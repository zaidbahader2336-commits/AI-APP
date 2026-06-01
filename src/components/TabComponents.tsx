import React, { useState } from 'react';
import { Type, PlaySquare, Image, List, Keyboard, SquareDot, BarChart3, Map, Plus, Play, Sparkles } from 'lucide-react';
import PhonePreview from './PhonePreview';

interface TabComponentsProps {
  dynamicComponents: { id: string; type: string; label: string }[];
  onAddComponent: (type: string, label: string) => void;
  onRemoveComponent: (id: string) => void;
}

interface ComponentItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  defaultLabel: string;
}

export default function TabComponents({ dynamicComponents, onAddComponent, onRemoveComponent }: TabComponentsProps) {
  const [successMsg, setSuccessMsg] = useState('');

  const COMP_LIST: ComponentItem[] = [
    { type: 'Text', label: 'T Text block', icon: <Type size={13} />, color: 'text-zinc-300 bg-zinc-800/40 border border-zinc-700/50 shadow-sm', defaultLabel: 'Custom Text block' },
    { type: 'Button', label: '□ Action Button', icon: <PlaySquare size={13} />, color: 'text-[#10B981] bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]', defaultLabel: 'Primary Click Button' },
    { type: 'Image', label: '🖼 Image Box', icon: <Image size={13} />, color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-sm', defaultLabel: 'Responsive Media frame' },
    { type: 'List', label: '≡ List collection', icon: <List size={13} />, color: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]', defaultLabel: 'Checklist performance list' },
    { type: 'Input', label: '⌨ Password Input', icon: <Keyboard size={13} />, color: 'text-teal-400 bg-teal-500/10 border border-teal-500/20 shadow-sm', defaultLabel: 'AI form input' },
    { type: 'Form', label: '☰ Complete Form', icon: <SquareDot size={13} />, color: 'text-sky-400 bg-sky-500/10 border border-sky-500/20 shadow-sm', defaultLabel: 'User Details submission form' },
    { type: 'Chart', label: '📊 Recharts Line Chart', icon: <BarChart3 size={13} />, color: 'text-emerald-350 bg-emerald-500/10 border border-[#10B981]/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]', defaultLabel: 'D3 Fitness chart activity' },
    { type: 'Map', label: '🗺 GPS Map Screen', icon: <Map size={13} />, color: 'text-teal-500 bg-teal-500/10 border border-teal-500/20 shadow-sm', defaultLabel: 'Coordinates tracker canvas' }
  ];

  const handleAddComponent = (type: string, defaultLabel: string) => {
    onAddComponent(type, defaultLabel);
    setSuccessMsg(`"${type}" layer added to active viewport compile stack.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const [mobileView, setMobileView] = useState<'elements' | 'preview'>('elements');

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-[#070e0a]">
      
      {/* Mobile view switcher */}
      <div className="lg:hidden flex bg-black/40 border-b border-white/[0.08] p-2 gap-2 shrink-0 select-none backdrop-blur-xl">
        <button
          onClick={() => setMobileView('elements')}
          className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            mobileView === 'elements' 
              ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          Catalogue
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            mobileView === 'preview' 
              ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          Design Canvas
        </button>
      </div>
      
      {/* Left UI Components Panel */}
      <div className={`w-full lg:w-[410px] shrink-0 bg-white/[0.01] border-r border-white/[0.06] backdrop-blur-xl flex flex-col min-h-0 ${
        mobileView === 'elements' ? 'flex flex-1' : 'hidden lg:flex'
      }`}>
        <div className="px-5 py-4 border-b border-white/[0.06] bg-black/30 flex justify-between items-center relative z-10 select-none">
          <div>
            <h4 className="text-xs uppercase font-black tracking-wider text-white font-mono">UI Element Catalogue</h4>
            <span className="text-[10px] text-zinc-400 mt-0.5 block">Add pre-compiled assets to live canvas</span>
          </div>
          <span className="text-[9.5px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono font-black shadow-[0_0_8px_rgba(16,185,129,0.15)]">
            {COMP_LIST.length} Elements
          </span>
        </div>

        {successMsg && (
          <div className="mx-4 mt-3.5 p-3 bg-emerald-500/10 border border-[#10B981]/25 text-[#10B981] rounded-xl text-[10.5px] font-sans flex items-center gap-2 animate-fadeIn relative z-10 shadow-lg shadow-emerald-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping shadow-[0_0_6px_#10B981]"></span>
            {successMsg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin relative z-10">
          {COMP_LIST.map((comp) => (
            <div 
              key={comp.type} 
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#09110b]/80 hover:bg-[#0c160e]/90 border border-white/[0.04] hover:border-emerald-500/30 transition-all duration-350 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transform hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${comp.color} flex items-center justify-center shrink-0`}>
                  {comp.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">{comp.label}</span>
                  <p className="text-[9.5px] text-zinc-500 mt-0.5 font-medium">Preconfigured responsive theme template</p>
                </div>
              </div>

              <button
                onClick={() => handleAddComponent(comp.type, comp.defaultLabel)}
                className="flex items-center gap-1 text-[10.5px] bg-[#122316] text-emerald-405 hover:bg-[#10B981] hover:text-zinc-950 px-3 py-2 rounded-xl border border-emerald-500/20 hover:border-transparent font-black tracking-normal transition-all duration-200 cursor-pointer shadow-md transform hover:scale-[1.04] active:scale-95"
              >
                <Plus size={12} className="stroke-[2.5]" /> Add Component
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Canvas Panel */}
      <div className={`flex-grow flex-1 bg-gradient-to-b from-[#040905]/80 to-[#010202]/80 relative flex flex-col justify-center items-center p-4 min-h-0 overflow-y-auto scrollbar-none ${
        mobileView === 'preview' ? 'flex flex-1' : 'hidden lg:flex'
      }`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <PhonePreview dynamicComponents={dynamicComponents} onRemoveComponent={onRemoveComponent} />
        </div>
      </div>

    </div>
  );
}
