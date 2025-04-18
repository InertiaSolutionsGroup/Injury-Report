<!-- 
Last updated: 2025-04-18 00:20 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# n8n Interactions

This document explains all interactions between the Injury Reporting App and n8n workflows. It covers the purpose of each interaction, the data sent and received via webhooks, and the formats used.

---

## Overview of n8n Integration

### Purpose
The n8n workflow serves two primary purposes:
1. **Validation**: Evaluating teacher-submitted injury reports for completeness and clarity
2. **Enhancement**: Providing improved text that is more parent-friendly and comprehensive
3. **Parent Narrative Generation**: Creating a brief, parent-friendly narrative summarizing the incident when all fields are sufficient

### Sequence of Events
1. Teacher fills out and submits the injury report form
2. Application constructs a focused data payload (6 fields only) and sends via HTTP POST request to the Injury Report Improver webhook
3. n8n workflow receives the payload and performs AI processing using GPT-4.1 Mini
4. n8n returns a response with:
   - For sufficient entries: Enhanced versions of the text with positive feedback
   - For insufficient entries: Specific guidance on what information is missing
   - When all fields are sufficient: A parent-friendly narrative summarizing the incident
5. The application displays the results to the teacher, who can:
   - Accept the enhancements for sufficient fields
   - Add more information for insufficient fields
   - View the parent narrative when all fields are sufficient
6. Once all fields are sufficient, the teacher can submit the final report

### Data Sent to n8n
- **Format:** JSON (application/json)
- **Attributes:** (Limited to 6 fields to conserve tokens)

```
{
  "child_name": string,               // Name of the child
  "injury_time_eastern": string,      // Formatted time in Eastern Time (e.g., "2025-04-17 11:30 AM EDT")
  "location": string,                 // Location where the incident occurred
  "incident_description": string,     // Description of the incident
  "injury_description": string,       // Description of the injury
  "action_taken": string              // Actions taken in response
}
```

### Code Node in n8n that transforms the data sent to n8n before it is processed by the AI Agent

```javascript
// Get all input items from the previous node (Webhook)
const items = $input.all();

// Prepare an array to hold the output items for the next node (AI Agent)
const outputItems = [];

// Loop through each item received from the Webhook
for (const item of items) {
  // Access the 'body' object within the JSON payload of the current item
  const inputBody = item.json.body;

  // Check if the inputBody exists to avoid errors
  if (inputBody) {
    // Create a new object containing only the desired attributes
    const extractedData = {
      child_name: inputBody.child_name,
      injury_time_eastern: inputBody.injury_time_eastern,
      location: inputBody.location,
      incident_description: inputBody.incident_description,
      injury_description: inputBody.injury_description,
      action_taken: inputBody.action_taken
    };

    // Create a new output item with the extracted data
    // nesting the extracted data under the "ReportData" key.
    const outputJson = {
      ReportData: extractedData
    };

    // Add the structured data as the 'json' payload for the output item
    outputItems.push({ json: outputJson });
  } else {
    // Optional: Handle cases where the 'body' is missing
    console.warn("Input item did not contain a 'body' object:", item.json);
    // If you want to maintain the structure even for empty cases:
    // outputItems.push({ json: { ReportData: {} } });
  }
}

// Return the array of processed items to be passed to the next node (AI Agent)
return outputItems;
```

### Response Format from n8n

The n8n workflow returns a JSON response with the following structure:

```json
{
  "fieldEvaluations": [
    {
      "field": "incident_description",
      "original": "[original text]",
      "status": "sufficient" | "insufficient",
      "suggestion": "[improved text or guidance]"
    },
    {
      "field": "injury_description",
      "original": "[original text]",
      "status": "sufficient" | "insufficient",
      "suggestion": "[improved text or guidance]"
    },
    {
      "field": "action_taken",
      "original": "[original text]",
      "status": "sufficient" | "insufficient",
      "suggestion": "[improved text or guidance]"
    }
  ],
  "parent_narrative": "Brief 2-4 sentence narrative summarizing the incident, injury, and care provided (null if any field is insufficient)",
  "model_name": "[model name]"
}
```

### Response Handling

The application processes this response as follows:

1. **For sufficient fields**:
   - Stores the original text for reference
   - Displays the AI's enhanced version in the form field
   - Shows a green indicator and "Accept Enhancement" button

2. **For insufficient fields**:
   - Stores the original text for reference
   - Clears the field to prompt the teacher to provide better information
   - Shows guidance on what information is missing
   - Shows a yellow indicator

3. **Parent Narrative**:
   - Only generated when all three fields are sufficient
   - Displayed in a dedicated section below the validation results
   - Provides a concise summary for parent communication
   - Stored in the database with the final report

4. **Submit Button**:
   - Disabled when any field is insufficient
   - Enabled when all fields are sufficient

### Holistic Evaluation Approach

The n8n prompt uses a holistic evaluation approach that:
1. Considers information across all fields when evaluating each one
2. Is more lenient with the action_taken field when the first two fields provide good context
3. Recognizes and expands common abbreviations like "TLC" when the meaning is clear
4. Provides improvements rather than marking as insufficient when context allows
5. Gives special attention to head injuries, requiring more detailed information

### Data Sent to Supabase

After the teacher has reviewed and approved the AI-validated content, the complete report data is sent to Supabase for storage. This happens only after the n8n validation process is complete.

### Complete Data Sent to Supabase
- **Format:** JSON (application/json)
- **Attributes:**

```
{
  "child_id": string,                 // ID of the child
  "child_name": string,               // Name of the child
  "injury_timestamp": string,         // ISO format timestamp for database storage
  "injury_time_eastern": string,      // Formatted time in Eastern Time (e.g., "2025-04-17 11:30 AM EDT")
  "location": string,                 // Location of the incident
  "submitting_user_id": string,       // ID of the submitting user
  "incident_description": string,     // Description of the incident (possibly AI-enhanced)
  "injury_description": string,       // Description of the injury (possibly AI-enhanced)
  "action_taken": string,             // Actions taken in response (possibly AI-enhanced)
  "is_bite": boolean,                 // Whether the injury was a bite
  "biter_child_id": string,           // ID of the biter child (if applicable)
  "is_peer_aggression": boolean,      // Whether the injury was due to peer aggression
  "aggressor_child_id": string,       // ID of the aggressor child (if applicable)
  "ai_validated": boolean,            // Whether the report was validated by AI
  "ai_suggestions_count": number,     // Number of suggestions provided by AI
  "ai_suggestions_accepted": number,  // Number of suggestions accepted by the teacher
  "parent_narrative": string,         // Parent-friendly narrative generated by AI
  "is_reviewed": boolean,             // Whether the report has been reviewed by front desk
  "is_delivered_to_parent": boolean   // Whether the report has been delivered to the parent
}
```

---

## Implementation Impacts and Required Changes

The transition to a combined Injury Report Improver workflow has several implications for the application:

### 1. Environment Variable Updates
- The application code must be updated to use `REACT_APP_INJURY_REPORT_IMPROVER_URL` instead of `REACT_APP_VALIDATION_WEBHOOK_URL`
- The `REACT_APP_MEMO_GENERATION_WEBHOOK_URL` is no longer needed as memo generation is now part of the combined workflow

### 2. Response Parsing Improvements
- The API module has been updated with a streamlined parsing approach focused on the expected format
- The application can now reliably extract data from the n8n response
- Parent narrative extraction has been enhanced to look for the narrative in multiple possible locations

### 3. UI Component Updates
- The form clearly indicates that teachers cannot edit the narrative
- The form handles cases where teacher input is inadequate and n8n has provided appropriate guidance
- For sufficient entries:
   - It shows positive feedback and populates fields with improved text
   - It displays positive feedback with a green checkmark
- For insufficient entries:
   - It shows guidance and clears fields with helpful placeholder text
   - It uses the suggestion as placeholder text

### 4. Error Handling Improvements
- The application implements robust error handling for cases where:
  - The n8n workflow fails or times out
  - The response format is unexpected

### 5. Input Validation
- Clear guidance is provided to teachers about the level of detail required for effective AI processing
- Visual indicators help teachers understand which fields need improvement

### 6. Workflow Changes
- The front desk review process has been updated to reflect that narratives are generated at submission time

---

## n8n AI Agent Prompt

The n8n workflow uses a carefully structured prompt for the AI agent (GPT-4.1 Mini) that:

1. Defines a clear professional role for the AI as a "preschool injury report validator"
2. Provides explicit instructions on how to evaluate each field
3. Specifies exactly what should be in the "suggestion" field based on status:
   - For sufficient entries: An improved version of the text (not just feedback)
   - For insufficient entries: Specific guidance on what information is missing
4. Requires the AI to include its model name in the response

The complete prompt can be found in `/tests/n8nPrompt.md`.

---

## Notes
- All webhook payloads use `Content-Type: application/json`.
- All date and time fields are expected in ISO 8601 or standard time formats.
- Additional fields may be included in the payloads as the schema evolves.
- The application follows a strict sequence where data is only sent to Supabase after the teacher has reviewed and approved the AI-validated content.

---

## Change Log
- *2025-04-18 00:20 EDT*: Updated documentation to reflect the holistic evaluation approach and improved parent narrative handling
- *2025-04-17 20:50 EDT*: Added location field to the data sent to n8n to provide better context for incident evaluation.
- *2025-04-17 20:14 EDT*: Clarified that only specific fields are sent to n8n (the 3 descriptions plus child_name and injury_time_eastern) to conserve tokens. Added explicit section about data sent to Supabase and clarified that this happens only after n8n validation is complete.
- *2025-04-17*: Removed ISO timestamp from n8n payload, using only human-readable Eastern Time format.
- *2025-04-17*: Added formatted Eastern Time (`injury_time_eastern`) to the payload to provide human-readable timestamps.
- *2025-04-17*: Added child_name to the payload sent to n8n and updated code to properly extract it from the form data.
- *2025-04-17*: Updated n8n code node documentation to include proper handling of conditional fields.
- *2025-04-17*: Updated documentation to reflect the correct output format (direct object with output property).
- *2025-04-17*: Simplified JSON parsing logic to focus on the expected response format.
- *2025-04-16*: Updated documentation to reflect the transition from separate validation and memo generation workflows to a combined Injury Report Improver approach. Added implementation impacts and required changes.
- *2025-04-16*: Updated to reflect improved JSON parsing logic and removal of data filtering functionality.

---

For more details on the database schema, see `DATABASE_SCHEMA.md`.
For workflow and integration details, see `WORKFLOW.md`.
