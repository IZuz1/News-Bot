import React from 'react';
import { REGIONS } from '../constants';
import { RegionKey } from '../types';

interface RegionTabsProps {
  selectedRegion: RegionKey;
  onSelect: (key: RegionKey) => void;
  isLoading: boolean;
}

export const RegionTabs: React.FC<RegionTabsProps> = ({ selectedRegion, onSelect, isLoading }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50">
      {REGIONS.map((region) => {
        const isSelected = selectedRegion === region.key;
        // Construct dynamic class names for selected state based on region color
        const selectedClasses = isSelected 
            ? `${region.color} text-white shadow-lg` 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border-slate-700 hover:border-slate-600';
            
        return (
          <button
            key={region.key}
            onClick={() => !isLoading && onSelect(region.key)}
            disabled={isLoading}
            className={`
              flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200
              border text-sm sm:text-base whitespace-nowrap
              ${selectedClasses}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {region.name}
          </button>
        );
      })}
    </div>
  );
};
