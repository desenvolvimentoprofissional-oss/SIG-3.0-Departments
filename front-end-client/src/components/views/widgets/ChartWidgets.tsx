import React from 'react';
import { ResultadoWidget } from '../../../types';
import { getWidgetColorStyle, renderIcon, COLORS } from './utils';
import {
  BarChart as RechartsBarChart, Bar,
  LineChart as RechartsLineChart, Line,
  PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';

export const BarChartWidget: React.FC<{ widget: ResultadoWidget, data: any }> = ({ widget, data }) => {
  const chartData = Array.isArray(data) ? data : [{ name: 'Total', value: data }];
  const mainColor = getWidgetColorStyle(widget.color);
  let dataKeys = chartData.length > 0 ? Object.keys(chartData[0]).filter(k => k !== 'name') : ['value'];
  if (widget.binding.groupByFields && widget.binding.groupByFields.length > 1) {
    dataKeys = widget.binding.groupByFields.map((f: string, i: number) => `${f}_${i}`);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center text-[var(--color-content-main)] mb-6 font-semibold text-sm">
        {renderIcon(widget, 'BarChart', 16, 'mr-2', widget.color)} {widget.title}
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />}
            {dataKeys.map((key, index) => {
              let fieldConfig;
              let label = key;
              let color = (dataKeys.length === 1 ? mainColor : COLORS[index % COLORS.length]);
              
              if (widget.binding.groupByFields && widget.binding.groupByFields.length > 1) {
                 fieldConfig = widget.binding.groupByFieldConfigs?.[index];
                 label = fieldConfig?.label || fieldConfig?.field || key;
                 if (fieldConfig?.color) color = getWidgetColorStyle(fieldConfig.color);
              } else {
                 fieldConfig = widget.binding.groupByFieldConfigs?.find((c: any) => c.field === key);
                 label = fieldConfig?.label || key;
                 if (fieldConfig?.color) color = getWidgetColorStyle(fieldConfig.color);
              }
              return (
              <Bar 
                key={key} 
                dataKey={key} 
                name={label}
                fill={color} 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50} 
              />
              );
            })}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const LineChartWidget: React.FC<{ widget: ResultadoWidget, data: any }> = ({ widget, data }) => {
  const chartData = Array.isArray(data) ? data : [{ name: 'Total', value: data }];
  const mainColor = getWidgetColorStyle(widget.color);
  let dataKeys = chartData.length > 0 ? Object.keys(chartData[0]).filter(k => k !== 'name') : ['value'];
  if (widget.binding.groupByFields && widget.binding.groupByFields.length > 1) {
    dataKeys = widget.binding.groupByFields.map((f: string, i: number) => `${f}_${i}`);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center text-[var(--color-content-main)] mb-6 font-semibold text-sm">
        {renderIcon(widget, 'LineChart', 16, 'mr-2', widget.color)} {widget.title}
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            {dataKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />}
            {dataKeys.map((key, index) => {
              let fieldConfig;
              let label = key;
              let color = (dataKeys.length === 1 ? mainColor : COLORS[index % COLORS.length]);
              
              if (widget.binding.groupByFields && widget.binding.groupByFields.length > 1) {
                 fieldConfig = widget.binding.groupByFieldConfigs?.[index];
                 label = fieldConfig?.label || fieldConfig?.field || key;
                 if (fieldConfig?.color) color = getWidgetColorStyle(fieldConfig.color);
              } else {
                 fieldConfig = widget.binding.groupByFieldConfigs?.find((c: any) => c.field === key);
                 label = fieldConfig?.label || key;
                 if (fieldConfig?.color) color = getWidgetColorStyle(fieldConfig.color);
              }
              return (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                name={label}
                stroke={color} 
                strokeWidth={3} 
                dot={{ r: 4, fill: color, strokeWidth: 0 }} 
                activeDot={{ r: 6 }} 
              />
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const PieChartWidget: React.FC<{ widget: ResultadoWidget, data: any }> = ({ widget, data }) => {
  const chartData = Array.isArray(data) ? data : [{ name: 'Total', value: data }];
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center text-[var(--color-content-main)] mb-6 font-semibold text-sm">
        {renderIcon(widget, 'PieChart', 16, 'mr-2', widget.color)} {widget.title}
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={widget.type === 'DONUT' ? 45 : 0}
              outerRadius={65}
              paddingAngle={widget.type === 'DONUT' ? 2 : 0}
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend 
              content={(props: any) => {
                const { payload } = props;
                if (!payload) return null;
                return (
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-2 mt-2 px-2">
                    {payload.map((entry: any, index: number) => (
                      <li key={`item-${index}`} className="flex items-center text-[10px] text-[#1e3a8a] truncate">
                        <span 
                          className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="truncate uppercase" title={entry.value}>
                          {entry.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
