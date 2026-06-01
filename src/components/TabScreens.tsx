import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppWindow, 
  Smartphone, 
  Flame, 
  Activity, 
  Map, 
  Sparkles, 
  Play, 
  Compass, 
  Target, 
  UserCircle2, 
  RotateCcw, 
  ChevronRight,
  Tv,
  Eye
} from 'lucide-react';
import PhonePreview from './PhonePreview';

interface AnimationPreset {
  id: string;
  name: string;
  category: 'Entrance' | 'Interactive' | 'Loop' | 'Physics';
  description: string;
  transition: any;
  animate: any;
}

const ANIMATION_PRESETS: AnimationPreset[] = [
  // --- ENTRANCE ---
  { id: '1', name: 'Ambient Fade In', category: 'Entrance', description: 'Smooth atmospheric opacity fade', animate: { opacity: [0, 1] }, transition: { duration: 0.8 } },
  { id: '2', name: 'Scale Spring', category: 'Entrance', description: 'Snappy bounce-up expansion', animate: { scale: [0.3, 1], opacity: [0, 1] }, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  { id: '3', name: 'Slide From Right', category: 'Entrance', description: 'Smooth right edge arrival', animate: { x: [100, 0], opacity: [0, 1] }, transition: { type: 'spring', damping: 25 } },
  { id: '4', name: 'Slide From Left', category: 'Entrance', description: 'Smooth left edge arrival', animate: { x: [-100, 0], opacity: [0, 1] }, transition: { type: 'spring', damping: 25 } },
  { id: '5', name: 'Slide Drop Down', category: 'Entrance', description: 'Gravitational top-down drop', animate: { y: [-80, 0], opacity: [0, 1] }, transition: { type: 'spring', stiffness: 300, damping: 18 } },
  { id: '6', name: 'Upward Reveal', category: 'Entrance', description: 'Card slide up reveal', animate: { y: [80, 0], opacity: [0, 1] }, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  { id: '7', name: 'Elegant 3D Flip', category: 'Entrance', description: 'Cinematic Y-axis fold open', animate: { rotateY: [90, 0], opacity: [0, 1] }, transition: { duration: 0.7, ease: 'easeOut' } },
  { id: '8', name: 'Whip Roll In', category: 'Entrance', description: 'Rotating scale combo entrance', animate: { rotate: [-45, 0], scale: [0.8, 1], opacity: [0, 1] }, transition: { duration: 0.5 } },
  { id: '9', name: 'Staggered Pop', category: 'Entrance', description: 'Double delay impact elastic pop', animate: { scale: [0.8, 1.1, 1], opacity: [0, 1] }, transition: { duration: 0.45, ease: 'easeInOut' } },

  // --- INTERACTIVE ---
  { id: '10', name: 'Press Compress', category: 'Interactive', description: 'Tactile press physical shrinkage', animate: { scale: [1, 0.92, 1] }, transition: { duration: 0.15 } },
  { id: '11', name: 'Elastic Hover Spark', category: 'Interactive', description: 'Snappy floatation height boost', animate: { y: [0, -6, 0] }, transition: { duration: 0.25 } },
  { id: '12', name: 'Cyber Neon Glow', category: 'Interactive', description: 'Temporary atomic highlight flash', animate: { filter: ['drop-shadow(0 0 0px rgba(16,185,129,0))', 'drop-shadow(0 0 12px rgba(16,185,129,0.8))', 'drop-shadow(0 0 0px rgba(16,185,129,0))'] }, transition: { duration: 0.6 } },
  { id: '13', name: 'Quick Accent Tilt', category: 'Interactive', description: 'Snappy angular wobble check', animate: { rotate: [0, -3, 3, 0] }, transition: { duration: 0.3 } },
  { id: '14', name: 'Wiggle Feedback', category: 'Interactive', description: 'Validation error alert shimmy', animate: { x: [0, -8, 8, -5, 5, 0] }, transition: { duration: 0.4 } },
  { id: '15', name: 'Atomic Spin Burst', category: 'Interactive', description: 'Fast clockwise rotation trigger', animate: { rotate: [0, 180, 360] }, transition: { duration: 0.5, ease: 'easeInOut' } },
  { id: '16', name: 'Liquid Sheen Flash', category: 'Interactive', description: 'X-axis glare reflections sheen', animate: { skewX: [0, -10, 10, 0], scaleX: [1, 1.05, 1] }, transition: { duration: 0.4 } },
  { id: '17', name: 'Micro-Bounce Action', category: 'Interactive', description: 'Spring back recoil transition', animate: { scaleY: [1, 0.85, 1.08, 1] }, transition: { duration: 0.35 } },

  // --- LOOP ---
  { id: '18', name: 'Zero-G Float', category: 'Loop', description: 'Continuous ambient levitation', animate: { y: [0, -8, 0] }, transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' } },
  { id: '19', name: 'Neon Pulse Breathing', category: 'Loop', description: 'Atmospheric light breathe loop', animate: { opacity: [0.4, 1, 0.4] }, transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } },
  { id: '20', name: 'Galactic Horizon Spin', category: 'Loop', description: 'Perpetual constant rotation', animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 15, ease: 'linear' } },
  { id: '21', name: 'Radar Glow Wave', category: 'Loop', description: 'Concentric ring expanding pulse', animate: { scale: [0.95, 1.05, 0.95] }, transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } },
  { id: '22', name: 'Cardiac Heartbeat', category: 'Loop', description: 'Double-pump pulse action', animate: { scale: [1, 1.08, 0.97, 1.05, 1] }, transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } },
  { id: '23', name: 'Dynamic Jelly Shake', category: 'Loop', description: 'Wobbling jelly shape cycle', animate: { scaleX: [1, 1.07, 0.93, 1.03, 1], scaleY: [1, 0.93, 1.07, 0.97, 1] }, transition: { repeat: Infinity, duration: 2.2 } },

  // --- PHYSICS ---
  { id: '24', name: 'Hyper Gravitational Slam', category: 'Physics', description: 'Extreme high-g heavy impact stomp', animate: { scale: [2, 1], opacity: [0, 1] }, transition: { type: 'spring', damping: 10, stiffness: 400 } },
  { id: '25', name: 'Magnet Snap Pull', category: 'Physics', description: 'Damped overshoot layout snap', animate: { x: [-150, 0] }, transition: { type: 'spring', damping: 12, stiffness: 220 } },
  { id: '26', name: 'Damped Wind Sway', category: 'Physics', description: 'Fluid aerodynamic drag wobble', animate: { rotate: [-12, 10, -6, 3, 0] }, transition: { duration: 1.2, ease: 'easeOut' } },
  { id: '27', name: 'Tractor Beam Scale', category: 'Physics', description: 'Elastic gravity center suction', animate: { scale: [0.5, 1.15, 1] }, transition: { type: 'spring', damping: 14 } },
  { id: '28', name: 'Pneumatic Cushion Drop', category: 'Physics', description: 'Air-cushioned shock-absorber land', animate: { y: [-120, 12, -4, 0] }, transition: { type: 'spring', stiffness: 180, damping: 15 } },
  { id: '29', name: 'Rapid Bounce Impact', category: 'Physics', description: 'High elastic impact rebounds', animate: { y: [0, -35, 0, -15, 0, -5, 0] }, transition: { duration: 0.9, ease: 'easeOut' } },
  { id: '30', name: 'Centrifugal Orbit Sling', category: 'Physics', description: 'Radial elastic snapback sling', animate: { rotate: [-180, 15, 0, -5, 0] }, transition: { type: 'spring', stiffness: 120 } }
];

export default function TabScreens() {
  const [selectedScreen, setSelectedScreen] = useState<'dashboard' | 'workouts' | 'goals' | 'map'>('dashboard');
  const [previewAnimKey, setPreviewAnimKey] = useState(0);
  const [currentPreset, setCurrentPreset] = useState<AnimationPreset | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Entrance' | 'Interactive' | 'Loop' | 'Physics'>('All');

  const testPreset = (preset: AnimationPreset) => {
    setCurrentPreset(preset);
    setPreviewAnimKey(prev => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden bg-[#070e0a]">
      
      {/* Scrollable left panel */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-thin relative z-10 w-full xl:max-w-4xl">
        
        {/* Banner with modern emerald branding */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none"></div>
          <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
            <AppWindow size={18} className="text-[#10B981]" />
            ACTIVE WORKSPACE ENVIRONMENT SCREENS
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xl leading-relaxed">
            All screens compiled inside your React Application. Tap on any screen tile on the right to interact, check layout constraints, or test customized animations.
          </p>
        </div>

        {/* 1. SIMULATED SCREEN MATRICES */}
        <div>
          <h3 className="text-xs uppercase font-black text-zinc-400 font-mono tracking-wider mb-3 select-none">
            Simulated In-App Screens Matrices
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'dashboard', name: 'Activity Dashboard', desc: 'Steps trend and active hour stats', icon: <Activity size={18} /> },
              { id: 'workouts', name: 'Workouts Library', desc: 'Yoga, Weights and HIIT list cards', icon: <Flame size={18} /> },
              { id: 'goals', name: 'Fitness Goals', desc: 'Concentric radial progress dials', icon: <Target size={18} /> },
              { id: 'map', name: 'Jogging GPS Map', desc: 'Simulated location coordinates pin', icon: <Map size={18} /> }
            ].map((scr) => {
              const isSelected = selectedScreen === scr.id;
              return (
                <div
                  key={scr.id}
                  onClick={() => setSelectedScreen(scr.id as any)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden select-none group flex flex-col justify-between h-28 ${
                    isSelected 
                      ? 'border-[#10B981] bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-white/[0.01]' 
                      : 'border-white/[0.05] bg-white/[0.01] hover:border-[#10B981]/30 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-[#10B981]' : 'bg-white/5 text-zinc-450'} shrink-0 group-hover:scale-105 transition`}>
                      {scr.icon}
                    </div>
                    {isSelected && (
                      <span className="text-[7.5px] px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/35 rounded text-[#10B981] font-mono uppercase tracking-widest font-black select-none">Active</span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white/90 leading-tight mt-1.5 truncate">{scr.name}</h5>
                    <p className="text-[9.5px] text-zinc-500 truncate mt-0.5">{scr.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. THE 30+ ANIMATION EXPERIENCER (BENTO GRID SELECTOR) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs uppercase font-black text-zinc-400 font-mono tracking-wider select-none">
                30+ Physics Animation Matrix
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5 select-none">Click any micro-preset to trigger high-performance Framer motion values on the phone viewport</p>
            </div>

            {/* Category Filter menu */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none font-mono shrink-0 select-none">
              {['All', 'Entrance', 'Interactive', 'Loop', 'Physics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat as any)}
                  className={`px-2.5 py-1 text-[9px] font-black rounded-md border uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategoryFilter === cat 
                      ? 'bg-emerald-500/20 text-[#10B981] border-[#10B981]/30' 
                      : 'bg-white/[0.01] text-zinc-400 border-white/[0.04] hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 select-none">
            {ANIMATION_PRESETS
              .filter(p => activeCategoryFilter === 'All' || p.category === activeCategoryFilter)
              .map((preset) => {
                const isActive = currentPreset?.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => testPreset(preset)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all relative overflow-hidden group flex flex-col justify-between min-h-[70px] ${
                      isActive 
                        ? 'border-[#10B981]/80 bg-[#10B981]/15 shadow-[0_4px_16px_rgba(16,185,129,0.12)]' 
                        : 'border-white/[0.04] bg-[#0c120e]/40 hover:bg-[#0c120e]/70 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center bg-transparent">
                      <span className="text-[7.5px] px-1.5 py-0.5 bg-black/40 text-zinc-450 rounded-md font-mono border border-white/5 uppercase font-bold leading-none">
                        {preset.category}
                      </span>
                      <Play size={8} className={`text-zinc-500 group-hover:text-emerald-400 transition-colors ${isActive ? 'text-emerald-400 scale-110' : ''}`} />
                    </div>
                    
                    <div className="mt-2.5">
                      <h4 className="text-[10.5px] font-black text-white/90 group-hover:text-[#10B981] transition-colors leading-none truncate h-4 flex items-center">
                        {preset.id}. {preset.name}
                      </h4>
                      <p className="text-[8.5px] text-zinc-500 truncate mt-0.5 leading-none">{preset.description}</p>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

      </div>

      {/* Right high-fidelity visual simulator phone preview screen */}
      <div className="w-full xl:w-[380px] shrink-0 bg-black/10 border-t xl:border-t-0 xl:border-l border-white/[0.06] backdrop-blur-xl flex flex-col justify-center items-center p-5 select-none relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="absolute top-4 left-6 text-[8px] uppercase text-zinc-500 tracking-wider font-black font-mono flex items-center gap-1.5 select-none">
          <Tv size={10} className="text-[#10B981]" />
          SCREEN PREVIEW & ANIMATOR DYNAMICS
        </div>

        <motion.div
          key={previewAnimKey}
          animate={currentPreset ? currentPreset.animate : { scale: 1, opacity: 1, y: 0, rotate: 0 }}
          transition={currentPreset ? currentPreset.transition : { duration: 0.3 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative">
            {selectedScreen === 'workouts' ? (
              <VirtualWorkoutScreen />
            ) : selectedScreen === 'goals' ? (
              <VirtualGoalsScreen />
            ) : selectedScreen === 'map' ? (
              <VirtualGeoMapScreen />
            ) : (
              <PhonePreview />
            )}
          </div>
        </motion.div>

        {/* Selected preset caption block bottom */}
        {currentPreset && (
          <div className="mt-4 p-2 px-3 rounded-lg bg-[#0d1610] border border-[#10B981]/15 shadow-md flex items-center justify-between gap-3 text-left w-[240px] select-none animate-fadeIn relative z-10">
            <div className="min-w-0">
              <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">Active Transition</span>
              <span className="text-[9.5px] font-black text-emerald-400 truncate block leading-none mt-1 font-mono">{currentPreset.name}</span>
            </div>
            <button 
              onClick={() => {
                setCurrentPreset(null);
                setPreviewAnimKey(prev => prev + 1);
              }}
              className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// VIRTUAL SCREENS FOR MULTI-SCREEN PREVIEW "sari screen show ho"
// -------------------------------------------------------------

function VirtualWorkoutScreen() {
  return (
    <div className="relative w-[256px] h-[524px] bg-[#020302] rounded-[42px] p-2.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.95)] border-[5px] border-[#101411] flex flex-col overflow-hidden">
      <div className="relative flex-1 bg-gradient-to-b from-[#060a07] via-[#020503] to-[#010201] rounded-[32px] overflow-hidden flex flex-col pt-4 pb-1.5 text-white border border-white/[0.03]">
        {/* Screen Header */}
        <div className="flex justify-between items-center px-3 pt-1 pb-1.5 shrink-0 select-none">
          <h4 className="text-[8.5px] font-black tracking-widest text-[#10B981] uppercase font-mono">WORKOUT ROUTINES</h4>
          <span className="text-[7.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">Sync</span>
        </div>

        {/* Workout list library */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3.5 scrollbar-none text-left">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-550/15 to-transparent rounded-full blur-xl" />
            <span className="text-[7px] text-emerald-450 font-bold uppercase tracking-widest font-mono">Intensity Max</span>
            <h3 className="text-sm font-black text-white leading-none mt-1">High Intensity Calisthenics</h3>
            <p className="text-[9px] text-zinc-450 mt-1 leading-normal">Cardio focus, speed-endurance sets, bodyweight strength circuits.</p>
            <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-white/[0.04]">
              <div>
                <span className="text-white font-mono text-[10.5px] font-black">45<span className="text-[8px] text-zinc-550 font-bold">min</span></span>
                <span className="text-[6.5px] text-zinc-500 block uppercase font-mono mt-0.5">Duration</span>
              </div>
              <div className="border-l border-white/[0.04] pl-3">
                <span className="text-emerald-400 font-mono text-[10.5px] font-black">480<span className="text-[8px] opacity-70">Cal</span></span>
                <span className="text-[6.5px] text-zinc-500 block uppercase font-mono mt-0.5">Est. Burn</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[7.5px] text-zinc-500 font-black tracking-widest uppercase block font-mono">ALL EXERCISES</span>
            
            {[
              { title: 'Core Burning Abs Control', level: 'Intermediate', time: '18 min', xp: '+120 XP' },
              { title: 'Upper Body Blast Weights', level: 'Advanced', time: '30 min', xp: '+250 XP' },
              { title: 'Relaxing Deep Vinyasa Flow', level: 'Beginner', time: '15 min', xp: '+80 XP' }
            ].map((workout, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] flex items-center justify-between gap-2.5 cursor-pointer hover:border-emerald-500/10 transition-all">
                <div>
                  <h5 className="text-[10px] font-black text-white/90 leading-tight">{workout.title}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[7.5px] text-zinc-500 font-mono">{workout.level}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-[7.5px] text-zinc-500 font-mono">{workout.time}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[8px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/15">{workout.xp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global tab simulator footer */}
        <div className="flex justify-around items-center pt-2 pb-1 bg-white/[0.01] border-t border-white/[0.04] shrink-0 select-none">
          <span className="text-[7.5px] text-emerald-400 flex items-center gap-1 font-mono font-black"><Flame size={9} /> Workout Hub</span>
        </div>
      </div>
    </div>
  );
}

function VirtualGoalsScreen() {
  return (
    <div className="relative w-[256px] h-[524px] bg-[#020302] rounded-[42px] p-2.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.95)] border-[5px] border-[#101411] flex flex-col overflow-hidden">
      <div className="relative flex-1 bg-gradient-to-b from-[#060a07] via-[#020503] to-[#010201] rounded-[32px] overflow-hidden flex flex-col pt-4 pb-1.5 text-white border border-white/[0.03]">
        {/* Screen Header */}
        <div className="flex justify-between items-center px-3 pt-1 pb-1.5 shrink-0 select-none">
          <h4 className="text-[8.5px] font-black tracking-widest text-[#10B981] uppercase font-mono">GOAL COMPILATION</h4>
          <span className="text-[7.5px] font-bold text-[#10B981] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">Sync</span>
        </div>

        {/* Goals content */}
        <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-4 scrollbar-none text-left">
          <div className="flex flex-col items-center py-4 bg-white/[0.01] rounded-2xl border border-white/[0.04]">
            {/* SVG concentric rings */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="8" strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round" className="opacity-80" />
                
                <circle cx="50" cy="50" r="28" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
                <circle cx="50" cy="50" r="28" fill="transparent" stroke="#059669" strokeWidth="8" strokeDasharray="175" strokeDashoffset="45" strokeLinecap="round" className="opacity-90" />
              </svg>
              <div className="absolute text-center select-none">
                <span className="text-[17px] font-black text-white tracking-tight font-sans">74<span className="text-[10px] text-zinc-500 font-bold">%</span></span>
                <span className="text-[7px] text-zinc-400 block uppercase font-mono font-medium leading-none mt-0.5">Overall</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 w-full px-4 text-center">
              <div>
                <span className="text-white font-mono text-xs font-black">7,480 / 10k</span>
                <span className="text-[7px] text-zinc-500 block uppercase font-mono mt-0.5">Step target</span>
              </div>
              <div>
                <span className="text-[#10B981] font-mono text-xs font-black">320 / 400</span>
                <span className="text-[7px] text-zinc-500 block uppercase font-mono mt-0.5">Kcal target</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pb-2">
            <span className="text-[7.5px] text-zinc-550 font-black tracking-widest uppercase block font-mono">COMPLETED TARGETS</span>
            
            {[
              { task: '60 min Aerobic Cardio Loop', xp: '+300 XP', done: true },
              { task: 'Interstellar Water Intake 4 Litres', xp: '+100 XP', done: true },
              { task: 'Consistent Sleep window > 8 hours', xp: '+150 XP', done: false }
            ].map((itm, idx) => (
              <div key={idx} className="p-2 bg-white/[0.01] border border-white/[0.03] rounded-lg flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${itm.done ? 'bg-emerald-400/20 border-[#10B981] text-emerald-450' : 'border-zinc-700 text-transparent'}`}>
                    {itm.done && <span className="text-[6.5px] font-black">✔</span>}
                  </div>
                  <span className="text-[9.5px] text-zinc-200 select-none truncate max-w-[130px] font-bold">{itm.task}</span>
                </div>
                <span className="text-[7.5px] font-mono text-[#10B981] font-black shrink-0">{itm.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global tab simulator footer */}
        <div className="flex justify-around items-center pt-2 pb-1 bg-white/[0.01] border-t border-white/[0.04] shrink-0 select-none">
          <span className="text-[7.5px] text-emerald-450 flex items-center gap-1 font-mono font-black"><Target size={9} /> Goals Matrix</span>
        </div>
      </div>
    </div>
  );
}

function VirtualGeoMapScreen() {
  return (
    <div className="relative w-[256px] h-[524px] bg-[#020302] rounded-[42px] p-2.5 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.95)] border-[5px] border-[#101411] flex flex-col overflow-hidden">
      <div className="relative flex-1 bg-gradient-to-b from-[#060a07] via-[#020503] to-[#010201] rounded-[32px] overflow-hidden flex flex-col pt-4 pb-1.5 text-white border border-white/[0.03]">
        {/* Screen Header */}
        <div className="flex justify-between items-center px-3 pt-1 pb-1.5 shrink-0 select-none relative z-10 bg-[#080d09]/65 backdrop-blur-sm">
          <h4 className="text-[8.5px] font-black tracking-widest text-emerald-400 uppercase font-mono">GPS COORDINATES</h4>
          <span className="text-[7.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span> Live Pin
          </span>
        </div>

        {/* Map view top boundaries */}
        <div className="flex-1 relative overflow-hidden flex flex-col justify-end text-left">
          <div className="absolute inset-0 bg-black/50">
            <svg className="w-full h-full opacity-35" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid-pattern-map" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-map)" />
              <path d="M 10 90 C 20 60, 40 70, 50 40 C 60 10, 80 20, 90 10" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="50" cy="40" r="5" fill="#10B981" className="animate-ping" />
              <circle cx="50" cy="40" r="3" fill="#ffffff" stroke="#10B981" strokeWidth="1" />
            </svg>
          </div>

          {/* Floating overlay stats box */}
          <div className="relative z-10 p-3.5 m-3 rounded-xl bg-black/80 backdrop-blur-md border border-[#10B981]/15 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[8.5px] font-mono text-emerald-405 uppercase tracking-wide font-black">Jogging Path active</span>
              <span className="text-[8px] text-zinc-500 font-mono font-bold">Signal strong</span>
            </div>
            
            <div className="grid grid-cols-3 gap-0.5 text-center pt-1 border-t border-white/[0.04]">
              <div>
                <span className="text-zinc-100 font-mono text-[10.5px] font-black">3.48<span className="text-[7.5px] text-zinc-550 font-bold font-mono">km</span></span>
                <span className="text-[6px] text-zinc-500 block uppercase font-mono leading-none mt-0.5">Distance</span>
              </div>
              <div className="border-x border-white/[0.04] px-1">
                <span className="text-white font-mono text-[10.5px] font-black">5'12"<span className="text-[7px] text-zinc-550 font-mono">/k</span></span>
                <span className="text-[6px] text-zinc-500 block uppercase font-mono leading-none mt-0.5">Avg Pace</span>
              </div>
              <div>
                <span className="text-emerald-400 font-mono text-[10.5px] font-black">18:42</span>
                <span className="text-[6px] text-zinc-500 block uppercase font-mono leading-none mt-0.5">Duration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global tab simulator footer */}
        <div className="flex justify-around items-center pt-2 pb-1 bg-white/[0.01] border-t border-white/[0.04] shrink-0 select-none">
          <span className="text-[7.5px] text-emerald-450 flex items-center gap-1 font-mono font-black"><Map size={9} /> GPS Tracking</span>
        </div>
      </div>
    </div>
  );
}
