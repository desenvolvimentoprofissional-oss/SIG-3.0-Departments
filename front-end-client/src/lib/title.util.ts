import { PageMapping } from '../types';

const defaultTitles: Record<string, string> = {
  avisos: "Avisos",
  banners: "Banners",
  iam: "Usuários",
  style: "Estilos",
  departamentosAdmin: "Departamentos",
  mapeamento: "Mapeamentos",
};

export const getSuggestedPageName = (pageType?: string): string | null => {
  if (!pageType) return null;
  switch (pageType) {
    case 'CADASTRO': return 'Cadastros';
    case 'METRICA': return 'Métricas';
    case 'PROCESSO': return 'Processos';
    case 'RESULTADOS': return 'Resultados';
    default: return null;
  }
};

export const formatPageName = (text?: string): string => {
  if (!text) return '';
  const exceptions = new Set([
    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
    'de', 'da', 'do', 'das', 'dos',
    'em', 'no', 'na', 'nos', 'nas',
    'por', 'pelo', 'pela', 'pelos', 'pelas',
    'para', 'pra', 'pro', 'pras', 'pros',
    'com', 'sem', 'sob', 'sobre', 'ante', 'até', 'após',
    'e', 'ou', 'nem', 'que', 'se',
    'ao', 'aos', 'à', 'às'
  ]);

  let tempText = text;
  const siglaPlaceholders: string[] = [];
  tempText = tempText.replace(/['"“”‘’`´«»‹›‚„]([^'"“”‘’`´«»‹›‚„\s]+)['"“”‘’`´«»‹›‚„]/g, (_, sigla) => {
    const placeholder = `__SIGLA_${siglaPlaceholders.length}__`;
    siglaPlaceholders.push(sigla.toUpperCase());
    return placeholder;
  });

  const words = tempText.split(' ');
  const formattedWords = words.map((word, index) => {
    if (!word) return '';
    
    const siglaIndex = word.match(/__SIGLA_(\d+)__/);
    if (siglaIndex) {
      const idx = parseInt(siglaIndex[1], 10);
      return word.replace(/__SIGLA_\d+__/, siglaPlaceholders[idx]);
    }

    if (/^['"“”‘’`´«»‹›‚„]/.test(word)) {
      const quoteChar = word.charAt(0);
      const rest = word.slice(1).toUpperCase();
      return quoteChar + rest;
    }

    const uppercaseLetters = word.match(/[A-ZÀ-Ú]/g);
    const hasLowercase = /[a-zà-ú]/.test(word);
    if (uppercaseLetters && uppercaseLetters.length >= 2 && !hasLowercase) {
      return word;
    }

    const lower = word.toLowerCase();
    if (index > 0 && exceptions.has(lower)) {
      return lower;
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });

  return formattedWords.join(' ').slice(0, 25);
};

export const resolvePageTitle = (currentView: string, mappings: PageMapping[], taxonomy: any[]): string => {
  if (defaultTitles[currentView]) return defaultTitles[currentView];
  
  if (currentView.startsWith("page_")) {
    const mId = currentView.split("_").pop();
    const mapped = mappings.find((m) => m.id === mId);
    return mapped?.pageName ? formatPageName(mapped.pageName) : "Página";
  }
  
  const dept = taxonomy.find((d) => d.id === currentView);
  return dept?.name || "Desenvolvimento";
};
