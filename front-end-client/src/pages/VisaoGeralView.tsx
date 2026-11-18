import React from 'react';
import { DashboardMultiProcessoTemplate } from '../templates/DashboardMultiProcessoTemplate';

import { PageMapping } from '../types';

export const VisaoGeralView: React.FC = () => {
  const dummyMapping: PageMapping = {
    id: 'dummy',
    departmentId: 'dummy',
    pageName: 'Visão Geral',
    collections: [],
    createdAt: 0,
    updatedAt: 0
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <DashboardMultiProcessoTemplate items={[]} mapping={dummyMapping} />
    </div>
  );
};
