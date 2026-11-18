import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  Minus,
  Plus,
  Moon,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useDocumentModal } from '../../hooks/useDocumentModal';
import { DocumentContent } from './DocumentContent';

export type DocumentType = 'privacidade' | 'seguranca' | 'termos';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocument?: DocumentType;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  initialDocument = 'privacidade',
}) => {
  const {
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
  } = useDocumentModal(isOpen, initialDocument);

  
  const resolveThemeTokens = (isDark: boolean, isHighContr: boolean) => {
    const theme = isDark ? 'dark' : (isHighContr ? 'highContrast' : 'light');
    const TOKENS: Record<string, any> = {
      dark: {
        modalBg: 'bg-gray-900', textColor: 'text-gray-300', headingColor: 'text-white', numberBg: 'bg-cyan-500', numberText: 'text-white', subHeadingColor: 'text-cyan-400', boxBg: 'bg-gray-800 border-gray-700', quoteBorder: 'border-cyan-500', linkColor: 'text-cyan-400 hover:text-cyan-500', markerColor: 'marker:text-cyan-500', scrollbarThumb: 'scrollbar-thumb-gray-600', footerBorder: 'border-gray-800', footerText: 'text-[var(--color-content-tertiary)]'
      },
      highContrast: {
        modalBg: 'bg-black', textColor: 'text-white', headingColor: 'text-yellow-400', numberBg: 'bg-yellow-400', numberText: 'text-black', subHeadingColor: 'text-yellow-400', boxBg: 'bg-black border-yellow-400', quoteBorder: 'border-yellow-400', linkColor: 'text-yellow-400 hover:text-yellow-300', markerColor: 'marker:text-yellow-400', scrollbarThumb: 'scrollbar-thumb-yellow-600', footerBorder: 'border-gray-800', footerText: 'text-yellow-500'
      },
      light: {
        modalBg: 'bg-white', textColor: 'text-gray-600', headingColor: 'text-gray-900', numberBg: 'bg-cyan-500', numberText: 'text-white', subHeadingColor: 'text-cyan-600', boxBg: 'bg-gray-50 border-gray-200', quoteBorder: 'border-cyan-500', linkColor: 'text-cyan-600 hover:text-cyan-700', markerColor: 'marker:text-cyan-500', scrollbarThumb: 'scrollbar-thumb-gray-300', footerBorder: 'border-gray-200', footerText: 'text-[var(--color-content-tertiary)]'
      }
    };
    return TOKENS[theme];
  };

  const resolveZoomTokens = (zoomLvl: number) => {
    const zoomStr = String(zoomLvl);
    const TOKENS: Record<string, any> = {
      '0': { bodyTextSize: 'text-sm', mainTitleSize: 'text-lg' },
      '1': { bodyTextSize: 'text-base', mainTitleSize: 'text-xl' },
      '2': { bodyTextSize: 'text-lg', mainTitleSize: 'text-2xl' }
    };
    return TOKENS[zoomStr] || TOKENS['0'];
  };

  const themeTokens = resolveThemeTokens(isDarkMode, isHighContrast);
  const zoomTokens = resolveZoomTokens(zoomLevel);
  const { modalBg, textColor, headingColor, numberBg, numberText, subHeadingColor, boxBg, quoteBorder, linkColor, markerColor, scrollbarThumb, footerBorder, footerText } = themeTokens;
  const { bodyTextSize, mainTitleSize } = zoomTokens;
    zoomLevel === 0 ? 'text-lg' : zoomLevel === 1 ? 'text-xl' : 'text-2xl';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`${modalBg} rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden transition-colors duration-300`}
          >
            {}
            <div className="bg-[var(--color-brand-dark)] text-white p-4 lg:px-8 lg:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div>
                  <div className="text-[var(--color-secondary-main)] text-[10px] font-bold tracking-widest uppercase mb-1">
                    Documento em Exibição
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {getDocTitle()}
                  </h2>
                </div>

                <button
                  onClick={handleNextDoc}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-[0.85em] font-semibold ml-2"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-white/50 text-[9px] uppercase tracking-wider">
                      Ver Próximo
                    </span>
                    <span>{nextDocMap[currentDoc].label}</span>
                  </div>
                  <ArrowRight size={14} className="ml-2 text-white/50" />
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 self-end sm:self-auto">
                <div className="flex items-center gap-1 mr-2 border-r border-white/10 pr-2 sm:pr-4">
                  <button
                    onClick={handleZoomOut}
                    className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    title="Diminuir fonte"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    title="Aumentar fonte"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isDarkMode ? 'bg-[var(--color-secondary-main)] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}
                  title="Modo Escuro"
                >
                  <Moon size={14} />
                </button>
                <button
                  onClick={toggleHighContrast}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isHighContrast ? 'bg-[var(--color-accent-main)] text-black' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}
                  title="Alto Contraste"
                >
                  <Info size={14} />
                </button>
                <button
                  onClick={handleReset}
                  className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white mr-1 sm:mr-2"
                  title="Redefinir visualização"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-white"
                  title="Fechar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {}
            <div
              className={`flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin ${scrollbarThumb} transition-colors duration-300`}
            >
              <h3 className={`font-bold mb-6 ${headingColor} ${mainTitleSize}`}>
                {getDocName()}
              </h3>

              <div
                className={`pl-4 border-l-4 mb-10 leading-relaxed font-medium ${quoteBorder} ${textColor} ${bodyTextSize}`}
              >
                {currentDoc === 'privacidade' && (
                  <>
                    Esta Política de Privacidade descreve como o Conselho
                    Regional de Administração de São Paulo (CRA-SP) coleta,
                    utiliza, armazena e protege suas informações pessoais ao
                    usar o Sistema Integrado de Gestão (SIG), em conformidade
                    com a Lei Geral de Proteção de Dados (LGPD - Lei nº
                    13.709/2018).
                  </>
                )}
                {currentDoc !== 'privacidade' && (
                  <>
                    O CRA-SP está comprometido em proteger a segurança do
                    Sistema Integrado de Gestão (SIG) e das informações de seus
                    usuários. Adotamos as seguintes medidas de segurança:
                  </>
                )}
              </div>

              <div className="space-y-10">
                <DocumentContent
                  currentDoc={currentDoc}
                  bodyTextSize={bodyTextSize}
                  textColor={textColor}
                  subHeadingColor={subHeadingColor}
                  headingColor={headingColor}
                  numberBg={numberBg}
                  numberText={numberText}
                  boxBg={boxBg}
                  linkColor={linkColor}
                  markerColor={markerColor}
                />
              </div>

              <div
                className={`mt-12 pt-6 border-t ${footerBorder} flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.85em] ${footerText}`}
              >
                <span>Conselho Regional de Administração de São Paulo</span>
                <span className="font-medium">
                  São Paulo, 01 de julho de 2026
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
