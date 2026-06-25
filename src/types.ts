export interface TrafficSegment {
  id: string;
  roadName: string;
  status: 'Clear' | 'Moderate' | 'Heavy' | 'Blocked';
  speedMph: number;
  averageSpeedMph: number;
  incident?: string;
  coordinates: { x1: number; y1: number; x2: number; y2: number };
}

export interface AirQualitySensor {
  id: string;
  locationName: string;
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  no2: number;  // ppb
  coordinates: { x: number; y: number };
}

export interface WeatherSensor {
  id: string;
  locationName: string;
  tempF: number;
  condition: string;
  humidity: number;
  precipitationChance: number;
  coordinates: { x: number; y: number };
}

export interface TransitLine {
  id: string;
  lineName: string;
  type: 'Metro' | 'Bus';
  status: 'On Time' | 'Delayed' | 'Suspended' | 'Reduced Service';
  delayMinutes: number;
  activeVehicles: Array<{ id: string; currentPosition: number; speedMph: number }>;
  routePath: Array<{ x: number; y: number }>;
}

export interface LocalEvent {
  id: string;
  title: string;
  type: 'Festival' | 'Sporting' | 'Construction' | 'Protest' | 'Standard';
  locationName: string;
  impactRadius: number; // distance units
  status: 'Active' | 'Upcoming' | 'Completed';
  trafficImpact: 'Low' | 'Medium' | 'High' | 'Severe';
  description: string;
  coordinates: { x: number; y: number };
}

export type CityIncidentPreset = 'Normal' | 'GasLeak' | 'TransitStrike' | 'SuddenStorm' | 'MusicFestival';

export interface CityFeedsData {
  traffic: TrafficSegment[];
  airQuality: AirQualitySensor[];
  weather: WeatherSensor[];
  transit: TransitLine[];
  events: LocalEvent[];
  lastUpdated: string;
  activeIncident: CityIncidentPreset;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Array<{
    category: 'Traffic' | 'AirQuality' | 'Weather' | 'Transit' | 'Events';
    title: string;
    detail: string;
  }>;
  pipelineSteps?: string[];
}

export interface RagPipelineStep {
  step: 'ANALYZE' | 'RETRIEVE' | 'AUGMENT' | 'STREAM';
  message: string;
  timestamp: string;
  data?: any;
}
