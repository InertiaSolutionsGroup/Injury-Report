# n8n Workflow Setup Guide

This guide provides step-by-step instructions for setting up the n8n workflows needed for the Injury Reporting App. Follow these instructions to create the workflows that will evaluate injury reports and generate parent-friendly memos.

## Prerequisites

1. Access to your n8n instance at https://rmkernanai.app.n8n.cloud/
2. An OpenAI API key or other AI service credentials

---

## 1. Injury Report Improver Workflow

This workflow evaluates injury reports and provides suggestions for improvement.

### Step 1: Create a New Workflow

1. Log in to your n8n instance
2. Click "Workflows" in the left sidebar
3. Click the "+ Create Workflow" button
4. Name the workflow "Injury Report Improver"

### Step 2: Add a Webhook Node

1. Click the "+" button to add a node
2. Search for and select "Webhook"
3. Configure the webhook:
   - **Authentication**: None
   - **HTTP Method**: POST
   - **Path**: Leave as default (will be part of your webhook URL)
   - **Response Mode**: Last Node
   - **Property Name**: `data`

4. Click "Execute Node" to activate the webhook and get your webhook URL
   - Test: `https://rmkernanai.app.n8n.cloud/webhook-test/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd`
   - Production: `https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd`

### Step 3: Add a Function Node to Prepare Data

1. Add a "Function" node after the Webhook node
2. Connect it to the Webhook node
3. Use this code to extract the relevant fields:

```javascript
// Get the input data from the webhook
const inputData = items[0].json;

// Extract the child's name and get first name
const childFullName = inputData.child_name || '';
const childFirstName = childFullName.split(' ')[0];

// Extract the fields we want to evaluate
const fieldsToEvaluate = {
  incident_description: inputData.incident_description || '',
  injury_description: inputData.injury_description || '',
  action_taken: inputData.action_taken || ''
};

// Return the data for the AI node
return [
  {
    json: {
      inputData: inputData,
      fieldsToEvaluate: fieldsToEvaluate,
      childFirstName: childFirstName
    }
  }
];
```

### Step 4: Add an OpenAI Node

1. Add an "OpenAI" node after the Function node
2. Connect it to the Function node
3. Configure the OpenAI node:
   - **Authentication**: Select your OpenAI credentials or create new ones
   - **Operation**: Chat Completion
   - **Model**: gpt-4 (or gpt-3.5-turbo if cost is a concern)
   - **Messages**: Use the following prompt template:

```
[
  {
    "role": "system",
    "content": "You are an expert in early childhood education and injury reporting. Your task is to evaluate injury report fields and suggest improvements for clarity, completeness, and professionalism. For each field, determine if improvements could be made and provide specific suggestions along with reasons. When appropriate, personalize the suggestions by using the child's first name."
  },
  {
    "role": "user",
    "content": "Please evaluate the following injury report fields for a child named {{$node[\"Function\"].json[\"childFirstName\"]}} and suggest improvements:\n\nIncident Description: {{$node[\"Function\"].json[\"fieldsToEvaluate\"][\"incident_description\"]}}\n\nInjury Description: {{$node[\"Function\"].json[\"fieldsToEvaluate\"][\"injury_description\"]}}\n\nAction Taken: {{$node[\"Function\"].json[\"fieldsToEvaluate\"][\"action_taken\"]}}\n\nFor each field, if you have a suggestion for improvement, provide the original text, your suggested improvement, and a brief reason for the change. Use the child's first name ({{$node[\"Function\"].json[\"childFirstName\"]}}) where appropriate in your suggestions. If a field is already well-written, you can indicate that no improvement is needed. Format your response as JSON with the following structure for each field that needs improvement:\n\n{\n  \"field\": \"[field_name]\",\n  \"original\": \"[original_text]\",\n  \"suggestion\": \"[improved_text]\",\n  \"reason\": \"[reason_for_improvement]\"\n}"
  }
]
```

   - **Output Data**: JSON

### Step 5: Add a Function Node to Format Response

1. Add another "Function" node after the OpenAI node
2. Connect it to the OpenAI node
3. Use this code to format the response:

```javascript
// Get the AI response
const aiResponse = items[0].json.response;
let suggestions = [];

try {
  // Try to parse the AI response as JSON
  if (typeof aiResponse === 'string') {
    // The AI might return a JSON string or an array of objects
    try {
      suggestions = JSON.parse(aiResponse);
      // If it's not an array, wrap it in an array
      if (!Array.isArray(suggestions)) {
        suggestions = [suggestions];
      }
    } catch (e) {
      // If parsing fails, try to extract JSON objects from the text
      const jsonMatches = aiResponse.match(/\{[\s\S]*?\}/g);
      if (jsonMatches) {
        suggestions = jsonMatches.map(match => {
          try {
            return JSON.parse(match);
          } catch (e) {
            return null;
          }
        }).filter(item => item !== null);
      }
    }
  } else if (typeof aiResponse === 'object') {
    // The AI might return an object directly
    suggestions = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
  }
  
  // Validate that each suggestion has the required fields
  suggestions = suggestions.filter(suggestion => 
    suggestion && 
    suggestion.field && 
    suggestion.original && 
    suggestion.suggestion && 
    suggestion.reason
  );
  
  // Return the formatted response
  return [
    {
      json: {
        status: 'success',
        suggestions: suggestions
      }
    }
  ];
} catch (error) {
  // Return an error response
  return [
    {
      json: {
        status: 'error',
        message: 'Failed to process AI response: ' + error.message
      }
    }
  ];
}
```

### Step 6: Save and Activate the Workflow

1. Click "Save" in the top right corner
2. Toggle the "Active" switch to activate the workflow

### Step 7: Test the Workflow

1. Use the `testWebhook.js` script to send test data to your webhook:
   ```
   node tests/testWebhook.js
   ```

2. Verify that you receive a properly formatted response with suggestions

---

## 2. Memo Generation Workflow

This workflow generates parent-friendly memos based on injury reports.

### Step 1: Create a New Workflow

1. Log in to your n8n instance
2. Click "Workflows" in the left sidebar
3. Click the "+ Create Workflow" button
4. Name the workflow "Memo Generator"

### Step 2: Add a Webhook Node

1. Click the "+" button to add a node
2. Search for and select "Webhook"
3. Configure the webhook similar to the previous workflow
4. Click "Execute Node" to activate the webhook and get your webhook URL

### Step 3: Add a Function Node to Prepare Data

1. Add a "Function" node after the Webhook node
2. Connect it to the Webhook node
3. Use code similar to the previous workflow to extract the relevant fields

### Step 4: Add an OpenAI Node

1. Add an "OpenAI" node after the Function node
2. Connect it to the Function node
3. Configure with a prompt that instructs the AI to generate a parent-friendly memo

### Step 5: Add a Function Node to Format Response

1. Add another "Function" node after the OpenAI node
2. Connect it to the OpenAI node
3. Use code to format the response with the generated memo

### Step 6: Save and Activate the Workflow

1. Click "Save" in the top right corner
2. Toggle the "Active" switch to activate the workflow

### Step 7: Test the Workflow

1. Use the `testWebhook.js` script to send test data to your webhook
2. Verify that you receive a properly formatted response with the generated memo

---

## Troubleshooting

### Common Issues

1. **Webhook 500 Error**: This usually means the workflow is not properly activated. Make sure the workflow is saved and the "Active" toggle is on.

2. **AI Node Errors**: Check that your OpenAI API key is valid and has sufficient credits.

3. **Parsing Errors**: If the AI response is not being properly parsed, check the Function node that formats the response and adjust as needed.

### Testing with Mock Data

If you're having issues with the n8n workflow, you can use the `--mock` flag with the test script to simulate a successful response:

```
node tests/testWebhook.js --mock
```

This will use a pre-defined mock response instead of calling the actual webhook.

---

## Next Steps

After setting up these workflows, update your application's environment variables to use the correct webhook URLs:

```
REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL=https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd
REACT_APP_MEMO_GENERATION_WEBHOOK_URL=[your_memo_generation_webhook_url]
REACT_APP_MOCK_AI_VALIDATION=false
```

Then restart your application to apply the changes.

## Testing Infrastructure

A comprehensive testing infrastructure has been implemented to evaluate how the AI handles different real-world scenarios:

### Test Harness

1. Access the test harness at `http://localhost:3000/test`
2. Select from 12 different test scenarios covering:
   - Basic scenarios (minimal, partial, good information)
   - Special cases (bites, peer aggression)
   - Complex situations (multiple injuries, allergic reactions)
   - Special populations (pre-existing conditions, special needs, toddlers)

### Testing Options

- Toggle between real API calls and mock data
- View AI suggestions and parent narratives as they would appear to teachers
- Test the workflow for accepting/rejecting suggestions

### Evaluation Criteria

When testing, evaluate the AI responses based on:
1. **Authenticity** - Do suggestions sound like they came from a busy teacher?
2. **Brevity** - Are suggestions and narratives concise and to the point?
3. **Completeness** - Is all necessary information included?
4. **Privacy** - Is sensitive information properly filtered out?

For more details on the testing infrastructure, see the [Test README](../tests/README.md).
