import { useState, useEffect } from 'react';
import { DocumentType } from '../components/auth/DocumentModal';

export const useDocumentModal = (isOpen: boolean, initialDocument: DocumentType = 'privacidade') => {
  const [currentDoc, setCurrentDoc] = useState<DocumentType>(initialDocument);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentDoc(initialDocument);
    }
  }, [isOpen, initialDocument]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const handleReset = () => {
    setZoomLevel(1);
    setIsDarkMode(false);
    setIsHighContrast(false);
  };

  const nextDocMap: Record<DocumentType, { type: DocumentType; label: string }> = {
    'privacidade': { type: 'seguranca', label: 'SEGURANÇA' },
    'seguranca': { type: 'termos', label: 'TERMOS DE USO' },
    'termos': { type: 'privacidade', label: 'PRIVACIDADE' },
  };

  const handleNextDoc = () => {
    setCurrentDoc(nextDocMap[currentDoc].type);
  };

  const getDocTitle = () => {
    if (currentDoc === 'privacidade') return 'PRIVACIDADE';
    if (currentDoc === 'seguranca') return 'SEGURANÇA';
    return 'TERMOS DE USO';
  };

  const getDocName = () => {
    if (currentDoc === 'privacidade') return 'Política de Privacidade';
    if (currentDoc === 'seguranca') return 'Política de Segurança';
    return 'Termos de Uso';
  };

  return {
    currentDoc,
    zoomLevel,
    isDarkMode,
    isHighContrast,
    handleZoomIn,
    handleZoomOut,
    toggleDarkMode,
    toggleHighContrast,
    handleReset,
    handleNextDoc,
    getDocTitle,
    getDocName,
    nextDocMap,
  };
};
