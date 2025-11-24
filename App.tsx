
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RegionTabs } from './components/RegionTabs';
import { NewsCard } from './components/NewsCard';
import { NewsItem, RegionKey } from './types';
import { fetchRegionalNews } from './services/geminiService';
import { REGIONS } from './constants';
import { RefreshCw, AlertCircle, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<RegionKey>('dnr');
  const [news, setNews] = useState<Record<RegionKey, NewsItem[]>>({
    dnr: [], lnr: [], zo: [], ho: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (region: RegionKey) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchRegionalNews(region);
      setNews(prev => ({
        ...prev,
        [region]: items
      }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Не удалось загрузить новости. Проверьте API ключ или попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const currentRegionNews = news[activeRegion];
    if (currentRegionNews.length === 0 && !loading && !error) {
      loadNews(activeRegion);
    }
  }, [activeRegion]);

  const currentItems = news[activeRegion] || [];
  const activeRegionData = REGIONS.find(r => r.key === activeRegion);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <RegionTabs 
                selectedRegion={activeRegion} 
                onSelect={setActiveRegion} 
                isLoading={loading}
            />
            
            <button 
                onClick={() => loadNews(activeRegion)}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Сканирование...' : 'Обновить ленту'}
            </button>
        </div>

        {/* Content Area */}
        {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-800/50 rounded-lg flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
            </div>
        )}

        {loading && currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="font-mono text-sm animate-pulse">Анализ источников информации...</p>
                <p className="text-xs mt-2 opacity-50">Поиск новостей по региону {activeRegionData?.fullName}</p>
            </div>
        ) : currentItems.length === 0 && !error && !loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/30 border border-slate-800/50 rounded-2xl border-dashed">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>Новости не найдены или лента пуста.</p>
                <button 
                    onClick={() => loadNews(activeRegion)}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm hover:underline"
                >
                    Попробовать снова
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentItems.map(item => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
