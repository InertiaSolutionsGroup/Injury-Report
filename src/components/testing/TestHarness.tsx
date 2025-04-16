import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import InjuryDetailsSection from '../teacher/InjuryDetailsSection';
import AIFeedbackSection from '../teacher/AIFeedbackSection';
import { testValidateInjuryReport } from '../../lib/testApi';
import { InjuryReport } from '../../types/InjuryReport';

// Import test scenarios
// Note: In a real implementation, you'd need to handle this import differently for browser environments
// This is a simplified version for the test harness
const testScenarios = [
  {
    name: "Minimal Information",
    description: "Tests how the AI responds when given minimal information in all fields",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Emma Johnson",
      injury_timestamp: new Date().toISOString(),
      location: "Playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Child fell.",
      injury_description: "Scrape on knee.",
      action_taken: "Cleaned it.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Partial Information",
    description: "Tests how the AI responds when some fields are good but others need improvement",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Noah Williams",
      injury_timestamp: new Date().toISOString(),
      location: "Classroom during circle time",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Noah tripped over a toy while walking to his seat.",
      injury_description: "Bruise on arm.",
      action_taken: "Applied ice pack.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Good Information",
    description: "Tests how the AI responds when given good information in all fields",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Sophia Garcia",
      injury_timestamp: new Date().toISOString(),
      location: "Art area in Blue Room",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Sophia slipped on some water that had spilled near the sink during art time.",
      injury_description: "Small red bump on her forehead about the size of a quarter.",
      action_taken: "Applied ice pack for 10 minutes and gave her a hug. She felt better after a few minutes and rejoined the activity.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Bite Incident",
    description: "Tests how the AI handles a bite incident while protecting the biter's identity",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Liam Thompson",
      injury_timestamp: new Date().toISOString(),
      location: "Block area",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Liam was bitten by another child while playing with blocks.",
      injury_description: "Teeth marks visible on left forearm, no broken skin.",
      action_taken: "Washed area with soap and water, applied ice pack.",
      is_bite: true,
      biter_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
      biter_child_name: "Oliver Martinez",
      is_peer_aggression: true,
      aggressor_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
      aggressor_child_name: "Oliver Martinez"
    }
  },
  {
    name: "Peer Aggression",
    description: "Tests how the AI handles peer aggression while protecting the aggressor's identity",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Ava Wilson",
      injury_timestamp: new Date().toISOString(),
      location: "Outdoor playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Ava was pushed by another child on the playground.",
      injury_description: "Scraped her palms when she fell.",
      action_taken: "Washed hands with soap and water, applied bandaids to both palms.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: true,
      aggressor_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
      aggressor_child_name: "Ethan Brown"
    }
  },
  {
    name: "Multiple Injuries",
    description: "Tests how the AI handles multiple injuries in one incident",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Jackson Lee",
      injury_timestamp: new Date().toISOString(),
      location: "Climbing structure on playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Jackson fell from the climbing structure.",
      injury_description: "Scrape on right knee and bump on forehead.",
      action_taken: "Cleaned knee, applied ice to head, monitored for 15 minutes.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Allergic Reaction",
    description: "Tests how the AI handles an allergic reaction incident",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Olivia Chen",
      injury_timestamp: new Date().toISOString(),
      location: "Snack table",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Olivia developed hives after snack time.",
      injury_description: "Red hives on arms and neck, some swelling.",
      action_taken: "Removed from area, called parent, monitored breathing.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Emotional Distress",
    description: "Tests how the AI handles emotional distress without physical injury",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Ethan Rodriguez",
      injury_timestamp: new Date().toISOString(),
      location: "Classroom",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Ethan became upset when his tower fell down.",
      injury_description: "No physical injury, but was crying and upset.",
      action_taken: "Comforted him, helped rebuild tower, redirected to new activity.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Pre-existing Condition",
    description: "Tests how the AI handles an incident involving a pre-existing condition",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Mia Johnson",
      injury_timestamp: new Date().toISOString(),
      location: "Playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Mia's asthma was triggered while running outside.",
      injury_description: "Breathing difficulty, wheezing.",
      action_taken: "Had her sit down, used her inhaler per care plan, monitored breathing.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Delayed Symptoms",
    description: "Tests how the AI handles an incident with delayed symptoms",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Lucas Smith",
      injury_timestamp: new Date().toISOString(),
      location: "Playground",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Lucas fell during outside time but seemed fine.",
      injury_description: "Later noticed limping, slight swelling on ankle.",
      action_taken: "Applied ice, had him rest, monitored swelling.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Special Needs Consideration",
    description: "Tests how the AI handles an incident involving a child with special needs",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Aiden Taylor",
      injury_timestamp: new Date().toISOString(),
      location: "Sensory area",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Aiden became overwhelmed by noise and hit his head on wall.",
      injury_description: "Small red mark on forehead.",
      action_taken: "Moved to quiet area, applied ice, used calming techniques from his plan.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  },
  {
    name: "Toddler Incident",
    description: "Tests how the AI handles an incident with a very young child",
    data: {
      child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
      child_name: "Harper Davis",
      injury_timestamp: new Date().toISOString(),
      location: "Toddler room",
      submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
      incident_description: "Harper bumped into shelf while learning to walk.",
      injury_description: "Small bump on head.",
      action_taken: "Comforted, applied cold pack, extra cuddles.",
      is_bite: false,
      biter_child_id: null,
      biter_child_name: null,
      is_peer_aggression: false,
      aggressor_child_id: null,
      aggressor_child_name: null
    }
  }
];

// Mock response for when the webhook is not available
const mockResponse = {
  enhancedReport: {
    child_name: "Child Name",
    incident_description_enhanced: "Enhanced incident description will appear here.",
    injury_description_enhanced: "Enhanced injury description will appear here.",
    action_taken_enhanced: "Enhanced action taken will appear here."
  },
  suggestions: [
    {
      field: "incident_description",
      original: "Original text",
      suggestion: "Suggested improvement",
      reason: "Reason for suggestion"
    }
  ],
  parent_narrative: "This is a sample parent narrative that would be generated by the AI."
};

const TestHarness: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("0");
  const [formData, setFormData] = useState<InjuryReport>(testScenarios[0].data);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [useMock, setUseMock] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  
  // Update form data when scenario changes
  useEffect(() => {
    const scenarioIndex = parseInt(selectedScenario, 10);
    setFormData(testScenarios[scenarioIndex].data);
    // Reset AI response when changing scenarios
    setAiResponse(null);
  }, [selectedScenario]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (useMock) {
        // Use mock response
        setTimeout(() => {
          setAiResponse(mockResponse);
          setIsLoading(false);
          setActiveTab("feedback");
        }, 1500);
        return;
      }
      
      // Call the actual API
      const response = await testValidateInjuryReport(formData, useMock);
      setAiResponse(response);
      setActiveTab("feedback");
    } catch (error) {
      console.error("Error submitting form:", error);
      // If there's an error, fall back to mock response
      setAiResponse(mockResponse);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAcceptSuggestion = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Remove the accepted suggestion
    if (aiResponse && aiResponse.suggestions) {
      const updatedSuggestions = aiResponse.suggestions.filter(
        (s: any) => s.field !== field
      );
      
      setAiResponse({
        ...aiResponse,
        suggestions: updatedSuggestions
      });
    }
  };
  
  const handleAcceptAllSuggestions = () => {
    if (!aiResponse || !aiResponse.enhancedReport) return;
    
    const updatedFormData = {
      ...formData,
      incident_description: aiResponse.enhancedReport.incident_description_enhanced || formData.incident_description,
      injury_description: aiResponse.enhancedReport.injury_description_enhanced || formData.injury_description,
      action_taken: aiResponse.enhancedReport.action_taken_enhanced || formData.action_taken
    };
    
    setFormData(updatedFormData);
    
    // Clear all suggestions
    setAiResponse({
      ...aiResponse,
      suggestions: []
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Injury Report Test Harness</CardTitle>
          <CardDescription>
            Test the AI feedback system with various scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Test Scenario
                </label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a test scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {testScenarios.map((scenario, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Use Mock Response
                </label>
                <Button 
                  variant={useMock ? "default" : "outline"} 
                  onClick={() => setUseMock(!useMock)}
                  className="w-full"
                >
                  {useMock ? "Using Mock" : "Use Real API"}
                </Button>
              </div>
            </div>
            
            <Alert className="mb-4">
              <AlertDescription>
                {testScenarios[parseInt(selectedScenario, 10)].description}
              </AlertDescription>
            </Alert>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form">Injury Report Form</TabsTrigger>
              <TabsTrigger value="feedback" disabled={!aiResponse}>AI Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-4">
              <InjuryDetailsSection
                incidentDescription={formData.incident_description}
                injuryDescription={formData.injury_description}
                actionTaken={formData.action_taken}
                onChange={handleInputChange}
              />
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit for AI Feedback"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-4">
              {aiResponse && (
                <AIFeedbackSection
                  isLoading={isLoading}
                  suggestions={aiResponse.suggestions || []}
                  parentNarrative={aiResponse.parent_narrative || ""}
                  enhancedReport={aiResponse.enhancedReport || {}}
                  onAcceptSuggestion={handleAcceptSuggestion}
                  onAcceptAllSuggestions={handleAcceptAllSuggestions}
                  onResubmit={handleSubmit}
                  onContinue={() => alert("Report would be submitted here")}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestHarness;
