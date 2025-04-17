<!--
Last updated: 2025-04-16 21:08 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Application Workflow & Component Status

This document provides a detailed overview of the application's workflow, the components involved in each step, and their current implementation status. This information is particularly useful for LLMs and developers to understand the system architecture and identify areas that need attention.

## 1. Overall Application Flow

The Injury Reporting App follows this general workflow:

1. **Teacher Form Submission**
   - Teacher fills out injury report details
   - Form data is validated and a parent narrative is generated via the n8n workflow
   - Report is submitted to Supabase database

2. **Front Desk Review**
   - Front desk staff views submitted reports with the generated parent narrative
   - Front desk staff marks reports as reviewed

3. **Parent Delivery**
   - Front desk staff delivers narratives to parents
   - Reports are marked as delivered in the system

## 2. Component Breakdown & Status

### 2.1 Data Layer Components

| Component | Description | Status | Dependencies |
|-----------|-------------|--------|--------------|
| **Supabase Connection** | Database connection for storing/retrieving data | ✅ FUNCTIONAL | Environment variables in `.env` file |
| **API Module** | Interface for all external API calls | ✅ FUNCTIONAL | N/A |
| **n8n Injury Report Improver** | Combined workflow for validation and parent narrative generation | ✅ FUNCTIONAL | External n8n instance |

### 2.2 Teacher Form Components

| Component | Description | Status | Dependencies |
|-----------|-------------|--------|--------------|
| **TeacherForm** | Main form container component | ✅ FUNCTIONAL | All subcomponents below |
| **useInjuryForm Hook** | State management for the form | ✅ FUNCTIONAL | Supabase connection |
| **BasicInfoSection** | Child/teacher selection and basic info | ✅ FUNCTIONAL | Supabase for dropdown data |
| **InjuryDetailsSection** | Incident, injury, and action descriptions | ✅ FUNCTIONAL | N/A |
| **AdditionalInfoSection** | Bite and peer aggression options | ✅ FUNCTIONAL | N/A |
| **ValidationError** | Error display with retry options | ✅ FUNCTIONAL | N/A |
| **FormActions** | Form submission and clear buttons | ✅ FUNCTIONAL | N/A |
| **AI Validation & Narrative** | Suggestions for improving report quality and parent narrative generation | ✅ FUNCTIONAL | n8n webhook |

### 2.3 Front Desk Components

| Component | Description | Status | Dependencies |
|-----------|-------------|--------|--------------|
| **MemoView** | Main memo display component | ✅ FUNCTIONAL | All subcomponents below |
| **useInjuryReport Hook** | State management for report data | ✅ FUNCTIONAL | Supabase connection |
| **MemoHeader** | Report header with status and actions | ✅ FUNCTIONAL | N/A |
| **MemoContainer** | Memo content with loading/error states | ✅ FUNCTIONAL | N/A |
| **MemoContent** | Formatted memo display | ✅ FUNCTIONAL | N/A |
| **ReviewModal** | Modal for marking reports as reviewed | ✅ FUNCTIONAL | Supabase connection |
| **DeliverModal** | Modal for marking reports as delivered | ✅ FUNCTIONAL | Supabase connection |

## 3. Data Flow & Error Handling

### 3.1 Teacher Form Submission Flow

```
START
  ↓
[Fill Form]
  ↓
[Submit for Validation] → [n8n Workflow] → [Show Suggestions & Parent Narrative]
  ↓                        ↑                   ↓
[Error?] → Yes → [Show Error] → [Retry?] → Yes → [Retry Validation]
  ↓                              ↓
  No                             No
  ↓                              ↓
[Submit as is] ← ─ ─ ─ ─ ─ ─ ─ ─ ┘
  ↓
[Write to Supabase]
  ↓
[Success/Error Notification]
  ↓
END
```

**Current Status:**
- Local form validation: ✅ FUNCTIONAL
- AI validation via n8n: ✅ FUNCTIONAL
- Parent narrative generation via n8n: ✅ FUNCTIONAL
- Direct submission to Supabase: ✅ FUNCTIONAL
- Error handling: ✅ FUNCTIONAL

### 3.2 Front Desk Review Flow

```
START
  ↓
[View Reports List]
  ↓
[Select Report]
  ↓
[Load Report Data & Parent Narrative]
  ↓
[Display Report & Parent Narrative]
  ↓
[Mark as Reviewed]
  ↓
[Mark as Delivered]
  ↓
END
```

**Current Status:**
- Report listing and selection: ✅ FUNCTIONAL
- Report data loading: ✅ FUNCTIONAL
- Parent narrative display: ✅ FUNCTIONAL
- Review/delivery marking: ✅ FUNCTIONAL

## 4. Implementation Notes

### 4.1 Supabase Integration

The application uses Supabase for data storage and retrieval. The connection is configured through environment variables in the `.env` file:

```
REACT_APP_SUPABASE_URL=[your-supabase-project-url]
REACT_APP_SUPABASE_ANON_KEY=[your-supabase-anon-key]
```

All Supabase operations are encapsulated in the `src/lib/supabase.ts` file, which provides functions for:
- Fetching children and users for dropdown selections
- Fetching injury reports (all or by ID)
- Creating new injury reports
- Updating existing reports (marking as reviewed/delivered)

#### 4.1.1 Database Schema

The database schema is defined in the `supabase/schema.sql` file. This file contains the SQL statements to create all required tables and relationships. **Always check this file first when working with database operations to understand the available fields and constraints.**

The main tables are:
- `Children`: Stores information about children
- `Users`: Stores information about teachers and front desk staff
- `InjuryReports`: Stores all injury report data including status tracking

#### 4.1.2 Required Schema Updates

The database schema has been updated to include AI validation tracking fields (as defined in `supabase/schema_update.sql`):

```sql
-- Add AI validation fields to InjuryReports table
ALTER TABLE "InjuryReports"
ADD COLUMN IF NOT EXISTS ai_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_suggestions_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_suggestions_accepted INTEGER DEFAULT 0;
```

These fields are used to track AI validation metrics:
- `ai_validated`: Whether the report was validated by AI
- `ai_suggestions_count`: Number of suggestions provided by AI validation
- `ai_suggestions_accepted`: Number of AI suggestions accepted by the user

The application code has been updated to use these fields when submitting injury reports.

### 4.2 n8n Integration

The application now integrates with a combined n8n workflow for both validation and parent narrative generation. This workflow is fully functional and replaces the previously separate validation and memo generation workflows.

The n8n webhook URL is configured in the `.env` file:
```
REACT_APP_INJURY_REPORT_IMPROVER_URL=https://n8n-instance.example.com/webhook/injury-report-improver
```

The n8n workflow is configured to:
1. Accept injury report data
2. Analyze it to provide suggestions for improvement
3. Generate a parent-friendly narrative based on the report data
4. Return both suggestions and the narrative in a single response

The application implements a robust JSON parsing strategy to handle the nested JSON structure in the n8n response:
1. First, it attempts standard JSON parsing
2. If that fails, it cleans the string by handling escape characters
3. If both approaches fail, it uses regex pattern matching to extract valid JSON content

This multi-tiered approach ensures reliable parsing regardless of formatting variations in the response.

### 4.3 Error Handling Strategy

The application implements a graceful degradation strategy:

1. **Form Validation**: If AI validation fails, users can still submit reports directly
2. **Parent Narrative Generation**: If AI narrative generation fails, the system uses existing content or a fallback template

## 5. Future Enhancements

Planned enhancements to the workflow include:

1. **Refining the n8n Prompt**:
   - Improve the prompt to better handle various types of data received from teachers
   - Enhance the quality of generated parent narratives

2. **Enhanced Error Handling**:
   - Add retry mechanisms for transient errors
   - Implement offline mode for form submissions

3. **Additional Features**:
   - Email notifications for new reports
   - Parent portal for viewing injury reports
   - Analytics dashboard for injury trends

---

This document should be updated whenever significant changes are made to the application workflow or component status.
