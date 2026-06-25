import React, { useRef, useEffect } from 'react';
import { ChatMessage, CityIncidentPreset } from '../types';
import { MessageSquare, Send, Sparkles, User, ShieldCheck, RefreshCw, AlertCircle, FileText } from 'lucide-react';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmitChat: (e: React.FormEvent) => void;
  isStreaming: boolean;
  activePreset: CityIncidentPreset;
}

export default function ChatPanel({
  chatHistory,
  inputValue,
  onInputChange,
  onSubmitChat,
  isStreaming,
  activePreset
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isStreaming]);

  const quickQueries = [
    "Best route to avoid traffic today?",
    "Which area has the cleanest air this evening?",
    "Show public transport status and delayed routes",
    "What is the overall weather and local events overview?"
  ];

  return (
    <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-5 flex flex-col h-[520px]" id="chat-with-your-city-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-[#8f3c75] rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Chat with your City</h3>
            <p className="font-sans text-[11px] text-slate-500 font-medium">Factual answers grounded on live sensors</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-[#faf8f5] border border-[#e6e2db] px-2.5 py-1 rounded-md font-sans font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#8f3c75] shrink-0" />
          <span>Active RAG Mode</span>
        </div>
      </div>

      {/* Messages Scroll Zone */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4" id="chat-messages-container">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
            <div className="p-4 bg-purple-50 text-[#8f3c75] rounded-full animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-display font-black text-slate-700 text-sm">Welcome to GuideLense City Intelligence</h4>
              <p className="font-sans text-[11px] text-slate-400 mt-1 max-w-[280px] mx-auto font-medium leading-relaxed">
                Chat, check road delays, sensor metrics, and transport logs. Your questions are matched to live documents instantly.
              </p>
            </div>

            {/* Quickstart Buttons */}
            <div className="w-full max-w-sm space-y-1.5 pt-2">
              <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest block text-left mb-1">
                Suggested Grounding Queries:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {quickQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onInputChange(q)}
                    className="w-full text-left font-sans text-xs p-2.5 rounded-xl border border-[#e6e2db] hover:bg-purple-50 hover:border-[#8f3c75]/20 transition-all text-slate-600 font-bold hover:text-[#8f3c75] bg-[#faf8f5]/50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {chatHistory.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${
                isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                isAssistant ? 'bg-[#8f3c75] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {isAssistant ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5">
                <div className={`p-3 rounded-2xl shadow-sm border font-sans text-xs leading-relaxed font-medium ${
                  isAssistant 
                    ? 'bg-slate-50 border-slate-200 text-slate-800' 
                    : 'bg-[#8f3c75] border-[#8f3c75] text-white'
                }`}>
                  {/* Markdown rendering simulation (handling lists and bolding nicely) */}
                  <div className="whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, lidx) => {
                      // Simple regex matching to render bold markdown (**text**)
                      const parts = [];
                      let lastIdx = 0;
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      let match;
                      
                      while ((match = boldRegex.exec(line)) !== null) {
                        if (match.index > lastIdx) {
                          parts.push(line.substring(lastIdx, match.index));
                        }
                        parts.push(<strong key={match.index} className="font-extrabold">{match[1]}</strong>);
                        lastIdx = boldRegex.lastIndex;
                      }
                      if (lastIdx < line.length) {
                        parts.push(line.substring(lastIdx));
                      }

                      return (
                        <p key={lidx} className={line.trim() === '' ? 'h-2' : 'mb-1 leading-normal'}>
                          {parts.length > 0 ? parts : line}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Grounding Source Citations below response */}
                {isAssistant && msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-1">
                    <span className="text-[9px] font-sans font-bold text-slate-400 flex items-center gap-0.5 mt-1 mr-1">
                      <FileText className="w-3 h-3 text-[#8f3c75]" /> Grounded on:
                    </span>
                    {msg.citations.map((cite, cIdx) => (
                      <span 
                        key={cIdx}
                        className="bg-slate-100 text-slate-600 border border-slate-200 hover:border-[#8f3c75]/20 text-[9px] font-mono font-bold py-0.5 px-2 rounded-full cursor-help hover:text-[#8f3c75] transition-colors"
                        title={`${cite.category} Document: ${cite.detail}`}
                      >
                        {cite.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live streaming indicator dots */}
        {isStreaming && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[#8f3c75] text-white animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl shadow-sm text-slate-500 font-sans text-xs flex items-center gap-1.5 font-semibold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8f3c75]/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8f3c75]"></span>
              </span>
              Synthesizing grounding context...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form Box */}
      <form onSubmit={onSubmitChat} className="mt-auto pt-2 shrink-0 border-t border-slate-100" id="chat-input-form">
        {/* Active Incident Warning bar inside chat */}
        {activePreset !== 'Normal' && (
          <div className="bg-[#ffedd5] border border-[#e28c7c]/30 p-2 rounded-xl mb-2 flex items-center gap-1.5 text-[10px] text-amber-900 font-sans font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-[#e28c7c] shrink-0" />
            <span>Active emergency simulation Mode is **{activePreset}**. Chat questions will be grounded on emergency feeds.</span>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isStreaming}
            placeholder='Chat with Sector 7 (e.g. "Best route to avoid traffic today?")...'
            className="flex-1 font-sans text-xs border border-[#e6e2db] bg-[#faf8f5] focus:bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8f3c75] focus:border-[#8f3c75] transition-all font-semibold"
          />
          <button
            type="submit"
            disabled={isStreaming || !inputValue.trim()}
            className="bg-[#8f3c75] hover:bg-[#72305d] disabled:bg-slate-150 text-white disabled:text-slate-400 font-sans font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:pointer-events-none"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
