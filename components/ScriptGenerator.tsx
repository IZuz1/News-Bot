import React, { useState } from 'react';
import { generateScript } from '../services/geminiService';
import { ScriptRequest, GenerationState } from '../types';
import { Wand2, Copy, Check, Loader2 } from 'lucide-react';

export const ScriptGenerator: React.FC = () => {
  const [request, setRequest] = useState<ScriptRequest>({
    topic: '',
    tone: 'Professional',
    type: 'Commercial'
  });

  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    result: null
  });

  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!request.topic) return;
    
    setState({ isLoading: true, error: null, result: null });
    try {
      const script = await generateScript(request);
      setState({ isLoading: false, error: null, result: script });
    } catch (err) {
      setState({ isLoading: false, error: "Failed to generate script. Please try again.", result: null });
    }
  };

  const copyToClipboard = () => {
    if (state.result) {
      navigator.clipboard.writeText(state.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-serif text-white mb-2 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-amber-500" />
          Need a Sample Script?
        </h3>
        <p className="text-zinc-400">
          Not sure what to write? Let my AI assistant generate a custom script for your project in seconds. 
          Use this to visualize how I might sound for your brand.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Project Type</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
              value={request.type}
              onChange={e => setRequest({...request, type: e.target.value})}
            >
              <option value="Commercial">Commercial / Ad</option>
              <option value="Explainer Video">Explainer Video</option>
              <option value="IVR / Phone Message">IVR / Phone Message</option>
              <option value="Video Game Character">Video Game Character</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Tone of Voice</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
              value={request.tone}
              onChange={e => setRequest({...request, tone: e.target.value})}
            >
              <option value="Professional & Trustworthy">Professional & Trustworthy</option>
              <option value="Warm & Friendly">Warm & Friendly</option>
              <option value="Energetic & Hype">Energetic & Hype</option>
              <option value="Deep & Cinematic">Deep & Cinematic</option>
              <option value="Funny & Quirky">Funny & Quirky</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Topic / Product Name</label>
            <input 
              type="text" 
              placeholder="e.g. 'Apex Fitness App' or 'Luxury Watches'"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
              value={request.topic}
              onChange={e => setRequest({...request, topic: e.target.value})}
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={state.isLoading || !request.topic}
            className={`
              w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
              ${state.isLoading || !request.topic 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-zinc-900 hover:bg-amber-50'}
            `}
          >
            {state.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            Generate Script
          </button>
        </div>

        {/* Output */}
        <div className="relative">
          <div className={`h-full min-h-[300px] bg-zinc-950 rounded-xl p-6 border border-zinc-800 ${state.result ? 'text-zinc-200' : 'text-zinc-600 flex items-center justify-center'}`}>
            {state.result ? (
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {state.result}
              </div>
            ) : (
              <div className="text-center">
                {state.error ? (
                  <span className="text-red-400">{state.error}</span>
                ) : (
                  "Script will appear here..."
                )}
              </div>
            )}
          </div>
          
          {state.result && (
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};