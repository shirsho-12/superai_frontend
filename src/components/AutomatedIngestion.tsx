import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Globe, RefreshCw, CheckCircle, AlertTriangle, Clock, Download, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useComplianceAPI } from "@/hooks/use-compliance-api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ManualFileUpload from "./ManualFileUpload";

interface MonitoringSource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  lastCheck: string;
  status: "active" | "error" | "pending" | "inactive";
  documentsFound: number;
}

interface IngestedDocument {
  id: string;
  title: string;
  source: string;
  detectedDate: string;
  publicationDate: string;
  documentType: string;
  status: "new" | "processing" | "analyzed" | "failed";
  confidence: number;
}

interface AutomatedIngestionProps {
  onNavigateToDashboard?: () => void;
}

const AutomatedIngestion: React.FC<AutomatedIngestionProps> = ({ onNavigateToDashboard }) => {
  const { uploadDocument, scanRegulatorySource } = useComplianceAPI();
  const [isScanning, setIsScanning] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState<string | null>(null);
  
  const [sources, setSources] = useState<MonitoringSource[]>([
    {
      id: "mas-main",
      name: "MAS Consultation Papers",
      url: "https://www.mas.gov.sg/regulation/consultation",
      enabled: true,
      lastCheck: "2024-06-17T10:30:00Z",
      status: "active",
      documentsFound: 24
    },
    {
      id: "mas-guidelines",
      name: "MAS Guidelines & Notices",
      url: "https://www.mas.gov.sg/regulation/guidelines",
      enabled: true,
      lastCheck: "2024-06-17T10:25:00Z",
      status: "active",
      documentsFound: 156
    },
    {
      id: "mas-circulars",
      name: "MAS Circulars",
      url: "https://www.mas.gov.sg/regulation/circulars",
      enabled: false,
      lastCheck: "2024-06-16T15:00:00Z",
      status: "inactive",
      documentsFound: 89
    }
  ]);

  const [recentDocuments, setRecentDocuments] = useState<IngestedDocument[]>([
    {
      id: "doc1",
      title: "1.1 Consultation Paper on Proposed Amendments to Notice PSN01",
      source: "MAS Consultation Papers",
      detectedDate: "2024-06-17T08:30:00Z",
      publicationDate: "2024-06-10T00:00:00Z",
      documentType: "consultation_paper",
      status: "analyzed",
      confidence: 0.95
    },
    {
      id: "doc2",
      title: "1.2 Technology Risk Management Guidelines Update",
      source: "MAS Guidelines & Notices",
      detectedDate: "2024-06-16T16:45:00Z",
      publicationDate: "2024-06-08T00:00:00Z",
      documentType: "guideline",
      status: "processing",
      confidence: 0.88
    },
    {
      id: "doc3",
      title: "1.3 Digital Payment Token Services - Licensing Framework",
      source: "MAS Guidelines & Notices",
      detectedDate: "2024-06-15T14:20:00Z",
      publicationDate: "2024-05-28T00:00:00Z",
      documentType: "framework",
      status: "new",
      confidence: 0.92
    }
  ]);

  const handleToggleSource = (sourceId: string, enabled: boolean) => {
    setSources(sources.map(source => {
      if (source.id === sourceId) {
        return { 
          ...source, 
          enabled,
          status: enabled ? "active" : "inactive"
        };
      }
      return source;
    }));
    
    toast({
      title: enabled ? "Monitoring enabled" : "Monitoring disabled",
      description: `Source monitoring has been ${enabled ? 'activated' : 'deactivated'}`
    });
  };

  const handleStartAnalysis = async (docId: string) => {
    setAnalysisLoading(docId);
    
    // Simulate analysis with loading time
    setTimeout(() => {
      setRecentDocuments(docs => 
        docs.map(doc => 
          doc.id === docId 
            ? { ...doc, status: "processing" as const }
            : doc
        )
      );
      
      setTimeout(() => {
        setRecentDocuments(docs => 
          docs.map(doc => 
            doc.id === docId 
              ? { ...doc, status: "analyzed" as const }
              : doc
          )
        );
        setAnalysisLoading(null);
        
        toast({
          title: "Analysis completed",
          description: "Document analysis has been completed successfully"
        });
        
        // Navigate to dashboard after analysis
        if (onNavigateToDashboard) {
          setTimeout(() => {
            onNavigateToDashboard();
            toast({
              title: "Redirected to Dashboard",
              description: "Check the results in your dashboard"
            });
          }, 1000);
        }
      }, 2000);
    }, 1000);
  };

  const handleManualUpload = async (uploadData: {
    title: string;
    description: string;
    tag: string;
    date: Date;
    file: File | null;
  }) => {
    if (!uploadData.file) {
      throw new Error("No file selected");
    }

    try {
      const result = await uploadDocument({
        title: uploadData.title,
        description: uploadData.description,
        tag: uploadData.tag,
        publicationDate: uploadData.date.toISOString(),
        file: uploadData.file
      });

      // Add the uploaded document to the recent documents list with numbering
      const nextNumber = recentDocuments.length + 1;
      const newDoc: IngestedDocument = {
        id: result.documentId,
        title: `${nextNumber}.1 ${uploadData.title}`,
        source: "Manual Upload",
        detectedDate: new Date().toISOString(),
        publicationDate: uploadData.date.toISOString(),
        documentType: uploadData.tag.replace('_', ' '),
        status: "processing",
        confidence: 1.0
      };

      setRecentDocuments([newDoc, ...recentDocuments]);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleManualScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Mock new document discovery
      const nextNumber = recentDocuments.length + 1;
      const newDoc: IngestedDocument = {
        id: `doc${Date.now()}`,
        title: `${nextNumber}.1 Updated AML/CFT Requirements for Digital Payment Services`,
        source: "MAS Guidelines & Notices",
        detectedDate: new Date().toISOString(),
        publicationDate: "2024-06-17T00:00:00Z",
        documentType: "notice",
        status: "new",
        confidence: 0.94
      };
      
      setRecentDocuments([newDoc, ...recentDocuments]);
      
      toast({
        title: "Scan completed",
        description: "1 new regulatory document detected and ingested"
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "analyzed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "new": return <Clock className="w-3 h-3" />;
      case "processing": return <RefreshCw className="w-3 h-3 animate-spin" />;
      case "analyzed": return <CheckCircle className="w-3 h-3" />;
      case "failed": return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Automated Regulatory Ingestion</CardTitle>
              <p className="text-gray-500">Monitor and automatically ingest new regulations from MAS website</p>
            </div>
            <div className="flex space-x-2">
              <ManualFileUpload onUpload={handleManualUpload} />
              <Button onClick={handleManualScan} disabled={isScanning}>
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Manual Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Monitoring Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{source.name}</h4>
                      <Badge className={getStatusColor(source.status)}>
                        {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{source.url}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                      <div>Last checked: {new Date(source.lastCheck).toLocaleString()}</div>
                      <div>Documents found: {source.documentsFound}</div>
                      <div>Status: {source.status.charAt(0).toUpperCase() + source.status.slice(1)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`toggle-${source.id}`} className="text-sm">
                        {source.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                      <Switch
                        id={`toggle-${source.id}`}
                        checked={source.enabled}
                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Recently Ingested Documents ({recentDocuments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{doc.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">Source: {doc.source}</p>
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge className={getDocumentStatusColor(doc.status)} variant="outline">
                        {getDocumentStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge variant="outline">
                        {doc.documentType.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Confidence: {(doc.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                      <div>Detected: {new Date(doc.detectedDate).toLocaleString()}</div>
                      <div>Published: {new Date(doc.publicationDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {doc.status === "analyzed" && (
                      <Button variant="outline" size="sm">
                        View Analysis
                      </Button>
                    )}
                    {doc.status === "new" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartAnalysis(doc.id)}
                        disabled={analysisLoading === doc.id}
                      >
                        {analysisLoading === doc.id ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          "Start Analysis"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingestion Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sources.filter(s => s.enabled).length}</div>
              <div className="text-sm text-gray-500">Active Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{recentDocuments.length}</div>
              <div className="text-sm text-gray-500">Documents This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-sm text-gray-500">Avg. Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.3h</div>
              <div className="text-sm text-gray-500">Avg. Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedIngestion;
