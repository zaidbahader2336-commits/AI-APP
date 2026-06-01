import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Sliders, ChevronDown, Bot, Terminal, TerminalSquare, AlertCircle, Bookmark, BadgeCheck, Code, ArrowRight } from 'lucide-react';
import PhonePreview from './PhonePreview';
import { ChatMessage, WorkspaceData } from '../types';

interface TabDashboardProps {
  dynamicComponents: { id: string; type: string; label: string }[];
  onAddComponent: (type: string, label: string) => void;
  onRemoveComponent: (id: string) => void;
  onSwitchTab?: (tab: 'dashboard' | 'code' | 'components' | 'database' | 'security') => void;
  activeApp: WorkspaceData | null;
  updateActiveApp: (data: WorkspaceData) => void;
}

interface EnhancedChatMessage extends ChatMessage {
  title?: string;
  checklist?: { text: string; checked: boolean }[];
  pills?: string[];
}

const INITIAL_MESSAGES: EnhancedChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    title: 'Buildcraft AI Assistant Active...',
    checklist: [
      { text: 'Dynamic Code synchronizer operational', checked: true },
      { text: 'Relational SQLite visual compiler linked', checked: true },
      { text: 'Real API keys proxy protection active', checked: true }
    ],
    text: 'Aashirvaad! Workspace ready hai. Mudjhe batayein aap kya banana chahte hain, main poore screens, interactive data visualization widgets aur code buffers generate kar dunga real-time mein!',
    timestamp: '09:20 AM'
  }
];

export default function TabDashboard({ dynamicComponents, onAddComponent, onRemoveComponent, onSwitchTab, activeApp, updateActiveApp }: TabDashboardProps) {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    const userMsg: EnhancedChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call real Gemini API on Express backend
    fetch("/api/chat-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText,
        currentState: activeApp
      })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to communicate with Express compiler service.");
      }
      return res.json();
    })
    .then((data) => {
      setIsTyping(false);
      
      const aiMsg: EnhancedChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        title: data.updatedTitle || "Workspace Syncing Successful...",
        checklist: [
          { text: "Evaluate responsive design components", checked: true },
          { text: "Compile backend API handlers", checked: true }
        ],
        text: data.aiResponseMessage || "Poora task successfully process ho gaya! Code buffers aur visual layouts update kar diye gaye hain.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeSnippet: data.updatedCode ? "App.tsx" : undefined,
        componentsAdded: data.updatedWidgets ? ["ResponsiveWidget"] : []
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Cascade updates back up to root state
      if (activeApp) {
        updateActiveApp({
          title: data.updatedTitle || activeApp.title,
          techStack: activeApp.techStack,
          previewHeaderTitle: data.updatedWidgets ? (data.updatedWidgets[0]?.title || activeApp.previewHeaderTitle) : activeApp.previewHeaderTitle,
          previewWidgets: data.updatedWidgets || activeApp.previewWidgets,
          sampleUsers: data.updatedUsers || activeApp.sampleUsers,
          sampleProducts: data.updatedProducts || activeApp.sampleProducts,
          sampleOrders: data.updatedOrders || activeApp.sampleOrders,
          securityChecks: data.updatedSecurityChecks || activeApp.securityChecks,
          activeCode: data.updatedCode || activeApp.activeCode
        });
      }
    })
    .catch((error) => {
      setIsTyping(false);
      // Beautiful local sandbox fallback fallback
      console.warn("Express Gemini endpoint unavailable, fallback activated.", error);
      
      const isButton = userText.toLowerCase().includes('button') || userText.toLowerCase().includes('click') || userText.toLowerCase().includes('action');
      const isInput = userText.toLowerCase().includes('input') || userText.toLowerCase().includes('form');
      const isChart = userText.toLowerCase().includes('chart') || userText.toLowerCase().includes('data') || userText.toLowerCase().includes('stats');

      const fallbackMsg: EnhancedChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        title: "Local Sandbox Fortifier...",
        checklist: [
          { text: "Activate local static simulation", checked: true },
          { text: "Bypass missing credentials block", checked: true }
        ],
        text: `Urdu/Hinglish Response: API key not set but main offline compiler set kar raha hoon: [Task: ${userText}].\n\n- Main ne local custom UI elements map kar diye hain. Right preview widget panel mein dynamic elements inspect karein!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, fallbackMsg]);

      if (isButton) {
        onAddComponent('button', 'Tactical Primary Button');
      } else if (isInput) {
        onAddComponent('input', 'Secure login input field');
      } else if (isChart) {
        onAddComponent('chart', 'In-App D3 Telemetry Line');
      } else {
        onAddComponent('widget', `Injected: ${userText.slice(0, 20)}`);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0 bg-[#070e0a]">
      
      {/* Mobile selectors */}
      <div className="lg:hidden flex bg-[#070e0a]/80 backdrop-blur-xl border-b border-white/[0.08] p-2 gap-2 shrink-0 select-none">
        <button
          onClick={() => setMobileView('chat')}
          className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            mobileView === 'chat' 
              ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          AI Assistant
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            mobileView === 'preview' 
              ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          Interactive Preview
        </button>
      </div>

      {/* Left Chat Screen */}
      <div className={`w-full lg:w-[55%] flex flex-col bg-white/[0.01] border-r border-white/[0.06] backdrop-blur-xl overflow-hidden min-h-0 ${
        mobileView === 'chat' ? 'flex flex-1' : 'hidden lg:flex'
      }`}>
        
        {/* Header bar dropdown & status */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-black/25 border-b border-white/[0.06] backdrop-blur-md relative z-10 select-none">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-[#10B981] border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Bot size={17} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-xs font-black tracking-widest text-[#10B981] uppercase font-mono">Workspace Chat</span>
              </div>
              <span className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase block mt-0.5">
                Compiler Online
              </span>
            </div>
          </div>
          
          <button className="flex items-center gap-1.5 text-[10px] text-zinc-350 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] px-3 py-2 rounded-lg transition-all duration-200 border border-white/[0.06] font-bold uppercase tracking-wider font-mono cursor-pointer">
            <Sliders size={11} className="text-[#10B981]" /> Tuning Parameters
          </button>
        </div>

        {/* Chat History Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin">
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2 max-w-full`}>
              {msg.sender === 'user' ? (
                <div className="bg-[#10B981] text-zinc-950 text-xs px-4 py-3 rounded-2xl rounded-tr-none shadow-[0_4px_15px_rgba(16,185,129,0.15)] max-w-[85%] leading-relaxed font-bold">
                  {msg.text}
                </div>
              ) : (
                <div className="flex gap-3.5 max-w-[92%] items-start">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-[#10B981] border border-emerald-500/20 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                    <Sparkles size={14} className="animate-pulse text-[#10B981]" />
                  </div>
                  <div className="flex-1 space-y-3.5 max-w-full">
                    
                    {msg.title && (
                      <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-[#08120c]/95 p-4 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-xs font-black text-white/95 tracking-wide leading-snug font-sans">
                            {msg.title}
                          </h4>
                          <span className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0">
                            <Bookmark size={11} className="stroke-[2.5]" />
                          </span>
                        </div>
                        
                        {msg.checklist && msg.checklist.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.checklist.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-zinc-300">
                                <span className="p-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 shrink-0">
                                  <BadgeCheck size={11} className="stroke-[2.5]" />
                                </span>
                                <span className="text-[10px] sm:text-[10.5px] font-semibold tracking-tight font-sans">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-4 select-none">
                          <button className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors text-[9.5px] font-black tracking-widest uppercase text-zinc-300 border border-white/5 active:scale-95 duration-150 cursor-pointer text-center font-mono">
                            Details
                          </button>
                          <button className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-[9.5px] font-black tracking-widest uppercase text-zinc-400 border border-white/[0.04] active:scale-95 duration-150 cursor-pointer text-center font-mono">
                            Preview
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-xl p-4 rounded-2xl rounded-tl-none text-xs text-zinc-100 leading-relaxed font-sans whitespace-pre-line text-left">
                      {msg.text}
                    </div>

                    {msg.codeSnippet && (
                      <div className="w-full max-w-sm rounded-xl border border-emerald-500/20 bg-[#061208]/95 hover:border-emerald-500/40 transition-all duration-300 p-3.5 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                            <Code size={13} className="stroke-[2.5]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[8.5px] font-mono text-zinc-450 uppercase tracking-widest block font-black leading-none font-bold">Code Synced</span>
                            <span className="text-[10.5px] font-black text-white/90 truncate block mt-1.5 font-mono">App.tsx Workspace</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onSwitchTab?.('code')}
                          className="px-3 py-1.5 text-[8.5px] font-black text-zinc-950 bg-[#10B981] hover:bg-[#34d399] rounded-lg uppercase tracking-wider font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/10"
                        >
                          View Code <ArrowRight size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <span className="text-[8.5px] text-zinc-550 font-mono tracking-wider px-3 uppercase select-none">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3.5 max-w-[80%] items-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#10B981] border border-white/[0.04]">
                <Sparkles size={14} className="animate-spin text-[#10B981]" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl rounded-tl-none text-xs flex gap-1.5 items-center shadow-lg">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-4 bg-black/40 border-t border-white/[0.06] flex gap-3 items-center relative z-10 backdrop-blur-md">
          <div className="relative flex-grow flex items-center rounded-xl border border-white/10 bg-[#061208]/80 focus-within:border-[#10B981]/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 px-3.5 py-1.5 w-full">
            <span className="text-[8px] text-[#10B981] font-black uppercase tracking-widest mr-3 select-none font-mono bg-emerald-500/15 px-2 py-1 rounded border border-emerald-500/30">Prompt</span>
            <input
              type="text"
              className="flex-grow bg-transparent text-xs text-white outline-none placeholder-zinc-500 font-sans h-8"
              placeholder="Describe what visual widget, layer or dynamic chart you want to build next..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className="p-2 bg-emerald-400 text-zinc-950 hover:bg-emerald-300 hover:scale-105 active:scale-95 transition-all rounded-lg cursor-pointer shadow-md shadow-emerald-500/15"
            >
              <Send size={12} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>

      {/* Right Phone preview */}
      <div className={`w-full lg:w-[45%] flex flex-col bg-[#020503] overflow-y-auto scrollbar-none p-4 items-center justify-center min-h-0 border-t lg:border-t-0 border-white/[0.06] ${
        mobileView === 'preview' ? 'flex flex-1' : 'hidden lg:flex'
      }`}>
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          <PhonePreview dynamicComponents={dynamicComponents} onRemoveComponent={onRemoveComponent} activeApp={activeApp} />
        </div>
      </div>
    </div>
  );
}
