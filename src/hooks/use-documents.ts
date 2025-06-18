import { useState } from 'react';
import { apiClient } from '../lib/api-provider';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async (documentType?: 'regulation' | 'policy') => {
    setLoading(true);
    try {
      const data = await apiClient.getDocuments(documentType);
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentContent = async (documentId: string) => {
    setLoading(true);
    try {
      const data = await apiClient.getDocumentContent(documentId);
      setCurrentDocument(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    currentDocument,
    loading,
    error,
    fetchDocuments,
    fetchDocumentContent
  };
} 