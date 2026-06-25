import React, { useState } from 'react';
import { CityFeedsData, CityIncidentPreset } from '../types';
import { Database, Zap, FileText, ChevronRight, ChevronDown, ChevronUp, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface FeedDatabaseProps {
  feeds: CityFeedsData;
  activePreset: CityIncidentPreset;
  onSelectPreset: (preset: CityIncidentPreset) => void;
  isLoading: boolean;
}

export default function FeedDatabase({ feeds, activePreset, onSelectPreset, isLoading }: FeedDatabaseProps) {
  const [activeTab, setActiveTab] = useState<'traffic' | 'air' | 'weather' | 'transit' | 'events'>('traffic');
  const [showJson, setShowJson] = useState(false);

  const presets: Array<{ id: CityIncidentPreset; label: string; icon: string; desc: string; color: string }> = [
    {
      id: 'Normal',
      label: 'Optimal Operation',
      icon: '🟢',
      desc: 'Standard city status. Smooth traffic flow, clean air, stable weather.',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 text-emerald-900'
    },
    {
      id: 'GasLeak',
      label: 'Industrial Gas Leak',
      icon: '⚠️',
      desc: 'HAZMAT level event. AQI spikes, emergency road closures active.',
      color: 'border-rose-200 hover:border-rose-400 bg-rose-50/50 text-rose-950'
    },
    {
      id: 'TransitStrike',
      label: 'Transit Union Strike',
      icon: '🚇',
      desc: 'Metro line suspended. Huge road congestion, downtown protest rally.',
      color: 'border-amber-200 hover:border-amber-400 bg-amber-50/50 text-amber-950'
    },
    {
      id: 'SuddenStorm',
      label: 'Torrential Rain Storm',
      icon: '⛈️',
      desc: 'Severe flash flood risk. Speeds halved, pristine washed air.',
      color: 'border-sky-200 hover:border-sky-400 bg-sky-50/50 text-sky-950'
    },
    {
      id: 'MusicFestival',
      label: 'Summer Sound Clash',
      icon: '🎉',
      desc: '45K attendees at park lawn. Westside highway jammed, high public transit.',
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/50 text-purple-950'
    }
  ];

  const getFilteredData = () => {
    switch (activeTab) {
      case 'traffic': return feeds.traffic;
      case 'air': return feeds.airQuality;
      case 'weather': return feeds.weather;
      case 'transit': return feeds.transit;
      case 'events': return feeds.events;
    }
  };

  return (
    <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-5 flex flex-col h-full" id="feed-database-explorer">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 text-[#8f3c75] rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Active Knowledge Base Feeds</h3>
            <p className="font-sans text-[11px] text-slate-500 font-medium">Trigger overrides to mutate the ground files for RAG</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold font-mono bg-[#faf8f5] border border-[#e6e2db] px-2.5 py-1 rounded-md">
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8f3c75]" />
          ) : (
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
          )}
          DB: Sector_7_Live
        </div>
      </div>

      {/* Incident Injector Board */}
      <div className="mb-5">
        <div className="flex items-center gap-1 text-xs font-sans font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Simulate City Scenarios & Overrides
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {presets.map((p) => {
            const isActive = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`p-2.5 rounded-xl border font-sans text-left transition-all relative ${
                  isActive 
                    ? 'ring-2 ring-[#8f3c75] border-[#8f3c75] bg-[#faf8f5] shadow-sm' 
                    : p.color
                }`}
                title={p.desc}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="text-sm">{p.icon}</span>
                  {p.label}
                </div>
                <div className="text-[9px] mt-1 text-slate-500 leading-tight truncate-two-lines font-medium">
                  {p.desc}
                </div>
                {isActive && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8f3c75]"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document View Selector */}
      <div className="flex border-b border-slate-100 pb-2 mb-3">
        {(['traffic', 'air', 'weather', 'transit', 'events'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-sans font-bold border-b-2 capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-[#8f3c75] text-[#8f3c75]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'air' ? 'Air Quality' : tab}
          </button>
        ))}
      </div>

      {/* Database Document List */}
      <div className="flex-1 overflow-y-auto max-h-[190px] border border-slate-100 rounded-xl p-3 bg-[#faf8f5]/40">
        <div className="flex justify-between items-center mb-2.5">
          <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <FileText className="w-3 h-3 text-[#8f3c75]" />
            Active Feed Documents
          </div>
          <button 
            onClick={() => setShowJson(!showJson)}
            className="text-[10px] font-sans font-bold text-[#8f3c75] hover:text-[#72305d] flex items-center gap-0.5 cursor-pointer"
          >
            {showJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showJson ? 'View Table Format' : 'View Raw Ground JSON'}
          </button>
        </div>

        {showJson ? (
          <pre className="font-mono text-[10px] bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-[140px] shadow-inner select-all">
            {JSON.stringify(getFilteredData(), null, 2)}
          </pre>
        ) : (
          <div className="space-y-1.5">
            {activeTab === 'traffic' && (getFilteredData() as any[]).map((road) => (
              <div key={road.id} className="bg-white border border-[#e6e2db] p-2 rounded-lg flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-slate-700">{road.roadName} <span className="text-[9px] text-slate-400 font-mono">[{road.id}]</span></span>
                <div className="flex items-center gap-3">
                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                    road.status === 'Clear' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    road.status === 'Moderate' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>{road.status}</span>
                  <span className="font-mono font-semibold text-slate-500">{road.speedMph} mph</span>
                </div>
              </div>
            ))}

            {activeTab === 'air' && (getFilteredData() as any[]).map((sensor) => (
              <div key={sensor.id} className="bg-white border border-[#e6e2db] p-2 rounded-lg flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-slate-700">{sensor.locationName} <span className="text-[9px] text-slate-400 font-mono">[{sensor.id}]</span></span>
                <div className="flex items-center gap-3">
                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                    sensor.aqi <= 50 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    sensor.aqi <= 100 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'
                  }`}>AQI {sensor.aqi} • {sensor.status}</span>
                  <span className="font-mono font-semibold text-slate-500">PM2.5: {sensor.pm25}</span>
                </div>
              </div>
            ))}

            {activeTab === 'weather' && (getFilteredData() as any[]).map((w) => (
              <div key={w.id} className="bg-white border border-[#e6e2db] p-2 rounded-lg flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-slate-700">{w.locationName} <span className="text-[9px] text-slate-400 font-mono">[{w.id}]</span></span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-600">{w.condition}</span>
                  <span className="font-mono font-bold text-[#8f3c75] bg-purple-50 px-1.5 py-0.5 rounded">{w.tempF}°F</span>
                </div>
              </div>
            ))}

            {activeTab === 'transit' && (getFilteredData() as any[]).map((tr) => (
              <div key={tr.id} className="bg-white border border-[#e6e2db] p-2 rounded-lg flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-slate-700">{tr.lineName} <span className="text-[9px] text-slate-400 font-mono">[{tr.id}]</span></span>
                <div className="flex items-center gap-3">
                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                    tr.status === 'On Time' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'
                  }`}>{tr.status}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">{tr.activeVehicles.length} units online</span>
                </div>
              </div>
            ))}

            {activeTab === 'events' && (getFilteredData() as any[]).map((evt) => (
              <div key={evt.id} className="bg-white border border-[#e6e2db] p-2.5 rounded-lg text-xs font-sans flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-[#8f3c75] rounded-full"></span>
                    {evt.title}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded font-bold text-[8px] ${
                    evt.trafficImpact === 'Severe' || evt.trafficImpact === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>{evt.trafficImpact} Impact</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-medium">{evt.description}</p>
              </div>
            ))}

            {(getFilteredData() as any[]).length === 0 && (
              <div className="text-center py-6 text-xs font-sans font-medium text-slate-400 flex flex-col items-center gap-1">
                <AlertCircle className="w-5 h-5 text-slate-300" />
                No documents of this type are currently active in this preset.
              </div>
            )}
          </div>
        )}
      </div>

      {/* RAG Context Summary Banner */}
      <div className="mt-3 bg-[#faf8f5] border border-[#e6e2db] p-2.5 rounded-xl flex items-center gap-2 text-[10px] font-sans font-medium text-slate-600">
        <Sparkles className="w-4 h-4 text-[#8f3c75] shrink-0" />
        <span>
          <strong>Real-time RAG Pipeline:</strong> When chatting, GuideLense searches these exact ground documents, constructs an augmented prompt, and feeds it to Gemini to get up-to-the-minute factual answers.
        </span>
      </div>
    </div>
  );
}
