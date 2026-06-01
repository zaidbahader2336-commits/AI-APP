import React, { useState } from 'react';
import { Folder, FolderOpen, File, FileCode, CheckSquare, Terminal, Eye, Play, Send } from 'lucide-react';
import { WorkspaceData } from '../types';

type FileKey = 'App.tsx' | 'package.json' | 'vite.config.ts' | 'README.md' | 'env.d.ts';

interface TabCodeEditorProps {
  activeApp?: WorkspaceData | null;
}

const DEFAULT_FILE_CONTENTS: Record<FileKey, string> = {
  'App.tsx': `
import { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function App() {
  const [steps, setSteps] = useState(8420);
  return (
    <div className="bg-[#0c120e] text-white p-6 rounded-2xl border border-emerald-500/10 min-h-[400px]">
      <h3 className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Active Companion</h3>
      <h1 className="text-2xl font-black mt-2">Daily Companion OS</h1>
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
        <span className="text-zinc-400 text-xs text-left">Logged Today:</span>
        <div className="text-3xl font-black text-[#10B981] mt-1">{steps} Steps</div>
      </div>
    </div>
  );
}`,
  'package.json': `{
  "name": "ai-companion-fitness-app",
  "version": "1.2.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.470.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.7.0"
  }
}`,
  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});`,
  'env.d.ts': `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}`,
  'README.md': `# Fitness Hub Mobile Companion

Developed natively using **BuildCraft AI Orchestration engine v1.2.0**.

## Core Characteristics
- Dynamic steps progress ring counting up directly from sensors
- Tailored Yoga, HIIT, and Weights interactive routine cards
- Dark aesthetic styling maximizing viewport contrast (#0d0d0f)`
};

export default function TabCodeEditor({ activeApp }: TabCodeEditorProps) {
  const [activeFile, setActiveFile] = useState<FileKey>('App.tsx');
  const [openedTabs, setOpenedTabs] = useState<FileKey[]>(['App.tsx', 'package.json']);
  const [promptText, setPromptText] = useState('');
  const [toast, setToast] = useState('');
  const [isTreeVisible, setIsTreeVisible] = useState(false);

  const fileContents = {
    ...DEFAULT_FILE_CONTENTS,
    'App.tsx': activeApp?.activeCode || DEFAULT_FILE_CONTENTS['App.tsx']
  };

  const selectFile = (fileName: FileKey) => {
    setActiveFile(fileName);
    if (!openedTabs.includes(fileName)) {
      setOpenedTabs([...openedTabs, fileName]);
    }
  };

  const closeTab = (e: React.MouseEvent, tab: FileKey) => {
    e.stopPropagation();
    const updated = openedTabs.filter(t => t !== tab);
    setOpenedTabs(updated);
    if (activeFile === tab && updated.length > 0) {
      setActiveFile(updated[0]);
    }
  };

  const renderHighlightedCode = (text: string, file: FileKey) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      let contentHtml = line;

      contentHtml = contentHtml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      if (file.endsWith('.json')) {
        contentHtml = contentHtml
          .replace(/("[a-zA-Z0-9_]+")\s*:/g, '<span class="text-teal-400 font-bold">$1</span>:')
          .replace(/("[^"]*")/g, (m) => m.startsWith('<span') ? m : `<span class="text-amber-400">${m}</span>`)
          .replace(/(\d+|true|false|null)/g, '<span class="text-[#10B981] font-semibold">$1</span>');
      } else if (file.endsWith('.md')) {
        if (contentHtml.startsWith('#')) {
          contentHtml = `<span class="text-teal-450 font-extrabold">${contentHtml}</span>`;
        } else {
          contentHtml = contentHtml.replace(/(\*\*.*?\*\*)/g, '<span class="text-[#10B981]">$1</span>');
        }
      } else {
        const keywords = ['import', 'from', 'export', 'default', 'function', 'return', 'const', 'let', 'interface', 'readonly', 'type'];
        keywords.forEach(kw => {
          const reg = new RegExp(`\\b${kw}\\b`, 'g');
          contentHtml = contentHtml.replace(reg, `<span class="text-emerald-400 font-semibold">${kw}</span>`);
        });

        contentHtml = contentHtml
          .replace(/&lt;([A-Z][a-zA-Z0-9]*)/g, '&lt;<span class="text-teal-400 font-medium">$1</span>')
          .replace(/\/([A-Z][a-zA-Z0-9]*)&gt;/g, '/<span class="text-teal-400 font-medium">$1</span>&gt;')
          .replace(/('[^']*')/g, '<span class="text-amber-400">$1</span>')
          .replace(/("[^"]*")/g, '<span class="text-amber-400">$1</span>')
          .replace(/([a-zA-Z0-9]+)=/g, '<span class="text-gray-400 italic">$1</span>=');
      }

      return (
        <div key={index} className="flex leading-6 hover:bg-white/[0.02] px-2 transition-colors text-left">
          <span className="text-zinc-650 font-mono text-[10px] select-none text-right w-6 pr-3.5 border-r border-white/5 mr-4.5 font-bold">
            {index + 1}
          </span>
          <span 
            className="font-mono text-[11px] text-zinc-300 whitespace-pre" 
            dangerouslySetInnerHTML={{ __html: contentHtml || ' ' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="flex-grow flex-1 flex min-h-0 overflow-hidden relative bg-[#070e0a]">
      {isTreeVisible && (
        <div 
          onClick={() => setIsTreeVisible(false)}
          className="fixed inset-0 bg-black/70 z-25 md:hidden backdrop-blur-sm"
        />
      )}
      
      {/* File Tree Panel */}
      <div className={`w-[220px] shrink-0 bg-[#030604]/90 border-r border-white/[0.06] backdrop-blur-xl flex flex-col min-h-0 overflow-y-auto select-none transition-transform relative z-20 ${
        isTreeVisible ? 'fixed inset-y-0 left-0 z-30 h-full w-[220px]' : 'hidden md:flex'
      }`}>
        <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-black/30">
          <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500 font-mono">WORKSPACE ROOT</span>
          <span className="text-[8px] bg-emerald-500/10 text-[#10B981] px-1.5 py-0.5 rounded-md font-mono font-bold border border-[#10B981]/20">APP-BOT</span>
        </div>

        <div className="p-3 space-y-1.5 text-xs text-left">
          <div className="flex items-center gap-1.5 text-white font-heavy px-2.5 py-2 rounded-xl bg-white/[0.04] select-none text-[11px] border border-white/[0.04] shadow-inner font-mono justify-start">
            <FolderOpen size={13} className="text-[#10B981]" />
            ai-companion-app
          </div>

          <div className="pl-3.5 space-y-0.5">
            {['.vscode', 'components', 'hooks', 'profiles', 'pages', 'services', 'utils', 'styles'].map((folder) => (
              <div 
                key={folder} 
                className="flex items-center gap-2 text-zinc-400 hover:text-white px-2 py-1.5 cursor-pointer transition-colors text-[11px] rounded-lg hover:bg-white/[0.02] justify-start"
              >
                <Folder size={12} className="text-zinc-550" />
                <span>{folder}</span>
              </div>
            ))}
          </div>

          <div className="pl-3.5 space-y-0.5 pt-2 border-t border-white/[0.06] mt-2">
            {(['App.tsx', 'env.d.ts', 'package.json', 'vite.config.ts', 'README.md'] as const).map((fileName) => {
              const isSelected = activeFile === fileName;
              return (
                <div
                  key={fileName}
                  onClick={() => {
                    selectFile(fileName as FileKey);
                    setIsTreeVisible(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-all text-[11px] font-mono group relative ${
                    isSelected 
                      ? 'bg-emerald-500/10 text-white border-l border-[#10B981] pl-3' 
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate justify-start">
                    <FileCode size={11} className={isSelected ? 'text-[#10B981]' : 'text-zinc-600'} />
                    <span className="truncate">{fileName}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] shrink-0 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor & Content panel */}
      <div className="flex-1 flex flex-col bg-white/[0.02] backdrop-blur-xl min-h-0 overflow-hidden relative">
        
        {/* Editor Tabs bar header */}
        <div className="flex justify-between items-center bg-black/35 border-b border-white/[0.06] h-11 px-2 shrink-0 select-none">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none h-full w-full">
            <button
              onClick={() => setIsTreeVisible(!isTreeVisible)}
              className="md:hidden flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-[#10B981] px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-[#10B981]/15 hover:bg-emerald-550 transition-all cursor-pointer shrink-0 ml-1.5 font-mono"
            >
              Files
            </button>
            {openedTabs.map((tab) => {
              const isSelected = activeFile === tab;
              return (
                <div
                  key={tab}
                  onClick={() => selectFile(tab)}
                  className={`flex items-center gap-2 h-full px-4 border-r border-white/[0.04] cursor-pointer text-[11px] font-mono select-none transition-all duration-200 ${
                    isSelected 
                      ? 'bg-black/20 text-white border-t-2 border-[#10B981] font-black' 
                      : 'text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-350'
                  }`}
                >
                  <span>{tab}</span>
                  <button
                    onClick={(e) => closeTab(e, tab)}
                    className="p-0.5 rounded-full hover:bg-white/10 text-zinc-650 hover:text-zinc-400 transition-colors cursor-pointer text-[9px] w-3.5 h-3.5 flex items-center justify-center font-black"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider font-bold shrink-0">
            <span>UTF-8</span>
            <span className="text-zinc-800">|</span>
            <span className="text-[#10B981]">TypeScript JSX</span>
          </div>
        </div>

        {/* Path breadcrumb bar */}
        <div className="px-4 py-2 bg-black/10 border-b border-white/[0.05] text-[10px] font-mono text-zinc-500 flex items-center gap-2 shrink-0 font-bold uppercase tracking-wider select-none justify-start">
          <span>ai-companion-app</span>
          <span className="text-zinc-700">&gt;</span>
          <span>src</span>
          <span className="text-zinc-700">&gt;</span>
          <span className="text-white normal-case">{activeFile}</span>
        </div>

        {/* Code Canvas view area */}
        <div className="flex-grow flex-1 overflow-auto bg-black/15 py-4 select-text scrollbar-thin relative z-10 text-left">
          {toast && (
            <div className="absolute top-4 left-4 right-4 p-3 bg-gradient-to-r from-[#031308]/95 to-[#010903]/90 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-sans flex items-center gap-2.5 shadow-2xl z-20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping shadow-[0_0_6px_#10B981]" />
              <span className="font-medium text-left">{toast}</span>
            </div>
          )}
          <pre className="m-0 font-mono text-left">
            <code>
              {renderHighlightedCode(fileContents[activeFile] || '// Code blank', activeFile)}
            </code>
          </pre>
        </div>

        <div className="p-4 bg-black/40 border-t border-white/[0.06] flex gap-3 shrink-0 items-center backdrop-blur-md relative z-10 w-full">
          <div className="relative flex-grow flex items-center rounded-xl border border-white/10 bg-[#061208]/95 focus-within:border-[#10B981]/50 transition-all duration-300 px-3.5 py-1.5 shadow-inner focus-within:shadow-[0_0_15px_rgba(16,185,129,0.15)] w-full">
            <span className="text-[8px] text-[#10B981] font-black uppercase tracking-widest mr-3 select-none font-mono bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/30">Prompt</span>
            <input
              type="text"
              className="flex-grow bg-transparent text-xs text-white outline-none placeholder-zinc-500 font-sans h-8"
              placeholder="Describe adjustments to file code or request refactoring..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const txt = promptText;
                  setPromptText('');
                  setToast(`Instruction compiled successfully: "${txt}". Code buffers updated.`);
                  setTimeout(() => setToast(''), 4000);
                }
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
