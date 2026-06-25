import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Car, 
  Wind, 
  CloudSun, 
  Calendar, 
  Bus, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  X,
  Navigation,
  Droplets,
  Thermometer
} from 'lucide-react';
import { CITIES_DATABASE, generateDynamicCityData, CityData } from './data/cities';

export default function App() {
  // Splash screen state
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected city object (active on the "separate page")
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  
  // Active detailed feature view (separate page for each of the 5 options)
  const [selectedFeature, setSelectedFeature] = useState<'traffic' | 'pollution' | 'weather' | 'events' | 'transit' | null>(null);

  // Find matches from pre-configured list plus typed fallbacks
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    // Look for exact or partial matches in the database
    const matches = Object.values(CITIES_DATABASE).filter(city => 
      city.name.toLowerCase().includes(query) || 
      (city.alternativeName && city.alternativeName.toLowerCase().includes(query)) ||
      city.country.toLowerCase().includes(query)
    );
    
    // If no matches are found in database, dynamically create a result for whatever they typed!
    if (matches.length === 0 && searchQuery.length >= 2) {
      matches.push(generateDynamicCityData(searchQuery));
    }
    
    return matches;
  }, [searchQuery]);

  // Handle selecting a city from quick buttons or search preview
  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);
    setSelectedFeature(null); // Show the feature blocks hub first
    setSearchQuery(''); // Clear search so they can search again later
  };

  // Get color for overall city status badge
  const getOverallStatusColor = (status: CityData['overallStatus']) => {
    switch (status) {
      case 'Optimal':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Normal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Moderate Congestion':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Weather Alert':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Active Festival':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Get color for AQI rating
  const getAqiColorClasses = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Good' };
    if (aqi <= 100) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Moderate' };
    if (aqi <= 150) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'Poor / Sensitive' };
    if (aqi <= 200) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Unhealthy' };
    return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'Hazardous' };
  };

  // Get color for traffic road status
  const getTrafficColor = (status: 'Clear' | 'Moderate' | 'Heavy' | 'Blocked') => {
    switch (status) {
      case 'Clear': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Moderate': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Heavy': return 'text-orange-600 bg-orange-50 border-orange-100 animate-pulse';
      case 'Blocked': return 'text-red-600 bg-red-50 border-red-200 font-bold';
    }
  };

  // Helper to count active issues in traffic
  const getHeavyTrafficCount = (city: CityData) => {
    return city.traffic.filter(t => t.status === 'Heavy' || t.status === 'Blocked').length;
  };

  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-slate-800 selection:bg-[#8f3c75] selection:text-white" id="landing-page">
        <style>{`
          @keyframes loading-progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-loading {
            animation: loading-progress 3s linear forwards;
          }
        `}</style>
        
        <div className="max-w-md w-full text-center space-y-8 relative">
          {/* Decorative glowing backdrops */}
          <div className="absolute inset-0 -z-10 bg-radial from-[#8f3c75]/5 to-transparent blur-2xl rounded-full scale-150 pointer-events-none" />
          
          <div className="space-y-4">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-[#8f3c75] text-white flex items-center justify-center shadow-xl shadow-[#8f3c75]/15 animate-bounce">
              <MapPin className="w-10 h-10 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display font-black text-slate-800 text-4xl tracking-tight">
                GuideLense
              </h1>
              <p className="text-xs text-[#8f3c75] font-sans font-extrabold uppercase tracking-widest">
                City Intelligence Assistant
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-sans font-medium leading-relaxed max-w-xs mx-auto">
            Accessing real-time municipal networks, air quality indicators, thermal sensors, and street congestion feeds.
          </p>

          <div className="space-y-3 pt-4">
            {/* Elegant 3s animated loading bar */}
            <div className="h-1.5 w-48 bg-slate-200/80 rounded-full mx-auto overflow-hidden border border-slate-300/20">
              <div className="h-full bg-gradient-to-r from-[#8f3c75] to-purple-600 rounded-full animate-loading" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase animate-pulse">
              Establishing live feed sync...
            </p>
          </div>

          {/* Core metadata stats/pairings */}
          <div className="pt-8 border-t border-[#e6e2db]/60 grid grid-cols-3 gap-2 text-[10px] font-sans font-bold text-slate-400">
            <div>
              <span className="text-slate-500 block">TRAFFIC</span>
              <span>LIVE</span>
            </div>
            <div className="border-x border-[#e6e2db]/60">
              <span className="text-slate-500 block">POLLUTION</span>
              <span>INDEXED</span>
            </div>
            <div>
              <span className="text-slate-500 block">WEATHER</span>
              <span>SECURED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col antialiased selection:bg-[#8f3c75] selection:text-white" id="citylens-root">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-[#e6e2db] py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setSelectedCity(null); setSelectedFeature(null); }}>
            <div className="h-9 w-9 rounded-xl bg-[#8f3c75] text-white flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-black text-slate-800 text-lg tracking-tight">CityLens</h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-tight -mt-0.5">Simple Live Urban Feeds</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-sans font-bold text-slate-500 bg-[#faf8f5] border border-[#e6e2db] px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Factual ground documents connected</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
        
        {/* VIEW 1: SEARCH PAGE */}
        {!selectedCity ? (
          <div className="space-y-8 py-4 animate-fade-in" id="search-view">
            
            {/* Visual Intro Banner */}
            <div className="text-center space-y-3 py-4">
              <span className="text-[10px] bg-purple-50 text-[#8f3c75] border border-purple-200/50 font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Simplified City Intelligence
              </span>
              <h2 className="font-display font-black text-slate-800 text-3xl md:text-4xl tracking-tight leading-tight">
                Understand Your City Instantly
              </h2>
              <p className="font-sans text-slate-500 text-sm md:text-base max-w-md mx-auto font-medium">
                Search road congestion, real-time weather sensors, air pollution indexes, public transits, and events in one simple click.
              </p>
            </div>

            {/* SEARCH BOX CARD */}
            <div className="bg-white border border-[#e6e2db] rounded-3xl p-6 shadow-sm space-y-4 max-w-xl mx-auto" id="search-panel">
              <label className="block text-xs font-sans font-black text-slate-400 uppercase tracking-wider">
                Type City Name Below
              </label>
              
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input 
                  type="text" 
                  placeholder='Try searching "Prayagraj", "New York", "Tokyo"...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full font-sans text-sm border-2 border-[#e6e2db] bg-[#faf8f5] focus:bg-white pl-11 pr-10 py-3 rounded-2xl focus:outline-none focus:border-[#8f3c75] transition-all font-semibold"
                  id="city-search-input"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* QUICK SUGGESTION PILLS */}
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => handleSelectCity(CITIES_DATABASE.prayagraj)}
                    className="px-3 py-1.5 rounded-xl border border-[#e6e2db] bg-white hover:bg-purple-50 hover:border-[#8f3c75]/30 text-xs font-sans font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
                  >
                    📍 Prayagraj (Allahabad)
                  </button>
                  <button 
                    onClick={() => handleSelectCity(CITIES_DATABASE.newyork)}
                    className="px-3 py-1.5 rounded-xl border border-[#e6e2db] bg-white hover:bg-purple-50 hover:border-[#8f3c75]/30 text-xs font-sans font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
                  >
                    🇺🇸 New York
                  </button>
                  <button 
                    onClick={() => handleSelectCity(CITIES_DATABASE.tokyo)}
                    className="px-3 py-1.5 rounded-xl border border-[#e6e2db] bg-white hover:bg-purple-50 hover:border-[#8f3c75]/30 text-xs font-sans font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
                  >
                    🇯🇵 Tokyo
                  </button>
                  <button 
                    onClick={() => handleSelectCity(CITIES_DATABASE.london)}
                    className="px-3 py-1.5 rounded-xl border border-[#e6e2db] bg-white hover:bg-purple-50 hover:border-[#8f3c75]/30 text-xs font-sans font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
                  >
                    🇬🇧 London
                  </button>
                  <button 
                    onClick={() => handleSelectCity(CITIES_DATABASE.newdelhi)}
                    className="px-3 py-1.5 rounded-xl border border-[#e6e2db] bg-white hover:bg-purple-50 hover:border-[#8f3c75]/30 text-xs font-sans font-bold text-slate-600 transition-all cursor-pointer shadow-sm"
                  >
                    🇮🇳 New Delhi
                  </button>
                </div>
              </div>
            </div>

            {/* SMALL BAR BOX PREVIEW CONTAINER (Triggered on search match) */}
            {searchQuery.trim().length > 0 && (
              <div className="space-y-3 max-w-xl mx-auto" id="search-preview-results">
                <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest block px-1">
                  Matching Search Results:
                </span>
                
                {searchResults.map((city) => {
                  const isConfigured = Object.keys(CITIES_DATABASE).includes(city.id);
                  const aqiDetails = getAqiColorClasses(city.pollution.aqi);
                  
                  return (
                    <div 
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className="bg-white border-2 border-[#e6e2db] hover:border-[#8f3c75] rounded-2xl p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md"
                      id={`city-small-bar-box-${city.id}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📍</span>
                          <h4 className="font-display font-black text-slate-800 text-sm">
                            {city.name} {city.alternativeName ? `(${city.alternativeName})` : ''}
                          </h4>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-mono font-bold px-1.5 py-0.5 rounded">
                            {city.country}
                          </span>
                          {!isConfigured && (
                            <span className="text-[9px] bg-purple-50 text-[#8f3c75] font-sans font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> AI Generated
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-[11px] text-slate-500 italic max-w-sm">
                          "{city.tagline}"
                        </p>
                      </div>

                      {/* Micro quick indicators in the small bar box */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="flex gap-2">
                          {/* Weather pill */}
                          <div className="bg-amber-50 border border-amber-100 text-amber-700 px-2 py-1 rounded-xl text-[10px] font-sans font-bold flex items-center gap-1">
                            <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                            <span>{city.weather.tempF}°F</span>
                          </div>
                          
                          {/* AQI pill */}
                          <div className={`${aqiDetails.bg} border ${aqiDetails.border} ${aqiDetails.text} px-2 py-1 rounded-xl text-[10px] font-sans font-bold flex items-center gap-1`}>
                            <Wind className="w-3.5 h-3.5" />
                            <span>AQI {city.pollution.aqi}</span>
                          </div>
                        </div>

                        {/* Trigger button */}
                        <div className="text-[#8f3c75] p-1.5 bg-purple-50 rounded-xl hover:bg-[#8f3c75] hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* App Explanation Graphic */}
            <div className="max-w-xl mx-auto border border-[#e6e2db] bg-white/40 rounded-2xl p-4 text-center text-xs text-slate-400 font-sans font-semibold">
              ✨ GuideLense Simple version allows rapid lookup for the entire municipal network feeds. Type any custom city to simulate live sensor overlays dynamically.
            </div>

          </div>
        ) : (
          
          /* VIEW 2: SEPARATE CITY LAYOUTS (Hub Screen or Feature screen) */
          <div className="space-y-6 py-2 animate-fade-in" id="city-separate-page">
            
            {/* HUB MENU SCREEN (When no specific feature/option is selected yet) */}
            {!selectedFeature ? (
              <div className="space-y-6" id="city-hub-menu">
                {/* Back to search button */}
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedCity(null)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#e6e2db] rounded-xl bg-white hover:bg-slate-50 text-xs font-sans font-bold text-slate-600 transition-all shadow-sm cursor-pointer"
                    id="back-to-search-btn"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                    <span>Back to Search</span>
                  </button>
                  
                  <span className={`text-[10px] border px-2.5 py-1 rounded-full font-sans font-bold uppercase tracking-wider ${getOverallStatusColor(selectedCity.overallStatus)}`}>
                    Status: {selectedCity.overallStatus}
                  </span>
                </div>

                {/* City Hero Banner Info */}
                <div className="bg-white border border-[#e6e2db] rounded-3xl p-6 shadow-sm relative overflow-hidden" id="city-hero-card">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-[#8f3c75]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="space-y-2 relative z-10">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-xl">📍</span>
                      <h2 className="font-display font-black text-slate-800 text-2xl md:text-3xl tracking-tight">
                        {selectedCity.name}
                      </h2>
                      {selectedCity.alternativeName && (
                        <span className="font-display text-slate-400 text-lg">
                          ({selectedCity.alternativeName})
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold bg-[#faf8f5] border border-[#e6e2db] px-2.5 py-0.5 rounded-full text-slate-500">
                        {selectedCity.country} {selectedCity.state ? `• ${selectedCity.state}` : ''}
                      </span>
                    </div>
                    
                    <p className="font-sans text-xs md:text-sm font-bold text-[#8f3c75] tracking-tight">
                      ✨ {selectedCity.tagline}
                    </p>
                    
                    <p className="font-sans text-xs text-slate-500 leading-relaxed font-medium pt-1 max-w-2xl border-t border-slate-100">
                      {selectedCity.shortDescription}
                    </p>
                  </div>
                </div>

                {/* VISUAL DESIGN DIRECTION: CENTERED 5 FEATURE BLOCKS GRID */}
                <div className="space-y-4">
                  <div className="text-center md:text-left">
                    <h3 className="font-display font-black text-slate-800 text-base tracking-tight">
                      Select a live municipal option to explore:
                    </h3>
                    <p className="text-xs text-slate-400 font-sans font-semibold">
                      Click any block to open its separate live feed details
                    </p>
                  </div>

                  {/* 5 Box Blocks Grid (Reflecting requested visual style in attached mockup) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5" id="five-options-blocks-grid">
                    
                    {/* BLOCK 1: Traffic feeds */}
                    <button 
                      onClick={() => setSelectedFeature('traffic')}
                      className="bg-white border-2 border-[#e6e2db] hover:border-[#8f3c75] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-pointer"
                      id="block-option-traffic"
                    >
                      <div className="h-14 w-14 rounded-full bg-purple-50 group-hover:bg-[#8f3c75] transition-colors flex items-center justify-center text-[#8f3c75] group-hover:text-white shadow-inner">
                        <Car className="w-7 h-7" />
                      </div>
                      <h4 className="font-display font-black text-slate-800 text-xs sm:text-sm mt-3 tracking-tight">
                        Traffic Feeds
                      </h4>
                      <div className="mt-2 bg-[#faf8f5] px-2 py-0.5 rounded-lg border border-[#e6e2db] text-[9px] font-mono font-bold text-slate-500 max-w-full truncate">
                        {getHeavyTrafficCount(selectedCity) > 0 ? (
                          <span className="text-orange-600 animate-pulse">⚠️ {getHeavyTrafficCount(selectedCity)} Delays</span>
                        ) : (
                          <span>🟢 Clear roads</span>
                        )}
                      </div>
                    </button>

                    {/* BLOCK 2: Pollution data */}
                    <button 
                      onClick={() => setSelectedFeature('pollution')}
                      className="bg-white border-2 border-[#e6e2db] hover:border-[#2ea3a3] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-pointer"
                      id="block-option-pollution"
                    >
                      <div className="h-14 w-14 rounded-full bg-teal-50 group-hover:bg-[#2ea3a3] transition-colors flex items-center justify-center text-[#2ea3a3] group-hover:text-white shadow-inner">
                        <Wind className="w-7 h-7" />
                      </div>
                      <h4 className="font-display font-black text-slate-800 text-xs sm:text-sm mt-3 tracking-tight">
                        Pollution Data
                      </h4>
                      <div className="mt-2 bg-teal-50/50 px-2 py-0.5 rounded-lg border border-teal-100 text-[9px] font-mono font-bold text-[#2ea3a3] max-w-full truncate">
                        AQI {selectedCity.pollution.aqi} • {selectedCity.pollution.status}
                      </div>
                    </button>

                    {/* BLOCK 3: Weather */}
                    <button 
                      onClick={() => setSelectedFeature('weather')}
                      className="bg-white border-2 border-[#e6e2db] hover:border-amber-500 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-pointer"
                      id="block-option-weather"
                    >
                      <div className="h-14 w-14 rounded-full bg-amber-50 group-hover:bg-amber-500 transition-colors flex items-center justify-center text-amber-500 group-hover:text-white shadow-inner">
                        <CloudSun className="w-7 h-7" />
                      </div>
                      <h4 className="font-display font-black text-slate-800 text-xs sm:text-sm mt-3 tracking-tight">
                        Weather Info
                      </h4>
                      <div className="mt-2 bg-amber-50/50 px-2 py-0.5 rounded-lg border border-amber-100 text-[9px] font-mono font-bold text-amber-700 max-w-full truncate">
                        {selectedCity.weather.tempF}°F • {selectedCity.weather.condition}
                      </div>
                    </button>

                    {/* BLOCK 4: Local events */}
                    <button 
                      onClick={() => setSelectedFeature('events')}
                      className="bg-white border-2 border-[#e6e2db] hover:border-[#e28c7c] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-pointer"
                      id="block-option-events"
                    >
                      <div className="h-14 w-14 rounded-full bg-rose-50 group-hover:bg-[#e28c7c] transition-colors flex items-center justify-center text-[#e28c7c] group-hover:text-white shadow-inner">
                        <Calendar className="w-7 h-7" />
                      </div>
                      <h4 className="font-display font-black text-slate-800 text-xs sm:text-sm mt-3 tracking-tight">
                        Local Events
                      </h4>
                      <div className="mt-2 bg-rose-50/50 px-2 py-0.5 rounded-lg border border-rose-100 text-[9px] font-mono font-bold text-[#e28c7c] max-w-full truncate">
                        {selectedCity.events.length} Events Listed
                      </div>
                    </button>

                    {/* BLOCK 5: Public transport data */}
                    <button 
                      onClick={() => setSelectedFeature('transit')}
                      className="bg-white border-2 border-[#e6e2db] hover:border-blue-600 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group transform hover:-translate-y-1 cursor-pointer col-span-2 sm:col-span-1"
                      id="block-option-transit"
                    >
                      <div className="h-14 w-14 rounded-full bg-blue-50 group-hover:bg-blue-600 transition-colors flex items-center justify-center text-blue-600 group-hover:text-white shadow-inner">
                        <Bus className="w-7 h-7" />
                      </div>
                      <h4 className="font-display font-black text-slate-800 text-xs sm:text-sm mt-3 tracking-tight">
                        Public Transport
                      </h4>
                      <div className="mt-2 bg-blue-50/50 px-2 py-0.5 rounded-lg border border-blue-100 text-[9px] font-mono font-bold text-blue-700 max-w-full truncate">
                        {selectedCity.transit.length} Active Lines
                      </div>
                    </button>

                  </div>
                </div>

                {/* Extra guidance */}
                <div className="bg-white border border-[#e6e2db] rounded-2xl p-4 text-center text-xs text-slate-400 font-sans font-semibold">
                  💡 Clicking any of the 5 options above will automatically open a dedicated, isolated page for that feature alone.
                </div>
              </div>
            ) : (
              
              /* SEPARATE FEATURE DEDICATED VIEW (Shown when an option block was selected) */
              <div className="space-y-6" id="separate-feature-view">
                
                {/* Back button to Hub menu */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedFeature(null)}
                      className="flex items-center gap-1.5 px-3.5 py-2 border border-[#e6e2db] rounded-xl bg-white hover:bg-slate-50 text-xs font-sans font-bold text-slate-600 transition-all shadow-sm cursor-pointer"
                      id="back-to-menu-btn"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-400" />
                      <span>Back to {selectedCity.name} Hub</span>
                    </button>
                    
                    <button 
                      onClick={() => { setSelectedCity(null); setSelectedFeature(null); }}
                      className="text-slate-400 hover:text-slate-600 text-xs font-sans font-bold px-2 py-2"
                    >
                      New Search
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-semibold font-sans flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8f3c75]" />
                    <span>Viewing live feed of <strong>{selectedCity.name}, {selectedCity.country}</strong></span>
                  </div>
                </div>

                {/* THE DEDICATED SEPARATE FEATURE CARDS */}
                <div className="bg-white border border-[#e6e2db] rounded-3xl p-6 shadow-sm min-h-[350px]" id="isolated-feature-container">
                  
                  {/* SEPARATE DEDICATED TRAFFIC PAGE */}
                  {selectedFeature === 'traffic' && (
                    <div className="space-y-5 animate-fade-in" id="dedicated-traffic-page">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-50 text-[#8f3c75] flex items-center justify-center">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-slate-800 text-base">Traffic & Congestion Reports</h3>
                          <p className="font-sans text-xs text-slate-500 font-medium">Real-time street delays, bottlenecks, and sensor incidents inside {selectedCity.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCity.traffic.map((item, idx) => (
                          <div key={idx} className="border border-[#e6e2db] p-4 rounded-2xl bg-[#faf8f5]/40 flex flex-col justify-between gap-3 hover:border-[#8f3c75]/40 hover:bg-white transition-all">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-[9px] text-slate-400 font-black block tracking-wider uppercase">ROAD LINK</span>
                                <h4 className="font-sans font-extrabold text-slate-800 text-sm leading-tight">{item.road}</h4>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md border font-sans font-black uppercase shrink-0 ${getTrafficColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-sans">
                              <div>
                                <span className="text-slate-400 font-semibold block text-[9px] uppercase">Speed Indicator</span>
                                <strong className="text-slate-700 font-black text-xs">{item.speed}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 font-semibold block text-[9px] uppercase">Delay Assessment</span>
                                <strong className={item.delay !== 'None' ? 'text-[#8f3c75] font-black text-xs' : 'text-slate-700 font-bold text-xs'}>{item.delay}</strong>
                              </div>
                            </div>

                            {item.incident && (
                              <div className="mt-1 bg-amber-50/80 border border-amber-100 p-2.5 rounded-xl text-xs text-amber-800 font-sans font-bold flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <span>{item.incident}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEPARATE DEDICATED POLLUTION PAGE */}
                  {selectedFeature === 'pollution' && (
                    <div className="space-y-6 animate-fade-in" id="dedicated-pollution-page">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-teal-50 text-[#2ea3a3] flex items-center justify-center">
                          <Wind className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-slate-800 text-base">Air Quality Indices (AQI)</h3>
                          <p className="font-sans text-xs text-slate-500 font-medium">Ecological particulates and safe breathing metrics in {selectedCity.name}</p>
                        </div>
                      </div>

                      {/* Main gauge visual block */}
                      {(() => {
                        const aqiInfo = getAqiColorClasses(selectedCity.pollution.aqi);
                        return (
                          <div className="border border-[#e6e2db] rounded-2xl p-5 bg-[#faf8f5]/50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="space-y-3 flex-1">
                              <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest block">Main Sensor Value</span>
                              <div className="flex items-baseline gap-2">
                                <span className={`font-mono text-5xl font-black ${aqiInfo.text}`}>{selectedCity.pollution.aqi}</span>
                                <span className={`text-xs px-3 py-1 rounded-full border font-sans font-black ${aqiInfo.bg} ${aqiInfo.border} ${aqiInfo.text}`}>
                                  {aqiInfo.label}
                                </span>
                              </div>
                              <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-bold">
                                💡 Advice: {selectedCity.pollution.advice}
                              </p>
                            </div>

                            <div className="w-full md:w-64 space-y-2 shrink-0">
                              <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest block">Relative Exposure scale</span>
                              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                                <div className="bg-emerald-500 h-full" style={{ width: '20%' }} />
                                <div className="bg-yellow-400 h-full" style={{ width: '20%' }} />
                                <div className="bg-orange-400 h-full" style={{ width: '20%' }} />
                                <div className="bg-red-500 h-full" style={{ width: '20%' }} />
                                <div className="bg-purple-600 h-full" style={{ width: '20%' }} />
                              </div>
                              <div className="flex justify-between text-[8px] font-mono font-black text-slate-400 px-1">
                                <span>0 (Good)</span>
                                <span>100</span>
                                <span>200</span>
                                <span>300+ (Hazardous)</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Secondary particulate blocks */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="border border-[#e6e2db] p-4 rounded-2xl bg-white text-center shadow-inner">
                          <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">PM2.5 Level</span>
                          <strong className="font-mono text-xl font-black text-slate-700">{selectedCity.pollution.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></strong>
                        </div>

                        <div className="border border-[#e6e2db] p-4 rounded-2xl bg-white text-center shadow-inner">
                          <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">PM10 Level</span>
                          <strong className="font-mono text-xl font-black text-slate-700">{selectedCity.pollution.pm10} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></strong>
                        </div>

                        <div className="border border-[#e6e2db] p-4 rounded-2xl bg-white text-center shadow-inner">
                          <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">NO2 Concentration</span>
                          <strong className="font-mono text-xl font-black text-slate-700">{selectedCity.pollution.no2} <span className="text-[10px] font-normal text-slate-500">ppb</span></strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEPARATE DEDICATED WEATHER PAGE */}
                  {selectedFeature === 'weather' && (
                    <div className="space-y-6 animate-fade-in" id="dedicated-weather-page">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                          <CloudSun className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-slate-800 text-base">Weather Sensor Specs</h3>
                          <p className="font-sans text-xs text-slate-500 font-medium">Factual atmospheric sensors, wind metrics, and 5-day local forecasts in {selectedCity.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Current metrics */}
                        <div className="md:col-span-5 border border-[#e6e2db] p-5 rounded-2xl bg-[#faf8f5]/40 flex flex-col justify-between gap-5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest block">Standard Reading</span>
                            <h4 className="font-sans font-black text-slate-800 text-sm">{selectedCity.weather.condition}</h4>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl border border-amber-100 shadow-sm">
                              <CloudSun className="w-8 h-8 animate-pulse" />
                            </div>
                            <div>
                              <div className="font-mono text-3xl font-black text-slate-800">
                                {selectedCity.weather.tempF}°F <span className="text-slate-400 text-lg font-medium">/ {selectedCity.weather.tempC}°C</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold">Standard thermal sensor overlay</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[10px] font-sans font-black text-slate-500">
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">Humidity</span>
                              <span className="text-slate-700 font-extrabold">{selectedCity.weather.humidity}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">Wind velocity</span>
                              <span className="text-slate-700 font-extrabold">{selectedCity.weather.wind}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">Precip. Probability</span>
                              <span className="text-slate-700 font-extrabold">{selectedCity.weather.precipitation}</span>
                            </div>
                          </div>
                        </div>

                        {/* 5-day forecast */}
                        <div className="md:col-span-7 border border-[#e6e2db] p-5 rounded-2xl bg-white space-y-3 shadow-inner">
                          <span className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest block">5-Day Forecast Outlook</span>
                          <div className="space-y-3">
                            {selectedCity.weather.forecast.map((fc, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs font-sans border-b border-slate-50 pb-2 last:border-0 last:pb-0 font-bold">
                                <span className="text-slate-700 w-24">{fc.day}</span>
                                <span className="text-slate-400 text-[11px] w-28 text-left">{fc.condition}</span>
                                <span className="font-mono text-slate-800 font-black text-right">
                                  {fc.tempF}°F <span className="text-slate-400 text-[10px] font-normal">({fc.tempC}°C)</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SEPARATE DEDICATED LOCAL EVENTS PAGE */}
                  {selectedFeature === 'events' && (
                    <div className="space-y-5 animate-fade-in" id="dedicated-events-page">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-rose-50 text-[#e28c7c] flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-slate-800 text-base">Local Events & Cultural Logs</h3>
                          <p className="font-sans text-xs text-slate-500 font-medium">Cultural processions, infrastructure projects, or public festivities active in {selectedCity.name}</p>
                        </div>
                      </div>

                      {selectedCity.events.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 font-sans text-xs">
                          No high-impact events active in the municipal log today.
                        </div>
                      ) : (
                        <div className="space-y-3 pt-1">
                          {selectedCity.events.map((evt, idx) => (
                            <div key={idx} className="border border-[#e6e2db] rounded-2xl p-4 bg-[#faf8f5]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#e28c7c]/40 hover:bg-white transition-all">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs bg-rose-50 text-[#e28c7c] border border-rose-100 px-2.5 py-0.5 rounded font-sans font-black uppercase">
                                    {evt.type}
                                  </span>
                                  <h4 className="font-sans font-black text-slate-800 text-xs sm:text-sm">{evt.title}</h4>
                                </div>
                                
                                <p className="font-sans text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{evt.date} • {evt.location}</span>
                                </p>
                                
                                <p className="font-sans text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                                  {evt.description}
                                </p>
                              </div>

                              <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-white md:bg-transparent p-2.5 md:p-0 rounded-xl w-full md:w-auto border border-[#e6e2db] md:border-0">
                                <span className="text-[9px] text-slate-400 font-mono font-black uppercase">TRAFFIC IMPACT</span>
                                <span className={`text-[10px] font-sans font-black px-2.5 py-0.5 rounded-full border ${
                                  evt.trafficImpact === 'Severe' ? 'bg-red-50 text-red-700 border-red-200' :
                                  evt.trafficImpact === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  evt.trafficImpact === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-slate-50 text-slate-500 border-slate-200'
                                }`}>
                                  {evt.trafficImpact} Impact
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SEPARATE DEDICATED PUBLIC TRANSPORT PAGE */}
                  {selectedFeature === 'transit' && (
                    <div className="space-y-5 animate-fade-in" id="dedicated-transit-page">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-slate-800 text-base">Public Transportation Networks</h3>
                          <p className="font-sans text-xs text-slate-500 font-medium">Schedules, delays, and routes of regional trains, metro rail, and electric rickshaw feeders</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        {selectedCity.transit.map((tr, idx) => (
                          <div key={idx} className="border border-[#e6e2db] rounded-2xl p-4 bg-[#faf8f5]/40 space-y-3 hover:border-blue-400 hover:bg-white transition-all">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded font-sans font-black uppercase">
                                    {tr.type}
                                  </span>
                                  <h4 className="font-sans font-black text-slate-800 text-xs sm:text-sm">{tr.line}</h4>
                                </div>
                                <span className="text-[11px] font-sans font-semibold text-slate-400 block">{tr.routes}</span>
                              </div>

                              <span className={`text-[10px] font-sans font-black px-2.5 py-0.5 rounded-full border ${
                                tr.status === 'On Time' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                tr.status === 'Delayed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {tr.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2.5 border-t border-slate-100 text-[11px] font-sans">
                              <div>
                                <span className="text-slate-400 font-semibold block text-[9px] uppercase">Service Frequency</span>
                                <strong className="text-slate-700 font-black text-xs">{tr.frequency}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 font-semibold block text-[9px] uppercase">Active Delays</span>
                                <strong className={tr.delay !== 'None' ? 'text-red-600 font-black text-xs' : 'text-slate-700 font-black text-xs'}>{tr.delay}</strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* FAQ Assistant widget Inside separate screen */}
                <div className="bg-white border border-[#e6e2db] rounded-3xl p-5 shadow-sm space-y-2">
                  <h4 className="font-display font-black text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#8f3c75]" /> Dedicated Telemetry notice
                  </h4>
                  <p className="font-sans text-[11px] text-slate-500 leading-normal font-semibold">
                    You are viewing a separate standalone feed page for {selectedFeature === 'traffic' ? 'Street Traffic & Bottlenecks' : selectedFeature === 'pollution' ? 'Ecology Air Pollution Metrics' : selectedFeature === 'weather' ? 'Meteorological Sensor Weather Outlook' : selectedFeature === 'events' ? 'Community Activity Logs' : 'Municipal Transit Timetable'} inside {selectedCity.name}. Click "Back to {selectedCity.name} Hub" above to view other options.
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* COMPLIANCE & ACCESSIBILITY FOOTER */}
      <footer className="bg-white border-t border-[#e6e2db] py-6 px-6 mt-auto text-center font-sans text-[11px] text-slate-500 font-semibold" id="citylens-footer">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2ea3a3]" />
            <span>CityLens • Factual Urban Reporting System</span>
          </div>
          <div className="text-slate-400 font-medium">
            Simplified Client View • React 18 • Vite Engine
          </div>
        </div>
      </footer>
    </div>
  );
}
