
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

  return {
    loading,
    error,
    analyzeDocument,
    generateAmendments,
    generateReport,
    analyzeCrossImpact,
    scanRegulatorySource,
  };
};
