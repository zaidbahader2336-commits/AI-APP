import React, { useState } from 'react';
import { Bell, Flame, Compass, Target, UserCircle2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkspaceData } from '../types';

interface PhonePreviewProps {
  dynamicComponents?: { id: string; type: string; label: string }[];
  onRemoveComponent?: (id: string) => void;
  activeApp?: WorkspaceData | null;
}

interface HourlyDataPoint {
  hour: string;
  steps: string;
  kcal: number;
  active: string;
  y: number;
}

const DEFAULT_CHART_DATA: HourlyDataPoint[] = [
  { hour: '08:00', steps: '4,120', kcal: 182, active: '18m', y: 65 },
  { hour: '10:00', steps: '6,842', kcal: 290, active: '26m', y: 48 },
  { hour: '12:00', steps: '8,190', kcal: 345, active: '30m', y: 38 },
  { hour: '14:00', steps: '9,500', kcal: 410, active: '35m', y: 25 },
  { hour: '16:00', steps: '11,207', kcal: 482, active: '42m', y: 12 },
  { hour: '18:00', steps: '13,100', kcal: 560, active: '51m', y: 5 }
];

export default function PhonePreview({ dynamicComponents = [], onRemoveComponent, activeApp }: PhonePreviewProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(4);
  const [toastText, setToastText] = useState<string>('');

  const renderToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => {
      setToastText('');
    }, 3500);
  };

  const headerTitle = activeApp?.previewHeaderTitle || "FITNESS OS";
  const widgets = activeApp?.previewWidgets || [
    {
      type: "chart",
      title: "Activity Trend",
      metricValue: DEFAULT_CHART_DATA[selectedIdx].steps,
      metricLabel: "Steps count",
      lineData: DEFAULT_CHART_DATA,
      metrics: [
        { label: "STEPS", value: DEFAULT_CHART_DATA[selectedIdx].steps },
        { label: "KCAL", value: `${DEFAULT_CHART_DATA[selectedIdx].kcal}` },
        { label: "ACTIVE", value: DEFAULT_CHART_DATA[selectedIdx].active }
      ]
    },
    {
      type: "list",
      title: "Today's Routines",
      items: [
        { title: "HIIT Fat Burn", category: "Cardio", value: "30 min", status: "passed" },
        { title: "Yoga Stretch", category: "Mindfulness", value: "15 min", status: "passed" }
      ]
    }
  ];

  return (
    <div className="relative mx-auto flex flex-col items-center select-none animate-fadeIn origin-center">
      
      {/* Toast Overlay inside Phone Frame preview */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-16 left-6 right-6 p-2.5 bg-black/90 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] flex items-center gap-1.5 shadow-2xl z-30 font-sans"
          >
            <Sparkles size={11} className="text-[#10B981] shrink-0" />
            <span className="font-medium text-left leading-tight">{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-[256px] h-[524px] bg-[#020302] rounded-[42px] p-2.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.95),0_0_30px_rgba(16,185,129,0.08)] border-[5px] border-[#101411] ring-1 ring-white/10 flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] pointer-events-none z-25 rounded-[32px]" />
        
        <div className="relative flex-1 bg-gradient-to-b from-[#060a07] via-[#020503] to-[#010201] rounded-[32px] overflow-hidden flex flex-col pt-4 pb-1.5 text-white border border-white/[0.03]">
          <div className="absolute top-8 left-8 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Mini Header */}
          <div className="flex justify-between items-center px-3 pt-1 pb-1.5 relative z-10 shrink-0">
            <div>
              <h4 className="text-[8.5px] font-black tracking-widest text-emerald-400 uppercase flex items-center gap-1 font-sans">
                {headerTitle} <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]"></span>
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] transition-all text-white/80 shrink-0" onClick={() => renderToast("Notifications synced successfully.")}>
                <Bell size={9} />
              </button>
              <button className="p-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] transition-all text-emerald-400 shrink-0" onClick={() => renderToast("Workspace profile synchronized.")}>
                <UserCircle2 size={9} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-1.5 xs:px-3 text-left py-1 space-y-3 scrollbar-none relative z-10 select-none">
            
            {widgets.map((widget: any, idx: number) => {
              if (widget.type === "chart") {
                const points = widget.lineData || DEFAULT_CHART_DATA;
                const activeDataPoint = points[selectedIdx] || points[points.length - 1] || {};
                const svgWidth = 220;
                const svgHeight = 75;
                const paddingX = 15;
                const getX = (i: number) => paddingX + (i * (svgWidth - (paddingX * 2)) / (points.length - 1 || 1));
                
                let pathD = "";
                if (points.length > 0) {
                  pathD = `M ${getX(0)} ${points[0].y || 30}`;
                  for (let i = 0; i < points.length - 1; i++) {
                    const x0 = getX(i);
                    const y0 = points[i].y || 30;
                    const x1 = getX(i + 1);
                    const y1 = points[i + 1].y || 30;
                    const cpX1 = x0 + (x1 - x0) / 2.2;
                    const cpY1 = y0;
                    const cpX2 = x0 + (x1 - x0) / 2.2 * 1.2;
                    const cpY2 = y1;
                    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x1} ${y1}`;
                  }
                }
                const areaD = pathD ? `${pathD} L ${getX(points.length - 1)} ${svgHeight} L ${getX(0)} ${svgHeight} Z` : "";

                return (
                  <div key={idx} className="relative p-3.5 rounded-2xl bg-[#09100a]/90 backdrop-blur-md border border-[#10B981]/15 hover:border-emerald-400/30 transition-all duration-300 overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-550/15 to-transparent rounded-full blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] text-[#10B981] font-extrabold tracking-widest uppercase font-mono">{widget.title || "Analytics"}</span>
                      {activeDataPoint.label && (
                        <span className="text-[8px] text-emerald-400 font-extrabold font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {activeDataPoint.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-baseline gap-1 mt-1">
                      <h2 className="text-xl font-black tracking-tight text-white leading-none">
                        {activeApp ? (widget.metricValue || activeDataPoint.value || "$0.00") : DEFAULT_CHART_DATA[selectedIdx].steps}
                      </h2>
                      <span className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest font-mono">{widget.metricLabel || "Stats"}</span>
                    </div>

                    {pathD && (
                      <div className="relative h-[80px] w-full mt-2.5 pb-1">
                        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                          <linearGradient id="emerald-area-gradient-phone" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
                          </linearGradient>
                          <path d={areaD} fill="url(#emerald-area-gradient-phone)" />
                          <path d={pathD} fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          {points.map((p: any, index: number) => {
                            const isSel = selectedIdx === index;
                            return (
                              <circle 
                                key={index} 
                                cx={getX(index)} 
                                cy={p.y || 30} 
                                r={isSel ? "4.5" : "3"} 
                                fill={isSel ? "#10B981" : "#122519"} 
                                stroke={isSel ? "#FFFFFF" : "#10B981"} 
                                strokeWidth={isSel ? "1.5" : "0.8"}
                                onClick={() => setSelectedIdx(index)}
                                className="cursor-pointer"
                              />
                            );
                          })}
                        </svg>
                      </div>
                    )}

                    {/* Quick Metrics columns list */}
                    {widget.metrics && (
                      <div className="grid grid-cols-3 gap-0.5 mt-3 pt-2.5 border-t border-white/[0.04] text-center">
                        {widget.metrics.map((m: any, mIdx: number) => (
                          <div key={mIdx}>
                            <span className="text-emerald-400 font-black text-[9px] block font-mono">
                              {activeApp && mIdx === 0 && points[selectedIdx] ? (points[selectedIdx].value || points[selectedIdx].steps || m.value) : m.value}
                            </span>
                            <p className="text-[5.5px] text-zinc-450 font-bold tracking-widest uppercase mt-0.5 font-mono">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (widget.type === "metrics") {
                return (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    {widget.metrics.map((m: any, mIdx: number) => (
                      <div key={mIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between">
                        <span className="text-[10px] text-zinc-400 font-mono block leading-tight">{m.label}</span>
                        <span className={`text-sm font-black mt-1 ${
                          m.color === 'emerald' ? 'text-emerald-400' : m.color === 'orange' ? 'text-orange-400' : 'text-teal-400'
                        }`}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              if (widget.type === "list") {
                return (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[8px] text-zinc-550 font-black tracking-widest uppercase block font-mono">{widget.title || "Items"}</span>
                    <div className="space-y-1">
                      {widget.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="p-2 border border-white/[0.03] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] flex justify-between items-center transition-all cursor-pointer" onClick={() => renderToast(`Action logs: ${item.title}`)}>
                          <div>
                            <span className="text-[9.5px] font-bold text-white block truncate max-w-[120px]">{item.title}</span>
                            <span className="text-[7px] font-mono text-zinc-500 uppercase mt-0.5 block">{item.category}</span>
                          </div>
                          <span className={`text-[8px] font-mono font-black ${
                            item.status === 'passed' ? 'text-[#10B981]' : 'text-orange-400'
                          }`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (widget.type === "action_button") {
                return (
                  <div key={idx} className="pt-1 select-none">
                    <button 
                      onClick={() => renderToast(widget.messageOnSelect || "Executing pipeline action.")}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-550 text-zinc-950 font-black text-xs transition hover:scale-[1.02] active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.3)] shadow-md"
                    >
                      {widget.label || "Compile Primary Action"}
                    </button>
                  </div>
                );
              }

              return null;
            })}

            {/* Injected user dynamic layers checklist */}
            {dynamicComponents.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[8.5px] text-emerald-400 font-black tracking-wider uppercase block font-mono">
                  ACTIVE WIDGETS ({dynamicComponents.length})
                </span>
                <div className="space-y-1">
                  {dynamicComponents.map((comp) => (
                    <motion.div
                      layout
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      key={comp.id}
                      className="group relative flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 text-[10.5px] transition-all"
                    >
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#10B981] animate-pulse shrink-0 font-bold" />
                        <span className="font-bold text-zinc-100 truncate max-w-[85px]">{comp.label}</span>
                        <span className="text-[7px] font-mono px-1 py-0.2 bg-white/5 rounded text-gray-500 scale-90">{comp.type}</span>
                      </div>
                      <button
                        onClick={() => onRemoveComponent?.(comp.id)}
                        className="text-[7.5px] text-zinc-400 hover:text-red-400 hover:bg-red-500/10 px-1 py-0.5 rounded cursor-pointer font-bold transition-all"
                      >
                        Delete
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick routines display */}
            <div className="pt-0.5">
              <h5 className="text-[8px] font-black uppercase tracking-wider text-zinc-500 font-mono mb-2">INTEGRATED SERVICES</h5>
              <div className="grid grid-cols-3 gap-1.5">
                {["Analytics Hub", "Cloud DB", "WAF Shield"].map((titleText, idx) => (
                  <div key={idx} className="group relative rounded-lg overflow-hidden h-14 bg-cover bg-center cursor-pointer border border-white/5 hover:border-emerald-500/30 transition-all bg-[#09110b]" onClick={() => renderToast(`${titleText} is fully operational.`)}>
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-2.5">
                      <span className="text-[7px] font-black text-white uppercase tracking-wider leading-none mt-auto block text-center truncate">{titleText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tab bottom navigation bar */}
          <div className="flex justify-around items-center pt-2 pb-1.5 border-t border-white/[0.04] bg-[#030604]">
            <button className="flex flex-col items-center gap-0.5 text-emerald-400">
              <Compass size={11} className="stroke-[2.5]" />
              <span className="text-[7px] font-extrabold font-mono tracking-tighter">Explore</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white transition-colors" onClick={() => renderToast("Switched to Live telemetry stream.")}>
              <Flame size={11} />
              <span className="text-[7px] font-bold font-mono tracking-tighter">Live</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white transition-colors" onClick={() => renderToast("Opening Goals Board.")}>
              <Target size={11} />
              <span className="text-[7px] font-bold font-mono tracking-tighter">Goals</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-white transition-colors" onClick={() => renderToast("Syncing secure user logs.")}>
              <UserCircle2 size={11} />
              <span className="text-[7px] font-bold font-mono tracking-tighter">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
