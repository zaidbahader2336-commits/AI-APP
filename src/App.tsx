import React, { useState, FormEvent, TouchEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Plus, 
  Globe, 
  MoreHorizontal, 
  AudioLines, 
  ArrowUp, 
  Sparkle, 
  Boxes, 
  Activity, 
  Contrast, 
  Sun,
  Laptop,
  Check,
  Search,
  Code2,
  Cpu,
  Zap,
  Play,
  ChevronRight,
  LayoutGrid, 
  Layout, 
  Code, 
  Puzzle, 
  Database, 
  GitBranch, 
  Settings, 
  Send, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  Shield,
  BadgeCheck,
  Bot,
  LogOut,
  AppWindow,
  Menu,
  X,
  Home
} from 'lucide-react';

// Import our custom subtabs
import TabDashboard from './components/TabDashboard';
import TabScreens from './components/TabScreens';
import TabCodeEditor from './components/TabCodeEditor';
import TabComponents from './components/TabComponents';
import TabDatabase from './components/TabDatabase';
import TabSecurity from './components/TabSecurity';

import PlusMenu from './components/PlusMenu';
import VoiceSTT from './components/VoiceSTT';
import LoginModal from './components/LoginModal';
import ShowcaseSection from './components/ShowcaseSection';
import MyProjectsDrawer, { UserProject } from './components/MyProjectsDrawer';

// @ts-ignore
import bgImage from './assets/images/cave_moon_background_1780298528427.png';
import { auth } from './lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  seedDefaultDbData, 
  getUserProjectsFromDb, 
  createUserProjectInDb, 
  deleteUserProjectFromDb 
} from './lib/projectsService';

import { TabKey, WorkspaceData } from './types';

export default function App() {
  // Global Workspace toggle state
  const [showWorkspace, setShowWorkspace] = useState(false);

  // Welcome Screen states
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Custom interactive system parameters
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPromptFocused, setIsPromptFocused] = useState(false);

  // Touch swipe gesture states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Local storage persisted portfolio state
  const [projects, setProjects] = useState<UserProject[]>([]);

  // Workspace subtab selection keys and components state
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Applet workspace state context
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
    title: "Fitness Mate Companion",
    techStack: ["React v19", "Tailwind v4", "Lucide Icons"],
    previewHeaderTitle: "FITNESS TRACKER",
    previewWidgets: [
      {
        type: "chart",
        title: "Daily Steps Progress",
        metricValue: "8,420",
        metricLabel: "Steps Counted",
        lineData: [
          { hour: "08:00", value: 1200, steps: "1,200", kcal: 80, active: "10m", y: 65 },
          { hour: "10:05", value: 3200, steps: "3,200", kcal: 160, active: "18m", y: 55 },
          { hour: "12:00", value: 5800, steps: "5,800", kcal: 260, active: "25m", y: 38 },
          { hour: "14:10", value: 8420, steps: "8,420", kcal: 320, active: "30m", y: 25 },
          { hour: "16:15", value: 11207, steps: "11,207", kcal: 482, active: "42m", y: 12 },
          { hour: "18:00", value: 13100, steps: "13,100", kcal: 560, active: "51m", y: 5 }
        ],
        metrics: [
          { label: "Steps count", value: "8,420" },
          { label: "KCAL", value: "320" },
          { label: "ACTIVE STATUS", value: "45 min" }
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
    ],
    sampleUsers: [
      { id: 1, email: "colleon@gmail.com", name: "John", role: "User", profile_picture_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40", created_at: "2023-01-08 14:22" },
      { id: 2, email: "coskak@gmail.com", name: "Mark", role: "Developer", profile_picture_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=40&h=40", created_at: "2023-09-05 10:15" },
      { id: 3, email: "hhane@gmail.com", name: "Jarem", role: "Product", profile_picture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40", created_at: "2023-09-19 11:45" }
    ],
    sampleProducts: [
      { id: "1", title: "Premium Yoga Mat", sku: "YOGA-MAT-001", price: "$49.99", category: "Gear" },
      { id: "2", title: "Carbon Dumbbells set", sku: "DB-SET-050", price: "$129.99", category: "Strength" }
    ],
    sampleOrders: [
      { id: "O-1004", user_id: "1", date: "2023-11-01", total: "$49.99", status: "Fulfilled" },
      { id: "O-1005", user_id: "2", date: "2023-11-03", total: "$129.99", status: "Shipped" }
    ],
    securityChecks: [
      { id: "sec-1", name: "Vulnerability Scan", status: "passed", message: "No issues found", category: "Code Analysis" },
      { id: "sec-2", name: "SSL Certificate", status: "passed", message: "Active & valid", category: "Network" },
      { id: "sec-3", name: "SQL Injection Protection", status: "passed", message: "Active", category: "Database Rules" }
    ],
    activeCode: `
import { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function App() {
  const [steps, setSteps] = useState(8420);
  return (
    <div className="bg-[#0c120e] text-white p-6 rounded-2xl border border-emerald-500/10 min-h-[400px]">
      <h3 className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">Active Companion</h3>
      <h1 className="text-2xl font-black mt-2 font-sans">Daily Companion OS</h1>
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
        <span className="text-zinc-400 text-xs text-left block">Logged Today:</span>
        <div className="text-3xl font-black text-[#10B981] mt-1 font-mono">{steps} Steps</div>
      </div>
    </div>
  );
}
`
  });
  
  // Real-time canvas components added dynamically by the user
  const [dynamicComponents, setDynamicComponents] = useState<{ id: string; type: string; label: string }[]>([]);

  // Publish deployment modal indicators
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentDone, setDeploymentDone] = useState(false);

  // Synchronize local state with Firebase Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || 'guest_architect@erere.io');
        
        // Seed default template blueprints and main landing showcase cards
        await seedDefaultDbData();

        // Retrieve saved user-specific blueprints from Firestore
        try {
          const dbItems = await getUserProjectsFromDb(user.uid);
          if (dbItems.length > 0) {
            setProjects(dbItems);
          } else {
            // First run migration: seed default tracker card
            const initialList: UserProject[] = [
              {
                id: 'fintech-ledger-local',
                title: 'Enterprise Portfolio Tracker',
                prompt: 'a flawless multi-currency transaction tracker featuring responsive custom micro-charts and secure JWT sessions',
                createdAt: 'Jun 1, 2026',
                status: 'Ready',
                techStack: ['React', 'Tailwind', 'Recharts'],
                viewsCount: 16
              }
            ];
            setProjects(initialList);
            await createUserProjectInDb(initialList[0], user.uid);
          }
        } catch (dbErr) {
          console.error("Firestore sync error: ", dbErr);
        }
      } else {
        // Automatically sign in anonymously to satisfy secure firestore rules
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn("Firebase anonymous authentication failed: ", authErr);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const saveProjects = (updatedList: UserProject[]) => {
    setProjects(updatedList);
    localStorage.setItem('erere_studio_blueprints', JSON.stringify(updatedList));
  };

  const chips = [
    { label: 'Saas app', promptText: 'a modern SaaS dashboard with analytical real-time data charts' },
    { label: 'E-commerce', promptText: 'a premium minimalist e-commerce clothing store with Apple-like aesthetics' },
    { label: 'Agency', promptText: 'a brutalist agency landing page with rich typing interactions' },
    { label: 'Marketplace', promptText: 'a peer-to-peer equipment rental marketplace with booking schedules' }
  ];

  const handleChipClick = (text: string) => {
    setPrompt((prev) => (prev ? `${prev} & ${text}` : `Build ${text}`));
  };

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= 2) {
          clearInterval(interval);
          return 2;
        }
        return prev + 1;
      });
    }, 1500);

    // Dynamic generation from our Express + Gemini system
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    })
    .then((res) => {
       if (!res.ok) throw new Error("Compiler fetch unsuccessful.");
       return res.json();
    })
    .then((data) => {
       clearInterval(interval);
       setGenerationStep(3);
       setWorkspaceData({
         title: data.title || "Custom AI App",
         techStack: data.techStack || ["React", "Tailwind v4"],
         previewHeaderTitle: data.previewHeaderTitle || "MY OS",
         previewWidgets: data.previewWidgets || [],
         sampleUsers: data.sampleUsers || [],
         sampleProducts: data.sampleProducts || [],
         sampleOrders: data.sampleOrders || [],
         securityChecks: data.securityChecks || [],
         activeCode: data.activeCode || ""
       });
    })
    .catch((err) => {
       console.warn("Direct compiler bypassed, using local high-fidelity sandbox context.", err);
       setTimeout(() => {
         clearInterval(interval);
         setGenerationStep(3);
       }, 1200);
    });
  };

  const currentStepMessage = () => {
    switch (generationStep) {
      case 0: return 'Analyzing prompt semantics and architectural patterns...';
      case 1: return 'Building database schemas and serverless modules...';
      case 2: return 'Generating high-fidelity React frontend components with Tailwind...';
      case 3: return 'App structure successfully compiled! Ready to preview.';
      default: return 'Initializing...';
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isRightSwipe) {
      setIsDrawerOpen(true);
    }
    if (isLeftSwipe) {
      setIsDrawerOpen(false);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Appends component trigger inside Workspace canvas
  const handleAddComponent = (type: string, label: string) => {
    const nextElem = {
      id: `${type}-${Date.now()}`,
      type,
      label
    };
    setDynamicComponents((prev) => [...prev, nextElem]);
  };

  // Removes component trigger inside Workspace canvas
  const handleRemoveComponent = (id: string) => {
    setDynamicComponents((prev) => prev.filter((item) => item.id !== id));
  };

  // Triggers mock compile and publish pipeline inside Workspace
  const triggerPublishPipeline = () => {
    setShowPublishModal(true);
    setIsDeploying(true);
    setDeploymentDone(false);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentDone(true);
    }, 2200);
  };

  // Returns Workspace top bar title
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Workflow Dashboard';
      case 'screens': return 'Active Mobile Screens';
      case 'code': return 'App Code Editor';
      case 'components': return 'UI Component Catalogue';
      case 'database': return 'Relational Database';
      case 'security': return 'Security Suite';
      default: return 'Studio Workspace';
    }
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="min-h-screen bg-[#070e0a] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 w-full overflow-x-hidden flex"
    >
      
      {/* Dynamic welcome/workspace layout toggling */}
      {!showWorkspace ? (
        
        // ==========================================
        // 1. THE ERERE DESIGNER WELCOME LANDING CARD
        // ==========================================
        <div className="relative w-full overflow-hidden flex flex-col min-h-screen">
          
          {/* Background Artwork - slow breathe moon backdrop */}
          <div className="absolute top-0 left-0 w-full h-[95vh] md:h-[110vh] overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#070e0a] via-transparent to-black/45 z-10" />
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/60 to-transparent z-10" />
            <motion.img 
              src={bgImage} 
              alt="Dreamy cave overlooking starry green moonlit sky" 
              className="w-full h-full object-cover origin-top opacity-85"
              referrerPolicy="no-referrer"
              animate={{
                scale: [1.01, 1.05, 1.01],
                y: [0, -6, 0]
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Prompt compilation progress modal overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="bg-zinc-950 border border-emerald-500/20 max-w-lg w-full rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-shimmer" />
                  
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                      <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Erere Compiler Engine</h4>
                      <p className="text-xs text-zinc-500">Formulating active blueprint parameters</p>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 font-mono text-xs text-zinc-400 min-h-[140px] flex flex-col justify-between">
                    <div>
                      <div className="text-zinc-500 mb-2">// Active Workspace Prompt:</div>
                      <div className="text-emerald-300 italic mb-4 line-clamp-2">"{prompt}"</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] text-zinc-500">
                        <span>COMPILING NODE</span>
                        <span>{Math.round((generationStep + 1) * 25)}%</span>
                      </div>
                      
                      {/* Active green loading line */}
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-400"
                          initial={{ width: '0%' }}
                          animate={{ width: `${(generationStep + 1) * 25}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      <p className="text-[11px] text-emerald-400 animate-pulse flex items-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-ping" />
                        {currentStepMessage()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3 text-xs font-medium">
                    <button
                      onClick={() => setIsGenerating(false)}
                      className="px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      Bypass
                    </button>
                    {generationStep === 3 && (
                      <motion.button
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        onClick={() => {
                          setIsGenerating(false);
                          
                          // Process variables to construct a fresh project card
                          const rawTitle = prompt.length > 30 ? prompt.substring(0, 27) + "..." : prompt;
                          const stackOptions: string[] = ['React v19', 'Tailwind v4'];
                          const lp = prompt.toLowerCase();
                          if (lp.includes('dash') || lp.includes('chart') || lp.includes('analyt')) {
                            stackOptions.push('Recharts');
                          }
                          if (lp.includes('e-com') || lp.includes('store') || lp.includes('pay') || lp.includes('stripe')) {
                            stackOptions.push('Stripe SDK');
                          }
                          if (lp.includes('database') || lp.includes('model') || lp.includes('row')) {
                            stackOptions.push('Cloud DB');
                          }
                          if (lp.includes('gemini') || lp.includes('ai') || lp.includes('agent')) {
                            stackOptions.push('Gemini OS');
                          }
                          if (stackOptions.length === 2) {
                            stackOptions.push('Core Hub');
                          }

                          const createdProj: UserProject = {
                            id: "user-app-" + Date.now(),
                            title: rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1),
                            prompt: prompt,
                            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            status: 'Ready',
                            techStack: stackOptions,
                            viewsCount: Math.floor(Math.random() * 8) + 1
                          };

                          const currentList = [createdProj, ...projects];
                          saveProjects(currentList);

                          // Sync to Firestore inside anonymous backend
                          if (auth.currentUser) {
                            createUserProjectInDb(createdProj, auth.currentUser.uid).catch(err => {
                              console.error("Firestore persistence failed:", err);
                            });
                          }
                          
                          // Launch straight to Workspace
                          setShowWorkspace(true);
                          setActiveTab('dashboard');
                        }}
                        className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition flex items-center space-x-1 cursor-pointer font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                      >
                        <span>Launch Workspace Preview</span>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ambient over-glow */}
          <div className="absolute top-0 left-0 w-full h-[100vh] ambient-glow z-1 pointer-events-none" />

          {/* --- LANDING HEADER --- */}
          <header className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-30 select-none">
            
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <span className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm group-hover:bg-emerald-500/30 transition-all duration-300" />
                <div className="relative w-5 h-5 border-2 border-emerald-400/80 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
                  <div className="absolute w-[3px] h-[3px] bg-emerald-400 rounded-full -top-1" />
                  <div className="absolute w-[3px] h-[3px] bg-emerald-400 rounded-full -bottom-1" />
                </div>
              </div>
              <span className="font-semibold text-lg text-white tracking-tight">Erere</span>
            </div>

            {/* Navigation options */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-zinc-300 text-[13.5px] font-medium">
              {[
                { label: 'Products', hasMenu: true },
                { label: 'For work', hasMenu: true },
                { label: 'Resources', hasMenu: true },
                { label: 'Pricing', hasMenu: false },
                { label: 'Careers', hasMenu: false }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="relative"
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition duration-150 cursor-pointer">
                    <span>{item.label}</span>
                    {item.hasMenu && <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
                  </button>
                  
                  {hoveredNav === item.label && item.hasMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-zinc-950/95 border border-zinc-800 rounded-lg p-2 shadow-2xl backdrop-blur-md"
                    >
                      <div className="px-3 py-1.5 text-xs text-emerald-500 font-mono uppercase tracking-wider font-extrabold">Studio Options</div>
                      <button 
                        onClick={() => { setShowWorkspace(true); setActiveTab('code'); }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-xs hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        Code Workspaces
                      </button>
                      <button 
                        onClick={() => { setShowWorkspace(true); setActiveTab('screens'); }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-xs hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        Active Previews
                      </button>
                      <button 
                        onClick={() => { setShowWorkspace(true); setActiveTab('database'); }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-xs hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        Database Management
                      </button>
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            {/* Profile trigger / Login option */}
            <div className="flex items-center space-x-3">
              {userEmail ? (
                <div className="flex items-center space-x-3 bg-zinc-950/70 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-lg select-none">
                  <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center text-[10px] font-bold text-zinc-950 uppercase">
                    {userEmail[0]}
                  </div>
                  <span className="text-xs text-emerald-300 font-medium max-w-[90px] truncate">
                    {userEmail.split('@')[0]}
                  </span>
                  <div className="h-3 w-[1px] bg-zinc-800" />
                  <button 
                    onClick={() => { setShowWorkspace(true); }}
                    className="text-[10px] text-emerald-400 hover:text-emerald-200 transition font-mono uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Workspace
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="text-zinc-400 hover:text-white text-[13.5px] font-medium transition cursor-pointer"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="px-4 py-1.5 rounded-full border border-zinc-800 text-zinc-300 text-[13.5px] font-medium transition bg-zinc-900/60 hover:border-emerald-500/40 hover:text-emerald-300 cursor-pointer"
                  >
                    Join Studio
                  </button>
                </>
              )}

              {/* Direct Workspace Launch Button in Header */}
              <button 
                onClick={() => setShowWorkspace(true)}
                className="px-4 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-[12px] transition shadow-[0_0_12px_rgba(52,211,153,0.25)] flex items-center gap-1 cursor-pointer scale-95"
              >
                <span>Launch Studio</span> <ChevronRight size={12} />
              </button>
            </div>
          </header>

          {/* --- HERO DESCRIPTION AND PROMPT CONTAINER --- */}
          <main className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-16 sm:pt-24 pb-8 flex flex-col items-center justify-center text-center">
            
            <h1 className="text-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.2] text-white select-none max-w-3xl">
              <motion.span 
                initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Build apps and websites
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="block text-zinc-300 mt-1 font-serif-inst"
              >
                faster with <span className="italic font-light text-emerald-400 relative inline-block px-1 select-text transition-colors duration-300 hover:text-emerald-300">AI-powered tooling</span>
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-zinc-400 font-light text-base sm:text-lg max-w-xl"
            >
              Turn ideas into functional apps — in minutes — no coding experience needed
            </motion.p>

            <AnimatePresence mode="wait">
              {isVoiceActive ? (
                <VoiceSTT 
                  onCancel={() => setIsVoiceActive(false)}
                  onConfirm={(transcriptText) => {
                    setPrompt((prev) => prev ? `${prev} ${transcriptText}` : transcriptText);
                    setIsVoiceActive(false);
                  }}
                />
              ) : (
                <motion.form 
                  onSubmit={handleGenerate}
                  initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    boxShadow: isPromptFocused 
                      ? '0 0 35px rgba(16, 185, 129, 0.22), 0 15px 35px -5px rgba(0,0,0,0.85)' 
                      : '0 15px 30px -5px rgba(0,0,0,0.6)'
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full max-w-3xl mt-12 mb-10 bg-zinc-950/85 border p-5 rounded-[26px] sm:rounded-[32px] backdrop-blur-md flex flex-col justify-between relative z-30 transition-colors duration-300 ${
                    isPromptFocused ? 'border-emerald-500/40' : 'border-white/10'
                  }`}
                >
                  {/* Textarea */}
                  <div className="relative w-full text-left">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onFocus={() => setIsPromptFocused(true)}
                      onBlur={() => setIsPromptFocused(false)}
                      placeholder="Build anything that..."
                      rows={2}
                      className="w-full bg-transparent text-white placeholder-zinc-550 text-base leading-relaxed resize-none focus:outline-none focus:ring-0 pr-10 border-none"
                      style={{ caretColor: '#10b981' }}
                    />
                    {prompt && (
                      <button 
                        type="button" 
                        onClick={() => setPrompt('')} 
                        className="absolute right-0 top-1 text-zinc-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/5 mt-4">
                    
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none">
                      
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsPlusMenuOpen(!isPlusMenuOpen);
                          }}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition active:scale-95 shrink-0 cursor-pointer ${
                            isPlusMenuOpen 
                              ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/40'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <AnimatePresence>
                          {isPlusMenuOpen && (
                            <div className="absolute bottom-9 left-0 z-50">
                              <PlusMenu 
                                onSelectOption={(textOption) => {
                                  setPrompt((prev) => prev ? `${prev} & ${textOption}` : `Build ${textOption}`);
                                }}
                                onClose={() => setIsPlusMenuOpen(false)}
                              />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Chips */}
                      {chips.map((chip, idx) => (
                        <motion.button
                          key={idx}
                          type="button"
                          onClick={() => handleChipClick(chip.promptText)}
                          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 0.35 + (idx * 0.08), 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          whileHover={{ 
                            scale: 1.05, 
                            borderColor: 'rgba(16, 185, 129, 0.45)', 
                            backgroundColor: 'rgba(24, 24, 27, 0.8)',
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)'
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="h-7 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11.5px] hover:text-white transition-all cursor-pointer shrink-0"
                        >
                          {chip.label}
                        </motion.button>
                      ))}

                      <div className="flex items-center space-x-1.5 pl-1 shrink-0">
                        <Globe className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 transition cursor-pointer" />
                        <MoreHorizontal className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 transition cursor-pointer" />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsVoiceActive(true)}
                        className="relative flex items-center space-x-2 bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-zinc-800/80 cursor-pointer hover:bg-zinc-800 hover:border-emerald-500/40 transition duration-150 active:scale-95 overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-emerald-500/5 rounded-lg pointer-events-none origin-center"
                          animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-2 h-2 rounded-full bg-emerald-400/45 animate-ping" />
                          <AudioLines className="w-3.5 h-3.5 text-emerald-400 relative z-10" />
                        </div>
                        
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wider relative z-10">AUDIO INPUT</span>
                      </button>

                      <button 
                        type="submit"
                        disabled={!prompt.trim()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          prompt.trim() 
                            ? 'bg-emerald-400 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 hover:bg-emerald-300' 
                            : 'bg-zinc-850 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>

                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </main>

          {/* Left slide out Project Drawer Trigger */}
          <div 
            onClick={() => setIsDrawerOpen(true)}
            className="fixed left-0 top-[40%] -translate-y-1/2 z-40 bg-zinc-950/95 hover:bg-[#121612] border-y border-r border-emerald-500/10 w-7.5 h-14 flex flex-col items-center justify-center rounded-r-xl shadow-xl cursor-pointer group transition-all duration-200 select-none hover:w-9"
            title="Browse App Blueprints"
          >
            <div className="flex flex-col space-y-1 w-3.5 items-center">
              <span className="h-[1.5px] w-3 bg-zinc-400 group-hover:bg-emerald-400 group-hover:w-3.5 rounded-full transition-all"></span>
              <span className="h-[1.5px] w-2.5 bg-zinc-400 group-hover:bg-white group-hover:w-3.5 rounded-full transition-all"></span>
              <span className="h-[1.5px] w-3 bg-zinc-400 group-hover:bg-emerald-400 group-hover:w-3.5 rounded-full transition-all"></span>
            </div>
          </div>

          {/* Community Blueprints showcases */}
          <ShowcaseSection onSelectProject={(selectedPrompt) => {
            setPrompt(selectedPrompt);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }} />

          <footer className="w-full bg-zinc-950/20 py-8 px-6 mt-auto text-center border-t border-zinc-900/40 text-xs text-zinc-500 z-10 flex items-center justify-center">
            <span className="mr-2">Powering Cloud AI Studio Code compilers</span>
            <div className="w-1.5 h-1.5 bg-emerald-500/45 rounded-full animate-pulse" />
          </footer>

          {/* Core modals */}
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)}
            onSuccess={(email) => setUserEmail(email)}
          />

          <MyProjectsDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            projects={projects}
            onDeleteProject={async (id) => {
              const list = projects.filter(p => p.id !== id);
              saveProjects(list);
              if (auth.currentUser) {
                try {
                  await deleteUserProjectFromDb(id, auth.currentUser.uid);
                } catch (err) {
                  console.error("Firestore project deletion failed:", err);
                }
              }
            }}
            onSelectProject={(selectedPrompt) => {
              setPrompt(selectedPrompt);
              setIsDrawerOpen(false);
            }}
          />

        </div>

      ) : (

        // ===================================
        // 2. THE HIGH-FIDELITY STUDIO WORKSPACE (EMERALD-DARK THEME)
        // ===================================
        <div className="w-full h-screen bg-[#070e0a] text-zinc-100 flex overflow-hidden select-none selection:bg-emerald-500/30 selection:text-emerald-300 relative flex-1 animate-fadeIn">
          
          {/* Subtle environmental emerald back lights */}
          <div className="absolute top-[-10%] left-[5%] w-[45%] h-[40%] rounded-full bg-[radial-gradient(ellipse_at_top_left,#059669,transparent_65%)] opacity-10 pointer-events-none blur-[140px] z-0"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[45%] rounded-full bg-[radial-gradient(ellipse_at_bottom_right,#10b981,transparent_70%)] opacity-8 pointer-events-none blur-[150px] z-0"></div>

          {/* Adaptive Mobile Backdrop overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/75 backdrop-blur-md z-30 md:hidden"
              />
            )}
          </AnimatePresence>

          {/* PHYSICAL CONTROL SIDEBAR */}
          <aside className={`fixed inset-y-0 left-0 w-[220px] shrink-0 bg-[#070e0a]/90 backdrop-blur-xl border-r border-white/[0.06] flex flex-col justify-between select-none z-40 transition-all duration-300 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div>
              {/* Logo Brand Header */}
              <div className="px-5 py-4 h-14 flex items-center justify-between border-b border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#10B981] to-[#047857] rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/35 shrink-0 relative overflow-hidden group">
                    <AppWindow size={15} className="text-white relative z-10 font-bold" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-350 block">BUILDCRAFT</span>
                    <span className="text-[8.5px] text-zinc-400 font-mono tracking-widest block uppercase">AI ENGINE v1</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
     
              {/* Sidebar Menu selections */}
              <nav className="p-3 space-y-1.5">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={13} /> },
                  { id: 'screens', label: 'Screens', icon: <Layout size={13} /> },
                  { id: 'code', label: 'Code Buffer', icon: <Code size={13} /> },
                  { id: 'components', label: 'Components', icon: <Puzzle size={13} /> },
                  { id: 'database', label: 'Database', icon: <Database size={13} /> },
                  { id: 'security', label: 'Security', icon: <Shield size={13} /> },
                ].map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as TabKey);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 text-left cursor-pointer relative ${
                        isSelected 
                          ? 'bg-[#10B981]/10 text-emerald-400 border-l-2 border-[#10B981] shadow-md' 
                          : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className={isSelected ? 'text-[#10B981]' : 'text-zinc-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {isSelected && (
                        <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
     
            {/* Nav footer and actions */}
            <div className="p-3 border-t border-white/[0.05] bg-white/[0.005] space-y-2 select-none">
              
              {/* Back to welcome launcher */}
              <button 
                onClick={() => {
                  setShowWorkspace(false);
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Home size={13} className="text-zinc-500" />
                <span>Go to Welcome Screen</span>
              </button>

              <button
                onClick={triggerPublishPipeline}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black text-xs rounded-lg transition-all duration-300 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 border border-white/5"
              >
                <Send size={11} className="stroke-[2.5]" />
                <span>Publish App</span>
              </button>
            </div>
          </aside>
     
          {/* MAIN PREVIEW PANEL WORKSPACE */}
          <main className="flex-grow flex flex-col min-w-0 h-full overflow-hidden relative z-10 animate-scaleUp">
            
            {/* Top Workspace Header */}
            <header className="h-14 shrink-0 bg-[#070e0a]/80 backdrop-blur-md border-b border-white/[0.05] flex justify-between items-center px-4 md:px-6 select-none shadow-xl relative z-10">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden mr-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-all"
                >
                  <Menu size={16} />
                </button>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  {getHeaderTitle()} 
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></span>
                </h1>
              </div>

              {/* Badges indicators */}
              <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
                
                <span className="text-[10px] font-semibold text-[#10B981] border border-[#10B981]/25 rounded px-2 py-0.5 bg-[#10B981]/10 font-mono whitespace-nowrap hidden sm:inline-block">
                  Studio Live v1
                </span>

                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded text-[10.5px] font-bold text-emerald-400 select-none">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_#10B981]" />
                  <span>Staging Compiler active</span>
                </div>

              </div>
            </header>

            {/* Subtab Canvas loaders */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  className="flex-grow flex flex-col min-h-0 overflow-hidden"
                >
                  {activeTab === 'dashboard' && (
                    <TabDashboard 
                      dynamicComponents={dynamicComponents} 
                      onAddComponent={handleAddComponent} 
                      onRemoveComponent={handleRemoveComponent} 
                      onSwitchTab={(tab) => setActiveTab(tab)}
                      activeApp={workspaceData}
                      updateActiveApp={setWorkspaceData}
                    />
                  )}
                  {activeTab === 'screens' && <TabScreens />}
                  {activeTab === 'code' && <TabCodeEditor activeApp={workspaceData} />}
                  {activeTab === 'components' && (
                    <TabComponents 
                      dynamicComponents={dynamicComponents} 
                      onAddComponent={handleAddComponent} 
                      onRemoveComponent={handleRemoveComponent} 
                    />
                  )}
                  {activeTab === 'database' && <TabDatabase activeApp={workspaceData} />}
                  {activeTab === 'security' && <TabSecurity activeApp={workspaceData} />}
                </motion.div>
              </AnimatePresence>
            </div>

          </main>

          {/* Deployment Publisher details popup */}
          {showPublishModal && (
            <div className="fixed inset-0 bg-[#070e0a]/85 backdrop-blur-lg flex items-center justify-center z-50 p-4">
              <div className="max-w-md w-full bg-zinc-950 border border-white/[0.08] rounded-[24px] shadow-[0_15px_50px_rgba(0,0,0,0.8)] p-7 relative overflow-hidden flex flex-col items-center text-center animate-scaleUp">
                
                <div className="absolute -top-16 -left-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {isDeploying ? (
                  <div className="py-6 space-y-5 w-full">
                    <div className="relative p-4 bg-emerald-500/10 text-emerald-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-spin border-y-2 border-r-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <div className="absolute inset-1.5 bg-zinc-950 rounded-full"></div>
                      <RefreshCw size={24} className="text-emerald-400 relative z-10" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-wide text-white font-mono uppercase">Deploying Asset Blueprints...</h3>
                      <p className="text-[11px] text-zinc-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
                        Compiling Tailwind templates, packing relational database components, and registering secure SSL certificates to staging.
                      </p>
                    </div>
                    
                    <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden mx-auto border border-white/5">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-loadingBar"></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-5 w-full animate-scaleUp">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-bounce border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 size={32} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight text-white">App Deployed successfully!</h3>
                      <p className="text-[11px] text-zinc-400 mt-1.5 max-w-[320px] mx-auto leading-relaxed">
                        Design canvas variables and persistent tables have been compiled. Staging endpoints are active with high-fidelity score.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 text-left w-full select-all font-mono text-[10.5px]">
                      <span className="text-emerald-400 font-medium truncate">https://erere-builder.buildcraft.app</span>
                      <a 
                        href="https://ais-pre-bjc3amg6a7xndb2n5fuw32-474893647157.asia-southeast1.run.app" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[9.5px] bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg text-zinc-950 font-black select-none cursor-pointer transition-all duration-250 shadow-md"
                      >
                        Launch
                      </a>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowPublishModal(false)}
                        className="text-[11px] font-bold text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl px-5 py-2.5 transition-all cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
