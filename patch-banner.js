const fs = require('fs');

let content = fs.readFileSync('front-end-client/src/components/ui/BannerItemCard.tsx', 'utf8');

const oldStyle = `  const getTagStyle = (color?: string) => {
    switch (color) {
      case 'blue-dark':
        return 'border-[var(--color-brand-main)] text-white bg-[var(--color-brand-main)]/40 backdrop-blur-md';
      case 'orange':
        return 'border-[var(--color-accent-dark)] text-white bg-[var(--color-accent-dark)]/40 backdrop-blur-md';
      case 'blue-light':
      default:
        return 'border-cyan-400 text-white bg-cyan-400/30 backdrop-blur-md';
    }
  };`;

const newStyle = `  const TAG_STYLES: Record<string, string> = {
    'blue-dark': 'border-[var(--color-brand-main)] text-white bg-[var(--color-brand-main)]/40 backdrop-blur-md',
    'orange': 'border-[var(--color-accent-dark)] text-white bg-[var(--color-accent-dark)]/40 backdrop-blur-md',
    'blue-light': 'border-cyan-400 text-white bg-cyan-400/30 backdrop-blur-md'
  };

  const getTagStyle = (color?: string) => {
    return TAG_STYLES[color || 'blue-light'] || TAG_STYLES['blue-light'];
  };`;

fs.writeFileSync('front-end-client/src/components/ui/BannerItemCard.tsx', content.replace(oldStyle, newStyle));
