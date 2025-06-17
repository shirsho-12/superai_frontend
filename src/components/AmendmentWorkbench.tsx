
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X, Edit3, Eye, FileText, Link } from "lucide-react";

const AmendmentWorkbench = () => {
  const [selectedAmendment, setSelectedAmendment] = useState(0);
  const [amendmentActions, setAmendmentActions] = useState<{ [key: number]: 'approved' | 'rejected' | 'edited' }>({});
  const [editedText, setEditedText] = useState<{ [key: number]: string }>({});

  const amendments = [
    {
      id: 1,
      gapId: 1,
      section: "Customer Verification Policy - Section 2.4",
      originalText: "Verification procedures apply to transactions above S$10,000. Enhanced documentation is required for amounts exceeding S$20,000.",
      suggestedText: "Verification procedures apply to transactions above S$5,000. Enhanced documentation and real-time risk assessment protocols are required for amounts exceeding S$5,000.",
      changeType: "threshold_update",
      rationale: "Aligns with MAS Notice PSN01 Section 3.2.1 requirement for enhanced verification at S$5,000 threshold and includes mandatory real-time risk assessment protocols.",
      regulationSource: "Notice PSN01 - Section 3.2.1"
    },
    {
      id: 2,
      gapId: 2,
      section: "Information Security Policy - Section 7.2",
      originalText: "Penetration testing is conducted annually. Vulnerability assessments are performed semi-annually with documentation reviewed annually.",
      suggestedText: "Penetration testing is conducted bi-annually. Vulnerability assessments are performed semi-annually with comprehensive documentation reviewed quarterly.",
      changeType: "frequency_update",
      rationale: "Increases penetration testing frequency from annual to bi-annual and changes vulnerability assessment documentation review from annual to quarterly as required by Technology Risk Management Guidelines.",
      regulationSource: "Technology Risk Management Guidelines - Section 4.1.3"
    },
    {
      id: 3,
      gapId: 3,
      section: "AML Policy - Section 4.1",
      originalText: "Enhanced due diligence applies to PEP transactions and transactions above S$50,000. High-risk jurisdiction monitoring is conducted on a risk-based approach.",
      suggestedText: "Enhanced due diligence applies to PEP transactions, transactions above S$50,000, and all cross-border transactions involving jurisdictions identified as high-risk by FATF. Ongoing monitoring requirements include quarterly reviews of all high-risk jurisdiction transactions.",
      changeType: "scope_expansion",
      rationale: "Expands enhanced due diligence requirements to include all transactions with FATF high-risk jurisdictions regardless of amount, and clarifies ongoing monitoring requirements with specific quarterly review cycles.",
      regulationSource: "AML/CFT Guidelines - Section 2.5.2"
    }
  ];

  const currentAmendment = amendments[selectedAmendment];

  const handleAmendmentAction = (amendmentId: number, action: 'approved' | 'rejected' | 'edited', editText?: string) => {
    setAmendmentActions(prev => ({ ...prev, [amendmentId]: action }));
    if (action === 'edited' && editText) {
      setEditedText(prev => ({ ...prev, [amendmentId]: editText }));
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "threshold_update": return "bg-blue-100 text-blue-800";
      case "frequency_update": return "bg-purple-100 text-purple-800";
      case "scope_expansion": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case "threshold_update": return "Threshold Update";
      case "frequency_update": return "Frequency Change";
      case "scope_expansion": return "Scope Expansion";
      default: return "Policy Change";
    }
  };

  const renderTextDiff = (original: string, suggested: string) => {
    // Simple diff visualization - in production, you'd use a proper diff library
    const words = original.split(' ');
    const suggestedWords = suggested.split(' ');
    
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Original Text</h4>
          <p className="text-sm text-red-700 line-through">{original}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Suggested Amendment</h4>
          <p className="text-sm text-green-700 font-medium">{suggested}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-purple-900">Amendment Workbench</h2>
              <p className="text-purple-700 mt-1">
                Review and approve CompliAgent's suggested policy amendments
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-900">
                {Object.keys(amendmentActions).length}/{amendments.length}
              </div>
              <p className="text-sm text-purple-600">Amendments Reviewed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Amendment List Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Policy Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {amendments.map((amendment, index) => (
                  <div
                    key={amendment.id}
                    className={`p-3 cursor-pointer transition-colors border-l-4 ${
                      selectedAmendment === index
                        ? 'bg-blue-50 border-l-blue-500'
                        : 'hover:bg-gray-50 border-l-transparent'
                    }`}
                    onClick={() => setSelectedAmendment(index)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Section {index + 1}</span>
                      {amendmentActions[amendment.id] && (
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {amendment.section}
                    </p>
                    <Badge 
                      className={`text-xs mt-1 ${getChangeTypeColor(amendment.changeType)}`}
                      variant="outline"
                    >
                      {getChangeTypeLabel(amendment.changeType)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Amendment Review Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Amendment Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{currentAmendment.section}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getChangeTypeColor(currentAmendment.changeType)}>
                      {getChangeTypeLabel(currentAmendment.changeType)}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Link className="w-3 h-3 mr-1" />
                      {currentAmendment.regulationSource}
                    </Button>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  Amendment {selectedAmendment + 1} of {amendments.length}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Text Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Proposed Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTextDiff(currentAmendment.originalText, currentAmendment.suggestedText)}
            </CardContent>
          </Card>

          {/* Rationale */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CompliAgent Rationale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 leading-relaxed">
                  {currentAmendment.rationale}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Area (if editing) */}
          {amendmentActions[currentAmendment.id] === 'edited' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Your Edited Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editedText[currentAmendment.id] || currentAmendment.suggestedText}
                  onChange={(e) => setEditedText(prev => ({ ...prev, [currentAmendment.id]: e.target.value }))}
                  className="min-h-[120px]"
                  placeholder="Edit the suggested amendment..."
                />
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Review this amendment to proceed
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleAmendmentAction(currentAmendment.id, 'rejected')}
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleAmendmentAction(currentAmendment.id, 'edited', currentAmendment.suggestedText)}
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleAmendmentAction(currentAmendment.id, 'approved')}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          {Object.keys(amendmentActions).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(amendmentActions).filter(action => action === 'approved').length}
                    </div>
                    <div className="text-sm text-green-700">Approved</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(amendmentActions).filter(action => action === 'edited').length}
                    </div>
                    <div className="text-sm text-blue-700">Edited</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-600">
                      {Object.values(amendmentActions).filter(action => action === 'rejected').length}
                    </div>
                    <div className="text-sm text-gray-700">Rejected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmendmentWorkbench;
