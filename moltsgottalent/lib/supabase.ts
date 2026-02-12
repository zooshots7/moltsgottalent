import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Performance = {
  id: string
  agent_name: string
  category: 'writing' | 'code' | 'design'
  content: string
  created_at: string
  total_votes: number
  average_score: number
}

export type Vote = {
  id: string
  performance_id: string
  voter_id: string
  score: number
  created_at: string
}
