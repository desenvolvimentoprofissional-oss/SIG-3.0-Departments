import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useSearchStore } from './store/useSearchStore';
import { useMappingStore } from './store/mappingStore';
import { DEPARTMENT_TAXONOMY } from './lib/taxonomia-icones';
import { LoginView } from './pages/LoginView';
import { PendingApprovalView } from './pages/PendingApprovalView';
import { determineInitialRoute } from './lib/routing.strategy';
import { resolvePageTitle } from './lib/title.util';
import { RootRouter } from './providers/RootRouter';
import { RootProvider } from './providers/RootProvider';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { NoticePopup } from './components/layout/NoticePopup';
import { PageInfoModal } from './components/layout/PageInfoModal';
import { resolvePageInfo } from './components/views/PageInfoContent';

const isAccessBlocked = (status?: string): boolean => {
  const blockedStatuses = [
    'PENDING_APPROVAL',
    'REJECTED',
    'REJEITADO',
    'SUSPENDED',
    'INACTIVE',
    'REJECTED_DOMAIN',
  ];
  return !!status && blockedStatuses.includes(status);
};

function AuthenticatedMainView({ user, currentView, setCurrentView }: any) {
  const { mappings } = useMappingStore();
  const [showInfo, setShowInfo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tooltip, setTooltip] = useState<{
    text: string;
    top: number;
    left: number;
  } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    if (isSidebarOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };
  const handleMouseLeave = () => setTooltip(null);

  const getPageTitle = () =>
    resolvePageTitle(currentView, mappings, DEPARTMENT_TAXONOMY as any);
  const getPageInfo = (): React.ReactNode => resolvePageInfo(currentView);

  return (
    <div className="w-full h-screen h-svh bg-[#F8FAFC] flex text-[var(--color-content-primary)] font-sans selection:bg-[#E9ECEF] overflow-hidden">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <main className="flex-1 flex flex-col bg-[#F8FAFC] w-full min-w-0 h-screen">
        <AppHeader
          currentView={currentView}
          getPageTitle={getPageTitle}
          setShowInfo={setShowInfo}
        />
        <div className="flex-1 overflow-auto custom-scrollbar relative w-full h-full min-h-0 bg-[#F8FAFC]">
          <RootRouter currentView={currentView} />
        </div>
      </main>
      <PageInfoModal
        isOpen={showInfo}
        pageId={currentView}
        pageTitle={getPageTitle()}
        pageInfo={getPageInfo()}
        onClose={() => setShowInfo(false)}
      />
      {tooltip && (
        <div
          className="fixed z-[999] bg-[var(--color-background-dark)] text-[var(--color-content-inverse)] text-[12px] font-medium px-3 py-1.5 rounded-xl shadow-sm pointer-events-none -translate-y-1/2 animate-tooltipFadeIn whitespace-nowrap"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.text}
        </div>
      )}
      <NoticePopup />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { reset: resetSearch } = useSearchStore();
  const { mappings } = useMappingStore();
  const [currentView, setCurrentView] = useState('iam');

  useEffect(() => {
    resetSearch();
  }, [currentView, resetSearch]);

  useEffect(() => {
    if (!user) return;
    const newRoute = determineInitialRoute(user, mappings, currentView);
    if (newRoute && newRoute !== currentView) {
      setCurrentView(newRoute);
    }
  }, [user, mappings, currentView]);

  if (!isAuthenticated || !user) return <LoginView />;

  if (isAccessBlocked(user.status)) {
    return (
      <PendingApprovalView
        onLogout={() => { try { logout(); } catch (e) {} }}
        user={user}
      />
    );
  }

  return (
    <AuthenticatedMainView
      user={user}
      currentView={currentView}
      setCurrentView={setCurrentView}
    />
  );
}

export default function App() {
  return (
    <RootProvider>
      <AppContent />
    </RootProvider>
  );
}
