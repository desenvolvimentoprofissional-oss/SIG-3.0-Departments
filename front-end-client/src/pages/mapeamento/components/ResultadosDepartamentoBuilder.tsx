import React, { useState } from 'react';
import { ResultadosConfig, ResultadoWidget, ResultadoWidgetType, ResultadoAggregateType } from '../../../types';
import { DataSourceConfig, CollectionSource } from '../../../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { 
  BarChart, LineChart, PieChart, LayoutGrid, Type, Hash, 
  Settings, Plus, X, List, GripHorizontal, User, Trash2, Table 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { CollapsibleCard } from '../../../components/ui/CollapsibleCard';

import { IconSelector, ColorSelector } from './IconColorSelectors';
import { SerieHistoricaGlobalConfig } from './builders/serie-historica/SerieHistoricaGlobalConfig';
import { SerieHistoricaWidgetConfig } from './builders/serie-historica/SerieHistoricaWidgetConfig';
import { SortableWidgetCard } from './builders/SortableWidgetCard';
import { FilterBuilder } from './FilterBuilder';

interface ResultadosDepartamentoBuilderProps {
  config: ResultadosConfig | undefined;
  onChange: (config: ResultadosConfig) => void;
  dataSources: DataSourceConfig[];
  tenantId: string;
}

export const ResultadosDepartamentoBuilder: React.FC<ResultadosDepartamentoBuilderProps> = ({ config, onChange, dataSources, tenantId }) => {
  const tabConfig = config?.departamentoConfig || { enabled: true, widgets: [] };
  const [widgets, setWidgets] = useState<ResultadoWidget[]>(tabConfig.widgets || []);
  const [globalFilters, setGlobalFilters] = useState(tabConfig.globalFilters || []);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const availableCollections = dataSources.flatMap(ds => {
    const cols = [];
    if (ds.mainCollection) cols.push(ds.mainCollection);
    return cols.concat(ds.relationalCollections);
  });

  const getExtractedFields = (collectionIdentifier: string) => {
    const col = availableCollections.find(c => c.collectionName === collectionIdentifier || c.id === collectionIdentifier);
    return col?.extractedFields || [];
  };

  const handleGlobalFiltersChange = (newFilters: any[]) => {
    setGlobalFilters(newFilters);
    onChange({ ...config, departamentoConfig: { ...tabConfig, widgets, globalFilters: newFilters } });
  };

  const handleAddWidget = (type: ResultadoWidgetType) => {
    let defaultW = 6;
    if (type === 'METRIC_CARD') defaultW = 3;
    else if (type === 'BAR' || type === 'LINE') defaultW = 8;
    else if (type === 'DONUT' || type === 'PIE') defaultW = 4;

    const newWidget: ResultadoWidget = {
      id: Date.now().toString(36),
      title: 'Novo Widget',
      type,
      binding: {
        collection: availableCollections[0]?.collectionName || '',
        aggregate: 'COUNT',
        filters: []
      },
      layout: { w: defaultW, h: 4 }
    };
    const newWidgets = [...widgets, newWidget];
    setWidgets(newWidgets);
    onChange({ ...config, departamentoConfig: { ...tabConfig, widgets: newWidgets, globalFilters } });
    setSelectedWidgetId(newWidget.id);
  };

  const handleUpdateWidget = (id: string, updates: Partial<ResultadoWidget>) => {
    const newWidgets = widgets.map(w => w.id === id ? { ...w, ...updates } : w);
    setWidgets(newWidgets);
    onChange({ ...config, departamentoConfig: { ...tabConfig, widgets: newWidgets, globalFilters } });
  };

  const handleRemoveWidget = (id: string) => {
    const newWidgets = widgets.filter(w => w.id !== id);
    setWidgets(newWidgets);
    onChange({ ...config, departamentoConfig: { ...tabConfig, widgets: newWidgets, globalFilters } });
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const selectedWidget = widgets.find(w => w.id === selectedWidgetId);

  const getWidgetIcon = (type: ResultadoWidgetType) => {
    switch (type) {
      case 'BAR': return <BarChart size={16} />;
      case 'LINE': return <LineChart size={16} />;
      case 'PIE': case 'DONUT': return <PieChart size={16} />;
      case 'METRIC_CARD': return <Hash size={16} />;
      case 'TABLE_TOP_5': return <List size={16} />;
      case 'PIVOT_TABLE': return <Table size={16} />;
      default: return <LayoutGrid size={16} />;
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((i: any) => i.id === active.id);
      const newIndex = widgets.findIndex((i: any) => i.id === over.id);
      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      setWidgets(newWidgets);
      
      const configKey = "departamentoConfig";
      
      onChange({ ...config, [configKey]: { ...tabConfig, widgets: newWidgets, globalFilters } });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[600px] border border-[var(--color-border-default)] rounded-xl overflow-hidden bg-white">
      
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-[var(--color-border-default)] bg-white flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-[var(--color-content-main)]">Ângulo: Departamento</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleAddWidget('METRIC_CARD')} title="Card Numérico" className="!p-2">
              <Hash size={16} />
            </Button>
            <Button variant="secondary" onClick={() => handleAddWidget('BAR')} title="Gráfico de Barras" className="!p-2">
              <BarChart size={16} />
            </Button>
            <Button variant="secondary" onClick={() => handleAddWidget('LINE')} title="Gráfico de Linha" className="!p-2">
              <LineChart size={16} />
            </Button>
            <Button variant="secondary" onClick={() => handleAddWidget('DONUT')} title="Gráfico de Rosca" className="!p-2">
              <PieChart size={16} />
            </Button>
            <Button variant="secondary" onClick={() => handleAddWidget('TABLE_TOP_5')} title="Tabela de Top 5" className="!p-2">
              <List size={16} />
            </Button>
            <Button variant="secondary" onClick={() => handleAddWidget('PIVOT_TABLE')} title="Tabela Dinâmica" className="!p-2">
              <Table size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {widgets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-content-secondary)]">
              <LayoutGrid size={48} className="mb-4 text-gray-300" />
              <p>Este dashboard está vazio. Utilize os botões acima para adicionar widgets.</p>
            </div>
          ) : (
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-12 gap-4">
                  <SortableContext 
                    items={widgets.map(w => w.id)}
                    strategy={rectSortingStrategy}
                  >
                    {widgets.map(widget => (
                      <SortableWidgetCard 
                        key={widget.id}
                        widget={widget}
                        selectedWidgetId={selectedWidgetId}
                        setSelectedWidgetId={setSelectedWidgetId}
                        handleRemoveWidget={handleRemoveWidget}
                        getWidgetIcon={getWidgetIcon}
                        availableCollections={availableCollections}
                      />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
          )}
        </div>
      </div>

      
      <div className={`w-96 border-l border-[var(--color-border-default)] bg-white flex flex-col`}>
        {!selectedWidget ? (
          <SerieHistoricaGlobalConfig
            globalFilters={globalFilters}
            handleGlobalFiltersChange={handleGlobalFiltersChange}
            availableCollections={availableCollections}
          />
        ) : (
          <SerieHistoricaWidgetConfig
            selectedWidget={selectedWidget}
            setSelectedWidgetId={setSelectedWidgetId}
            handleUpdateWidget={handleUpdateWidget}
            availableCollections={availableCollections}
            getExtractedFields={getExtractedFields}
          />
        )}
      </div>

    </div>
  );
};
