import React, { useState } from 'react';
import { CityFeedsData } from '../types';
import { Home, Volume2, ShieldCheck, Heart, AlertCircle, Wind, Thermometer, Calendar, Send, PlusCircle, CheckCircle, MapPin, Smile, MessageSquare, Info } from 'lucide-react';

interface ResidentialHubProps {
  feeds: CityFeedsData;
  activePreset: string;
}

interface CitizenReport {
  id: string;
  neighborhood: string;
  category: 'Noise' | 'Safety' | 'Environmental' | 'Infrastructure' | 'Event';
  title: string;
  description: string;
  timestamp: string;
  upvotes: number;
  status: 'Investigating' | 'Resolved' | 'Received';
}

export default function ResidentialHub({ feeds, activePreset }: ResidentialHubProps) {
  // Local state for interactive resident notice board
  const [reports, setReports] = useState<CitizenReport[]>([
    {
      id: 'R1',
      neighborhood: 'Greenwood Park Residential',
      category: 'Noise',
      title: 'Loud subwoofers around central lawns',
      description: 'Persistent loud thumping coming from vehicles parked near the west festival boundary.',
      timestamp: 'Just now',
      upvotes: 14,
      status: 'Received'
    },
    {
      id: 'R2',
      neighborhood: 'North Hills Heights',
      category: 'Infrastructure',
      title: 'Flickering street lamp at Oak & 5th',
      description: 'The primary street lighting on the intersection is completely dark, creating pedestrian visibility issues.',
      timestamp: '2 hours ago',
      upvotes: 8,
      status: 'Investigating'
    },
    {
      id: 'R3',
      neighborhood: 'Riverside Family Promenade',
      category: 'Safety',
      title: 'Riverside Walk bicycle lane clear',
      description: 'The bicycle bypass is clean and fully clear for children this evening.',
      timestamp: '4 hours ago',
      upvotes: 21,
      status: 'Resolved'
    }
  ]);

  // Form input state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Noise' | 'Safety' | 'Environmental' | 'Infrastructure' | 'Event'>('Noise');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Greenwood Park Residential');
  const [showSuccess, setShowSuccess] = useState(false);

  // Dynamic feedback parameters depending on the active scenario
  const getScenarioContext = () => {
    switch (activePreset) {
      case 'GasLeak':
        return {
          alertLevel: 'Severe',
          warning: '⚠️ EMERGENCY SHELTER IN PLACE: Gas Main Leak in industrial zone perimeter. Industrial District residents must keep all windows locked. High air contaminant detected.',
          greenwoodStatus: 'Safe (Outdoor activity discouraged)',
          riversideStatus: 'Safe but windward draft',
          northHillsStatus: 'Completely Clear'
        };
      case 'TransitStrike':
        return {
          alertLevel: 'Moderate',
          warning: '⚠️ ADVISORY: Significant residential commuter disruptions due to Transit Strike. Carpooling encouraged.',
          greenwoodStatus: 'Extremely high vehicle transit noise on perimeter avenues',
          riversideStatus: 'Quiet but high ride-share traffic',
          northHillsStatus: 'Quiet, minimal direct traffic impact'
        };
      case 'SuddenStorm':
        return {
          alertLevel: 'High',
          warning: '⛈️ SEVERE WEATHER WARNING: Torrential downpours. Greenwood Park Canopy reports localized water pooling. Residents are advised to avoid low grounds.',
          greenwoodStatus: 'Heavy pooling, flash flood watch',
          riversideStatus: 'High waves near riverwalk promenade',
          northHillsStatus: 'High winds, secure light outdoor fixtures'
        };
      case 'MusicFestival':
        return {
          alertLevel: 'Notice',
          warning: '🎉 FESTIVAL EVENT: Metropolis Summer Sound Clash at Greenwood Lawn. High noise levels are expected in the Greenwood neighborhood until 11:00 PM.',
          greenwoodStatus: 'Decibel limits exceeded. Multi-vehicle pedestrian crowd.',
          riversideStatus: 'Moderate ambient music audible',
          northHillsStatus: 'Quiet, elevated panoramic views of festival lights'
        };
      default:
        return {
          alertLevel: 'Normal',
          warning: '🟢 OPTIMAL STATUS: Sector 7 residential sectors report quiet, clean, and safe conditions. Outdoor environments are perfect.',
          greenwoodStatus: 'Perfect quiet flow, clear skies',
          riversideStatus: 'Calm water walk, serene sunset',
          northHillsStatus: 'Pleasant temperature, crystal views'
        };
    }
  };

  const context = getScenarioContext();

  // Neighborhood Data Structure
  const residentialAreas = [
    {
      name: 'Greenwood Park Residential',
      location: 'Sector 7 - West Quadrant',
      coordinates: 'Coordinates [X: 220, Y: 130]',
      baseNoise: activePreset === 'MusicFestival' ? '78 dB (Loud)' : activePreset === 'TransitStrike' ? '64 dB (Moderate)' : '41 dB (Very Quiet)',
      quietScore: activePreset === 'MusicFestival' ? 'D+' : activePreset === 'TransitStrike' ? 'B-' : 'A+',
      aqiText: `${feeds.airQuality[0]?.aqi || 22} AQI (${feeds.airQuality[0]?.status || 'Good'})`,
      aqiValue: feeds.airQuality[0]?.aqi || 22,
      tempText: `${feeds.weather[2]?.tempF || 68}°F, ${feeds.weather[2]?.condition || 'Sunny'}`,
      description: 'Charming green suburb flanked by Greenwood park lawns. Popular for young families and runners.',
      statusComment: context.greenwoodStatus
    },
    {
      name: 'North Hills Heights',
      location: 'Sector 7 - Northeast Ridge',
      coordinates: 'Coordinates [X: 480, Y: 80]',
      baseNoise: activePreset === 'SuddenStorm' ? '58 dB (Windy)' : '38 dB (Pristine Silent)',
      quietScore: activePreset === 'SuddenStorm' ? 'A-' : 'A++',
      aqiText: `${feeds.airQuality[0]?.aqi ? Math.floor(feeds.airQuality[0].aqi * 0.9) : 20} AQI (Good)`,
      aqiValue: feeds.airQuality[0]?.aqi ? Math.floor(feeds.airQuality[0].aqi * 0.9) : 20,
      tempText: `${feeds.weather[2]?.tempF || 68}°F, ${feeds.weather[2]?.condition || 'Sunny'}`,
      description: 'Elevated luxury residential complex with clean, fast air filtration and exceptional panoramic vistas of the Sector 7 skyline.',
      statusComment: context.northHillsStatus
    },
    {
      name: 'Riverside Family Promenade',
      location: 'Sector 7 - South Waterways',
      coordinates: 'Coordinates [X: 350, Y: 410]',
      baseNoise: activePreset === 'SuddenStorm' ? '65 dB (River Surge)' : activePreset === 'TransitStrike' ? '54 dB (Moderate)' : '44 dB (Very Quiet)',
      quietScore: activePreset === 'SuddenStorm' ? 'B+' : activePreset === 'TransitStrike' ? 'A-' : 'A',
      aqiText: `${feeds.airQuality[3]?.aqi || 31} AQI (${feeds.airQuality[3]?.status || 'Good'})`,
      aqiValue: feeds.airQuality[3]?.aqi || 31,
      tempText: `${feeds.weather[1]?.tempF || 71}°F, ${feeds.weather[1]?.condition || 'Windy'}`,
      description: 'Lively pedestrian-friendly waterfront blocks and lofts. Boasts scenic trails, family decks, and public seating docks.',
      statusComment: context.riversideStatus
    }
  ];

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newReport: CitizenReport = {
      id: `R${reports.length + 1}`,
      neighborhood: selectedNeighborhood,
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim(),
      timestamp: '1 min ago',
      upvotes: 1,
      status: 'Received'
    };

    setReports([newReport, ...reports]);
    setNewTitle('');
    setNewDesc('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUpvote = (id: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === id) {
        return { ...rep, upvotes: rep.upvotes + 1 };
      }
      return rep;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="residential-hub-root-container">
      
      {/* 🏢 LEFT SIDEBAR: Residential Area Selector & Stats (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Scenario Alert Bar */}
        <div className={`p-4 rounded-2xl border ${
          activePreset === 'GasLeak' ? 'bg-red-50 border-red-200 text-red-900' :
          activePreset === 'SuddenStorm' ? 'bg-[#ffedd5] border-[#e28c7c]/40 text-amber-900' :
          activePreset === 'MusicFestival' ? 'bg-purple-50 border-purple-200 text-[#8f3c75]' :
          'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#e28c7c]" />
            <div>
              <h4 className="font-display font-black text-xs tracking-tight uppercase">Neighborhood Bulletins</h4>
              <p className="font-sans text-[11px] leading-relaxed mt-1 font-semibold">{context.warning}</p>
            </div>
          </div>
        </div>

        {/* List of Residential Areas */}
        <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Home className="w-5 h-5 text-[#e28c7c]" />
            <div>
              <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Active Residential Sectors</h3>
              <p className="font-sans text-[10px] text-slate-500 font-medium">Environmental metrics tuned for residential quarters</p>
            </div>
          </div>

          <div className="space-y-4">
            {residentialAreas.map((area, idx) => {
              const scoreColor = area.quietScore.startsWith('A') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                                 area.quietScore.startsWith('B') ? 'text-[#2ea3a3] bg-teal-50 border-[#2ea3a3]/20' :
                                 area.quietScore.startsWith('C') ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                                 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse';

              const aqiBg = area.aqiValue <= 50 ? 'bg-emerald-500' :
                            area.aqiValue <= 100 ? 'bg-amber-400' : 'bg-rose-500';

              return (
                <div key={idx} className="border border-[#e6e2db] rounded-xl p-3.5 hover:border-[#e28c7c] transition-colors bg-[#faf8f5]/40">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-display font-black text-slate-800 text-xs tracking-tight">{area.name}</h4>
                      <p className="font-sans text-[9px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#e28c7c]" /> {area.location} • {area.coordinates}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg border text-xs font-mono font-black ${scoreColor}`} title="Quiet Zone Score">
                      {area.quietScore}
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-slate-500 font-medium leading-relaxed mb-3">
                    {area.description}
                  </p>

                  {/* Badges bar */}
                  <div className="grid grid-cols-3 gap-2 border-t border-dashed border-[#e6e2db] pt-2.5 text-[10px] font-sans font-bold">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[9px] uppercase">Ambient AQI</span>
                      <span className="text-slate-700 flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${aqiBg}`}></span>
                        {area.aqiText}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[9px] uppercase">Noise Level</span>
                      <span className="text-slate-700 flex items-center gap-1 mt-0.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#8f3c75]" />
                        {area.baseNoise}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[9px] uppercase">Local Climate</span>
                      <span className="text-slate-700 flex items-center gap-1 mt-0.5">
                        <Thermometer className="w-3.5 h-3.5 text-[#2ea3a3]" />
                        {area.tempText}
                      </span>
                    </div>
                  </div>

                  {/* Safety comments */}
                  <div className="mt-3 bg-white border border-[#e6e2db] rounded-lg p-2 flex items-center gap-1.5 text-[9px] text-slate-600 font-sans font-semibold">
                    <Info className="w-3.5 h-3.5 text-[#208ca2] shrink-0" />
                    <span>Live Condition: <strong className="text-[#8f3c75]">{area.statusComment}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 📝 RIGHT PANEL: Citizen Notice Board & Interactive Submissions (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Interactive Notice Submission Form */}
        <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <PlusCircle className="w-5 h-5 text-[#e28c7c]" />
            <div>
              <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Report Local Activity / Noise Complaint</h3>
              <p className="font-sans text-[10px] text-slate-500 font-medium">Alert fellow residents and stream reports directly to city servers</p>
            </div>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-3.5">
            {showSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-2.5 flex items-center gap-1.5 font-sans font-semibold animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Report logged successfully! Appended to live Grounding indexes.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-sans font-black text-slate-500 uppercase tracking-wider block mb-1">Target Sector</label>
                <select 
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full font-sans text-xs border border-[#e6e2db] bg-[#faf8f5] p-2.5 rounded-xl focus:ring-2 focus:ring-[#e28c7c] focus:outline-none"
                >
                  <option value="Greenwood Park Residential">Greenwood Park Residential</option>
                  <option value="North Hills Heights">North Hills Heights</option>
                  <option value="Riverside Family Promenade">Riverside Family Promenade</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-sans font-black text-slate-500 uppercase tracking-wider block mb-1">Issue Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full font-sans text-xs border border-[#e6e2db] bg-[#faf8f5] p-2.5 rounded-xl focus:ring-2 focus:ring-[#e28c7c] focus:outline-none"
                >
                  <option value="Noise">Decibel / Noise Complaint</option>
                  <option value="Safety">Safety & Pedestrian Hazard</option>
                  <option value="Environmental">Environmental / Air Outage</option>
                  <option value="Infrastructure">Infrastructure Outage (Water/Road)</option>
                  <option value="Event">Neighborhood Event Notice</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-sans font-black text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Brief summary e.g. 'Sewer backup on Elm Boulevard'"
                className="w-full font-sans text-xs border border-[#e6e2db] p-2.5 rounded-xl focus:ring-2 focus:ring-[#e28c7c] focus:outline-none bg-[#faf8f5]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-sans font-black text-slate-500 uppercase tracking-wider block mb-1">Description / Notes</label>
              <textarea 
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detail instructions, coordinates, or specific vehicle decibel alerts..."
                className="w-full font-sans text-xs border border-[#e6e2db] p-2.5 rounded-xl focus:ring-2 focus:ring-[#e28c7c] focus:outline-none bg-[#faf8f5]"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#e28c7c] hover:bg-[#d47868] text-white font-sans font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Citizen Dispatch
              </button>
            </div>
          </form>
        </div>

        {/* Live Citizen Notice Board Output */}
        <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#e28c7c]" />
              <div>
                <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Resident Dispatch Board</h3>
                <p className="font-sans text-[10px] text-slate-500 font-medium">Peer-vetted environmental and sound observations</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#faf8f5] border border-[#e6e2db] text-slate-600 px-2 py-0.5 rounded-full">
              {reports.length} Reports active
            </span>
          </div>

          <div className="space-y-3.5">
            {reports.map((rep) => {
              const tagColor = rep.category === 'Noise' ? 'text-[#8f3c75] bg-purple-50 border-purple-100' :
                               rep.category === 'Safety' ? 'text-rose-600 bg-rose-50 border-rose-100' :
                               rep.category === 'Environmental' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                               rep.category === 'Infrastructure' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                               'text-[#208ca2] bg-teal-50 border-teal-100';

              const statusColor = rep.status === 'Resolved' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                                  rep.status === 'Investigating' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                                  'text-slate-600 bg-slate-100 border-slate-200';

              return (
                <div key={rep.id} className="border border-[#e6e2db] rounded-xl p-3.5 bg-[#faf8f5]/20 hover:bg-white transition-colors flex gap-3.5 items-start">
                  
                  {/* Upvote Button Column */}
                  <button 
                    onClick={() => handleUpvote(rep.id)}
                    className="border border-[#e6e2db] hover:border-[#e28c7c] hover:bg-[#ffedd5]/30 rounded-xl p-2 flex flex-col items-center gap-1 transition-all min-w-[40px] cursor-pointer"
                  >
                    <Smile className="w-4 h-4 text-[#e28c7c]" />
                    <span className="font-mono text-xs font-black text-slate-700">{rep.upvotes}</span>
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border uppercase ${tagColor}`}>
                        {rep.category}
                      </span>
                      <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border uppercase ${statusColor}`}>
                        {rep.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-sans ml-auto">
                        {rep.timestamp}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-xs text-slate-800 tracking-tight">
                      {rep.title}
                    </h4>

                    <p className="font-sans text-[11px] text-slate-500 font-medium leading-relaxed">
                      {rep.description}
                    </p>

                    <div className="text-[10px] font-sans font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#e28c7c]" />
                      <span>{rep.neighborhood}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
