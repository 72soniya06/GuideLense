import React from 'react';
import { CityFeedsData, TrafficSegment, AirQualitySensor, WeatherSensor, TransitLine, LocalEvent } from '../types';
import { Activity, Thermometer, Wind, ShieldAlert, Navigation, Clock, AlertCircle, Info, TrendingUp, Sparkles } from 'lucide-react';

interface TelemetryStatsProps {
  feeds: CityFeedsData;
  selectedNodeType: 'traffic' | 'air' | 'weather' | 'event' | 'transit' | 'none';
  selectedNodeData: any;
  onClearSelection: () => void;
}

export default function TelemetryStats({ feeds, selectedNodeType, selectedNodeData, onClearSelection }: TelemetryStatsProps) {
  
  // Calculate general city averages
  const avgAqi = Math.round(feeds.airQuality.reduce((sum, current) => sum + current.aqi, 0) / feeds.airQuality.length);
  const activeRoadIncidentsCount = feeds.traffic.filter(r => r.status !== 'Clear').length;
  const transitOnTimeRatio = Math.round((feeds.transit.filter(t => t.status === 'On Time').length / feeds.transit.length) * 100);

  // Get AQI color status
  const getAqiStatusAndColor = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good (Healthy)', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (aqi <= 100) return { label: 'Moderate (Acceptable)', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { label: 'Hazardous (Critical Air Warning!)', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300 animate-pulse', border: 'border-rose-300' };
  };

  const aqiInfo = getAqiStatusAndColor(avgAqi);

  return (
    <div className="bg-white border border-[#e6e2db] rounded-2xl shadow-sm p-5 flex flex-col h-full" id="telemetry-diagnostics-board">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 text-[#2ea3a3] rounded-lg">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">Live Telemetry & Diagnostics</h3>
            <p className="font-sans text-[11px] text-slate-500 font-medium">Real-time charts & sensor readouts</p>
          </div>
        </div>
        {selectedNodeType !== 'none' && (
          <button 
            onClick={onClearSelection}
            className="text-[10px] font-sans font-bold text-slate-500 hover:text-slate-800 border border-[#e6e2db] px-2.5 py-1 rounded-lg bg-[#faf8f5] shadow-sm cursor-pointer"
          >
            Clear Target
          </button>
        )}
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col justify-between">
        
        {/* IDLE COMMAND STATE: No node selected */}
        {selectedNodeType === 'none' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block mb-1">Sector 7 Safety Assessment</span>
              <div className="flex items-center gap-1.5 font-sans font-extrabold text-xs text-slate-800">
                <ShieldAlert className={`w-4 h-4 ${feeds.activeIncident === 'Normal' ? 'text-emerald-500' : 'text-rose-500'}`} />
                Status: {feeds.activeIncident === 'Normal' ? 'Grid Clear (Normal Conditions)' : `Active Incident Override (${feeds.activeIncident})`}
              </div>
              <p className="font-sans text-[11px] text-slate-500 mt-1 leading-relaxed">
                {feeds.activeIncident === 'Normal' && "All subsystems in Sector 7 are performing within normal limits. Commute flow is optimal."}
                {feeds.activeIncident === 'GasLeak' && "⚠️ ALERT: A highly hazardous gas leakage is ongoing at the Industrial District. Heavy road blocks and emergency units are occupying roadways nearby."}
                {feeds.activeIncident === 'TransitStrike' && "⚠️ COMMUTE WARNING: Bus and Subway workers are conducting strike protests downtown. Standard travel is heavily impacted."}
                {feeds.activeIncident === 'SuddenStorm' && "⛈️ WEATHER DISASTER ALERT: Heavy storm front causes pooling water and minor flash floods. Speeds reduced city-wide."}
                {feeds.activeIncident === 'MusicFestival' && "🎉 EVENT DETECTED: 45,000 visitors crowding Greenwood Park for the Music Festival. High transit usage, west roads congested."}
              </p>
            </div>

            {/* Overall Averages Quick Meters */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">Avg Air AQI</span>
                <div className="flex items-baseline gap-1">
                  <span className={`font-mono font-extrabold text-xl ${
                    avgAqi <= 50 ? 'text-emerald-600' : avgAqi <= 100 ? 'text-amber-500' : 'text-rose-600'
                  }`}>{avgAqi}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Score</span>
                </div>
                <span className="text-[8px] text-slate-500 font-bold leading-none mt-1 truncate">{aqiInfo.label}</span>
              </div>

              <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">Road Incidents</span>
                <div className="flex items-baseline gap-1">
                  <span className={`font-mono font-extrabold text-xl ${
                    activeRoadIncidentsCount === 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>{activeRoadIncidentsCount}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Alerts</span>
                </div>
                <span className="text-[8px] text-slate-500 font-bold leading-none mt-1">
                  {activeRoadIncidentsCount === 0 ? 'Optimal Flow' : `${activeRoadIncidentsCount} delays active`}
                </span>
              </div>

              <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1">Transit Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-extrabold text-xl text-[#2ea3a3]">{transitOnTimeRatio}%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Ratio</span>
                </div>
                <span className="text-[8px] text-slate-500 font-bold leading-none mt-1">On-time dispatch</span>
              </div>
            </div>

            {/* Informational telemetry graph */}
            <div className="border border-[#e6e2db] p-3 rounded-xl bg-[#faf8f5]/40">
              <span className="text-[10px] font-sans font-black text-slate-500 uppercase tracking-widest block mb-2">Overall Commute Speed Index</span>
              <div className="flex items-end gap-1.5 h-10 px-2 pt-1 border-b border-l border-slate-200">
                <div className="bg-[#8cd4d4] w-full h-[80%] rounded-t-sm" title="8:00 AM"></div>
                <div className="bg-[#8cd4d4] w-full h-[65%] rounded-t-sm" title="11:00 AM"></div>
                <div className="bg-[#8cd4d4] w-full h-[50%] rounded-t-sm" title="2:00 PM"></div>
                <div className="bg-[#2ea3a3] w-full h-[35%] rounded-t-sm" title="5:00 PM"></div>
                <div className="bg-[#8f3c75] w-full h-[85%] rounded-t-sm" title="Current" style={{ height: `${feeds.activeIncident === 'Normal' ? 88 : feeds.activeIncident === 'TransitStrike' ? 22 : 45}%` }}></div>
              </div>
              <div className="flex justify-between text-[8px] font-mono font-semibold text-slate-400 mt-1">
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span className="text-[#8f3c75] font-bold">Now</span>
              </div>
            </div>
          </div>
        )}

        {/* 🚗 ROAD SEGMENT TELEMETRY */}
        {selectedNodeType === 'traffic' && selectedNodeData && (() => {
          const road = selectedNodeData as TrafficSegment;
          const pctOfLimit = Math.round((road.speedMph / road.averageSpeedMph) * 100);
          return (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-sans font-extrabold text-[#2ea3a3] uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full inline-block mb-1.5 font-bold">Traffic Link</span>
                <h4 className="font-display font-black text-slate-800 text-lg">{road.roadName}</h4>
                <p className="font-mono text-[10px] text-slate-400 font-semibold">SEGMENT ID: {road.id}</p>
              </div>

              {/* Congestion Meter */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs font-sans font-bold mb-1">
                  <span className="text-slate-500">Flow Efficiency</span>
                  <span className={road.status === 'Clear' ? 'text-emerald-600' : road.status === 'Moderate' ? 'text-amber-500' : 'text-rose-600'}>
                    {pctOfLimit}% ({road.status})
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      road.status === 'Clear' ? 'bg-emerald-500' : road.status === 'Moderate' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, pctOfLimit)}%` }}
                  />
                </div>
              </div>

              {/* Stats Speed Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-100 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Live Speed</span>
                  <span className="font-mono font-extrabold text-lg text-slate-700">{road.speedMph} <span className="text-[10px]">mph</span></span>
                </div>
                <div className="border border-slate-100 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Limit Speed</span>
                  <span className="font-mono font-extrabold text-lg text-slate-400">{road.averageSpeedMph} <span className="text-[10px]">mph</span></span>
                </div>
              </div>

              {/* Incidents Warning */}
              {road.incident && (
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-2 text-xs font-sans text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Active Road Obstruction:</strong>
                    <p className="text-[10px] text-rose-600 leading-normal mt-0.5">{road.incident}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 🍃 AIR QUALITY TELEMETRY */}
        {selectedNodeType === 'air' && selectedNodeData && (() => {
          const sensor = selectedNodeData as AirQualitySensor;
          const alertClass = sensor.aqi <= 50 ? 'border-emerald-200 bg-emerald-50 text-emerald-900' :
                             sensor.aqi <= 100 ? 'border-amber-200 bg-amber-50 text-amber-900' :
                             'border-rose-300 bg-rose-50 text-rose-950 animate-pulse';
          return (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-sans font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1.5 font-semibold">Pollution Telemetry</span>
                <h4 className="font-sans font-extrabold text-slate-800 text-lg">{sensor.locationName}</h4>
                <p className="font-mono text-[10px] text-slate-400 font-semibold">SENSOR STATION: {sensor.id}</p>
              </div>

              {/* Circular Gauge */}
              <div className={`border p-3.5 rounded-xl flex items-center justify-between ${alertClass}`}>
                <div className="font-sans">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Station Quality</span>
                  <strong className="text-sm font-extrabold block mt-0.5">{sensor.status}</strong>
                  <span className="text-[9px] text-slate-500 font-medium">Safe outdoor activity: {sensor.aqi <= 100 ? 'Permitted' : 'Restricted'}</span>
                </div>
                <div className="relative flex items-center justify-center">
                  {/* Circle SVG */}
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="26" 
                      fill="transparent" 
                      stroke={sensor.aqi <= 50 ? '#10b981' : sensor.aqi <= 100 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="4" 
                      strokeDasharray="163.3"
                      strokeDashoffset={163.3 - (163.3 * Math.min(300, sensor.aqi)) / 300}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-black text-slate-700">{sensor.aqi}</span>
                </div>
              </div>

              {/* Chemical Telemetry Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-100 p-2.5 rounded-xl">
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">PM2.5 particulate</span>
                  <span className="font-mono font-extrabold text-base text-slate-700">{sensor.pm25} <span className="text-[9px] text-slate-400">µg/m³</span></span>
                </div>
                <div className="border border-slate-100 p-2.5 rounded-xl">
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">NO2 Dioxide</span>
                  <span className="font-mono font-extrabold text-base text-slate-700">{sensor.no2} <span className="text-[9px] text-slate-400">ppb</span></span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ⛈️ WEATHER STATION TELEMETRY */}
        {selectedNodeType === 'weather' && selectedNodeData && (() => {
          const w = selectedNodeData as WeatherSensor;
          return (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-sans font-extrabold text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-full inline-block mb-1.5 font-semibold">Meteorological Feed</span>
                <h4 className="font-sans font-extrabold text-slate-800 text-lg">{w.locationName}</h4>
                <p className="font-mono text-[10px] text-slate-400 font-semibold">STATION ID: {w.id}</p>
              </div>

              {/* Temperature block */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Condition Feed</span>
                  <strong className="text-sm font-bold text-slate-700 block mt-0.5">{w.condition}</strong>
                </div>
                <div className="flex items-center gap-1 font-mono text-xl font-black text-[#2ea3a3] bg-teal-50 px-3 py-1.5 rounded-xl">
                  <Thermometer className="w-5 h-5 text-[#2ea3a3]" />
                  {w.tempF}°F
                </div>
              </div>

              {/* Humidity & Rain Chance */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-100 p-2.5 rounded-xl">
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Rel. Humidity</span>
                  <span className="font-mono font-extrabold text-base text-slate-700">{w.humidity}%</span>
                </div>
                <div className="border border-slate-100 p-2.5 rounded-xl">
                  <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Rain Probability</span>
                  <span className="font-mono font-extrabold text-base text-slate-700">{w.precipitationChance}%</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 🚇 TRANSIT TELEMETRY */}
        {selectedNodeType === 'transit' && selectedNodeData && (() => {
          const tr = selectedNodeData as TransitLine;
          return (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-sans font-extrabold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full inline-block mb-1.5 font-semibold">Public Transit</span>
                <h4 className="font-sans font-extrabold text-slate-800 text-lg">{tr.lineName}</h4>
                <p className="font-mono text-[10px] text-slate-400 font-semibold">TRANSIT CORRIDOR: {tr.id}</p>
              </div>

              {/* Status Box */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                tr.status === 'On Time' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-900'
              }`}>
                <div>
                  <span className="text-[10px] font-sans font-bold opacity-60 uppercase tracking-wider block">Operational State</span>
                  <strong className="font-extrabold text-xs block mt-0.5">{tr.status}</strong>
                </div>
                {tr.delayMinutes > 0 && (
                  <div className="font-mono text-xs font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-lg flex items-center gap-1 animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    +{tr.delayMinutes} min delay
                  </div>
                )}
              </div>

              {/* Vehicles Details */}
              <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Telemetry Links</span>
                <div className="space-y-1.5">
                  {tr.activeVehicles.map(veh => (
                    <div key={veh.id} className="bg-white border border-[#e6e2db] p-1.5 rounded-lg flex items-center justify-between text-[11px] font-sans">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-[#2ea3a3]" />
                        Unit: {veh.id}
                      </span>
                      <span className="font-mono font-medium text-slate-500">
                        Pos: {Math.round(veh.currentPosition * 100)}% • Speed: {veh.speedMph} mph
                      </span>
                    </div>
                  ))}
                  {tr.activeVehicles.length === 0 && (
                    <div className="text-center py-2 text-[10px] text-slate-400 font-bold font-sans">
                      No active vehicles currently transmitting telemetry coordinates.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 📢 LOCAL EVENT / DISPATCH TELEMETRY */}
        {selectedNodeType === 'event' && selectedNodeData && (() => {
          const evt = selectedNodeData as LocalEvent;
          return (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-sans font-extrabold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full inline-block mb-1.5 font-semibold">Incident / Dispatch</span>
                <h4 className="font-sans font-extrabold text-slate-800 text-lg leading-tight">{evt.title}</h4>
                <p className="font-mono text-[10px] text-slate-400 font-semibold">EVENT CODE: {evt.id}</p>
              </div>

              {/* Impact Card */}
              <div className="border border-slate-100 p-3 rounded-xl bg-slate-50">
                <div className="flex justify-between text-xs font-sans font-bold mb-1">
                  <span className="text-slate-500">Traffic Obstruction</span>
                  <span className={evt.trafficImpact === 'Severe' ? 'text-red-600 animate-pulse font-black' : 'text-[#8f3c75] font-black'}>
                    {evt.trafficImpact} Impact
                  </span>
                </div>
                <div className="text-[11px] font-sans text-slate-600 font-medium leading-relaxed mt-1.5">
                  <strong>Location:</strong> {evt.locationName}<br />
                  <strong>Radius:</strong> {evt.impactRadius} units
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-xs font-sans leading-relaxed text-slate-500">
                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest block mb-1">Incident Report</span>
                {evt.description}
              </div>
            </div>
          );
        })()}

        {/* Footer info branding */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] font-sans text-slate-400 font-semibold">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Synchronized with City DB
          </span>
          <span className="font-mono">{feeds.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
