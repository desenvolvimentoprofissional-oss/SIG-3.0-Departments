import React from 'react';

export const renderExtractedPills = (fields?: string[]) => {
  if (!fields || fields.length === 0) return null;
  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
      <h5 className="text-xs font-bold text-green-800 mb-2">Sucesso! {fields.length} campos encontrados:</h5>
      <div className="flex flex-wrap gap-2">
        {fields.map(f => (
          <span key={f} className="bg-white border border-green-200 text-green-700 text-xs px-2 py-1 rounded shadow-sm">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};
