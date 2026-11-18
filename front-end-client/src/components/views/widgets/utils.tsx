import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ResultadoWidget } from '../../../types';

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const getWidgetColorStyle = (color?: string) => {
  return color || 'var(--color-brand-main)';
};

export const renderIcon = (widget: ResultadoWidget, defaultIconName: string, size: number = 16, className: string = '', color?: string) => {
  const iconName = widget.icon || defaultIconName;
  const IconComponent = (LucideIcons as any)[iconName] || (LucideIcons as any)[defaultIconName] || LucideIcons.LayoutGrid;
  return <IconComponent size={size} className={className} style={{ color: color ? getWidgetColorStyle(color) : undefined }} />;
};
