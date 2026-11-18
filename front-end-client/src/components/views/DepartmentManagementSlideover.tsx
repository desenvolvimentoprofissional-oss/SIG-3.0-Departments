import React from 'react';
import { Slideover } from '../../components/ui/Slideover';
import { Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FirebaseConfigSection } from '../../pages/departamentos/components/FirebaseConfigSection';
import { LinkedPagesSection } from '../../pages/departamentos/components/LinkedPagesSection';
import { DeptUsersSection } from '../../pages/departamentos/components/DeptUsersSection';
import { ShareAccessModal } from '../../pages/departamentos/components/ShareAccessModal';
import { logger } from '../../lib/logger.util';

export const DepartmentManagementSlideover = ({
  selectedDeptId,
  selectedDeptNode,
  setSelectedDeptId,
  user,
  confirmDeleteDept,
  showSdk,
  setShowSdk,
  firebaseConfigForm,
  setFirebaseConfigForm,
  sdkInput,
  setSdkInput,
  isSaving,
  handleSaveSDK,
  handleRemoveSDK,
  totalAssetsInDept,
  deptUsers,
  mappings,
  setIsShareModalOpen,
  errorMsg,
  successMsg,
  isShareModalOpen,
  users,
  updateUser
}: any) => {
  if (!selectedDeptId || !selectedDeptNode) return null;

  return (
    <Slideover
      isOpen={true}
      onClose={() => setSelectedDeptId(null)}
      title={selectedDeptNode.name}
      subtitle={selectedDeptNode.area}
      icon={selectedDeptNode.icon}
      headerActions={user?.role === 'MASTER' ? (
        <>
          <button onClick={() => confirmDeleteDept(selectedDeptId)} className="p-2 text-[var(--color-content-secondary)] hover:text-red-500 rounded-full hover:bg-[var(--color-border-default)] transition-colors" title="Excluir Departamento">
            <Trash2 size={18} />
          </button>
        </>
      ) : undefined}
    >
      {user?.role === 'MASTER' && (
        <FirebaseConfigSection 
          showSdk={showSdk}
          setShowSdk={setShowSdk}
          firebaseConfigForm={firebaseConfigForm}
          setFirebaseConfigForm={setFirebaseConfigForm}
          sdkInput={sdkInput}
          setSdkInput={setSdkInput}
          isSaving={isSaving}
          onSave={handleSaveSDK}
          onRemove={handleRemoveSDK}
        />
      )}
      
      <LinkedPagesSection totalAssetsInDept={totalAssetsInDept} />
      <DeptUsersSection deptUsers={deptUsers} selectedDeptId={selectedDeptId} mappings={mappings} selectedDeptArea={selectedDeptNode?.area} onManageAccess={() => setIsShareModalOpen(true)} />
      {errorMsg && (
        <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-4 rounded-xl flex items-start space-x-3 mt-4">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-700 border border-green-200 text-sm p-4 rounded-xl flex items-start space-x-3 mt-4">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}
      <ShareAccessModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        users={users}
        mappings={mappings}
        selectedDeptId={selectedDeptId}
        selectedDeptArea={selectedDeptNode?.area}
        onSaveAccess={async (userId: string, newViewerPages: string[]) => {
          try {
            await updateUser(userId, { viewerPages: newViewerPages }, {
              action: "UPDATE_VIEWER_PAGES",
              details: `Páginas de visualização atualizadas para o departamento ${selectedDeptNode?.name || selectedDeptId}`,
              performedBy: "ADMIN"
            });
          } catch (e) {
            logger.error("UPDATE_ACCESS_FAILED");
          }
        }}
      />
    </Slideover>
  );
};
