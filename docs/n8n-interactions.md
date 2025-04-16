<!-- 
Last updated: 2025-04-16 17:25 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# n8n Interactions

This document explains all interactions between the Injury Reporting App and n8n workflows. It covers the purpose of each interaction, the data sent and received via webhooks, the formats used, and implementation details for n8n.

---

## Overview

The Injury Reporting App integrates with n8n for two main purposes:

1. **Injury Report Improvement**: To evaluate injury reports using AI and return suggestions for improvements.
2. **Memo Generation**: To generate parent-friendly memos based on submitted injury reports.

These integrations are performed via HTTP webhooks configured in the app's environment variables:

- `REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL`
- `REACT_APP_MEMO_GENERATION_WEBHOOK_URL`

### Webhook URLs

**Injury Report Improver:**
- Test: `https://rmkernanai.app.n8n.cloud/webhook-test/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd`
- Production: `https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd`

**Memo Generation:** (URLs to be determined)
- Test: TBD
- Production: TBD

---

## 1. Injury Report Improver Webhook

**Purpose:**
- Enables AI node in n8n to evaluate and recommend improvements to injury report

**Trigger:**
- Called during the teacher report submission process, before finalizing the report.

**Webhook URL:**
- Test: `https://rmkernanai.app.n8n.cloud/webhook-test/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd`
- Production: `https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd`

### Sequence of Events
1. Teacher completes and submits injury report
2. App constructs report payload and sends via POST request to n8n injury report improver webhook 
3. n8n Injury Report Improver workflow receives the payload and performs AI improvements
4. n8n Reply via webhook node returns a response with suggested improvements
5. Application displays suggestions to teacher for review and allows acceptance or submission as-is

### Data Sent to n8n
- **Format:** JSON (application/json)
- **Attributes:**

```json
{
  "child_id": "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
  "injury_timestamp": "2025-04-16T17:27:00.000Z",
  "location": "Playground",
  "submitting_user_id": "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
  "incident_description": "Child fell while playing on the playground equipment.",
  "injury_description": "Small scrape on right knee.",
  "action_taken": "Cleaned with antiseptic wipe.",
  "is_bite": false,
  "biter_child_id": null,
  "is_peer_aggression": false,
  "aggressor_child_id": null
}
```

### Expected Response from n8n
- **Format:** JSON (application/json)
- **Attributes:**

```json
{
  "status": "success",
  "suggestions": [
    {
      "field": "incident_description",
      "original": "Child fell while playing on the playground equipment.",
      "suggestion": "Child fell from the slide while playing on the playground equipment.",
      "reason": "Adding specific details about where the child fell from provides important context for understanding the incident."
    },
    {
      "field": "injury_description",
      "original": "Small scrape on right knee.",
      "suggestion": "Small scrape (approximately 1 inch) on the right knee with minor redness but no bleeding.",
      "reason": "Including size and appearance details helps assess the severity of the injury."
    },
    {
      "field": "action_taken",
      "original": "Cleaned with antiseptic wipe.",
      "suggestion": "Cleaned with antiseptic wipe and applied a bandage. Child was able to return to activities after 5 minutes of rest.",
      "reason": "Specifying the complete treatment and recovery details provides a clearer record of care."
    }
  ],
  "enhancedReport": {
    "child_name": "Emma Johnson",
    "incident_description_enhanced": "Emma fell from the slide while playing on the playground equipment.",
    "injury_description_enhanced": "Small scrape (approximately 1 inch) on Emma's right knee with minor redness but no bleeding.",
    "action_taken_enhanced": "Cleaned with antiseptic wipe and applied a bandage. Emma was able to return to activities after 5 minutes of rest."
  },
  "parent_narrative": "Emma had a minor incident today on the playground. She fell from the slide and got a small scrape on her knee. We cleaned the area, applied a bandage, and after a short rest, she was back to playing happily."
}
```

### Implementation Notes for n8n
1. **Webhook Node Setup:**
   - Method: POST
   - Response Mode: Last Node
   - Authentication: None (or implement as needed)
   - Content-Type: application/json

2. **AI Node Configuration:**
   - Use an AI node (like OpenAI or similar) to process the injury report
   - The AI should evaluate three key fields: incident_description, injury_description, and action_taken
   - For each field, determine if improvements could be made for clarity, completeness, or professionalism

3. **Prompt Engineering:**
   - Your AI prompt should instruct the model to:
     - Analyze each field independently
     - Suggest improvements that add relevant details or clarity
     - Provide a specific reason for each suggestion
     - Maintain a professional, factual tone
     - Keep suggestions concise and focused

4. **Response Formatting:**
   - Structure the response exactly as shown in the expected response format
   - Include the original text for each field to allow comparison
   - Always return a "status" field with value "success" or "error"
   - For each suggestion, include field name, original text, suggested text, and reason

5. **Error Handling:**
   - If the AI processing fails, return a response with:
   ```json
   {
     "status": "error",
     "message": "Error processing injury report. Please try again."
   }
   ```

---

## 2. Memo Generation Webhook

**Purpose:**
- Generate a human-readable, parent-friendly memo for an injury report, suitable for communication with parents.

**Trigger:**
- Called after a report has been submitted and validated.

**Webhook URL:**
- Defined by `REACT_APP_MEMO_GENERATION_WEBHOOK_URL`

### Sequence of Events
1. Front desk staff finalizes and stores the injury report in the database.
2. Application constructs the full report payload.
3. Application sends a POST request with the payload to the Memo Generation webhook URL.
4. n8n workflow receives the payload and generates a memo.
5. n8n Reply via webhook node returns a response with the generated memo and status.
6. Application displays or stores the memo content as appropriate.

### Data Sent to n8n
- **Format:** JSON (application/json)
- **Attributes:**

```json
{
  "id": "6175ffed-1257-4395-89b5-834a70df8aa5",
  "child_id": "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
  "submitting_user_id": "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
  "injury_timestamp": "2025-04-16T17:27:00+00:00",
  "location": "Playground",
  "incident_description": "Child fell from the slide while playing on the playground equipment.",
  "injury_description": "Small scrape (approximately 1 inch) on the right knee with minor redness but no bleeding.",
  "action_taken": "Cleaned with antiseptic wipe and applied a bandage. Child was able to return to activities after 5 minutes of rest.",
  "is_bite": false,
  "biter_child_id": null,
  "is_peer_aggression": false,
  "aggressor_child_id": null,
  "memo_content": null,
  "is_reviewed": false,
  "reviewed_by_user_id": null,
  "reviewed_timestamp": null,
  "is_delivered_to_parent": false,
  "delivered_by_user_id": null,
  "delivered_timestamp": null,
  "created_at": "2025-04-16T17:27:44.348731+00:00",
  "updated_at": "2025-04-16T17:27:44.348731+00:00",
  "ai_validated": true,
  "ai_suggestions_count": 3,
  "ai_suggestions_accepted": 3
}
```

### Expected Response from n8n
- **Format:** JSON (application/json)
- **Attributes:**

```json
{
  "status": "success",
  "memo_content": "Dear Parent,\n\nWe wanted to inform you that Emily had a minor incident today at school. While playing on the playground, Emily fell from the slide and got a small scrape on her knee.\n\nOur staff promptly attended to Emily by cleaning the area with an antiseptic wipe and applying a bandage. Emily was able to return to her activities after a brief rest period and continued to have a good day.\n\nPlease let us know if you have any questions or if you notice any concerns when Emily returns home.\n\nSincerely,\nThe Teaching Staff"
}
```

### Implementation Notes for n8n
1. **Webhook Node Setup:**
   - Method: POST
   - Response Mode: Last Node
   - Authentication: None (or implement as needed)
   - Content-Type: application/json

2. **AI Node Configuration:**
   - Use an AI node (like OpenAI or similar) to generate the parent-friendly memo
   - The AI should transform the technical injury report into a warm, reassuring communication for parents

3. **Prompt Engineering:**
   - Your AI prompt should instruct the model to:
     - Create a professional but warm communication to parents
     - Include all relevant details about the incident, injury, and care provided
     - Use a reassuring tone that conveys appropriate concern without causing alarm
     - Format as a letter with greeting and closing
     - Keep the memo concise (typically 4-6 sentences)
     - Refer to the child by name if available

4. **Response Formatting:**
   - Structure the response exactly as shown in the expected response format
   - Include the "memo_content" as a formatted string with newline characters (\n) for paragraph breaks
   - Always return a "status" field with value "success" or "error"

5. **Error Handling:**
   - If the AI processing fails, return a response with:
   ```json
   {
     "status": "error",
     "message": "Error generating memo. Please try again."
   }
   ```

---

## Testing the n8n Webhook Flow

The application includes a comprehensive testing infrastructure to evaluate how the AI handles different real-world scenarios:

### Test Harness

A dedicated test page is available at `http://localhost:3000/test` that provides:

1. **Scenario Selection**: Choose from 12 different test scenarios covering:
   - Basic scenarios (minimal, partial, good information)
   - Special cases (bites, peer aggression)
   - Complex situations (multiple injuries, allergic reactions)
   - Special populations (pre-existing conditions, special needs, toddlers)

2. **Testing Options**:
   - Toggle between real API calls and mock data
   - View AI suggestions and parent narratives as they would appear to teachers
   - Test the workflow for accepting/rejecting suggestions

3. **Evaluation Criteria**:
   - **Authenticity**: Do suggestions sound like they came from a busy teacher?
   - **Brevity**: Are suggestions and narratives concise and to the point?
   - **Completeness**: Is all necessary information included?
   - **Privacy**: Is sensitive information properly filtered out?

### Mock Testing

Set `REACT_APP_MOCK_AI_VALIDATION=true` in the `.env` file to test with mock suggestions without requiring an actual n8n instance. Alternatively, use the toggle in the test harness UI.

### API Testing

The application includes a test script (`tests/testFormSubmission.js`) that simulates the complete n8n webhook response flow:

1. **Running the Test**: Execute `node tests/testScenarios.js` to:
   - Test multiple scenarios against the webhook
   - View the AI's responses for each scenario
   - Save responses to files for later analysis

2. **Manual Testing**: Use the browser interface to test the user experience when:
   - Submitting a form for validation
   - Viewing and interacting with suggestions
   - Accepting individual or all suggestions
   - Submitting the final report

For more details on the testing infrastructure, see the [Test README](../tests/README.md).

---

## Notes
- All webhook payloads use `Content-Type: application/json`.
- All date and time fields are expected in ISO 8601 or standard time formats.
- Additional fields may be included in the payloads as the schema evolves.
- Webhook URLs should be kept secret and managed via environment variables.

## User Interface for AI Suggestions

When the n8n validation webhook returns suggestions, they are displayed to the user in the following manner:

1. **Field-Specific Suggestions**: Each suggestion appears directly below the corresponding field (incident description, injury description, or action taken) with:
   - The original text entered by the user
   - The suggested improvement from the AI
   - The reason for the suggestion
   - An "Accept" button to apply the individual suggestion

2. **Global Suggestion Panel**: A yellow panel appears at the bottom of the form with options to:
   - Accept all suggestions at once
   - Submit the report as-is without accepting suggestions

3. **Tracking**: The system tracks:
   - Whether AI validation was performed (`ai_validated`)
   - How many suggestions were provided (`ai_suggestions_count`)
   - How many suggestions were accepted by the user (`ai_suggestions_accepted`)

---

## Change Log
- *2025-04-16 17:25*: Updated the timestamp to reflect the current time
- *2025-04-16 14:05*: Added detailed implementation notes for n8n, sample JSON payloads, and prompt engineering guidance
- *2025-04-16 13:32*: Updated with field-specific suggestion UI details and testing information
- *2025-04-16*: Initial creation of this documentation.

---

For more details on the database schema, see `DATABASE_SCHEMA.md`.
For workflow and integration details, see `WORKFLOW.md`.
