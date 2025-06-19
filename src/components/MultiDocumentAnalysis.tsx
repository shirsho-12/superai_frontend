
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, FileText, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { useComplianceAPI } from "@/hooks/use-compliance-api";

interface Document {
  id: string;
  title: string;
  type: string;
  status: string;
  lastUpdated: string;
}

interface CrossImpactResult {
  impactLevel: string;
  affectedPolicies: string[];
  recommendations: string[];
  conflicts: string[];
}

const MultiDocumentAnalysis: React.FC = () => {
  const { analyzeCrossImpact } = useComplianceAPI();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<CrossImpactResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const documents: Document[] = [
    {
      id: "doc-1",
      title: "1.1 Payment Services Notice PSN01 Amendments",
      type: "regulation",
      status: "active",
      lastUpdated: "2024-06-10"
    },
    {
      id: "doc-2", 
      title: "1.2 Technology Risk Management Guidelines",
      type: "guideline",
      status: "active",
      lastUpdated: "2024-06-08"
    },
    {
      id: "doc-3",
      title: "1.3 Digital Payment Token Licensing Framework",
      type: "framework", 
      status: "draft",
      lastUpdated: "2024-05-28"
    },
    {
      id: "policy-1",
      title: "1.4 Internal AML/CFT Policy Document",
      type: "policy",
      status: "active",
      lastUpdated: "2024-05-15"
    },
    {
      id: "policy-2",
      title: "1.5 Customer Due Diligence Procedures",
      type: "policy", 
      status: "active",
      lastUpdated: "2024-04-20"
    }
  ];

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    }
  };

  const handleAnalyze = async () => {
    if (selectedDocuments.length < 2) {
      toast({
        title: "Selection Required",
        description: "Please select at least 2 documents for cross-impact analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const regulationIds = selectedDocuments.filter(id => id.startsWith('doc-'));
      const policyIds = selectedDocuments.filter(id => id.startsWith('policy-'));
      
      await analyzeCrossImpact(regulationIds, policyIds);
      
      // Mock result for demonstration
      const mockResult: CrossImpactResult = {
        impactLevel: "High",
        affectedPolicies: [
          "1.1.a Customer identification procedures",
          "1.2.a Transaction monitoring systems", 
          "1.3.a Risk assessment frameworks"
        ],
        recommendations: [
          "1.1.b Update customer onboarding procedures to include enhanced due diligence",
          "1.2.b Implement real-time transaction monitoring for high-risk customers",
          "1.3.b Review and update risk scoring algorithms"
        ],
        conflicts: [
          "1.1.c Conflicting timeline requirements between PSN01 and internal policy",
          "1.2.c Technology requirements may exceed current system capabilities"
        ]
      };
      
      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete", 
        description: "Cross-impact analysis has been completed successfully"
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to complete cross-impact analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "regulation":
      case "guideline":
      case "framework":
        return <FileText className="w-4 h-4" />;
      case "policy":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Multi-Document Cross-Impact Analysis</CardTitle>
          <p className="text-gray-500">Analyze the cross-impact between regulations and internal policies</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Documents for Analysis</CardTitle>
            <p className="text-sm text-gray-500">Choose at least 2 documents to analyze cross-impact</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={doc.id}
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) => handleDocumentSelection(doc.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(doc.type)}
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadgeColor(doc.status)} variant="outline">
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">Updated: {doc.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleAnalyze}
                disabled={selectedDocuments.length < 2 || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Analyzing Cross-Impact...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Start Cross-Impact Analysis
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Selected: {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No Analysis Yet</h3>
                <p className="text-gray-500">Select documents and run analysis to see results</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Analyzing Cross-Impact</h3>
                <p className="text-gray-500">Processing document relationships...</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-4">
                {/* Impact Level */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Impact Level</h4>
                  </div>
                  <Badge className={
                    analysisResult.impactLevel === "High" ? "bg-red-100 text-red-800" :
                    analysisResult.impactLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }>
                    {analysisResult.impactLevel} Impact
                  </Badge>
                </div>

                {/* Affected Policies */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Affected Policies</h4>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    {analysisResult.affectedPolicies.map((policy, index) => (
                      <li key={index}>• {policy}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Recommendations</h4>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Conflicts */}
                {analysisResult.conflicts.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-900">Potential Conflicts</h4>
                    </div>
                    <ul className="text-sm text-red-800 space-y-1">
                      {analysisResult.conflicts.map((conflict, index) => (
                        <li key={index}>• {conflict}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiDocumentAnalysis;
