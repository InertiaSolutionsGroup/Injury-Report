<!--
Last updated: 2025-04-16 17:35 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Environment Variables & API Keys

This app requires the following environment variables for full functionality:

- `REACT_APP_SUPABASE_URL` — Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` — Supabase anon/public API key
- `REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL` — n8n webhook URL for injury report validation
- `REACT_APP_MEMO_GENERATION_WEBHOOK_URL` — n8n webhook URL for parent memo generation
- `REACT_APP_MOCK_AI_VALIDATION` — Set to "true" to use mock AI responses instead of real API calls

## How to Set
- Create a `.env.local` file in the project root (never commit this file)
- Add your variables like so:
  ```
  REACT_APP_SUPABASE_URL=your-url-here
  REACT_APP_SUPABASE_ANON_KEY=your-key-here
  REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL=https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd
  REACT_APP_MEMO_GENERATION_WEBHOOK_URL=your-memo-webhook-url-here
  REACT_APP_MOCK_AI_VALIDATION=false
  ```

## Testing Configuration
- For testing without a live n8n instance, set `REACT_APP_MOCK_AI_VALIDATION=true`
- Alternatively, use the test harness at `/test` which provides a UI toggle for mock/real API calls

## Notes
- Never commit real secrets to version control.
- Update this document if new environment variables are added.
- The test harness can be used to evaluate AI responses without modifying environment variables.
