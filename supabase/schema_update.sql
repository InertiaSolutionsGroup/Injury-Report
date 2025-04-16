-- Add AI validation fields to InjuryReports table
ALTER TABLE "InjuryReports"
ADD COLUMN IF NOT EXISTS ai_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_suggestions_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_suggestions_accepted INTEGER DEFAULT 0;

-- Add comment explaining the purpose of these fields
COMMENT ON COLUMN "InjuryReports".ai_validated IS 'Whether the report was validated by AI';
COMMENT ON COLUMN "InjuryReports".ai_suggestions_count IS 'Number of suggestions provided by AI validation';
COMMENT ON COLUMN "InjuryReports".ai_suggestions_accepted IS 'Number of AI suggestions accepted by the user';
