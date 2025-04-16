# n8n Interactions

This document explains all interactions between the Injury Reporting App and n8n workflows. It covers the purpose of each interaction, the data sent and received via webhooks, and the formats used.

---

## Overview

The Injury Reporting App integrates with n8n for two main purposes:

1. **AI Validation**: To validate injury reports using AI and return suggestions.
2. **Memo Generation**: To generate memos based on submitted injury reports.

These integrations are performed via HTTP webhooks configured in the app’s environment variables:

- `REACT_APP_VALIDATION_WEBHOOK_URL`
- `REACT_APP_MEMO_GENERATION_WEBHOOK_URL`

---

## 1. AI Validation Webhook

**Purpose:**
- Validate a submitted injury report using AI.
- Provide suggestions or corrections to the report data.

**Trigger:**
- Called during the report submission process, before finalizing the report.

**Webhook URL:**
- Defined by `REACT_APP_VALIDATION_WEBHOOK_URL`

### Sequence of Events
1. User fills out and submits the injury report form.
2. Application constructs the report data payload.
3. Application sends a POST request with the payload to the AI Validation webhook URL.
4. n8n workflow receives the payload and performs AI validation.
5. n8n returns a response with validation status and optional suggestions.
6. Application displays suggestions to the user (if any) and allows acceptance or submission as-is.

### Data Sent to n8n
- **Format:** JSON (application/json)
- **Attributes:**

```
{
  "child_id": string,                 // ID of the child
  "injury_timestamp": string,         // Date and time of the incident (ISO 8601)
  "location": string,                 // Location of the incident
  "submitting_user_id": string,       // ID of the submitting user
  "incident_description": string,     // Description of the incident
  "injury_description": string,       // Description of the injury
  "action_taken": string,             // Actions taken in response
  "is_bite": boolean,                 // Whether the injury was a bite
  "biter_child_id"?: string,          // ID of the biter child (if applicable)
  "is_peer_aggression": boolean,      // Whether the injury was due to peer aggression
  "aggressor_child_id"?: string       // ID of the aggressor child (if applicable)
}
```

### Data Received from n8n
- **Format:** JSON (application/json)
- **Attributes:**

```
{
  "status": "success" | "error",      // Outcome of validation
  "suggestions"?: [                   // Optional: suggestions for corrections or improvements
    {
      "field": "incident_description" | "injury_description" | "action_taken",
      "original": string,
      "suggestion": string,
      "reason": string
    }
  ],
  "message"?: string                  // Optional: additional info or error message
}
```

---

## 2. Memo Generation Webhook

**Purpose:**
- Generate a human-readable memo or summary for an injury report, suitable for communication or record-keeping.

**Trigger:**
- Called after a report has been submitted and validated.

**Webhook URL:**
- Defined by `REACT_APP_MEMO_GENERATION_WEBHOOK_URL`

### Sequence of Events
1. Application finalizes and stores the injury report in the database.
2. Application constructs the full report payload.
3. Application sends a POST request with the payload to the Memo Generation webhook URL.
4. n8n workflow receives the payload and generates a memo.
5. n8n returns a response with the generated memo and status.
6. Application displays or stores the memo content as appropriate.

### Data Sent to n8n
- **Format:** JSON (application/json)
- **Attributes:**

```
{
  "id": string,                       // Report ID
  "child_id": string,
  "submitting_user_id": string,
  "injury_timestamp": string,         // ISO 8601
  "location": string,
  "incident_description": string,
  "injury_description": string,
  "action_taken": string,
  "is_bite": boolean,
  "biter_child_id"?: string,
  "is_peer_aggression": boolean,
  "aggressor_child_id"?: string,
  "memo_content"?: string,
  "is_reviewed": boolean,
  "reviewed_by_user_id"?: string,
  "reviewed_timestamp"?: string,
  "is_delivered_to_parent": boolean,
  "delivered_by_user_id"?: string,
  "delivered_timestamp"?: string,
  "ai_validated": boolean,
  "ai_suggestions_count": number,
  "ai_suggestions_accepted": number,
  "created_at": string,
  "updated_at": string
}
```

### Data Received from n8n
- **Format:** JSON (application/json)
- **Attributes:**

```
{
  "status": "success" | "error",      // Outcome of memo generation
  "memo_content"?: string,             // The generated memo (if successful)
  "message"?: string                   // Optional: additional info or error message
}
```

---

## Notes
- All webhook payloads use `Content-Type: application/json`.
- All date and time fields are expected in ISO 8601 or standard time formats.
- Additional fields may be included in the payloads as the schema evolves.
- Webhook URLs should be kept secret and managed via environment variables.

---

## Change Log
- *2025-04-16*: Initial creation of this documentation.

---

For more details on the database schema, see `DATABASE_SCHEMA.md`.
For workflow and integration details, see `WORKFLOW.md`.
