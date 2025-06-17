
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Edit, FileText } from "lucide-react";

interface AmendmentWorkbenchProps {
  regulation: { id: number; title: string } | null;
}

const AmendmentWorkbench: React.FC<AmendmentWorkbenchProps> = ({ regulation }) => {
  const [amendments, setAmendments] = useState([
    {
      id: 1,
      policySection: "Section 3.2 - Customer Due Diligence",
      originalText: "Standard KYC procedures apply to all customers with verification of identity and address.",
      proposedText: "Enhanced due diligence measures must be applied to all high-risk customers, including politically exposed persons, with additional verification steps and ongoing monitoring.",
      changeType: "modification",
      status: "pending",
      rationale: "To comply with new MAS requirements for enhanced customer screening"
    },
    {
      id: 2,
      policySection: "Section 5.1 - Transaction Monitoring",
      originalText: "Suspicious transaction reports are filed within 48 hours of detection.",
      proposedText: "Suspicious transaction reports must be filed within 24 hours of detection to comply with updated regulatory timelines.",
      changeType: "modification",
      status: "pending",
      rationale: "Updated timeline requirement from MAS guidelines"
    }
  ]);

  const handleApprove = (amendmentId: number) => {
    setAmendments(amendments.map(amendment => 
      amendment.id === amendmentId ? { ...amendment, status: "approved" } : amendment
    ));
  };

  const handleReject = (amendmentId: number) => {
    setAmendments(amendments.map(amendment => 
      amendment.id === amendmentId ? { ...amendment, status: "rejected" } : amendment
    ));
  };

  if (!regulation) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold">Select a regulation first</h3>
        <p className="text-gray-500">Please select a regulatory item to review amendments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Amendment Workbench</CardTitle>
          <p className="text-gray-500">Review and approve proposed policy amendments</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{regulation.title}</h3>
            <p className="text-sm text-gray-500">Regulation ID: {regulation.id}</p>
          </div>
        </CardHeader>
      </Card>

      {amendments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h3 className="mt-4 text-lg font-semibold">No amendments pending</h3>
            <p className="text-gray-500">All amendments have been reviewed for this regulation</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {amendments.map((amendment) => (
            <Card key={amendment.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{amendment.policySection}</CardTitle>
                  <Badge 
                    variant={
                      amendment.status === "approved" ? "default" :
                      amendment.status === "rejected" ? "destructive" : "outline"
                    }
                  >
                    {amendment.status.charAt(0).toUpperCase() + amendment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rationale</h4>
                  <p className="text-sm text-gray-700">{amendment.rationale}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Current Text</h4>
                    <p className="text-sm text-red-800 line-through">{amendment.originalText}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Proposed Text</h4>
                    <p className="text-sm text-green-800">{amendment.proposedText}</p>
                  </div>
                </div>
                
                {amendment.status === "pending" && (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => handleApprove(amendment.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Amendment
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Amendment
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      onClick={() => handleReject(amendment.id)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Amendment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmendmentWorkbench;
