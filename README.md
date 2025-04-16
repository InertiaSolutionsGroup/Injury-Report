# Injury Reporting / Boo-Boo Report Application

This application provides a web-based solution for documenting and managing child injuries within a childcare center. It streamlines the process of creating, validating, and reviewing injury reports with AI assistance.

## Features

- **Teacher Form**: Allows teachers to document injury details with AI-assisted validation and suggestions
- **Front Desk View**: Enables front desk staff to view submitted reports and track their status
- **Memo Generation**: Automatically generates professional, parent-friendly "Boo-Boo Report" memos
- **Status Management**: Tracks review and delivery status of each report
- **Testing Infrastructure**: Comprehensive test harness for evaluating AI responses to different scenarios

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
   REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL=your-n8n-validation-webhook-url
   REACT_APP_MEMO_GENERATION_WEBHOOK_URL=your-n8n-memo-generation-webhook-url
   REACT_APP_MOCK_AI_VALIDATION=false
   ```
4. Set up the Supabase database by executing the SQL script in `supabase/schema.sql`
5. Populate sample data for `Children` and `Users` tables via the Supabase UI

### Running the Application

```
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Testing the AI Integration

The application includes a comprehensive testing infrastructure to evaluate how the AI handles different real-world scenarios:

1. Start the application with `npm start`
2. Navigate to the test page at `http://localhost:3000/test`
3. Select a test scenario from the dropdown
4. Choose whether to use the real API or mock data
5. Submit the form to see the AI's response
6. Evaluate the suggestions and parent narrative

For more details on the testing infrastructure, see the [Test README](./tests/README.md).

### Building for Production

```
npm run build
```

This builds the app for production to the `build` folder.

## Application Flow

The application follows this general workflow:

1. **Teacher Form Submission**:
   - Teacher fills out injury report details
   - Form data is validated (locally and via AI)
   - AI provides suggestions for improvement
   - Teacher accepts or rejects suggestions
   - Report is submitted to Supabase database

2. **Front Desk Review**:
   - Front desk staff views submitted reports
   - AI generates a parent-friendly memo for each report
   - Front desk staff marks reports as reviewed/delivered

For a detailed breakdown of each component and its current implementation status, see [docs/WORKFLOW.md](./docs/WORKFLOW.md).

## Component Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Supabase Integration** | ✅ FUNCTIONAL | Reading and writing to database works |
| **Teacher Form** | ✅ FUNCTIONAL | All form fields and validation working |
| **Front Desk View** | ✅ FUNCTIONAL | Report listing and viewing works |
| **AI Validation** | ✅ FUNCTIONAL | n8n webhook implemented with testing infrastructure |
| **AI Memo Generation** | ⚠️ IN PROGRESS | n8n webhook partially implemented |
| **Testing Infrastructure** | ✅ FUNCTIONAL | Comprehensive test harness available at /test |

## Documentation Index

- [docs/WORKFLOW.md](./docs/WORKFLOW.md): Detailed workflow and component status documentation
- [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md): Comprehensive database schema documentation
- [docs/n8n-workflow-setup.md](./docs/n8n-workflow-setup.md): Setup guide for n8n workflows
- [docs/n8n-interactions.md](./docs/n8n-interactions.md): Documentation of API interactions with n8n
- [tests/README.md](./tests/README.md): Testing infrastructure documentation
- [docs/LLM_HANDOFF.md](./docs/LLM_HANDOFF.md): Handoff guide for LLMs and developers

## Development Notes

- The application is designed to work even when n8n webhooks are not available
- Mock API functionality allows testing without a live n8n instance
- Privacy protection is implemented to ensure sensitive information (like other children's names) is not shared with the AI or included in parent communications

---

Last updated: 2025-04-16
