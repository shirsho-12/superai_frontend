import { useState, useCallback } from "react";
import { apiProvider, type ComplianceGap, type PolicyAmendment, type AnalysisReport } from "@/lib/api-provider";

export const useComplianceAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDocument = useCallback(async (documentId: string, content?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.analyzeDocument(documentId, content);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAmendments = useCallback(async (gapId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.generateAmendments(gapId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Amendment generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.generateExecutiveReport(documentId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Report generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeCrossImpact = useCallback(async (documentIds: string[], policyIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.analyzeCrossImpact(documentIds, policyIds);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cross-impact analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scanRegulatorySource = useCallback(async (sourceUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.scanRegulatorySource(sourceUrl);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Source scan failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (data: {
    title: string;
    description?: string;
    tag: string;
    publicationDate: string;
    file: File;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.uploadDocument(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Document upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUploadStatus = useCallback(async (uploadId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.getUploadStatus(uploadId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get upload status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUploadedDocuments = useCallback(async (filters?: { tag?: string; dateFrom?: string; dateTo?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiProvider.getUploadedDocuments(filters);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch uploaded documents');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    analyzeDocument,
    generateAmendments,
    generateReport,
    analyzeCrossImpact,
    scanRegulatorySource,
    uploadDocument,
    getUploadStatus,
    getUploadedDocuments,
  };
};
