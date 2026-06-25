import React, { useState, useEffect } from 'react';
import { Layers, RefreshCw, Radio, Cpu, Shield, Sparkles, Network } from 'lucide-react';

interface LandingPageProps {
  onComplete: () => void;
}

export default function LandingPage({ onComplete }: LandingPageProps) {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);

  const bootLogs = [
    'Establishing secure connection with Sector 7 Grid...',
    'Synchronizing live Traffic, AQI, and Transit sensor matrix...',
    'Structuring vector data segments for RAG database schema...',
    'Deploying semantic grounding pipeline & caching index states...',
    'Powering up Google Gemini-3.5 cognitive grounding layer...',
    'Interface established. Initiating Secure Handshake...'
  ];

  useEffect(() => {
    // Progress increment timer over 3 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 150); // Small buffer
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Rotate logs sequentially
    const logInterval = setInterval(() => {
      setBootStep((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#faf8f5] text-slate-800 flex flex-col justify-center items-center p-6 select-none overflow-hidden" id="guidelense-landing-overlay">
      {/* 1. Artistic Fluid Ribbon Wave Backgrounds (Inspired by image) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft elegant mesh background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#fdfbf7] via-[#f5f1e9] to-[#edf6f6]" />
        
        {/* Swirling fluid gradient layers / ribbons */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#e28c7c]/40 via-[#a24982]/30 to-[#208ca2]/10 blur-[100px] animate-[pulse_10s_infinite]" />
        <div className="absolute -bottom-[15%] -right-[15%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-[#2ea3a3]/30 via-[#fb923c]/20 to-[#8f3c75]/30 blur-[120px] animate-[pulse_12s_infinite]" style={{ animationDelay: '2s' }} />
        
        {/* Wave ribbons simulated using layered skewed gradients with smooth transitions */}
        <div className="absolute top-[20%] left-[-20%] w-[140%] h-[250px] bg-gradient-to-r from-[#d66e5a]/10 via-[#8e3c75]/10 to-[#236e7a]/15 rotate-[15deg] transform origin-top-left filter blur-[40px] opacity-70" />
        <div className="absolute bottom-[10%] right-[-20%] w-[140%] h-[180px] bg-gradient-to-r from-[#2ea3a3]/10 via-[#fb923c]/10 to-[#8e3c75]/10 rotate-[-12deg] transform origin-bottom-right filter blur-[30px] opacity-60" />

        {/* 2. Floating Shaded 3D Ornaments/Spheres (Echoing the image) */}
        {/* Large Orange Sphere */}
        <div className="absolute top-[15%] right-[20%] w-20 h-20 rounded-full bg-radial from-[#ff9e7d] to-[#e05a36] shadow-[5px_15px_30px_rgba(224,90,54,0.35)] animate-[bounce_8s_infinite] ease-in-out" />
        {/* Deep Magenta Sphere */}
        <div className="absolute bottom-[20%] left-[15%] w-16 h-16 rounded-full bg-radial from-[#d946ef] to-[#86198f] shadow-[5px_12px_25px_rgba(134,25,143,0.3)] animate-[bounce_10s_infinite] ease-in-out" style={{ animationDelay: '1s' }} />
        {/* Teal Blue Sphere */}
        <div className="absolute top-[60%] right-[10%] w-12 h-12 rounded-full bg-radial from-[#2ed4c4] to-[#0f766e] shadow-[3px_10px_20px_rgba(15,118,110,0.25)] animate-[bounce_7s_infinite] ease-in-out" style={{ animationDelay: '0.5s' }} />
        {/* Tiny golden drop ball */}
        <div className="absolute top-[40%] left-[30%] w-6 h-6 rounded-full bg-radial from-[#fef08a] to-[#ca8a04] shadow-[2px_5px_10px_rgba(202,138,4,0.2)] animate-pulse" />
      </div>

      {/* Main Glassmorphic Container Card (Super high-end, clean cream backing) */}
      <div className="max-w-lg w-full bg-[#fdfbfc]/95 border border-[#e6e2db] backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_50px_rgba(45,55,72,0.1)] relative overflow-hidden flex flex-col items-center z-10">
        
        {/* Top vibrant accent border strip */}
        <div className="absolute inset-x-0 top-0 h-[6px] bg-gradient-to-r from-[#2ea3a3] via-[#8f3c75] via-[#e28c7c] to-[#208ca2]" />

        {/* Floating Core Indicator */}
        <div className="relative mb-6 mt-2">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#e28c7c] to-[#2ea3a3] opacity-80 blur-sm animate-spin" style={{ animationDuration: '8s' }} />
          <div className="h-16 w-16 rounded-full bg-white text-slate-800 flex items-center justify-center relative border border-[#e6e2db] shadow-inner">
            <Layers className="w-8 h-8 text-[#8f3c75] animate-pulse" />
          </div>
        </div>

        {/* Title Group */}
        <div className="text-center space-y-1 mb-6">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-[#236e7a]">GuideLense</h1>
            <span className="text-[10px] bg-[#236e7a]/10 text-[#236e7a] border border-[#236e7a]/20 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Enterprise
            </span>
          </div>
          <p className="text-[11px] text-[#8e3c75] font-mono tracking-widest uppercase font-bold">
            Cognitive City Intelligence
          </p>
        </div>

        {/* Dynamic scanning display mimicking visual radar */}
        <div className="h-28 w-28 rounded-full border border-[#e6e2db] relative flex items-center justify-center bg-[#faf8f5]/50 mb-6 shadow-inner">
          <div className="absolute inset-1 rounded-full border border-[#2ea3a3]/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-3 rounded-full border border-[#e6e2db] border-dashed" />
          <div className="absolute w-[2px] h-10 bg-[#8f3c75]/30 origin-bottom bottom-1/2 left-[calc(50%-1px)] animate-spin" style={{ animationDuration: '4s' }} />
          
          <Radio className="w-6 h-6 text-[#d66e5a] animate-pulse" />

          {/* Micro-indicators */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#2ea3a3]" />
          <span className="absolute bottom-5 left-3 h-1.5 w-1.5 rounded-full bg-[#8f3c75]" />
          <span className="absolute top-6 left-5 h-2 w-2 rounded-full bg-[#d66e5a] animate-ping" />
        </div>

        {/* Live boot sequence telemetry feed */}
        <div className="w-full bg-[#faf8f5] border border-[#e6e2db] rounded-2xl p-4 mb-6 font-mono text-[10px] text-slate-600 space-y-2 h-[85px] overflow-hidden flex flex-col justify-end">
          <div className="flex items-center gap-1.5 text-[#236e7a] font-bold border-b border-slate-200 pb-1.5 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>CORE BOOT DIAGNOSTICS:</span>
          </div>
          <div className="space-y-1">
            {bootStep > 0 && <p className="opacity-50 text-slate-500">&gt; {bootLogs[bootStep - 1]}</p>}
            <p className="text-[#d66e5a] flex items-center gap-1 font-bold">
              <span className="h-1.5 w-1.5 bg-[#d66e5a] rounded-full animate-ping" />
              &gt; {bootLogs[bootStep]}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-1.5 mb-6">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 font-bold">
            <span>SYNCHRONIZING SYNERGY MATRIX</span>
            <span className="text-[#236e7a] font-black">{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="w-full h-3 bg-[#faf8f5] border border-[#e6e2db] rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#2ea3a3] via-[#8f3c75] to-[#d66e5a] transition-all duration-100 ease-out shadow-[0_0_8px_rgba(214,110,90,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip button styled nicely */}
        <button
          onClick={onComplete}
          className="bg-white hover:bg-[#236e7a]/10 text-[#236e7a] border border-[#e6e2db] hover:border-[#236e7a]/30 font-sans font-extrabold text-[10px] tracking-wider uppercase py-2.5 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d66e5a]" />
          Skip Handshake & Initialize
        </button>

      </div>

      {/* Bottom compliance tag */}
      <div className="mt-8 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 font-bold tracking-wider uppercase z-10">
        <Shield className="w-3.5 h-3.5 text-[#2ea3a3]" />
        <span>ISO-9001 Grounded Terminal Matrix • Secure Link</span>
      </div>
    </div>
  );
}

