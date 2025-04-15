import axios from 'axios';
import { InjuryReport } from './supabase';

// These URLs should be replaced with actual n8n webhook URLs
const VALIDATION_WEBHOOK_URL = process.env.REACT_APP_VALIDATION_WEBHOOK_URL || 'https://n8n-instance.example.com/webhook/validation';
const MEMO_GENERATION_WEBHOOK_URL = process.env.REACT_APP_MEMO_GENERATION_WEBHOOK_URL || 'https://n8n-instance.example.com/webhook/memo-generation';

// Types for API responses
export type ValidationResponse = {
  status: 'success' | 'error';
  suggestions?: {
    field: 'incident_description' | 'injury_description' | 'action_taken';
    original: string;
    suggestion: string;
    reason: string;
  }[];
  message?: string;
};

export type MemoGenerationResponse = {
  status: 'success' | 'error';
  memo_content?: string;
  message?: string;
};

// Function to validate injury report data with AI
export const validateInjuryReport = async (reportData: Partial<InjuryReport>): Promise<ValidationResponse> => {
  try {
    const response = await axios.post(VALIDATION_WEBHOOK_URL, reportData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating injury report:', error);
    return {
      status: 'error',
      message: 'Failed to connect to the validation service. Please try again or submit as is.',
    };
  }
};

// Function to generate memo for an injury report
export const generateMemo = async (reportData: InjuryReport): Promise<MemoGenerationResponse> => {
  try {
    const response = await axios.post(MEMO_GENERATION_WEBHOOK_URL, reportData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating memo:', error);
    return {
      status: 'error',
      message: 'Failed to connect to the memo generation service. Please try again later.',
    };
  }
};
