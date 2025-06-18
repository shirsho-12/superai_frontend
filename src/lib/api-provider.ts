import { toast } from "@/hooks/use-toast";

// Type definitions for API responses
export interface RegulatoryDocument {
  id: string;
  title: string;
  publicationDate: string;
  closingDate: string;
  status: string;
  priority: string;
  gapsFound: number;
  type: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface ComplianceGap {
  id: string;
  documentId: string;
  policySection: string;
  description: string;
  severity: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  amendments: PolicyAmendment[];
}

export interface PolicyAmendment {
  id: string;
  gapId: string;
  originalText: string;
  suggestedText: string;
  justification: string;
  status: string;
  approvedBy: string;
}

export interface AnalysisReport {
  id: string;
  documentId: string;
  generatedDate: string;
  summary: string;
  findings: string[];
}

// S3 Upload Response
export interface S3UploadResponse {
  fileUrl: string;
  fileKey: string;
  uploadId: string;
}

// Manual Upload Request
export interface ManualUploadRequest {
  title: string;
  description?: string;
  tag: string;
  publicationDate: string;
  file: File;
}

// Manual Upload Response
export interface ManualUploadResponse {
  documentId: string;
  s3Upload: S3UploadResponse;
  status: "uploaded" | "processing";
  message: string;
}

// Task Assignment interface
export interface TaskAssignment {
  id: string;
  documentId: string;
  taskType: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  priority: string;
  createdAt: string;
}

// Audit Event interface
export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

class MockApiProvider {
  private baseUrl = "https://api.yourcompany.com/v1"; // TODO: Replace with actual FastAPI endpoint

  async analyzeDocument(documentId: string, content?: string): Promise<AnalysisReport> {
    console.log("Mock API: Analyzing document", documentId);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      id: `report-${documentId}`,
      documentId: documentId,
      generatedDate: new Date().toISOString(),
      summary: "Analysis completed. 3 gaps identified.",
      findings: ["Policy section 3.2 needs update", "Ensure compliance with clause 5.1", "Address requirement in section 4.8"]
    };
  }

  async generateAmendments(gapId: string): Promise<PolicyAmendment[]> {
    console.log("Mock API: Generating amendments for gap", gapId);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    return [
      {
        id: `amendment-${gapId}-1`,
        gapId: gapId,
        originalText: "The original policy text here.",
        suggestedText: "The suggested amended text here.",
        justification: "To address the identified compliance gap.",
        status: "pending",
        approvedBy: ""
      }
    ];
  }

  async generateExecutiveReport(documentId: string): Promise<AnalysisReport> {
    console.log("Mock API: Generating executive report for document", documentId);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    return {
      id: `report-${documentId}`,
      documentId: documentId,
      generatedDate: new Date().toISOString(),
      summary: "Executive report generated. Key compliance areas highlighted.",
      findings: ["Review data protection measures", "Update incident response plan", "Enhance employee training"]
    };
  }

  async analyzeCrossImpact(documentIds: string[], policyIds: string[]): Promise<any> {
    console.log("Mock API: Analyzing cross-impact for documents", documentIds, "and policies", policyIds);
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay
    return {
      summary: "Cross-impact analysis completed. Key overlaps and conflicts identified.",
      details: "Detailed analysis results here."
    };
  }

  async scanRegulatorySource(sourceUrl: string): Promise<any> {
    console.log("Mock API: Scanning regulatory source", sourceUrl);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay
    return {
      newDocuments: ["Document 1 from " + sourceUrl, "Document 2 from " + sourceUrl],
      updatedDocuments: ["Document 3 from " + sourceUrl]
    };
  }

  // Manual file upload to S3 and document ingestion
  async uploadDocument(data: ManualUploadRequest): Promise<ManualUploadResponse> {
    // TODO: Replace with actual API call to FastAPI backend
    // This should:
    // 1. Upload file to S3 bucket
    // 2. Create document record in database
    // 3. Trigger document analysis pipeline
    
    console.log("Mock API: Uploading document", {
      title: data.title,
      tag: data.tag,
      fileName: data.file.name,
      fileSize: data.file.size
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock S3 upload simulation
    const mockS3Response: S3UploadResponse = {
      fileUrl: `https://your-s3-bucket.s3.amazonaws.com/documents/${Date.now()}-${data.file.name}`,
      fileKey: `documents/${Date.now()}-${data.file.name}`,
      uploadId: `upload-${Date.now()}`
    };

    // Mock successful response
    const response: ManualUploadResponse = {
      documentId: `doc-${Date.now()}`,
      s3Upload: mockS3Response,
      status: "uploaded",
      message: "Document uploaded successfully and queued for analysis"
    };

    return response;
  }

  // Get upload status
  async getUploadStatus(uploadId: string): Promise<{ status: string; progress: number }> {
    // TODO: Replace with actual API call
    console.log("Mock API: Getting upload status for", uploadId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: "completed",
      progress: 100
    };
  }
}

// Create singleton instance
export const mockApiProvider = new MockApiProvider();

// Real API client for backend integration
const API_BASE_URL = 'http://localhost:8000'; // Adjust to your backend URL

export const apiClient = {
  // Document Management
  getDocuments: async (documentType?: 'regulation' | 'policy') => {
    const params = documentType ? `?document_type=${documentType}` : '';
    return fetch(`${API_BASE_URL}/api/documents${params}`).then(res => res.json());
  },
  
  getDocumentContent: async (documentId: string) => {
    return fetch(`${API_BASE_URL}/api/documents/${documentId}`).then(res => res.json());
  },
  
  // Gap Analysis
  analyzeGaps: async (regulationId: string, policyId: string) => {
    return fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regulation_id: regulationId, policy_id: policyId })
    }).then(res => res.json());
  },
  
  // Get gap details for a specific document
  getGapDetails: async (documentId: string) => {
    return fetch(`${API_BASE_URL}/api/documents/${documentId}/gaps`).then(res => res.json());
  }
};
