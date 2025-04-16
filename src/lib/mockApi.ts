import { InjuryReport } from '../types/InjuryReport';

/**
 * Mock implementation of the validateInjuryReport API for testing
 * This simulates the response from the n8n webhook
 */
export const mockValidateInjuryReport = (reportData: Partial<InjuryReport>) => {
  // Extract the child's name for personalization
  const childName = reportData.child_name || 'the child';
  const childFirstName = childName.split(' ')[0];
  
  // Create suggestions based on the quality of the input
  const suggestions = [];
  
  // Check incident description
  if (!reportData.incident_description || reportData.incident_description.length < 20) {
    suggestions.push({
      field: 'incident_description',
      original: reportData.incident_description || '',
      suggestion: `${childFirstName} fell while playing in the ${reportData.location?.toLowerCase() || 'playground'}.`,
      reason: "Adding more context about what the child was doing helps understand how the incident occurred."
    });
  }
  
  // Check injury description
  if (!reportData.injury_description || reportData.injury_description.length < 20) {
    suggestions.push({
      field: 'injury_description',
      original: reportData.injury_description || '',
      suggestion: `Small scrape on ${childFirstName}'s right knee. No bleeding, just a red mark about the size of a dime.`,
      reason: "Specifying the exact location and appearance of the injury helps assess its severity."
    });
  }
  
  // Check action taken
  if (!reportData.action_taken || reportData.action_taken.length < 20) {
    suggestions.push({
      field: 'action_taken',
      original: reportData.action_taken || '',
      suggestion: `Cleaned the area with soap and water. Gave ${childFirstName} a hug and applied a bandage.`,
      reason: "Including both the first aid provided and comfort measures helps show complete care."
    });
  }
  
  // Generate enhanced report
  const enhancedReport = {
    child_name: reportData.child_name,
    incident_description_enhanced: suggestions.find(s => s.field === 'incident_description')?.suggestion || reportData.incident_description,
    injury_description_enhanced: suggestions.find(s => s.field === 'injury_description')?.suggestion || reportData.injury_description,
    action_taken_enhanced: suggestions.find(s => s.field === 'action_taken')?.suggestion || reportData.action_taken
  };
  
  // Generate a parent narrative
  let parentNarrative = `${childFirstName} had a minor incident today in the ${reportData.location?.toLowerCase() || 'classroom'}. `;
  
  if (reportData.is_bite) {
    parentNarrative += "Another child bit them during play. ";
  } else if (reportData.is_peer_aggression) {
    parentNarrative += "They were pushed by another child. ";
  } else {
    parentNarrative += `They ${reportData.incident_description?.toLowerCase().replace(childFirstName, '').replace('child', '').trim() || 'fell'}. `;
  }
  
  parentNarrative += `We ${reportData.action_taken?.toLowerCase().replace('.', '') || 'provided first aid'} and made sure ${childFirstName} was comfortable before returning to activities.`;
  
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        enhancedReport,
        suggestions,
        parent_narrative: parentNarrative
      });
    }, 1500);
  });
};

/**
 * Mock implementation of the generateMemo API for testing
 */
export const mockGenerateMemo = (reportData: Partial<InjuryReport>) => {
  // Similar to validateInjuryReport but focused on generating the memo
  const childName = reportData.child_name || 'the child';
  const childFirstName = childName.split(' ')[0];
  
  let memo = `Dear Parent/Guardian,\n\n`;
  memo += `This is to inform you that ${childName} had a minor incident today at school. `;
  
  if (reportData.is_bite) {
    memo += "They were bitten by another child during play. ";
  } else if (reportData.is_peer_aggression) {
    memo += "They were involved in an incident with another child. ";
  } else {
    memo += `${reportData.incident_description || 'They had a fall'}. `;
  }
  
  memo += `${reportData.injury_description || 'They sustained a minor injury'}. `;
  memo += `${reportData.action_taken || 'We provided appropriate care'}.`;
  
  memo += `\n\nPlease let us know if you have any questions or concerns.`;
  memo += `\n\nSincerely,\nThe Teaching Team`;
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        memo
      });
    }, 1000);
  });
};
