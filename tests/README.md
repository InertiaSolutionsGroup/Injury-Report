# Injury Report AI Testing

This directory contains test scenarios and utilities for testing the AI-powered injury report validation and parent narrative generation features.

## Test Scenarios

The `testScenarios.js` file contains a variety of real-world scenarios that cover different types of incidents commonly encountered in preschool settings:

1. **Minimal Information** - Tests how the AI responds when given minimal information in all fields
2. **Partial Information** - Tests how the AI responds when some fields are good but others need improvement
3. **Good Information** - Tests how the AI responds when given good information in all fields
4. **Bite Incident** - Tests how the AI handles a bite incident while protecting the biter's identity
5. **Peer Aggression** - Tests how the AI handles peer aggression while protecting the aggressor's identity
6. **Multiple Injuries** - Tests how the AI handles multiple injuries in one incident
7. **Allergic Reaction** - Tests how the AI handles an allergic reaction incident
8. **Emotional Distress** - Tests how the AI handles emotional distress without physical injury
9. **Pre-existing Condition** - Tests how the AI handles an incident involving a pre-existing condition
10. **Delayed Symptoms** - Tests how the AI handles an incident with delayed symptoms
11. **Special Needs Consideration** - Tests how the AI handles an incident involving a child with special needs
12. **Toddler Incident** - Tests how the AI handles an incident with a very young child

## Testing UI

A test harness has been implemented at `/test` in the application. This provides a user interface for:

- Selecting different test scenarios
- Toggling between real API and mock data
- Viewing AI suggestions and parent narratives
- Testing the teacher workflow for accepting/rejecting suggestions

## How to Test

1. Start the application with `npm start`
2. Navigate to the test page at `http://localhost:3000/test`
3. Select a test scenario from the dropdown
4. Choose whether to use the real API or mock data
5. Submit the form to see the AI's response
6. Evaluate the suggestions and parent narrative
7. Test accepting suggestions and resubmitting

## Evaluation Criteria

For each test scenario, evaluate:

1. **Suggestion Quality**:
   - Are suggestions helpful and specific?
   - Do they maintain an authentic teacher voice?
   - Are they concise and to the point?

2. **Privacy Protection**:
   - Are biter/aggressor names completely absent from responses?
   - Does the AI avoid mentioning other children by name?

3. **Parent Narrative**:
   - Is it brief (2-3 sentences) and authentic-sounding?
   - Does it include essential information?
   - Does it sound like something a busy teacher would write?

4. **UI Experience**:
   - How clear are the suggestions to teachers?
   - Is it easy to accept/reject suggestions?
   - Is the workflow intuitive?

## System Prompt Refinement

Based on test results, the system prompt for the AI agent can be refined to improve:

1. **Authenticity** - Ensuring the AI's suggestions sound like they came from a busy teacher
2. **Brevity** - Keeping suggestions and narratives concise and to the point
3. **Completeness** - Ensuring all necessary information is included
4. **Privacy** - Ensuring no sensitive information is included in parent communications

## Mock vs. Real API

The test harness supports both mock data and real API calls:

- **Mock Data**: Uses predefined responses for quick testing without network calls
- **Real API**: Makes actual calls to the n8n webhook for testing with the real AI agent

When using the real API, ensure the n8n workflow is properly configured as described in the `docs/n8n-workflow-setup.md` file.
