import React from "react";

interface SidebarProfileProps {
  user: any;
  isSidebarOpen: boolean;
  handleMouseEnter: (e: React.MouseEvent, text: string) => void;
  handleMouseLeave: () => void;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  user,
  isSidebarOpen,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <>
      <div
        className={`mt-auto p-4 border-t border-[var(--color-border-default)] flex items-center shrink-0 ${isSidebarOpen ? "justify-start" : "justify-center"}`}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-[var(--color-border-default)] object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--color-border-default)] flex items-center justify-center font-bold text-[var(--color-brand-dark)] text-xs shrink-0">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
          )}
          {isSidebarOpen && (
            <div className="flex-1 min-w-0 transition-opacity duration-300">
              <p className="text-xs font-semibold text-[var(--color-content-primary)] truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-[var(--color-content-tertiary)] truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
