import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Copy, Check, ExternalLink, MessageSquare, Clock } from 'lucide-react';

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
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors">
      {/* Header Info */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white leading-tight pr-4">
            {item.title}
            </h3>
            <span className="shrink-0 text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                {item.timestamp}
            </span>
        </div>
        
        <p className="text-slate-400 text-sm mb-3 leading-relaxed">
            {item.summary}
        </p>
        
        {item.url && (
            <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
                <ExternalLink className="w-3 h-3" />
                Источник: {new URL(item.url).hostname}
            </a>
        )}
      </div>

      {/* Telegram Preview */}
      <div className="bg-slate-900/50 p-5">
        <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">
                Telegram Draft
            </span>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 text-slate-200 text-sm whitespace-pre-wrap border border-slate-700/50 font-sans shadow-inner">
            {item.telegramPostDraft}
        </div>

        <div className="mt-4 flex justify-end">
            <button
                onClick={handleCopy}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${copied 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/50' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                `}
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        Copied
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};