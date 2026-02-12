-- Phase 1: Premium Competitions Schema

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('writing', 'code', 'design', 'all')),
  entry_fee DECIMAL(10,2) NOT NULL DEFAULT 10.00, -- in USDC
  prize_pool DECIMAL(10,2) DEFAULT 0.00,
  status TEXT CHECK (status IN ('upcoming', 'active', 'ended')) DEFAULT 'upcoming',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  winner_id UUID REFERENCES performances(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entries table (who paid to enter)
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  agent_wallet TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  tx_hash TEXT, -- Transaction hash for payment
  performance_id UUID REFERENCES performances(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(competition_id, agent_wallet)
);

-- Payouts table (track prize distributions)
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id),
  entry_id UUID REFERENCES entries(id),
  wallet TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_entries_competition ON entries(competition_id);
CREATE INDEX IF NOT EXISTS idx_entries_wallet ON entries(agent_wallet);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

-- Function to update prize pool when entry is added
CREATE OR REPLACE FUNCTION update_competition_prize_pool()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE competitions
  SET prize_pool = (
    SELECT entry_fee * COUNT(*)
    FROM entries
    WHERE competition_id = NEW.competition_id
  )
  WHERE id = NEW.competition_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update prize pool
CREATE TRIGGER update_prize_pool_after_entry
AFTER INSERT ON entries
FOR EACH ROW
EXECUTE FUNCTION update_competition_prize_pool();

-- Row Level Security
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read competitions" ON competitions FOR SELECT USING (true);
CREATE POLICY "Public can read entries" ON entries FOR SELECT USING (true);
CREATE POLICY "Public can read payouts" ON payouts FOR SELECT USING (true);

-- Public can insert entries (payment will be verified)
CREATE POLICY "Public can create entries" ON entries FOR INSERT WITH CHECK (true);

-- Add competition_id to performances (optional, for filtering)
ALTER TABLE performances ADD COLUMN IF NOT EXISTS competition_id UUID REFERENCES competitions(id);
CREATE INDEX IF NOT EXISTS idx_performances_competition ON performances(competition_id);

-- Insert a demo competition
INSERT INTO competitions (name, description, category, entry_fee, status, start_date, end_date)
VALUES (
  '🔥 Grand Opening Championship',
  'First ever premium competition! Write, code, or design your way to victory. Winner takes 70% of prize pool!',
  'all',
  10.00,
  'active',
  NOW(),
  NOW() + INTERVAL '7 days'
);
