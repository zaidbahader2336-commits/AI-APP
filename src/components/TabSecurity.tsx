import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, BadgeCheck, CheckCircle2, Lock, Flame, RefreshCw, Layers, Terminal, AlertTriangle, Play, HelpCircle, Shield, Radio, Key, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkspaceData, SecurityCheck } from '../types';

interface SecurityCheckItem {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'scanning';
  message: string;
  category: string;
}

const INITIAL_CHECKS: SecurityCheckItem[] = [
  { id: 'sec-1', name: 'Vulnerability Scan', status: 'passed', message: 'No issues found', category: 'Code Analysis' },
  { id: 'sec-2', name: 'SSL Certificate', status: 'passed', message: 'Active & valid', category: 'Network' },
  { id: 'sec-3', name: 'SQL Injection Protection', status: 'passed', message: 'Active', category: 'Database Rules' },
  { id: 'sec-4', name: 'Cross-Site Scripting (XSS) Filter', status: 'passed', message: 'Active', category: 'WAF rules' },
  { id: 'sec-5', name: 'Dependency Checks', status: 'passed', message: 'All clear', category: 'Dependencies' },
  { id: 'sec-6', name: 'Compliance Audits', status: 'passed', message: 'All clear', category: 'Compliance' }
];

const SECURITY_PACKAGES = [
  { name: '@google/genai', status: 'Active', version: 'v2.4.0', integrity: 'Verified' },
  { name: 'express', status: 'Active', version: 'v4.21.2', integrity: 'Verified' },
  { name: 'vite', status: 'Active', version: 'v6.2.3', integrity: 'Verified' },
  { name: 'dotenv', status: 'Active', version: 'v17.2.3', integrity: 'Verified' },
  { name: 'lucide-react', status: 'Active', version: 'v0.546.0', integrity: 'Verified' }
];

interface TabSecurityProps {
  activeApp?: WorkspaceData | null;
}

export default function TabSecurity({ activeApp }: TabSecurityProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'health' | 'waf' | 'compliance'>('overview');
  const [securityScore, setSecurityScore] = useState(98);
  const [checks, setChecks] = useState<SecurityCheckItem[]>(INITIAL_CHECKS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [cliText, setCliText] = useState('');
  const [cliToast, setCliToast] = useState('');

  React.useEffect(() => {
    if (activeApp && activeApp.securityChecks && activeApp.securityChecks.length > 0) {
      setChecks(activeApp.securityChecks);
    }
  }, [activeApp]);

  const runFullScan = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setSecurityScore(0);
    setScanMessage('Scanning structural modules...');
    
    setChecks(checks.map(c => ({ ...c, status: 'scanning', message: 'Analyzing code blocks...' })));

    let currentScore = 0;
    const interval = setInterval(() => {
      currentScore += 3;
      if (currentScore <= 98) {
        setSecurityScore(currentScore);
      }
    }, 50);

    setTimeout(() => {
      setChecks(prev => prev.map((c, i) => i === 0 || i === 1 ? { ...c, status: 'passed', message: 'Verified secure' } : c));
      setScanMessage('Evaluating SQL databases rules...');
    }, 800);

    setTimeout(() => {
      setChecks(prev => prev.map((c, i) => i === 2 || i === 3 ? { ...c, status: 'passed', message: 'Active & enabled' } : c));
      setScanMessage('Running dependency audit diagnostics...');
    }, 1500);

    setTimeout(() => {
      setChecks(prev => prev.map((c, i) => i >= 4 ? { ...c, status: 'passed', message: 'All checks clear' } : c));
      setScanMessage('');
      setSecurityScore(98);
      setIsScanning(false);
      clearInterval(interval);
    }, 2200);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliText.trim()) return;

    const queryCmd = cliText;
    setCliText('');
    setCliToast(`SecCLI: Compiled command successfully — "${queryCmd}". System fortified.`);
    setTimeout(() => setCliToast(''), 4500);
  };

  return (
    <div className="flex-grow flex flex-col xl:flex-row min-h-0 overflow-hidden bg-[#070e0a]">
      
      {/* Secondary Left Navigation Bar */}
      <div className="w-full xl:w-[220px] shrink-0 bg-[#030604]/90 border-b xl:border-b-0 xl:border-r border-white/[0.06] backdrop-blur-xl flex flex-col sm:flex-row xl:flex-col py-3 select-none gap-2 px-3 sm:items-center xl:items-stretch relative z-10 text-left">
        <div className="px-2 xl:px-4 py-2 border-b border-white/[0.06] flex items-center gap-2 mb-1 xl:mb-3 shrink-0">
          <Shield size={14} className="text-[#10B981] drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[10px] font-black text-white tracking-widest uppercase font-mono">Security Suite</span>
        </div>

        <div className="flex flex-col sm:flex-row xl:flex-col gap-1 items-stretch shrink-0 flex-grow sm:flex-grow-0 w-full">
          {[
            { id: 'overview', label: 'Security Overview', icon: <ShieldCheck size={13} /> },
            { id: 'health', label: 'Site Health', icon: <Radio size={13} /> },
            { id: 'waf', label: 'WAF Rules', icon: <Layers size={13} /> },
            { id: 'compliance', label: 'Compliance Audits', icon: <BadgeCheck size={13} /> }
          ].map((item) => {
            const isSelected = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer text-left ${
                  isSelected 
                    ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                    : 'text-zinc-405 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Security Canvas panel */}
      <div className="flex-grow flex flex-col bg-white/[0.01] min-h-0 overflow-hidden relative z-10">
        
        {/* Module Title bar */}
        <div className="px-5 py-3 border-b border-white/[0.06] bg-black/30 shrink-0 flex justify-between items-center h-12 relative z-10 select-none">
          <span className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping shadow-[0_0_6px_#10B981]"></span> Firewall Engine active
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Last scanned: 2 minutes ago</span>
        </div>

        {/* Unified Security Checkup content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-none text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Score Gauge Panel */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-black/25 border border-[#10B981]/15 flex flex-col items-center justify-center text-center relative shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981] mb-4 font-mono select-none">Overall System Security</span>
              
              <div className="relative w-36 h-36 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-[#10B981]"
                    strokeWidth="3.2"
                    strokeDasharray={`${securityScore}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    animate={{ strokeDasharray: `${securityScore}, 100` }}
                    transition={{ duration: 0.8 }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.4))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black tracking-tighter text-white font-mono">{securityScore}%</span>
                  <span className="text-[9px] font-black text-[#10B981] uppercase tracking-widest font-mono animate-pulse">Secure</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 w-full max-w-[210px] relative z-10 select-none">
                <button
                  onClick={runFullScan}
                  disabled={isScanning}
                  className={`w-full text-xs font-black py-2.5 px-4 rounded-xl border flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md transform active:scale-95 ${
                    isScanning 
                      ? 'bg-white/[0.02] border-white/5 text-zinc-550 cursor-not-allowed' 
                      : 'bg-transparent border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-zinc-950 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  }`}
                >
                  {isScanning ? (
                    <RefreshCw size={12} className="animate-spin text-[#10B981]" />
                  ) : (
                    <Play size={12} className="stroke-[2.5]" />
                  )}
                  {isScanning ? 'Running Scan...' : 'Run In-Depth Scan'}
                </button>
                
                <span className="text-[9px] font-bold text-zinc-500 block uppercase tracking-wider font-mono">
                  Quick Scan (Staging Target)
                </span>
              </div>

              {isScanning && (
                <div className="absolute bottom-3 left-0 right-0 text-center animate-pulse">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">{scanMessage}</span>
                </div>
              )}
            </div>

            {/* Right Checks Status grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {checks.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="p-4 rounded-2xl bg-[#09110b]/80 hover:bg-[#0c160e]/95 border border-white/[0.04] hover:border-emerald-500/30 flex justify-between items-start transition-all duration-300 shadow-md">
                  <div>
                    <span className="text-[8.5px] font-mono tracking-widest text-[#10B981] uppercase font-black">{item.category}</span>
                    <h5 className="text-[11.5px] font-bold text-[#F5F7FF] mt-1 pr-2">{item.name}</h5>
                    <span className="text-[10px] text-zinc-500 mt-1 block select-none">{item.message}</span>
                  </div>

                  {item.status === 'scanning' ? (
                    <RefreshCw size={13} className="text-[#10B981] animate-spin shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={13} className="text-[#10B981] shrink-0 mt-0.5 drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Detected Potential Issues table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-left">
            
            <div className="p-5 rounded-2xl bg-black/25 border border-white/[0.05] flex flex-col justify-between h-52 shadow-md">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block font-mono">Detected Potential Issues</span>
              
              <div className="flex flex-col items-center justify-center text-center p-3 select-none">
                <CheckCircle2 size={24} className="text-[#10B981] mb-2 animate-bounce drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <h6 className="text-[11.5px] font-black text-white">Zero threats identified in staging</h6>
                <p className="text-[9.5px] text-zinc-500 mt-1 max-w-sm">All database triggers, firewall routes, and certifications compiled emerald green.</p>
              </div>

              <div className="h-4"></div>
            </div>

            <div className="p-5 rounded-2xl bg-black/25 border border-white/[0.05] h-52 flex flex-col overflow-hidden justify-between shadow-md">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2 font-mono">Security Dependencies (30 packages)</span>
              
              <div className="flex-grow overflow-y-auto mb-1 scrollbar-none">
                <table className="w-full text-[10.5px] border-collapse text-left">
                  <thead className="text-zinc-500 font-bold border-b border-white/[0.06] h-6 sticky top-0 bg-[#030604] uppercase font-mono text-[9px] select-none tracking-wider">
                    <tr>
                      <th className="text-left pb-1">Package</th>
                      <th className="text-center pb-1">Status</th>
                      <th className="text-right pb-1">Resolved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {SECURITY_PACKAGES.map((pkg, i) => (
                      <tr key={i} className="h-7 hover:bg-white/[0.01]">
                        <td className="font-mono text-zinc-400">{pkg.name}</td>
                        <td className="text-center">
                          <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 rounded px-1.5 py-0.5 font-bold text-[8.5px] font-mono">
                            {pkg.status}
                          </span>
                        </td>
                        <td className="text-right font-mono text-zinc-550">{pkg.integrity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* CLI console input */}
        <div className="p-4 bg-black/40 border-t border-white/[0.06] flex gap-3 shrink-0 items-center backdrop-blur-md relative z-20">
          <form onSubmit={handleCliSubmit} className="relative flex-grow flex items-center rounded-xl border border-white/10 bg-[#061208]/95 focus-within:border-[#10B981]/50 transition-all duration-300 px-3.5 py-1.5 shadow-inner focus-within:shadow-[0_0_15px_rgba(16,185,129,0.15)] w-full">
            <span className="text-[8px] text-[#10B981] font-black uppercase tracking-widest mr-3 select-none font-mono bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/30">Sec CLI</span>
            <input
              type="text"
              className="flex-grow bg-transparent text-xs text-white outline-none placeholder-zinc-500 font-sans h-8"
              placeholder="Inject raw WAF custom bypass queries or security suite command rules..."
              value={cliText}
              onChange={(e) => setCliText(e.target.value)}
            />
          </form>
        </div>

        <AnimatePresence>
          {cliToast && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-20 left-4 right-4 p-3 bg-gradient-to-r from-[#031308]/95 to-[#010903]/90 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-sans flex items-center gap-2.5 shadow-2xl z-30 backdrop-blur-xl"
            >
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping shrink-0 shadow-[0_0_6px_#10B981]"></span>
              <span>{cliToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
