import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch competitions with entry count
    const { data: competitions, error } = await supabase
      .from('competitions')
      .select(`
        *,
        entries (count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch competitions' },
        { status: 500 }
      )
    }

    // Format the data
    const formatted = (competitions || []).map(comp => ({
      ...comp,
      entry_count: comp.entries?.[0]?.count || 0
    }))

    return NextResponse.json({
      success: true,
      competitions: formatted
    })
  } catch (error) {
    console.error('Competitions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
