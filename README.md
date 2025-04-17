# Injury Reporting / Boo-Boo Report Application

## Git Repository Information

**IMPORTANT: Git Repository Location**
- The Git repository for this project is located at: `c:/PythonProjects/KurtComms/injury-report-app/.git`
- Always run Git commands from: `c:/PythonProjects/KurtComms/injury-report-app`

**Remote Repositories:**
- Primary: `origin` → https://github.com/InertiaSolutionsGroup/Injury-Report
- Backup: `backup-origin` → https://github.com/InertiaSolutionsGroup/Injury-Report2

**Backup Instructions for LLMs and Developers:**

1. **Check Repository Status:**
   ```
   git status
   ```

2. **Create Backup Branch:**
   ```
   git checkout -b backup-[current-date]
   git add -A
   git commit -m "Full backup as of [current-date]"
   ```

3. **Push to Backup Repository:**
   ```
   git push backup-origin backup-[current-date]
   ```

4. **If Merge Conflicts Occur:**
   - Option 1 (Quick Backup): Abort rebase and create fresh backup
     ```
     git rebase --abort
     git checkout -b backup-[current-date]
     git add -A
     git commit -m "Full backup as of [current-date]"
     git push backup-origin backup-[current-date]
     ```
   - Option 2 (Resolve Conflicts): Complete the rebase properly
     ```
     # For each conflicted file:
     # 1. Edit file to resolve conflicts
     # 2. git add <filename>
     git rebase --continue
     git push backup-origin master --force
     ```

## Project Overview

The Injury Reporting App is designed to help preschool teachers document and report injuries to children. The application streamlines the process of creating injury reports, improves the quality of documentation through AI assistance, and facilitates communication with parents.

### Key Features

- Teacher-friendly injury report form with AI-assisted improvements
- AI-generated parent-friendly narratives
- Front desk review workflow
- Parent delivery tracking
- Comprehensive data storage in Supabase

## Current Status

- Core application functionality is operational
- The n8n AI agent system prompt needs further development to better handle various types of teacher input
- The application uses a combined n8n workflow for both validation and parent narrative generation
- Enhanced JSON parsing logic handles various response formats from the n8n webhook
- Database schema has been updated to include AI validation tracking fields

## Application Workflow

1. **Teacher Form Submission**
   1. Teacher fills out and submits the injury report form
   2. Application sends data to the n8n workflow for AI processing
   3. n8n returns enhanced report content or requests better content from teacher
   4. Teacher evaluates each attribute improvement, edits or accepts, and then sends back to the AI or submits to the front desk
   5. Teachers are presented with an AI-generated narrative (which they cannot edit)
   6. Report is submitted to Supabase database

2. **Front Desk Review**
   - Front desk staff views submitted reports with the generated parent narrative
   - Front desk staff marks reports as reviewed

3. **Parent Delivery**
   - Front desk staff delivers narratives to parents
   - Reports are marked as delivered in the system

## Technical Components

- **Frontend**: React components with TypeScript
- **Backend**: Supabase for database operations
- **AI Integration**: n8n workflow with an AI agent for validation and narrative generation
- **Database Schema**: Defined in `supabase/schema.sql` and `supabase/schema_update2.sql`

## Next Steps

- Refine the n8n prompt to correctly handle various types of data received from teachers
- Test and iterate on the n8n prompt based on test teacher submissions
- Add proper TypeScript interfaces for all component props
- Continue adding inline code comments and JSDoc for major components

## Project Documentation

For detailed project documentation, please see the following files in the `docs/` folder:

- [LLM_HANDOFF.md](docs/LLM_HANDOFF.md) - Project handoff document for LLMs
- [WORKFLOW.md](docs/WORKFLOW.md) - Detailed workflow and component status
- [n8n-interactions.md](docs/n8n-interactions.md) - n8n webhook interactions documentation
- [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Database schema documentation
- [ENVIRONMENT.md](docs/ENVIRONMENT.md) - Environment configuration
- [CHANGELOG.md](docs/CHANGELOG.md) - Project change history
- [instructions.md](docs/instructions.md) - Developer quick reference
