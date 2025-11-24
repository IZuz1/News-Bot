import React, { useState } from 'react';
import { Header } from './components/Header';
import { RegionTabs } from './components/RegionTabs';
import { NewsCard } from './components/NewsCard';
import { REGIONS } from './constants';
import { RegionKey, NewsItem, GenerationState } from './types';
import { fetchRegionalNews } from './services/geminiService';
import { Search, RotateCw, AlertCircle, Newspaper } from 'lucide-react';

const App: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('DNR');
  const [news, setNews] = useState<Record<RegionKey, NewsItem[]>>({
    DNR: [],
    LNR: [],
    ZO: [],
    HO: [],
  });
  
  const [status, setStatus] = useState<GenerationState>({
    isLoading: false,
    error: null,
  });

  const handleFetchNews = async () => {
    setStatus({ isLoading: true, error: null });
    
    try {
      const regionConfig = REGIONS.find(r => r.key === selectedRegion);
      if (!regionConfig) return;

      const items = await fetchRegionalNews(regionConfig.fullName);
      
      setNews(prev => ({
        ...prev,
        [selectedRegion]: items
      }));
    } catch (err: any) {
      setStatus({ 
        isLoading: false, 
        error: err.message || "Failed to fetch news. Please try again." 
      });
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const currentNews = news[selectedRegion];
  const regionName = REGIONS.find(r => r.key === selectedRegion)?.fullName;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Intro / Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">News Monitor</h2>
          <p className="text-slate-400">
            Select a region to find the latest news using Google Search Grounding and generate Telegram posts automatically.
          </p>
        </div>

        {/* Controls */}
        <RegionTabs 
          selectedRegion={selectedRegion} 
          onSelect={setSelectedRegion} 
          isLoading={status.isLoading}
        />

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
             <div className="bg-slate-700 p-2 rounded-lg">
                <Newspaper className="w-5 h-5 text-slate-300" />
             </div>
             <div>
                <h3 className="font-semibold text-white">{regionName}</h3>
                <p className="text-xs text-slate-400">
                    {currentNews.length > 0 
                        ? `${currentNews.length} items found` 
                        : "No news loaded yet"}
                </p>
             </div>
          </div>
          
          <button
            onClick={handleFetchNews}
            disabled={status.isLoading}
            className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                ${status.isLoading 
                    ? 'bg-slate-700 text-slate-400 cursor-wait' 
                    : 'bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-700 shadow-lg shadow-white/5'}
            `}
          >
            {status.isLoading ? (
                <>
                    <RotateCw className="w-5 h-5 animate-spin" />
                    Searching & Generating...
                </>
            ) : (
                <>
                    <Search className="w-5 h-5" />
                    Find News for {selectedRegion}
                </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {status.error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{status.error}</p>
            </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentNews.map((item) => (
                <NewsCard key={item.id} item={item} />
            ))}
        </div>

        {/* Empty State */}
        {!status.isLoading && currentNews.length === 0 && !status.error && (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Ready to search</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Click the button above to search Google for the latest events in {regionName}.
                </p>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;