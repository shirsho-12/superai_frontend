
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, X, Edit, FileText, Save, XIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

interface Amendment {
  id: number;
  policySection: string;
  originalText: string;
  proposedText: string;
  changeType: string;
  status: string;
  rationale: string;
}

interface AmendmentWorkbenchProps {
  regulation: { id: number; title: string } | null;
}

const AmendmentWorkbench: React.FC<AmendmentWorkbenchProps> = ({ regulation }) => {
  const [amendments, setAmendments] = useState<Amendment[]>([
    {
      id: 1,
      policySection: "1.1 Customer Due Diligence",
      originalText: "Standard KYC procedures apply to all customers with verification of identity and address.",
      proposedText: "Enhanced due diligence measures must be applied to all high-risk customers, including politically exposed persons, with additional verification steps and ongoing monitoring.",
      changeType: "modification",
      status: "pending",
      rationale: "To comply with new MAS requirements for enhanced customer screening"
    },
    {
      id: 2,
      policySection: "1.2 Transaction Monitoring",
      originalText: "Suspicious transaction reports are filed within 48 hours of detection.",
      proposedText: "Suspicious transaction reports must be filed within 24 hours of detection to comply with updated regulatory timelines.",
      changeType: "modification",
      status: "pending",
      rationale: "Updated timeline requirement from MAS guidelines"
    }
  ]);

  const [editingAmendment, setEditingAmendment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  const handleStartEdit = (amendmentId: number, currentText: string) => {
    setEditingAmendment(amendmentId);
    setEditText(currentText);
  };

  const handleSaveEdit = async (amendmentId: number) => {
    setLoadingActions(prev => ({ ...prev, [`save-${amendmentId}`]: true }));
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAmendments(amendments.map(amendment => 
      amendment.id === amendmentId 
        ? { ...amendment, proposedText: editText }
        : amendment
    ));
    
    setEditingAmendment(null);
    setEditText("");
    setLoadingActions(prev => ({ ...prev, [`save-${amendmentId}`]: false }));
    
    toast({
      title: "Amendment updated",
      description: "The proposed text has been successfully updated"
    });
  };

  const handleCancelEdit = () => {
    setEditingAmendment(null);
    setEditText("");
  };

  const handleApprove = async (amendmentId: number) => {
    setLoadingActions(prev => ({ ...prev, [`approve-${amendmentId}`]: true }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAmendments(amendments.map(amendment => 
      amendment.id === amendmentId ? { ...amendment, status: "approved" } : amendment
    ));
    
    setLoadingActions(prev => ({ ...prev, [`approve-${amendmentId}`]: false }));
    
    toast({
      title: "Amendment approved",
      description: "The amendment has been successfully approved"
    });
  };

  const handleReject = async (amendmentId: number) => {
    setLoadingActions(prev => ({ ...prev, [`reject-${amendmentId}`]: true }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAmendments(amendments.map(amendment => 
      amendment.id === amendmentId ? { ...amendment, status: "rejected" } : amendment
    ));
    
    setLoadingActions(prev => ({ ...prev, [`reject-${amendmentId}`]: false }));
    
    toast({
      title: "Amendment rejected",
      description: "The amendment has been rejected"
    });
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
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-green-900">Proposed Text</h4>
                      {amendment.status === "pending" && editingAmendment !== amendment.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(amendment.id, amendment.proposedText)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {editingAmendment === amendment.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[100px] bg-white"
                          placeholder="Enter the proposed text..."
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(amendment.id)}
                            disabled={loadingActions[`save-${amendment.id}`]}
                          >
                            {loadingActions[`save-${amendment.id}`] ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-3 h-3 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <XIcon className="w-3 h-3 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-green-800">{amendment.proposedText}</p>
                    )}
                  </div>
                </div>
                
                {amendment.status === "pending" && editingAmendment !== amendment.id && (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => handleApprove(amendment.id)}
                      className="flex-1"
                      disabled={loadingActions[`approve-${amendment.id}`]}
                    >
                      {loadingActions[`approve-${amendment.id}`] ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Amendment
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      onClick={() => handleReject(amendment.id)}
                      className="flex-1"
                      disabled={loadingActions[`reject-${amendment.id}`]}
                    >
                      {loadingActions[`reject-${amendment.id}`] ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Reject Amendment
                        </>
                      )}
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
