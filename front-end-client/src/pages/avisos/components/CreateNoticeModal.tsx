import React, { useState, useEffect } from 'react';
import { NoticeForm } from '../../../components/views/notice/NoticeForm';
import { Toggle } from '../../../components/ui/Toggle';
import { Button } from '../../../components/ui/Button';
import { NoticeType } from '../../../store/noticeStore';
import { Slideover } from '../../../components/ui/Slideover';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useNoticeStore } from '../../../store/noticeStore';
import { DEPARTMENT_TAXONOMY } from '../../../lib/taxonomia-icones';
import { getLocalISODate } from '../../../lib/date.util';

interface CreateNoticeModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  showModal, setShowModal
}) => {
  const { user } = useAuthStore();
  const { addNotice } = useNoticeStore();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState<NoticeType>('info');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetDepartments, setTargetDepartments] = useState<string[]>(['ALL']);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (showModal) {
       setTitle('');
       setText('');
       setType('info');
       setStartDate('');
       setEndDate('');
       setIsPublished(true);
       const defaultDept = user?.role === 'MASTER' ? ['ALL'] : 
                           user?.role === 'ADMIN' ? ['ALL_AREA'] : 
                           user?.departmentId ? [user.departmentId] : ['ERROR_NO_DEPT'];
       setTargetDepartments(defaultDept);
    }
  }, [showModal, user]);

  const availableDepartments: {label: string, value: string}[] = [];
  if (user?.role === 'MASTER') {
     availableDepartments.push({ label: 'Todos os Departamentos', value: 'ALL' });
     DEPARTMENT_TAXONOMY.forEach(d => availableDepartments.push({ label: `${d.name} (${d.area})`, value: d.id }));
  } else if (user?.role === 'ADMIN') {
     availableDepartments.push({ label: `Toda a Área: ${user.assignedArea}`, value: 'ALL_AREA' });
     DEPARTMENT_TAXONOMY.filter(d => d.area === user.assignedArea).forEach(d => {
       availableDepartments.push({ label: d.name, value: d.id });
     });
  } else if (user?.role === 'COLABORADOR') {
     const myDept = DEPARTMENT_TAXONOMY.find(d => d.id.toLowerCase() === user.departmentId?.toLowerCase());
     if (myDept) {
       availableDepartments.push({ label: myDept.name, value: myDept.id });
     }
  }

  const handleSave = () => {
    if (!user) return;
    const today = getLocalISODate();
    if (startDate && startDate < today) {
      alert("A data de início não pode ser anterior à data de hoje.");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      alert("A data de fim não pode ser menor que a data de início.");
      return;
    }
    if (targetDepartments.includes('ERROR_NO_DEPT')) {
      alert("Erro de sessão: Departamento não identificado. Por favor, recarregue a página.");
      return;
    }
    if (!title || !text || !startDate || !endDate || targetDepartments.length === 0) return;
    let targets: string[] = [];
    if (targetDepartments.includes('ALL')) {
      targets = ['ALL'];
    } else if (targetDepartments.includes('ALL_AREA')) {
      targets = DEPARTMENT_TAXONOMY.filter(d => d.area === user?.assignedArea).map(d => d.id);
    } else {
      targets = [...targetDepartments];
    }
    
    addNotice({
      title,
      text,
      type,
      startDate,
      endDate,
      targetDepartments: targets,
      authorRole: user.role,
      authorId: user.uid,
      isPublished
    });
    setShowModal(false);
  };

  return (
    <Slideover 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
      title="Criar Novo Aviso" 
      icon={Plus}
    >
      <div className="flex flex-col h-full space-y-6">
        <NoticeForm 
          title={title} setTitle={setTitle}
          text={text} setText={setText}
          type={type} setType={setType}
          targetDepartments={targetDepartments} setTargetDepartments={setTargetDepartments}
          availableDepartments={availableDepartments}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
        />
        <div className="pt-4 border-t border-[var(--color-border-default)] flex justify-between items-center shrink-0">
           <div className="flex items-center space-x-3">
             <Toggle checked={isPublished} onChange={setIsPublished} />
             <span className="text-sm font-medium text-[var(--color-content-secondary)]">{isPublished ? 'Publicado' : 'Rascunho'}</span>
           </div>
           <div className="flex space-x-3">
             <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
             <Button variant="primary" onClick={handleSave}>Salvar</Button>
           </div>
        </div>
      </div>
    </Slideover>
  );
};
