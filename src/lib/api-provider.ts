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

    // TODO: Actual implementation would look like:
    /*
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('tag', data.tag);
    formData.append('publication_date', data.publicationDate);

    const response = await fetch(`${this.baseUrl}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`, // Add authentication
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return await response.json();
    */
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

    // TODO: Actual implementation:
    /*
    const response = await fetch(`${this.baseUrl}/uploads/${uploadId}/status`);
    if (!response.ok) throw new Error('Failed to get upload status');
    return await response.json();
    */
  }

  // List uploaded documents
  async getUploadedDocuments(filters?: { tag?: string; dateFrom?: string; dateTo?: string }): Promise<any[]> {
    // TODO: Replace with actual API call
    console.log("Mock API: Getting uploaded documents with filters", filters);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    return [
      {
        id: "doc-1",
        title: "Sample Uploaded Document",
        tag: "internal_policy",
        uploadDate: new Date().toISOString(),
        status: "analyzed",
        s3Url: "https://your-s3-bucket.s3.amazonaws.com/documents/sample.pdf"
      }
    ];

    // TODO: Actual implementation:
    /*
    const params = new URLSearchParams();
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters?.dateTo) params.append('date_to', filters.dateTo);

    const response = await fetch(`${this.baseUrl}/documents?${params}`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
    */
  }

  // Helper method for authentication (implement based on your auth strategy)
  private getAuthToken(): string {
    // TODO: Implement actual token retrieval
    return "mock-jwt-token";
  }
}

export const apiProvider = new MockApiProvider();
