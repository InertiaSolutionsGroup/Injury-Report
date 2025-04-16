import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherForm from '../src/components/TeacherForm';
import * as api from '../src/lib/api';

/**
 * Test: AI Validation Suggestions UI
 * 
 * Purpose: This test verifies that when the validation webhook returns suggestions,
 * they are properly displayed to the teacher in the UI. It tests the complete flow
 * from form submission to suggestion display without requiring actual API calls.
 * 
 * This is critical for ensuring the AI validation feature works correctly from the
 * teacher's perspective.
 */

// Mock the validation API to return suggestions
// This simulates what would come back from the n8n validation webhook
jest.spyOn(api, 'validateInjuryReport').mockImplementation(async () => ({
  status: 'success',
  suggestions: [
    {
      field: 'injury_description',
      original: 'Old description',
      suggestion: 'Suggested new description',
      reason: 'More detailed explanation.'
    },
    {
      field: 'action_taken',
      original: 'Old action',
      suggestion: 'Suggested new action',
      reason: 'Clearer action.'
    }
  ]
}));

// Mock hooks and data dependencies as needed
// This prevents the test from requiring actual data from Supabase
jest.mock('../src/hooks/useInjuryForm', () => {
  const original = jest.requireActual('../src/hooks/useInjuryForm');
  return {
    ...original,
    useInjuryForm: () => {
      const base = original.useInjuryForm();
      // Prepopulate required fields to pass validation
      return {
        ...base,
        formData: {
          childId: 'child-1',
          date: '2025-04-16',
          time: '10:00',
          location: 'Playground',
          submittingUserId: 'teacher-1',
          incidentDescription: 'A test incident',
          injuryDescription: 'Old description',
          actionTaken: 'Old action',
          isBite: false,
          biterChildId: '',
          isPeerAggression: false,
          aggressorChildId: ''
        },
        children: [{ id: 'child-1', name: 'Test Child' }],
        teachers: [{ id: 'teacher-1', name: 'Test Teacher' }],
        // Provide a no-op for resetForm to avoid errors
        resetForm: jest.fn()
      };
    }
  };
});

// Main test
describe('TeacherForm AI Validation', () => {
  it('displays AI suggestions to the teacher after validation webhook reply', async () => {
    // Render the TeacherForm component
    render(<TeacherForm />);

    // Simulate clicking the submit button (triggers validation)
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for the SuggestionPanel to appear
    // This verifies that the UI updates after receiving the webhook response
    await waitFor(() => {
      expect(screen.getByText(/AI has suggested improvements/i)).toBeInTheDocument();
    });

    // Check that the suggestions are displayed
    // This verifies that the exact suggestion content is visible to the teacher
    expect(screen.getByText('Suggested new description')).toBeInTheDocument();
    expect(screen.getByText('Suggested new action')).toBeInTheDocument();
    expect(screen.getByText('More detailed explanation.')).toBeInTheDocument();
    expect(screen.getByText('Clearer action.')).toBeInTheDocument();

    // Verify that the action buttons are available to the teacher
    expect(screen.getByRole('button', { name: /Accept All Suggestions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit as is/i })).toBeInTheDocument();
  });
});
