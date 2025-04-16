<!--
Last updated: 2025-04-15 20:26 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Environment Variables & API Keys

This app may require the following environment variables for full functionality:

- `REACT_APP_SUPABASE_URL` — Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` — Supabase anon/public API key

## How to Set
- Create a `.env.local` file in the project root (never commit this file)
- Add your variables like so:
  ```
  REACT_APP_SUPABASE_URL=your-url-here
  REACT_APP_SUPABASE_ANON_KEY=your-key-here
  ```

## Notes
- Never commit real secrets to version control.
- Update this document if new environment variables are added.
