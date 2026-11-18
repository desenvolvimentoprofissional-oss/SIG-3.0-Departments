import { UserSessionProfile as User, PageMapping } from '../types/index';

type RouteStrategy = (user: User, mappings: PageMapping[], currentView: string) => string | null;

const GuestStrategy: RouteStrategy = (user, mappings) => {
  if (user.viewerPages && user.viewerPages.length > 0) {
    const firstPage = mappings.find((m) => m.id === user.viewerPages![0]);
    if (firstPage) {
      return `page_${firstPage.departmentId}_${firstPage.id}`;
    }
  }
  return "unauthorized";
};

const CollaboratorStrategy: RouteStrategy = (user, _, currentView) => {
  if (currentView === "avisos" || currentView === "unauthorized") {
    return user.departmentId ? user.departmentId : "unauthorized";
  }
  return null;
};

const DefaultStrategy: RouteStrategy = (_, __, currentView) => {
  if (currentView === "unauthorized") {
    return "avisos";
  }
  return null;
};

const strategyMap: Record<string, RouteStrategy> = {
  CONVIDADO: GuestStrategy,
  COLABORADOR: CollaboratorStrategy
};

export const determineInitialRoute = (user: User, mappings: PageMapping[], currentView: string): string | null => {
  const strategy = strategyMap[user.role] || DefaultStrategy;
  return strategy(user, mappings, currentView);
};
