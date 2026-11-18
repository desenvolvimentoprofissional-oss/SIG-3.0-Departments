import React, { useState, useEffect } from 'react';
import { NoticeForm } from '../../../components/views/notice/NoticeForm';
import { AuditHistory } from '../../../components/ui/AuditHistory';
import { Slideover } from '../../../components/ui/Slideover';
import { Toggle } from '../../../components/ui/Toggle';
import { Button } from '../../../components/ui/Button';
import { Edit2 } from 'lucide-react';
import { NoticeType, useNoticeStore } from '../../../store/noticeStore';
import { useAuthStore } from '../../../store/authStore';
import { getLocalISODate } from '../../../lib/date.util';
import { DEPARTMENT_TAXONOMY } from '../../../lib/taxonomia-icones';

interface EditNoticeSlideoverProps {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

export const EditNoticeSlideover: React.FC<EditNoticeSlideoverProps> = ({
  editingId, setEditingId
}) => {
  const { notices, updateNotice } = useNoticeStore();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState<NoticeType>('info');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetDepartments, setTargetDepartments] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);

  const notice = notices.find(n => n.id === editingId);

  useEffect(() => {
    if (editingId && notice) {
      setTitle(notice.title);
      setText(notice.text);
      setType(notice.type);
      setStartDate(notice.startDate);
      setEndDate(notice.endDate);
      setIsPublished(notice.isPublished !== false);
      
      if (notice.targetDepartments.includes('ALL')) {
         setTargetDepartments(['ALL']);
      } else if (notice.targetDepartments.length > 1 && user?.role === 'ADMIN' && notice.targetDepartments.includes('ALL_AREA')) {
         setTargetDepartments(['ALL_AREA']);
      } else {
         setTargetDepartments(notice.targetDepartments.length > 0 ? notice.targetDepartments : ['ALL']);
      }
    }
  }, [editingId, notice, user]);

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
    if (!editingId || !user) return;
    
    const today = getLocalISODate();
    if (startDate && startDate < today && startDate !== notice?.startDate) {
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
    
    updateNotice(editingId, {
      title,
      text,
      type,
      startDate,
      endDate,
      targetDepartments: targets,
      isPublished
    });
    
    setEditingId(null);
  };

  if (!editingId || !notice) return null;

  return (
    <Slideover
      isOpen={!!editingId}
      onClose={() => setEditingId(null)}
      title="Editar Aviso"
      subtitle="Detalhes e Histórico"
      icon={Edit2}
    >
        <div className="space-y-4">
           <NoticeForm 
             title={title} setTitle={setTitle}
             text={text} setText={setText}
             type={type} setType={setType}
             targetDepartments={targetDepartments} setTargetDepartments={setTargetDepartments}
             availableDepartments={availableDepartments}
             startDate={startDate} setStartDate={setStartDate}
             endDate={endDate} setEndDate={setEndDate}
           />
           <AuditHistory 
             createdByName={notice.createdByName} 
             createdAt={notice.createdAt} 
             updatedByName={notice.updatedByName} 
             updatedAt={notice.updatedAt} 
           />
           <div className="pt-6 flex justify-between items-center">
             <div className="flex items-center space-x-3">
               <Toggle checked={isPublished} onChange={setIsPublished} />
               <span className="text-sm font-medium text-[var(--color-content-secondary)]">{isPublished ? 'Publicado (Visível)' : 'Rascunho (Oculto)'}</span>
             </div>
             <div className="flex space-x-3">
               <Button variant="secondary" onClick={() => setEditingId(null)}>Cancelar</Button>
               <Button variant="primary" onClick={handleSave}>Salvar Alterações</Button>
             </div>
           </div>
        </div>
    </Slideover>
  );
};
