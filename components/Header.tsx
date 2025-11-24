import React from 'react';
import { Bot, Radio } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              NewsFlow <span className="text-blue-400">Bot Manager</span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-green-500 animate-pulse" />
              Regional Monitoring Active
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Powered by</p>
          <p className="text-sm font-bold text-slate-300">Gemini 2.5 Flash</p>
        </div>
      </div>
    </header>
  );
};