import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Generate voter ID from IP or use session
function getVoterId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'anonymous'
  return `voter-${ip}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { performanceId, score } = body

    // Validation
    if (!performanceId || !score) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (score < 1 || score > 10) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 10' },
        { status: 400 }
      )
    }

    const voterId = getVoterId(request)

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('performance_id', performanceId)
      .eq('voter_id', voterId)
      .single()

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this performance' },
        { status: 409 }
      )
    }

    // Insert vote
    const { data, error } = await supabase
      .from('votes')
      .insert({
        performance_id: performanceId,
        voter_id: voterId,
        score
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      vote: data
    })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
