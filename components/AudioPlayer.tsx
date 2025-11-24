import React, { useState } from 'react';
import { DemoTrack } from '../types';
import { Play, Pause, Download } from 'lucide-react';

interface AudioPlayerProps {
  track: DemoTrack;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock play toggle (would connect to real audio ref in prod)
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-amber-600 flex items-center justify-center shrink-0 transition-colors duration-300"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-current" />
          ) : (
            <Play className="w-5 h-5 text-white fill-current ml-1" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-zinc-100 truncate">{track.title}</h4>
          <p className="text-xs text-amber-500 uppercase tracking-wider font-medium mt-0.5">{track.category}</p>
        </div>

        <div className="hidden sm:flex items-center gap-1 opacity-50">
           {/* Decorative visualizer bars */}
           {[...Array(12)].map((_, i) => (
             <div 
               key={i} 
               className={`w-1 bg-zinc-500 rounded-full transition-all duration-500 ${isPlaying ? 'animate-pulse' : ''}`}
               style={{ height: `${Math.max(20, Math.random() * 40)}%` }} 
             />
           ))}
        </div>

        <div className="text-xs font-mono text-zinc-500 tabular-nums">
          {track.duration}
        </div>
        
        <button className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};