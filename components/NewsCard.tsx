import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Copy, Check, ExternalLink, Send, Globe } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.telegramPostDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 flex flex-col h-full group">
      
      {/* Top Section: Meta & Summary */}
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-lg font-bold text-slate-100 leading-snug">
                {item.title}
            </h3>
            <span className="shrink-0 text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700/50">
                {item.timestamp}
            </span>
        </div>
        
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            {item.summary}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs">
             <div className="flex items-center gap-1.5 text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                <Globe className="w-3 h-3" />
                {item.source}
             </div>
             {item.url && (
                <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline px-2 py-1"
                >
                    <ExternalLink className="w-3 h-3" />
                    Читать оригинал
                </a>
             )}
        </div>
      </div>

      {/* Bottom Section: Telegram Draft */}
      <div className="bg-slate-900/80 p-5 border-t border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Send className="w-3 h-3 text-sky-500" />
                </div>
                <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">
                    Telegram Draft
                </span>
            </div>
            <button
                onClick={handleCopy}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                    ${copied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600'}
                `}
            >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Скопировано' : 'Копировать'}
            </button>
        </div>
        
        <div 
            className="bg-slate-950 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap border border-slate-800 font-sans shadow-inner opacity-90 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            title="Click to copy"
            style={{ cursor: 'pointer' }}
        >
            {item.telegramPostDraft}
        </div>
      </div>
    </div>
  );
};
