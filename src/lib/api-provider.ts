
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
  description: string;
  regulationText: string;
  policySection: string;
  currentPolicy: string;
  severity: string;
  confidence: number;
  suggestedChanges?: string[];
}

export interface PolicyAmendment {
  id: string;
  gapId: string;
  policySection: string;
  originalText: string;
  proposedText: string;
  changeType: string;
  status: string;
  rationale: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface TaskAssignment {
  id: string;
  gapId: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface AnalysisReport {
  id: string;
  documentId: string;
  generatedAt: string;
  summary: string;
  totalChanges: number;
  highImpactChanges: number;
  policyChanges: PolicyAmendment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  lastLogin?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  details: string;
  ipAddress: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

// Mock API provider class
export class ComplianceAPIProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'https://api.compliance-agent.aws.com', apiKey: string = 'mock-api-key') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async mockApiCall<T>(endpoint: string, data?: any, delay: number = 1000): Promise<T> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log(`Mock API call to ${endpoint}`, data);
    
    // Simulate random API failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error(`API Error: Failed to ${endpoint}`);
    }
    
    return this.getMockData(endpoint, data) as T;
  }

  private getMockData(endpoint: string, data?: any): any {
    switch (endpoint) {
      case '/documents/analyze':
        return {
          gaps: [
            {
              id: 'gap-1',
              documentId: data?.documentId || 'doc-1',
              description: 'Customer identification requirements need enhancement',
              regulationText: 'Enhanced due diligence measures must be applied to all high-risk customers...',
              policySection: 'Section 3.2 - Customer Due Diligence',
              currentPolicy: 'Standard KYC procedures apply to all customers...',
              severity: 'high',
              confidence: 0.94
            }
          ]
        };
      case '/documents/ingest':
        return {
          documentId: 'doc-' + Date.now(),
          status: 'processing',
          message: 'Document ingestion started'
        };
      case '/amendments/generate':
        return {
          amendments: [
            {
              id: 'amend-' + Date.now(),
              gapId: data?.gapId,
              policySection: 'Section 3.2 - Customer Due Diligence',
              originalText: 'Standard KYC procedures apply...',
              proposedText: 'Enhanced due diligence measures must be applied...',
              changeType: 'modification',
              status: 'pending',
              rationale: 'To comply with new MAS requirements'
            }
          ]
        };
      case '/reports/generate':
        return {
          reportId: 'report-' + Date.now(),
          summary: 'Executive summary generated successfully',
          totalChanges: 5,
          highImpactChanges: 2
        };
      default:
        return { success: true };
    }
  }

  // Document analysis methods
  async analyzeDocument(documentId: string, content?: string): Promise<{ gaps: ComplianceGap[] }> {
    try {
      return await this.mockApiCall('/documents/analyze', { documentId, content });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze document for compliance gaps",
        variant: "destructive"
      });
      throw error;
    }
  }

  async ingestDocument(url: string, metadata?: Record<string, any>): Promise<{ documentId: string; status: string }> {
    try {
      return await this.mockApiCall('/documents/ingest', { url, metadata });
    } catch (error) {
      toast({
        title: "Ingestion failed",
        description: "Failed to ingest document from source",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Amendment generation methods
  async generateAmendments(gapId: string): Promise<{ amendments: PolicyAmendment[] }> {
    try {
      return await this.mockApiCall('/amendments/generate', { gapId });
    } catch (error) {
      toast({
        title: "Amendment generation failed",
        description: "Failed to generate policy amendments",
        variant: "destructive"
      });
      throw error;
    }
  }

  async approveAmendment(amendmentId: string): Promise<{ success: boolean }> {
    try {
      return await this.mockApiCall('/amendments/approve', { amendmentId });
    } catch (error) {
      toast({
        title: "Approval failed",
        description: "Failed to approve amendment",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Report generation methods
  async generateExecutiveReport(documentId: string): Promise<AnalysisReport> {
    try {
      return await this.mockApiCall('/reports/generate', { documentId });
    } catch (error) {
      toast({
        title: "Report generation failed",
        description: "Failed to generate executive report",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Cross-document analysis
  async analyzeCrossImpact(documentIds: string[], policyIds: string[]): Promise<{ results: any[] }> {
    try {
      return await this.mockApiCall('/analysis/cross-impact', { documentIds, policyIds });
    } catch (error) {
      toast({
        title: "Cross-impact analysis failed",
        description: "Failed to analyze cross-document impacts",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Monitoring and ingestion
  async scanRegulatorySource(sourceUrl: string): Promise<{ documents: RegulatoryDocument[] }> {
    try {
      return await this.mockApiCall('/monitoring/scan', { sourceUrl });
    } catch (error) {
      toast({
        title: "Source scan failed",
        description: "Failed to scan regulatory source",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Task management
  async createTask(assignment: Omit<TaskAssignment, 'id' | 'createdAt'>): Promise<TaskAssignment> {
    try {
      return await this.mockApiCall('/tasks/create', assignment);
    } catch (error) {
      toast({
        title: "Task creation failed",
        description: "Failed to create assignment task",
        variant: "destructive"
      });
      throw error;
    }
  }

  // Audit trail
  async logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<{ success: boolean }> {
    try {
      return await this.mockApiCall('/audit/log', event);
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't show toast for audit failures to avoid spam
      throw error;
    }
  }
}

// Create singleton instance
export const apiProvider = new ComplianceAPIProvider();
