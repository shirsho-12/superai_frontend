
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, AlertTriangle, FileText, User, Calendar } from "lucide-react";
import TaskAssignmentModal from "./TaskAssignmentModal";

interface GapReviewScreenProps {
  regulation: { id: number; title: string } | null;
}

interface TaskAssignment {
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  notes: string;
}

interface Gap {
  id: number;
  description: string;
  regulationText: string;
  policySection: string;
  currentPolicy: string;
  severity: string;
  acknowledged: boolean;
  assignment?: TaskAssignment;
}

const GapReviewScreen: React.FC<GapReviewScreenProps> = ({ regulation }) => {
  const [gaps, setGaps] = useState<Gap[]>([
    {
      id: 1,
      description: "Customer identification requirements need enhancement",
      regulationText: "Enhanced due diligence measures must be applied to all high-risk customers...",
      policySection: "Section 3.2 - Customer Due Diligence",
      currentPolicy: "Standard KYC procedures apply to all customers...",
      severity: "high",
      acknowledged: false
    },
    {
      id: 2,
      description: "Transaction monitoring thresholds require adjustment",
      regulationText: "Suspicious transaction reports must be filed within 24 hours...",
      policySection: "Section 5.1 - Transaction Monitoring",
      currentPolicy: "Reports are filed within 48 hours of detection...",
      severity: "medium",
      acknowledged: false
    }
  ]);

  const handleAcknowledgeGap = (gapId: number) => {
    setGaps(gaps.map(gap => 
      gap.id === gapId ? { ...gap, acknowledged: true } : gap
    ));
  };

  const handleDismissGap = (gapId: number) => {
    setGaps(gaps.filter(gap => gap.id !== gapId));
  };

  const handleAssignTask = (gapId: number, assignment: TaskAssignment) => {
    setGaps(gaps.map(gap => 
      gap.id === gapId ? { ...gap, assignment } : gap
    ));
  };

  if (!regulation) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold">Select a regulation first</h3>
        <p className="text-gray-500">Please select a regulatory item to review gaps</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gap Review</CardTitle>
          <p className="text-gray-500">Review and triage identified compliance gaps</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{regulation.title}</h3>
            <p className="text-sm text-gray-500">Regulation ID: {regulation.id}</p>
          </div>
        </CardHeader>
      </Card>

      {gaps.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h3 className="mt-4 text-lg font-semibold">All gaps reviewed</h3>
            <p className="text-gray-500">No pending gaps to review for this regulation</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap) => (
            <Card key={gap.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{gap.description}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={gap.severity === "high" ? "destructive" : "default"}>
                        {gap.severity === "high" ? "High Priority" : "Medium Priority"}
                      </Badge>
                      {gap.assignment && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{gap.assignment.assigneeName}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">{gap.policySection}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {gap.assignment && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Task Assignment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Assigned to: {gap.assignment.assigneeName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Due: {new Date(gap.assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                        <span>Priority: {gap.assignment.priority}</span>
                      </div>
                    </div>
                    {gap.assignment.notes && (
                      <p className="text-sm text-blue-800 mt-2">{gap.assignment.notes}</p>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Regulation Text</h4>
                    <p className="text-sm text-blue-800">{gap.regulationText}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Current Policy</h4>
                    <p className="text-sm text-gray-700">{gap.currentPolicy}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAcknowledgeGap(gap.id)}
                    disabled={gap.acknowledged}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {gap.acknowledged ? "Acknowledged" : "Acknowledge Gap"}
                  </Button>
                  
                  <TaskAssignmentModal
                    gapId={gap.id}
                    gapDescription={gap.description}
                    onAssign={(assignment) => handleAssignTask(gap.id, assignment)}
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleDismissGap(gap.id)}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss Gap
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GapReviewScreen;
