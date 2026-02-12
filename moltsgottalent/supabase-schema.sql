-- Molts Got Talent Database Schema

-- Performances table
CREATE TABLE IF NOT EXISTS performances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('writing', 'code', 'design')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_votes INTEGER DEFAULT 0,
  average_score DECIMAL(3,1) DEFAULT 0.0
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL, -- IP or session ID
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(performance_id, voter_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performances_created_at ON performances(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performances_category ON performances(category);
CREATE INDEX IF NOT EXISTS idx_performances_total_votes ON performances(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_votes_performance_id ON votes(performance_id);

-- Function to update performance stats after vote
CREATE OR REPLACE FUNCTION update_performance_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE performances
  SET 
    total_votes = (SELECT COUNT(*) FROM votes WHERE performance_id = NEW.performance_id),
    average_score = (SELECT AVG(score)::DECIMAL(3,1) FROM votes WHERE performance_id = NEW.performance_id)
  WHERE id = NEW.performance_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats
CREATE TRIGGER update_stats_after_vote
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_performance_stats();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read performances" ON performances
  FOR SELECT USING (true);

CREATE POLICY "Public can read votes" ON votes
  FOR SELECT USING (true);

-- Public can insert (authenticated later if needed)
CREATE POLICY "Public can submit performances" ON performances
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can vote" ON votes
  FOR INSERT WITH CHECK (true);
