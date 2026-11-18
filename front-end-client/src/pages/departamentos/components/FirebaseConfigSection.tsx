import React from 'react';
import { Database, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';

interface FirebaseConfigSectionProps {
  showSdk: boolean;
  setShowSdk: (show: boolean) => void;
  firebaseConfigForm: any;
  setFirebaseConfigForm: (form: any) => void;
  sdkInput: string;
  setSdkInput: (sdk: string) => void;
  isSaving?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
}

export const FirebaseConfigSection: React.FC<FirebaseConfigSectionProps> = ({ 
  showSdk, setShowSdk, firebaseConfigForm, setFirebaseConfigForm, sdkInput, setSdkInput,
  isSaving, onSave, onRemove
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-content-primary)] flex items-center">
          <Database size={16} className="mr-2 text-[var(--color-brand-main)]" />
          Credenciais Firebase
        </h3>
        <button 
          onClick={() => setShowSdk(!showSdk)}
          className="p-1.5 bg-[var(--color-background-main)] rounded-full text-[var(--color-content-secondary)] hover:text-[var(--color-content-primary)] shadow-sm border border-[var(--color-border-default)] transition-colors cursor-pointer z-50"
          title={showSdk ? "Ocultar SDK" : "Visualizar SDK"}
        >
          {showSdk ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      {firebaseConfigForm.apiKey ? (
        <div className="bg-[var(--color-background-main)] border border-[var(--color-border-default)] p-4 rounded-md mb-4 text-center">
            <div className="text-[var(--color-brand-main)] mb-2 flex justify-center">
                <Database size={24} />
            </div>
            <p className="text-sm font-medium text-[var(--color-content-primary)]">Credenciais de Infraestrutura Configuradas</p>
            <p className="text-xs text-[var(--color-content-secondary)] mt-1">
                Por motivos de segurança (Conformidade ISO 27001), chaves de acesso não são exibidas.
            </p>
        </div>
      ) : (
        <div className="relative mb-4">
            <Textarea 
               value={sdkInput}
               onChange={(e) => setSdkInput(e.target.value)}
               placeholder={'// Import the functions you need from the SDKs you need\nimport { initializeApp } from "firebase/app";\n\nconst firebaseConfig = {\n  apiKey: "...",\n  authDomain: "...",\n...\n};\n'}
               rows={8}
               className={`font-mono text-xs text-[var(--color-content-primary)] border-[var(--color-brand-main)] focus:ring-[var(--color-brand-main)] bg-[var(--color-background-light)]`}
            />
        </div>
      )}

      {(onSave || onRemove) && (
        <div className="flex gap-3">
          {onSave && (
            <Button variant="primary" onClick={onSave} disabled={isSaving || (!firebaseConfigForm.apiKey && !sdkInput)} className="w-full flex justify-center items-center">
               <Save size={16} className="mr-2" />
               {isSaving ? 'Processando...' : 'Salvar Infraestrutura'}
            </Button>
          )}
          {firebaseConfigForm.apiKey && onRemove && (
            <Button variant="secondary" onClick={onRemove} disabled={isSaving} className="w-full flex justify-center items-center text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200">
               <Trash2 size={16} className="mr-2" />
               Excluir SDK
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
