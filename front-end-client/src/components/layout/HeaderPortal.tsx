import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface HeaderPortalProps {
  children: React.ReactNode;
}

export const HeaderPortal: React.FC<HeaderPortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const el = document.getElementById('header-portal-target');
    if (el) {
      setTarget(el);
    }
    const interval = setInterval(() => {
      const el = document.getElementById('header-portal-target');
      if (el && el !== target) {
        setTarget(el);
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [target]);

  if (!mounted || !target) return null;

  return createPortal(children, target);
};
