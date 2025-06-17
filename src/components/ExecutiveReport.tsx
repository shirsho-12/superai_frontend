
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Check, AlertTriangle, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PolicyChange {
  id: string;
  policyName: string;
  sectionModified: string;
  changeType: "addition" | "modification" | "removal";
  changeDescription: string;
  regulatorySource: string;
  impactLevel: "high" | "medium" | "low";
  dateModified: string;
}

interface ExecutiveReportProps {
  regulationTitle: string;
  regulationId: string;
}

const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ regulationTitle, regulationId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<null | {
    summary: string;
    totalChanges: number;
    highImpactChanges: number;
    policyChanges: PolicyChange[];
    generatedDate: string;
  }>(null);

  // Mock function to generate a report - in a real implementation this would fetch data from a backend
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock report data
      const mockReport = {
        summary: `This report summarizes changes made to company policies in response to ${regulationTitle}. A total of 5 changes were made across 3 policy documents, with 2 high-impact changes requiring immediate attention.`,
        totalChanges: 5,
        highImpactChanges: 2,
        policyChanges: [
          {
            id: "pc1",
            policyName: "AML/CFT Policy",
            sectionModified: "Customer Due Diligence",
            changeType: "modification",
            changeDescription: "Enhanced requirements for high-risk customers, including additional verification steps for politically exposed persons.",
            regulatorySource: "Section 4.2 of PSN01 Amendments",
            impactLevel: "high",
            dateModified: "2024-06-15"
          },
          {
            id: "pc2",
            policyName: "AML/CFT Policy",
            sectionModified: "Transaction Monitoring",
            changeType: "addition",
            changeDescription: "Added new thresholds for transaction monitoring alerts based on updated MAS guidance.",
            regulatorySource: "Section 5.3 of PSN01 Amendments",
            impactLevel: "medium",
            dateModified: "2024-06-15"
          },
          {
            id: "pc3",
            policyName: "Technology Risk Management Policy",
            sectionModified: "Access Controls",
            changeType: "modification",
            changeDescription: "Updated password policy to align with new cybersecurity requirements.",
            regulatorySource: "Section 3.1 of TRM Guidelines",
            impactLevel: "medium",
            dateModified: "2024-06-14"
          },
          {
            id: "pc4",
            policyName: "Data Protection Policy",
            sectionModified: "Data Retention",
            changeType: "addition",
            changeDescription: "Added specified retention periods for transaction data in accordance with new requirements.",
            regulatorySource: "Section 8.2 of PSN01 Amendments",
            impactLevel: "high",
            dateModified: "2024-06-12"
          },
          {
            id: "pc5",
            policyName: "Technology Risk Management Policy",
            sectionModified: "Incident Response",
            changeType: "modification",
            changeDescription: "Updated incident response procedures to include new notification timelines.",
            regulatorySource: "Section 7.4 of TRM Guidelines",
            impactLevel: "low",
            dateModified: "2024-06-10"
          }
        ] as PolicyChange[],
        generatedDate: new Date().toISOString()
      };
      
      setReport(mockReport);
      setIsGenerating(false);
      toast({
        title: "Report generated successfully",
        description: "Executive summary is ready for review and export",
      });
    }, 1500);
  };

  const downloadPdf = () => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "PDF download started",
      description: "Your report is being prepared for download",
    });
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>;
      case "medium":
        return <Badge variant="default" className="bg-yellow-500">Medium Impact</Badge>;
      case "low":
        return <Badge variant="outline">Low Impact</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Executive Report</CardTitle>
          <p className="text-gray-500">Generate a summary report of policy changes for executive review</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">{regulationTitle}</h3>
              <p className="text-sm text-gray-500">ID: {regulationId}</p>
            </div>
            {!report ? (
              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            ) : (
              <Button 
                onClick={downloadPdf}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export as PDF
              </Button>
            )}
          </div>
          
          {report ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Executive Summary</h4>
                <p className="text-blue-700">{report.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <FileText className="h-8 w-8 text-gray-500 mb-2" />
                    <h4 className="text-lg font-bold">{report.totalChanges}</h4>
                    <p className="text-sm text-gray-500">Total Changes</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                    <h4 className="text-lg font-bold">{report.highImpactChanges}</h4>
                    <p className="text-sm text-red-500">High Impact Changes</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="text-lg font-bold">{new Date(report.generatedDate).toLocaleDateString()}</h4>
                    <p className="text-sm text-green-500">Generated Date</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Policy Changes Detail</h4>
                <div className="space-y-4">
                  {report.policyChanges.map((change) => (
                    <Card key={change.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold">{change.policyName}</h5>
                            <p className="text-sm text-gray-500">Section: {change.sectionModified}</p>
                          </div>
                          {getImpactBadge(change.impactLevel)}
                        </div>
                        <Separator className="my-3" />
                        <p className="text-sm">{change.changeDescription}</p>
                        <div className="mt-3 text-xs text-gray-500">
                          <p>Source: {change.regulatorySource}</p>
                          <p>Modified: {new Date(change.dateModified).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                  <p>Analyzing changes and generating report...</p>
                </div>
              ) : (
                <div>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Click "Generate Report" to create an executive summary of all policy changes related to this regulation</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveReport;
