import React from 'react';
import { RagPipelineStep } from '../types';
import { Network, Search, FileSymlink, Sparkles, AlertCircle, HelpCircle, CheckCircle } from 'lucide-react';

interface PipelineVisualizerProps {
  steps: RagPipelineStep[];
  currentStepIndex: number; // -1 if idle, 0 to 3
}

export default function PipelineVisualizer({ steps, currentStepIndex }: PipelineVisualizerProps) {
  const pipelineSchema = [
    {
      id: 'ANALYZE',
      label: '1. Parsing Query',
      icon: Network,
      color: 'text-blue-500 bg-blue-50 border-blue-200',
      activeColor: 'ring-blue-400 bg-blue-600 text-white'
    },
    {
      id: 'RETRIEVE',
      label: '2. Document Search',
      icon: Search,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      activeColor: 'ring-amber-400 bg-amber-500 text-white'
    },
    {
      id: 'AUGMENT',
      label: '3. Prompt Augment',
      icon: FileSymlink,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      activeColor: 'ring-purple-400 bg-purple-600 text-white'
    },
    {
      id: 'STREAM',
      label: '4. Gemini Generation',
      icon: Sparkles,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      activeColor: 'ring-emerald-400 bg-emerald-500 text-white'
    }
  ];

  const getStepLog = (stepId: 'ANALYZE' | 'RETRIEVE' | 'AUGMENT' | 'STREAM') => {
    return steps.find(s => s.step === stepId);
  };

  return (
    <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-5 text-slate-800 flex flex-col h-full" id="rag-pipeline-visualizer">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-[#8f3c75] rounded-lg">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Real-Time Streaming RAG Monitor</h3>
            <p className="font-sans text-[10px] text-slate-500 font-medium">Step-by-step vector search, context extraction, and token streaming</p>
          </div>
        </div>
        <div className="text-[10px] bg-purple-50 border border-purple-100 font-mono font-bold text-[#8f3c75] px-2.5 py-0.5 rounded-full">
          RAG Core v1.2
        </div>
      </div>

      {/* Steps Pipeline Visual Progress Row */}
      <div className="grid grid-cols-4 gap-2 relative mb-5 shrink-0">
        {pipelineSchema.map((item, index) => {
          const isActive = currentStepIndex === index;
          const isCompleted = currentStepIndex > index;
          
          return (
            <div 
              key={item.id} 
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all duration-300 relative ${
                isActive 
                  ? 'bg-[#faf8f5] border-[#8f3c75] ring-2 ring-[#8f3c75]/30 shadow-sm scale-105' 
                  : isCompleted 
                  ? 'bg-slate-50 border-slate-100 opacity-60' 
                  : 'bg-white border-slate-100 opacity-40'
              }`}
            >
              <div className={`p-1.5 rounded-lg mb-1 transition-all ${
                isActive ? item.activeColor : item.color
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-sans font-bold text-[9px] tracking-tight text-slate-700 block truncate w-full">
                {item.label}
              </span>
              
              {/* Completed Status Checkmark */}
              {isCompleted && (
                <CheckCircle className="w-3 h-3 text-emerald-500 absolute top-1 right-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Live Pipeline Telemetry Log Output Terminal */}
      <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-3.5 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[170px] flex flex-col justify-between shadow-inner text-slate-300">
        <div>
          <div className="text-[9px] font-sans font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-2.5 flex items-center justify-between">
            <span>Grounding Diagnostics Terminal</span>
            <span className="h-1.5 w-1.5 bg-[#8f3c75] rounded-full animate-ping"></span>
          </div>

          <div className="space-y-2">
            {steps.map((log, index) => {
              const iconColor = log.step === 'ANALYZE' ? 'text-blue-400' :
                                log.step === 'RETRIEVE' ? 'text-amber-400' :
                                log.step === 'AUGMENT' ? 'text-purple-400' : 'text-emerald-400';
              return (
                <div key={index} className="flex gap-2 text-slate-300 items-start">
                  <span className={`font-bold shrink-0 ${iconColor}`}>[{log.step}]</span>
                  <div>
                    <span className="text-slate-400">{log.message}</span>
                    {log.data && log.step === 'ANALYZE' && (
                      <span className="text-slate-500 block text-[10px] mt-0.5">
                        &gt; Intent: {log.data.query.slice(0, 40)}... Mode: {log.data.activeIncident}
                      </span>
                    )}
                    {log.data && log.step === 'RETRIEVE' && (
                      <span className="text-amber-500/85 block text-[10px] mt-0.5">
                        &gt; Retrained context: {log.data.documents.length} JSON segments. Generated citations: {log.data.citationCount}.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {steps.length === 0 && (
              <div className="text-center py-6 text-slate-500 flex flex-col items-center gap-1">
                <HelpCircle className="w-5 h-5 text-slate-600 shrink-0" />
                <span className="font-sans font-bold text-xs">Pipeline Idle</span>
                <span className="font-sans text-[10px] max-w-[200px]">Send a chat query to activate the real-time RAG engine.</span>
              </div>
            )}
          </div>
        </div>

        {currentStepIndex >= 0 && (
          <div className="text-[9px] font-sans font-bold text-[#8f3c75] border-t border-slate-900 pt-2.5 mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 bg-[#8f3c75] rounded-full animate-ping"></span>
              {currentStepIndex === 3 ? 'Streaming model generation tokens...' : 'RAG operations active...'}
            </span>
            <span>Step {currentStepIndex + 1} of 4</span>
          </div>
        )}
      </div>
    </div>
  );
}
