-- Create Children table
CREATE TABLE IF NOT EXISTS "Children" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Teacher', 'Front Desk')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create InjuryReports table
CREATE TABLE IF NOT EXISTS "InjuryReports" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES "Children"(id),
  submitting_user_id UUID NOT NULL REFERENCES "Users"(id),
  injury_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  incident_description TEXT NOT NULL,
  injury_description TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  is_bite BOOLEAN DEFAULT FALSE,
  biter_child_id UUID REFERENCES "Children"(id),
  is_peer_aggression BOOLEAN DEFAULT FALSE,
  aggressor_child_id UUID REFERENCES "Children"(id),
  memo_content TEXT,
  is_reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by_user_id UUID REFERENCES "Users"(id),
  reviewed_timestamp TIMESTAMP WITH TIME ZONE,
  is_delivered_to_parent BOOLEAN DEFAULT FALSE,
  delivered_by_user_id UUID REFERENCES "Users"(id),
  delivered_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON "Children"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON "Users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_injury_reports_updated_at
BEFORE UPDATE ON "InjuryReports"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
