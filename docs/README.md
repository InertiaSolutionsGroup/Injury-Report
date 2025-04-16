<!--
Last updated: 2025-04-16 10:58 EDT
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
- n8n instance with configured workflows for validation and memo generation (optional for development)

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

The application follows this general workflow:

1. **Teacher Form Submission**:
   - Teacher fills out injury report details
   - Form data is validated (locally and optionally via AI)
   - Report is submitted to Supabase database

2. **Front Desk Review**:
   - Front desk staff views submitted reports
   - AI generates a parent-friendly memo for each report
   - Front desk staff marks reports as reviewed/delivered

For a detailed breakdown of each component and its current implementation status, see [WORKFLOW.md](./WORKFLOW.md).

## Component Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Supabase Integration** | ✅ FUNCTIONAL | Reading and writing to database works |
| **Teacher Form** | ✅ FUNCTIONAL | All form fields and validation working |
| **Front Desk View** | ✅ FUNCTIONAL | Report listing and viewing works |
| **AI Validation** | ⚠️ STUBBED | n8n webhook not yet implemented |
| **AI Memo Generation** | ⚠️ STUBBED | n8n webhook not yet implemented |

## Database Schema

The application uses three main tables:
- `Children`: Stores information about children
- `Users`: Stores information about teachers and front desk staff
- `InjuryReports`: Stores all injury report data including status tracking

## Documentation Index

- [WORKFLOW.md](./WORKFLOW.md): Detailed workflow and component status documentation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md): Comprehensive database schema documentation
- [instructions.md](./instructions.md): Quick reference for common developer tasks
- [LLM_HANDOFF.md](./LLM_HANDOFF.md): Handoff guide for LLMs and developers
- [CHANGELOG.md](./CHANGELOG.md): Chronological list of all project changes
- [ENVIRONMENT.md](./ENVIRONMENT.md): Environment variable and API key setup

## How to Use
- Start here if you are new to the project or returning after a break
- Check [WORKFLOW.md](./WORKFLOW.md) for detailed component status
- Always check [LLM_HANDOFF.md](./LLM_HANDOFF.md) for current status and next steps
- For setup and running instructions, see the Setup Instructions section above

## Development Notes

- The application is designed to work even when n8n webhooks are not available
- "Submit as is" functionality writes directly to Supabase, bypassing n8n validation
- Error handling is implemented to gracefully handle missing dependencies

---

If you have questions or need to update documentation, please keep all docs in this folder and update the index as needed.
