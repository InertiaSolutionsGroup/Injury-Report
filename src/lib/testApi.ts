import { InjuryReport } from '../types/InjuryReport';
import { mockValidateInjuryReport, mockGenerateMemo } from './mockApi';

// Define interfaces for API responses
export interface ValidationResponse {
  enhancedReport: {
    child_name: string;
    incident_description_enhanced: string;
    injury_description_enhanced: string;
    action_taken_enhanced: string;
    [key: string]: any;
  };
  suggestions: Array<{
    field: string;
    original: string;
    suggestion: string;
    reason: string;
  }>;
  parent_narrative: string;
}

export interface MemoResponse {
  memo: string;
}

/**
 * Test API for validating injury reports
 * Can use either the real API or mock data based on useMock flag
 */
export const testValidateInjuryReport = async (
  reportData: Partial<InjuryReport>, 
  useMock: boolean = false
): Promise<ValidationResponse> => {
  try {
    if (useMock) {
      // Use mock data
      const response = await mockValidateInjuryReport(reportData) as ValidationResponse;
      console.log('Mock validation response:', response);
      return response;
    } else {
      // Use real API - import from api.ts
      const { validateInjuryReport } = await import('./api');
      const response = await validateInjuryReport(reportData);
      console.log('Real API validation response:', response);
      return response;
    }
  } catch (error) {
    console.error('Error validating injury report:', error);
    // Fall back to mock data if real API fails
    const response = await mockValidateInjuryReport(reportData) as ValidationResponse;
    console.log('Fallback to mock validation response:', response);
    return response;
  }
};

/**
 * Test API for generating memos
 * Can use either the real API or mock data based on useMock flag
 */
export const testGenerateMemo = async (
  reportData: Partial<InjuryReport>,
  useMock: boolean = false
): Promise<MemoResponse> => {
  try {
    if (useMock) {
      // Use mock data
      const response = await mockGenerateMemo(reportData) as MemoResponse;
      console.log('Mock memo response:', response);
      return response;
    } else {
      // Use real API - import from api.ts
      const { generateMemo } = await import('./api');
      const response = await generateMemo(reportData);
      console.log('Real API memo response:', response);
      return response;
    }
  } catch (error) {
    console.error('Error generating memo:', error);
    // Fall back to mock data if real API fails
    const response = await mockGenerateMemo(reportData) as MemoResponse;
    console.log('Fallback to mock memo response:', response);
    return response;
  }
};
