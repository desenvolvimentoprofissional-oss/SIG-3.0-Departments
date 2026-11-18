import React, { useState } from 'react';
import { ColorsSection } from './style-guide/components/ColorsSection';
import { FormControlsSection } from './style-guide/components/FormControlsSection';
import { DataCardsSection } from './style-guide/components/DataCardsSection';
import { TablesSection } from './style-guide/components/TablesSection';
import { TypographySection } from './style-guide/TypographySection';

export function StyleGuideView() {
  const [toggleState, setToggleState] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex flex-col h-full p-4 md:p-8 overflow-auto custom-scrollbar items-center">
      <div className="w-full max-w-7xl space-y-12 pb-12">
        <ColorsSection />

        <TypographySection />

        <FormControlsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleState={toggleState}
          setToggleState={setToggleState}
        />

        <DataCardsSection />

        <TablesSection />
      </div>
    </div>
  );
}
