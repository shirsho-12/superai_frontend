
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Activity, FileText, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { useComplianceAPI } from "@/hooks/use-compliance-api";

interface Document {
  id: string;
  title: string;
  type: "regulation" | "policy";
  publicationDate: string;
  status: string;
  selected: boolean;
}

const MultiDocumentAnalysis: React.FC = () => {
  const { analyzeCrossImpact } = useComplianceAPI();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "reg-1",
      title: "1.1 MAS Payment Services Notice PSN01",
      type: "regulation",
      publicationDate: "2024-06-10",
      status: "active",
      selected: false
    },
    {
      id: "reg-2",
      title: "1.2 Technology Risk Management Guidelines",
      type: "regulation",
      publicationDate: "2024-06-08",
      status: "active",
      selected: false
    },
    {
      id: "pol-1",
      title: "2.1 Internal Customer Due Diligence Policy",
      type: "policy",
      publicationDate: "2024-05-15",
      status: "current",
      selected: false
    },
    {
      id: "pol-2",
      title: "2.2 Transaction Monitoring and Reporting Policy",
      type: "policy",
      publicationDate: "2024-05-20",
      status: "current",
      selected: false
    },
    {
      id: "reg-3",
      title: "1.3 Digital Payment Token Services Framework",
      type: "regulation",
      publicationDate: "2024-05-28",
      status: "active",
      selected: false
    },
    {
      id: "pol-3",
      title: "2.3 Cybersecurity Risk Management Policy",
      type: "policy",
      publicationDate: "2024-05-25",
      status: "current",
      selected: false
    }
  ]);

  const handleDocumentToggle = (documentId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  const handleSelectAll = (type?: "regulation" | "policy") => {
    setDocuments(documents.map(doc => 
      type ? 
        (doc.type === type ? { ...doc, selected: true } : doc) :
        { ...doc, selected: true }
    ));
  };

  const handleClearAll = () => {
    setDocuments(documents.map(doc => ({ ...doc, selected: false })));
  };

  const handleAnalyzeImpact = async () => {
    const selectedDocs = documents.filter(doc => doc.selected);
    
    if (selectedDocs.length < 2) {
      toast({
        title: "Insufficient selection",
        description: "Please select at least 2 documents for cross-impact analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);

    try {
      // Extended loading time for impact analysis (5 seconds)
      setTimeout(async () => {
        const regulationIds = selectedDocs.filter(doc => doc.type === "regulation").map(doc => doc.id);
        const policyIds = selectedDocs.filter(doc => doc.type === "policy").map(doc => doc.id);
        
        const results = await analyzeCrossImpact(regulationIds, policyIds);
        
        // Mock detailed results with numbered gaps
        const mockResults = {
          summary: results.summary,
          totalConflicts: 3,
          criticalIssues: 2,
          recommendations: 5,
          conflicts: [
            {
              id: "1.1",
              title: "Customer Identification Timeline Mismatch",
              severity: "high",
              description: "1.1.a Regulation requires 24-hour customer verification while policy allows 48-hour window",
              affectedDocuments: ["reg-1", "pol-1"],
              recommendation: "1.1.b Update internal policy to align with 24-hour regulatory requirement"
            },
            {
              id: "1.2", 
              title: "Technology Risk Assessment Frequency",
              severity: "medium",
              description: "1.2.a Policy mandates quarterly assessments but regulation suggests monthly reviews for high-risk services",
              affectedDocuments: ["reg-2", "pol-3"],
              recommendation: "1.2.b Increase assessment frequency for high-risk digital payment services"
            },
            {
              id: "1.3",
              title: "Transaction Monitoring Thresholds",
              severity: "high",
              description: "1.3.a Current policy thresholds may not capture all suspicious activities as defined in new regulations",
              affectedDocuments: ["reg-3", "pol-2"],
              recommendation: "1.3.b Recalibrate monitoring systems to align with updated regulatory thresholds"
            }
          ]
        };
        
        setAnalysisResults(mockResults);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis completed",
          description: `Found ${mockResults.totalConflicts} conflicts requiring attention`
        });
      }, 5000); // 5-second delay for impact analysis

    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "Unable to complete cross-impact analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectedCount = documents.filter(doc => doc.selected).length;
  const regulationCount = documents.filter(doc => doc.type === "regulation").length;
  const policyCount = documents.filter(doc => doc.type === "policy").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <span>Multi-Document Cross-Impact Analysis</span>
          </CardTitle>
          <p className="text-gray-500">
            Analyze conflicts and overlaps between regulations and internal policies
          </p>
        </CardHeader>
      </Card>

      {/* Document Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Regulations ({regulationCount})</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleSelectAll("regulation")}>
                Select All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.filter(doc => doc.type === "regulation").map((doc) => (
              <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={doc.selected}
                  onCheckedChange={() => handleDocumentToggle(doc.id)}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-sm text-gray-500">
                    Published: {new Date(doc.publicationDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  {doc.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Internal Policies ({policyCount})</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleSelectAll("policy")}>
                Select All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.filter(doc => doc.type === "policy").map((doc) => (
              <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={doc.selected}
                  onCheckedChange={() => handleDocumentToggle(doc.id)}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(doc.publicationDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {doc.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
              </span>
              {selectedCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </div>
            
            <Button 
              onClick={handleAnalyzeImpact}
              disabled={selectedCount < 2 || isAnalyzing}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Analyzing Impact... (This may take up to 5 seconds)
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze Cross-Impact
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{analysisResults.totalConflicts}</div>
                <div className="text-sm text-red-800">Total Conflicts</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{analysisResults.criticalIssues}</div>
                <div className="text-sm text-orange-800">Critical Issues</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analysisResults.recommendations}</div>
                <div className="text-sm text-blue-800">Recommendations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedCount}</div>
                <div className="text-sm text-green-800">Documents Analyzed</div>
              </div>
            </div>

            <Separator />

            {/* Detailed Conflicts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identified Conflicts</h3>
              {analysisResults.conflicts.map((conflict: any) => (
                <Card key={conflict.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{conflict.id} {conflict.title}</h4>
                      <Badge 
                        variant={conflict.severity === "high" ? "destructive" : "secondary"}
                      >
                        {conflict.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{conflict.description}</p>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1">Recommendation:</h5>
                      <p className="text-blue-800 text-sm">{conflict.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiDocumentAnalysis;
