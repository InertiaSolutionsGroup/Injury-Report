import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Check, AlertCircle, Edit, RefreshCw } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Suggestion {
  field: string;
  original: string;
  suggestion: string;
  reason: string;
}

interface AIFeedbackSectionProps {
  isLoading: boolean;
  suggestions: Suggestion[];
  parentNarrative: string;
  enhancedReport: {
    incident_description_enhanced?: string;
    injury_description_enhanced?: string;
    action_taken_enhanced?: string;
  };
  onAcceptSuggestion: (field: string, value: string) => void;
  onAcceptAllSuggestions: () => void;
  onResubmit: () => void;
  onContinue: () => void;
}

const fieldLabels: Record<string, string> = {
  'incident_description': 'Incident Description',
  'injury_description': 'Injury Description',
  'action_taken': 'Action Taken'
};

const AIFeedbackSection: React.FC<AIFeedbackSectionProps> = ({
  isLoading,
  suggestions,
  parentNarrative,
  enhancedReport,
  onAcceptSuggestion,
  onAcceptAllSuggestions,
  onResubmit,
  onContinue
}) => {
  const [activeTab, setActiveTab] = useState<string>("suggestions");
  
  if (isLoading) {
    return (
      <Card className="mt-6 animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your report...
          </CardTitle>
          <CardDescription>
            We're reviewing your report to provide helpful suggestions and generate a parent-friendly narrative.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  const hasSuggestions = suggestions && suggestions.length > 0;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Feedback</CardTitle>
        <CardDescription>
          Review suggestions and the parent narrative generated from your report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">
              Suggestions {hasSuggestions && <Badge variant="destructive" className="ml-2">{suggestions.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="narrative">Parent Narrative</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions" className="space-y-4 mt-4">
            {!hasSuggestions ? (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Great job!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your report contains all the necessary details. No improvements needed.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Suggestions Available</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    We've identified some ways to improve your report. Review and accept suggestions below.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <Card key={index} className="border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{fieldLabels[suggestion.field] || suggestion.field}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">Original:</div>
                          <div className="text-sm p-2 bg-gray-100 rounded-md">{suggestion.original}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">Suggested improvement:</div>
                          <div className="text-sm p-2 bg-green-50 rounded-md border border-green-100">{suggestion.suggestion}</div>
                        </div>
                        <div className="text-xs text-gray-600 italic">
                          <span className="font-semibold">Why: </span>
                          {suggestion.reason}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => onAcceptSuggestion(suggestion.field, suggestion.suggestion)}
                        >
                          <Check className="mr-1 h-3 w-3" /> Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={onResubmit}>
                    <RefreshCw className="mr-1 h-4 w-4" /> Resubmit with My Edits
                  </Button>
                  <Button onClick={onAcceptAllSuggestions}>
                    <Check className="mr-1 h-4 w-4" /> Accept All Suggestions
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="narrative" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Parent Narrative</CardTitle>
                <CardDescription>
                  This is the narrative that will be shared with parents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                  {parentNarrative}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  This narrative is generated based on your report details. If you accept suggestions or edit your report, the narrative will be updated.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={onContinue} disabled={hasSuggestions}>
          Continue to Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIFeedbackSection;
