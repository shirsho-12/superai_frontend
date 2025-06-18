import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText, Search, AlertTriangle, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDocuments } from '../hooks/use-documents';

interface PolicyDocument {
  id: string;
  name: string;
  sections: number;
  lastUpdated: string;
  selected: boolean;
}

interface CrossImpactResult {
  policyId: string;
  policyName: string;
  impactedSections: string[];
  severity: "high" | "medium" | "low";
  gapsFound: number;
}

const MultiDocumentAnalysis: React.FC = () => {
  const { 
    documents, 
    currentDocument, 
    loading, 
    error, 
    fetchDocuments, 
    fetchDocumentContent 
  } = useDocuments();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<CrossImpactResult[]>([]);
  const [selectedRegulations, setSelectedRegulations] = useState<string[]>([]);
  const [policyDocuments, setPolicyDocuments] = useState<PolicyDocument[]>([
    {
      id: "aml-cft",
      name: "AML/CFT Policy",
      sections: 8,
      lastUpdated: "2024-05-15",
      selected: true
    },
    {
      id: "tech-risk",
      name: "Technology Risk Management Policy",
      sections: 12,
      lastUpdated: "2024-04-20",
      selected: true
    },
    {
      id: "data-protection",
      name: "Data Protection Policy",
      sections: 6,
      lastUpdated: "2024-03-10",
      selected: false
    },
    {
      id: "operational-risk",
      name: "Operational Risk Policy",
      sections: 10,
      lastUpdated: "2024-02-28",
      selected: false
    }
  ]);

  const regulations = [
    { id: "1", title: "Consultation Paper on Proposed Amendments to Notice PSN01" },
    { id: "2", title: "Technology Risk Management Guidelines Update" },
    { id: "3", title: "Digital Payment Token Services - Licensing Framework" },
    { id: "4", title: "AML/CFT Requirements for Money Service Businesses" }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handlePolicySelection = (policyId: string, checked: boolean) => {
    setPolicyDocuments(docs => 
      docs.map(doc => 
        doc.id === policyId ? { ...doc, selected: checked } : doc
      )
    );
  };

  const handleRegulationSelection = (regulationId: string, checked: boolean) => {
    if (checked) {
      setSelectedRegulations([...selectedRegulations, regulationId]);
    } else {
      setSelectedRegulations(selectedRegulations.filter(id => id !== regulationId));
    }
  };

  const runCrossImpactAnalysis = () => {
    const selectedPolicies = policyDocuments.filter(doc => doc.selected);
    
    if (selectedPolicies.length === 0 || selectedRegulations.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one policy document and one regulation",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      const mockResults: CrossImpactResult[] = selectedPolicies.map(policy => ({
        policyId: policy.id,
        policyName: policy.name,
        impactedSections: [
          "Section 3.2 - Customer Due Diligence",
          "Section 5.1 - Transaction Monitoring",
          "Section 7.3 - Record Keeping"
        ].slice(0, Math.ceil(Math.random() * 3) + 1),
        severity: Math.random() > 0.5 ? "high" : "medium",
        gapsFound: Math.floor(Math.random() * 5) + 1
      }));

      setResults(mockResults);
      setAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: `Found cross-functional impacts across ${mockResults.length} policy documents`
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDocumentSelect = (documentId) => {
    fetchDocumentContent(documentId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Multi-Document Cross-Impact Analysis</CardTitle>
          <p className="text-gray-500">Analyze regulatory changes across multiple policy documents simultaneously</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Regulations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {regulations.map((regulation) => (
              <div key={regulation.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`reg-${regulation.id}`}
                  checked={selectedRegulations.includes(regulation.id)}
                  onCheckedChange={(checked) => 
                    handleRegulationSelection(regulation.id, checked as boolean)
                  }
                />
                <label 
                  htmlFor={`reg-${regulation.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {regulation.title}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Policy Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {policyDocuments.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`policy-${policy.id}`}
                    checked={policy.selected}
                    onCheckedChange={(checked) => 
                      handlePolicySelection(policy.id, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`policy-${policy.id}`}
                    className="text-sm font-medium leading-none"
                  >
                    {policy.name}
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  {policy.sections} sections
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={runCrossImpactAnalysis}
            disabled={analyzing}
            className="w-full"
            size="lg"
          >
            {analyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Cross-Impact Analysis...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Run Cross-Impact Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Cross-Impact Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result) => (
              <div key={result.policyId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{result.policyName}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.toUpperCase()} IMPACT
                    </Badge>
                    <Badge variant="outline">
                      {result.gapsFound} gaps found
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Impacted Sections:</p>
                  <div className="space-y-1">
                    {result.impactedSections.map((section, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span>{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiDocumentAnalysis;
