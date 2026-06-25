import React, { useState, useEffect } from 'react';
import { CityFeedsData, TrafficSegment, AirQualitySensor, WeatherSensor, LocalEvent } from '../types';
import { MapPin, Wind, AlertTriangle, HelpCircle, Activity, Info, Car, Train } from 'lucide-react';

interface CityMapProps {
  feeds: CityFeedsData;
  onSelectNode: (type: 'traffic' | 'air' | 'weather' | 'event' | 'transit' | 'none', data: any) => void;
  selectedNodeId?: string;
}

export default function CityMap({ feeds, onSelectNode, selectedNodeId }: CityMapProps) {
  const [hoveredNode, setHoveredNode] = useState<{ type: string; label: string; details: string; x: number; y: number } | null>(null);
  
  // Transit animation offset
  const [transitOffset, setTransitOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitOffset((prev) => (prev + 0.005) % 1.0);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Helpers to get point along a segmented path
  const getPointAlongPath = (path: Array<{ x: number; y: number }>, ratio: number) => {
    if (!path || path.length < 2) return { x: 0, y: 0 };
    const numSegments = path.length - 1;
    const scaledRatio = ratio * numSegments;
    const segmentIndex = Math.min(Math.floor(scaledRatio), numSegments - 1);
    const segmentRatio = scaledRatio - segmentIndex;

    const start = path[segmentIndex];
    const end = path[segmentIndex + 1];

    return {
      x: start.x + (end.x - start.x) * segmentRatio,
      y: start.y + (end.y - start.y) * segmentRatio,
    };
  };

  // Get color for road status
  const getRoadColorClass = (status: string) => {
    switch (status) {
      case 'Clear': return 'stroke-emerald-500';
      case 'Moderate': return 'stroke-amber-400';
      case 'Heavy': return 'stroke-rose-500';
      case 'Blocked': return 'stroke-slate-700 [stroke-dasharray:6,4] animate-[dash_1s_linear_infinite]';
      default: return 'stroke-slate-300';
    }
  };

  // Get color for AQI levels
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500 text-white';
    if (aqi <= 100) return 'bg-amber-400 text-slate-900';
    if (aqi <= 150) return 'bg-orange-500 text-white';
    return 'bg-rose-600 text-white animate-pulse border border-rose-300';
  };

  return (
    <div className="relative bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner h-[460px] select-none" id="guide-lense-map-view">
      {/* Blueprint Grid Watermark Background */}
      <div className="absolute inset-0 opacity-15" style={{ 
        backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px), radial-gradient(#64748b 1.5px, #f8fafc 1.5px)',
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px'
      }} />

      {/* Map Header / Legend Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap gap-2 items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-sans font-medium text-xs text-slate-700 tracking-tight">Live Grid Sector 7</span>
        </div>

        {/* Legend */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-full shadow-sm flex gap-3 text-[10px] font-sans font-semibold text-slate-500">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 rounded bg-emerald-500 inline-block"></span> Clear
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 rounded bg-amber-400 inline-block"></span> Moderate
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 rounded bg-rose-500 inline-block"></span> Heavy
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 rounded bg-slate-700 [stroke-dasharray:2,2] border border-dashed border-slate-500 inline-block"></span> Blocked
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg className="w-full h-full cursor-grab active:cursor-grabbing" viewBox="0 0 800 450" id="city-svg-viewport">
        {/* Definitions for grid textures and markers */}
        <defs>
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -20;
              }
            }
          `}</style>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* --- WATER BODIES (RIVERSIDE) --- */}
        <path 
          d="M 150 420 Q 400 435 650 420 L 650 450 L 150 450 Z" 
          fill="#e0f2fe" 
          stroke="#bae6fd" 
          strokeWidth="2"
        />
        <text x="400" y="440" className="fill-sky-500 font-sans text-[11px] font-semibold text-center tracking-widest opacity-80" textAnchor="middle">
          METROPOLIS RIVERWALK
        </text>

        {/* --- ROAD NETWORK (TRAFFIC SEGMENTS) --- */}
        {feeds.traffic.map((road) => {
          const isSelected = selectedNodeId === road.id;
          return (
            <g key={road.id} className="cursor-pointer" onClick={() => onSelectNode('traffic', road)}>
              {/* Thick shadow base path */}
              <line 
                x1={road.coordinates.x1} 
                y1={road.coordinates.y1} 
                x2={road.coordinates.x2} 
                y2={road.coordinates.y2} 
                stroke="#cbd5e1" 
                strokeWidth={isSelected ? "14" : "11"} 
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Dynamic colored route */}
              <line 
                x1={road.coordinates.x1} 
                y1={road.coordinates.y1} 
                x2={road.coordinates.x2} 
                y2={road.coordinates.y2} 
                className={`transition-all duration-300 ${getRoadColorClass(road.status)}`}
                strokeWidth={isSelected ? "10" : "7"} 
                strokeLinecap="round"
                onMouseEnter={(e) => {
                  setHoveredNode({
                    type: 'traffic',
                    label: road.roadName,
                    details: `${road.status} • Current Speed: ${road.speedMph} mph • ${road.incident || 'Flowing normal'}`,
                    x: (road.coordinates.x1 + road.coordinates.x2) / 2,
                    y: (road.coordinates.y1 + road.coordinates.y2) / 2 - 10
                  });
                }}
                onMouseLeave={() => setHoveredNode(null)}
              />
              {/* Highlight Overlay Ring */}
              {isSelected && (
                <line 
                  x1={road.coordinates.x1} 
                  y1={road.coordinates.y1} 
                  x2={road.coordinates.x2} 
                  y2={road.coordinates.y2} 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                  opacity="0.6"
                />
              )}
            </g>
          );
        })}

        {/* --- TRANSIT LINES ROUTES --- */}
        {feeds.transit.map((tr) => (
          <g key={tr.id} opacity="0.4">
            <polyline
              points={tr.routePath.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={tr.type === 'Metro' ? '#3b82f6' : '#f97316'}
              strokeWidth="2.5"
              strokeDasharray={tr.type === 'Bus' ? '4,4' : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* --- TRANSIT ANIMATED VEHICLES --- */}
        {feeds.transit.map((tr) => {
          if (tr.status === 'Suspended') return null;
          return tr.activeVehicles.map((veh, idx) => {
            // Compute dynamic animated position ratio
            const currentRatio = (veh.currentPosition + transitOffset) % 1.0;
            const pos = getPointAlongPath(tr.routePath, currentRatio);

            return (
              <g 
                key={veh.id} 
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode('transit', tr);
                }}
                onMouseEnter={() => {
                  setHoveredNode({
                    type: 'transit',
                    label: `${tr.lineName} [${veh.id}]`,
                    details: `Speed: ${veh.speedMph} mph • Line Status: ${tr.status}`,
                    x: pos.x,
                    y: pos.y - 12
                  });
                }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r="9" className="fill-white stroke-slate-300" filter="url(#shadow)" />
                <circle 
                  r="6" 
                  className={tr.type === 'Metro' ? 'fill-blue-600' : 'fill-orange-500'} 
                />
                {tr.type === 'Metro' ? (
                  <Train className="text-white absolute w-2.5 h-2.5 -translate-x-[5px] -translate-y-[5px]" style={{ pointerEvents: 'none' }} />
                ) : (
                  <Car className="text-white absolute w-2.5 h-2.5 -translate-x-[5px] -translate-y-[5px]" style={{ pointerEvents: 'none' }} />
                )}
              </g>
            );
          });
        })}

        {/* --- LOCAL EVENTS (INCIDENTS / EVENTS) --- */}
        {feeds.events.map((evt) => {
          const isSelected = selectedNodeId === evt.id;
          const isHazard = evt.trafficImpact === 'Severe' || evt.trafficImpact === 'High';
          return (
            <g 
              key={evt.id} 
              className="cursor-pointer" 
              onClick={() => onSelectNode('event', evt)}
              onMouseEnter={() => {
                setHoveredNode({
                  type: 'event',
                  label: evt.title,
                  details: `${evt.type} • Impact: ${evt.trafficImpact} • ${evt.locationName}`,
                  x: evt.coordinates.x,
                  y: evt.coordinates.y - 15
                });
              }}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Alert Radius Pulse Ring */}
              <circle 
                cx={evt.coordinates.x} 
                cy={evt.coordinates.y} 
                r={isSelected ? 28 : 20} 
                className={`fill-none ${isHazard ? 'stroke-rose-400 animate-ping' : 'stroke-blue-400 opacity-60'}`}
                strokeWidth="1.5"
                opacity="0.3"
              />
              {/* Inner Circle Pin */}
              <circle 
                cx={evt.coordinates.x} 
                cy={evt.coordinates.y} 
                r={isSelected ? 16 : 13} 
                className={`${isHazard ? 'fill-rose-500' : 'fill-blue-500'} stroke-white`}
                strokeWidth="2.5"
                filter="url(#shadow)"
              />
              <foreignObject
                x={evt.coordinates.x - 7}
                y={evt.coordinates.y - 8}
                width="14"
                height="14"
                className="pointer-events-none"
              >
                {isHazard ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-white" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-white" />
                )}
              </foreignObject>
            </g>
          );
        })}

        {/* --- AIR QUALITY SENSORS (Interactive Badges) --- */}
        {feeds.airQuality.map((sensor) => {
          const isSelected = selectedNodeId === sensor.id;
          return (
            <g 
              key={sensor.id} 
              className="cursor-pointer" 
              onClick={() => onSelectNode('air', sensor)}
              onMouseEnter={() => {
                setHoveredNode({
                  type: 'air',
                  label: `AQI Sensor: ${sensor.locationName}`,
                  details: `AQI: ${sensor.aqi} (${sensor.status}) • PM2.5: ${sensor.pm25} µg/m³ • NO2: ${sensor.no2} ppb`,
                  x: sensor.coordinates.x,
                  y: sensor.coordinates.y - 18
                });
              }}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulsing ring for high aqi */}
              {sensor.aqi > 100 && (
                <circle 
                  cx={sensor.coordinates.x} 
                  cy={sensor.coordinates.y} 
                  r="24" 
                  className="fill-none stroke-rose-500 animate-pulse" 
                  strokeWidth="2"
                  opacity="0.5"
                />
              )}
              {/* Outer frame */}
              <circle 
                cx={sensor.coordinates.x} 
                cy={sensor.coordinates.y} 
                r={isSelected ? 16 : 14} 
                className="fill-white stroke-slate-300" 
                strokeWidth="2.5"
                filter="url(#shadow)"
              />
              {/* Colored Indicator */}
              <circle 
                cx={sensor.coordinates.x} 
                cy={sensor.coordinates.y} 
                r={isSelected ? 11 : 9} 
                className={sensor.aqi <= 50 ? 'fill-emerald-500' : sensor.aqi <= 100 ? 'fill-amber-400' : 'fill-rose-500'} 
              />
              {/* Text badge above sensor */}
              <g transform={`translate(${sensor.coordinates.x}, ${sensor.coordinates.y - 20})`}>
                <rect 
                  x="-16" 
                  y="-8" 
                  width="32" 
                  height="13" 
                  rx="4" 
                  className={`${getAqiColor(sensor.aqi)} stroke-white`}
                  strokeWidth="1"
                  filter="url(#shadow)"
                />
                <text 
                  y="1" 
                  className="font-mono text-[8px] font-bold text-center" 
                  textAnchor="middle"
                  fill="currentColor"
                >
                  {sensor.aqi}
                </text>
              </g>
            </g>
          );
        })}

        {/* --- WEATHER SENSORS --- */}
        {feeds.weather.map((station) => {
          const isSelected = selectedNodeId === station.id;
          return (
            <g 
              key={station.id} 
              className="cursor-pointer" 
              onClick={() => onSelectNode('weather', station)}
              onMouseEnter={() => {
                setHoveredNode({
                  type: 'weather',
                  label: `Weather Stn: ${station.locationName}`,
                  details: `${station.condition} • Temp: ${station.tempF}°F • Humidity: ${station.humidity}%`,
                  x: station.coordinates.x,
                  y: station.coordinates.y - 15
                });
              }}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle 
                cx={station.coordinates.x} 
                cy={station.coordinates.y} 
                r={isSelected ? 14 : 11} 
                className="fill-white stroke-sky-400" 
                strokeWidth="2.5"
                filter="url(#shadow)"
              />
              <foreignObject
                x={station.coordinates.x - 7}
                y={station.coordinates.y - 7}
                width="14"
                height="14"
                className="pointer-events-none"
              >
                <Wind className="w-3.5 h-3.5 text-sky-500" />
              </foreignObject>
              <g transform={`translate(${station.coordinates.x}, ${station.coordinates.y + 18})`}>
                <rect x="-14" y="-6" width="28" height="11" rx="3" fill="#f1f5f9" className="stroke-slate-200" strokeWidth="0.5" />
                <text y="2" className="font-mono text-[7px] font-bold text-slate-600" textAnchor="middle">
                  {station.tempF}°F
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute z-20 bg-slate-900/95 backdrop-blur-md text-white text-[11px] p-2.5 rounded-xl shadow-lg border border-slate-700 pointer-events-none transition-all duration-150 max-w-[240px]"
          style={{ 
            left: `${Math.min(760, Math.max(10, (hoveredNode.x / 800) * 100))}%`,
            top: `${Math.min(410, Math.max(10, (hoveredNode.y / 450) * 100))}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-sans font-bold text-xs mb-1 text-slate-200 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400 inline" />
            {hoveredNode.label}
          </div>
          <div className="font-sans text-[10px] text-slate-300 leading-relaxed font-medium">
            {hoveredNode.details}
          </div>
        </div>
      )}

      {/* Interactive Hint */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 py-1 px-2.5 rounded-lg shadow-sm text-[10px] font-sans font-medium text-slate-500 flex items-center gap-1.5 pointer-events-none">
        <Info className="w-3 h-3 text-slate-400" />
        Click road segments, sensors, or markers to view instant live telemetry
      </div>
    </div>
  );
}
