<!--
Last updated: 2025-04-15 20:26 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Injury Reporting / Boo-Boo Report Application

This application provides a web-based solution for documenting and managing child injuries within a childcare center. It streamlines the process of creating, validating, and reviewing injury reports with AI assistance.

## Features

- **Teacher Form**: Allows teachers to document injury details with AI-assisted validation and suggestions
- **Front Desk View**: Enables front desk staff to view submitted reports and track their status
- **Memo Generation**: Automatically generates professional, parent-friendly "Boo-Boo Report" memos
- **Status Management**: Tracks review and delivery status of each report

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: n8n webhook endpoints for validation and memo generation

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Supabase project created
- n8n instance with configured workflows for validation and memo generation

### Configuration

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables by updating the `.env` file with your Supabase and n8n webhook URLs:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_VALIDATION_WEBHOOK_URL=your-n8n-validation-webhook-url
   REACT_APP_MEMO_GENERATION_WEBHOOK_URL=your-n8n-memo-generation-webhook-url
   ```
4. Set up the Supabase database by executing the SQL script in `supabase/schema.sql`
5. Populate sample data for `Children` and `Users` tables via the Supabase UI

### Running the Application

```
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```
npm run build
```

This builds the app for production to the `build` folder.

## Application Flow

1. **Teacher**: Selects their name, fills out injury details, and submits for AI validation
2. **AI Validation**: Provides suggestions for improving the report quality
3. **Teacher**: Accepts suggestions or edits manually before final submission
4. **Front Desk**: Views submitted reports and selects one to review
5. **AI Memo Generation**: Creates a polished memo summarizing the incident
6. **Front Desk**: Reviews the memo and marks it as reviewed/delivered to parents

## Database Schema

The application uses three main tables:
- `Children`: Stores information about children
- `Users`: Stores information about teachers and front desk staff
- `InjuryReports`: Stores all injury report data including status tracking

## Documentation Index

- [instructions.md](./instructions.md): Quick reference for common developer tasks (start/stop server, testing, refactoring, etc.)
- [LLM_HANDOFF.md](./LLM_HANDOFF.md): Handoff guide for LLMs and developers—always update before switching sessions
- [CHANGELOG.md](./CHANGELOG.md): Chronological list of all project changes
- [ENVIRONMENT.md](./ENVIRONMENT.md): Environment variable and API key setup

## How to Use
- Start here if you are new to the project or returning after a break
- Always check `LLM_HANDOFF.md` for current status and next steps
- For setup and running instructions, see the Setup Instructions section above

---

If you have questions or need to update documentation, please keep all docs in this folder and update the index as needed.
