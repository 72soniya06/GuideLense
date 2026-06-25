import { CityFeedsData, CityIncidentPreset, TrafficSegment, AirQualitySensor, WeatherSensor, TransitLine, LocalEvent } from '../types';

export function getDefaultFeeds(preset: CityIncidentPreset = 'Normal'): CityFeedsData {
  // Base default traffic segments
  const traffic: TrafficSegment[] = [
    {
      id: 'T1',
      roadName: 'Grand Avenue',
      status: 'Clear',
      speedMph: 45,
      averageSpeedMph: 45,
      coordinates: { x1: 150, y1: 150, x2: 650, y2: 350 }
    },
    {
      id: 'T2',
      roadName: 'Westside Highway',
      status: 'Moderate',
      speedMph: 35,
      averageSpeedMph: 50,
      coordinates: { x1: 100, y1: 80, x2: 100, y2: 420 }
    },
    {
      id: 'T3',
      roadName: 'Eastside Expressway',
      status: 'Clear',
      speedMph: 55,
      averageSpeedMph: 55,
      coordinates: { x1: 700, y1: 80, x2: 700, y2: 420 }
    },
    {
      id: 'T4',
      roadName: 'Central Boulevard',
      status: 'Clear',
      speedMph: 30,
      averageSpeedMph: 30,
      coordinates: { x1: 100, y1: 250, x2: 700, y2: 250 }
    },
    {
      id: 'T5',
      roadName: 'Riverside Drive',
      status: 'Clear',
      speedMph: 40,
      averageSpeedMph: 40,
      coordinates: { x1: 150, y1: 420, x2: 650, y2: 420 }
    }
  ];

  // Base default air quality sensors
  const airQuality: AirQualitySensor[] = [
    {
      id: 'AQ1',
      locationName: 'Greenwood Park',
      aqi: 22,
      status: 'Good',
      pm25: 5.2,
      no2: 8.1,
      coordinates: { x: 220, y: 130 }
    },
    {
      id: 'AQ2',
      locationName: 'Industrial District',
      aqi: 72,
      status: 'Moderate',
      pm25: 22.4,
      no2: 24.5,
      coordinates: { x: 580, y: 360 }
    },
    {
      id: 'AQ3',
      locationName: 'Downtown Hub',
      aqi: 54,
      status: 'Moderate',
      pm25: 14.1,
      no2: 18.0,
      coordinates: { x: 420, y: 250 }
    },
    {
      id: 'AQ4',
      locationName: 'Riverside Walk',
      aqi: 31,
      status: 'Good',
      pm25: 7.3,
      no2: 9.2,
      coordinates: { x: 350, y: 410 }
    }
  ];

  // Base default weather sensors
  const weather: WeatherSensor[] = [
    {
      id: 'W1',
      locationName: 'Downtown Plaza',
      tempF: 74,
      condition: 'Sunny',
      humidity: 48,
      precipitationChance: 5,
      coordinates: { x: 440, y: 220 }
    },
    {
      id: 'W2',
      locationName: 'Harbor Port',
      tempF: 71,
      condition: 'Windy',
      humidity: 62,
      precipitationChance: 10,
      coordinates: { x: 140, y: 380 }
    },
    {
      id: 'W3',
      locationName: 'North Hills Heights',
      tempF: 68,
      condition: 'Partly Cloudy',
      humidity: 50,
      precipitationChance: 15,
      coordinates: { x: 480, y: 80 }
    }
  ];

  // Base default transit lines
  const transit: TransitLine[] = [
    {
      id: 'TR1',
      lineName: 'Metro Line A (Blue)',
      type: 'Metro',
      status: 'On Time',
      delayMinutes: 0,
      activeVehicles: [
        { id: 'M-101', currentPosition: 0.15, speedMph: 40 },
        { id: 'M-102', currentPosition: 0.55, speedMph: 45 },
        { id: 'M-103', currentPosition: 0.85, speedMph: 42 }
      ],
      routePath: [
        { x: 100, y: 90 },
        { x: 250, y: 170 },
        { x: 420, y: 250 },
        { x: 580, y: 330 },
        { x: 700, y: 390 }
      ]
    },
    {
      id: 'TR2',
      lineName: 'City Loop Bus 101',
      type: 'Bus',
      status: 'On Time',
      delayMinutes: 0,
      activeVehicles: [
        { id: 'B-401', currentPosition: 0.25, speedMph: 20 },
        { id: 'B-402', currentPosition: 0.70, speedMph: 24 }
      ],
      routePath: [
        { x: 100, y: 250 },
        { x: 150, y: 150 },
        { x: 420, y: 250 },
        { x: 650, y: 350 },
        { x: 700, y: 250 },
        { x: 100, y: 250 }
      ]
    }
  ];

  // Base default local events
  const events: LocalEvent[] = [
    {
      id: 'E1',
      title: 'Farmer\'s Market Expo',
      type: 'Festival',
      locationName: 'Greenwood Park Canopy',
      impactRadius: 100,
      status: 'Active',
      trafficImpact: 'Low',
      description: 'Weekly organic farmer market showcasing local produce, crafts, and food stands. Slight pedestrian surge around Greenwood Park.',
      coordinates: { x: 250, y: 110 }
    },
    {
      id: 'E2',
      title: 'Central Blvd Road Repaving',
      type: 'Construction',
      locationName: 'Central Boulevard (Eastbound)',
      impactRadius: 150,
      status: 'Active',
      trafficImpact: 'Medium',
      description: 'Scheduled asphalt maintenance and repaving. Right lane closed on Central Blvd from 4th to 8th streets.',
      coordinates: { x: 520, y: 250 }
    }
  ];

  const result: CityFeedsData = {
    traffic,
    airQuality,
    weather,
    transit,
    events,
    lastUpdated: new Date().toLocaleTimeString(),
    activeIncident: preset
  };

  // Modify base data depending on incident override preset
  if (preset === 'GasLeak') {
    // 1. Spikes Air Quality at AQ2 Industrial District to Hazardous
    const indAQ = result.airQuality.find(a => a.id === 'AQ2');
    if (indAQ) {
      indAQ.aqi = 345;
      indAQ.status = 'Hazardous';
      indAQ.pm25 = 142.8;
      indAQ.no2 = 85.2;
    }
    // 2. High traffic/Blockage near Grand Avenue due to emergency crews
    const grTraffic = result.traffic.find(t => t.id === 'T1');
    if (grTraffic) {
      grTraffic.status = 'Blocked';
      grTraffic.speedMph = 0;
      grTraffic.incident = 'Emergency Services Blockage - Industrial Gas Main Incident';
    }
    // 3. Central Blvd becomes Heavy due to diverted vehicles
    const cbTraffic = result.traffic.find(t => t.id === 'T4');
    if (cbTraffic) {
      cbTraffic.status = 'Heavy';
      cbTraffic.speedMph = 8;
    }
    // 4. Add emergency local event
    result.events.push({
      id: 'E_GAS',
      title: 'HAZMAT Response: Gas Pipeline Rupture',
      type: 'Construction',
      locationName: 'Industrial Zone Perimeter',
      impactRadius: 300,
      status: 'Active',
      trafficImpact: 'Severe',
      description: 'High-alert pipeline rupture. Citizens within 300 yards are advised to stay indoors. Grand Avenue closed eastbound.',
      coordinates: { x: 550, y: 350 }
    });
  } else if (preset === 'TransitStrike') {
    // 1. Metro line is suspended
    const metro = result.transit.find(t => t.id === 'TR1');
    if (metro) {
      metro.status = 'Suspended';
      metro.delayMinutes = 999;
      metro.activeVehicles = [];
    }
    // 2. Bus line is severely delayed
    const bus = result.transit.find(t => t.id === 'TR2');
    if (bus) {
      bus.status = 'Delayed';
      bus.delayMinutes = 45;
      bus.activeVehicles.forEach(v => {
        v.speedMph = 6; // Moving extremely slow
      });
    }
    // 3. Traffic bottlenecks everywhere
    result.traffic.forEach(t => {
      if (t.id === 'T1' || t.id === 'T4') {
        t.status = 'Heavy';
        t.speedMph = 10;
        t.incident = 'Severe congestion due to Transit Strike';
      } else if (t.id === 'T2') {
        t.status = 'Heavy';
        t.speedMph = 12;
      }
    });
    // 4. Air quality degrades due to extra cars idling
    result.airQuality.forEach(aq => {
      if (aq.id === 'AQ3') { // Downtown
        aq.aqi = 112;
        aq.status = 'Unhealthy';
        aq.pm25 = 41.2;
      }
    });
    // 5. Add local event for the strike protest
    result.events.push({
      id: 'E_STRIKE',
      title: 'Transit Union Protest Rally',
      type: 'Protest',
      locationName: 'Downtown Central Terminal',
      impactRadius: 200,
      status: 'Active',
      trafficImpact: 'High',
      description: 'Transit union workers rallying outside the central station terminal. Broad pedestrian streets blocked.',
      coordinates: { x: 420, y: 250 }
    });
  } else if (preset === 'SuddenStorm') {
    // 1. All weather sensors report Torrential Storm
    result.weather.forEach(w => {
      w.tempF -= 12; // cooling down
      w.condition = 'Heavy Thunderstorm';
      w.humidity = 98;
      w.precipitationChance = 95;
    });
    // 2. Traffic is moderate to heavy due to wet tarmac, low speed
    result.traffic.forEach(t => {
      t.status = t.status === 'Clear' ? 'Moderate' : 'Heavy';
      t.speedMph = Math.max(5, Math.floor(t.speedMph * 0.45));
      t.incident = 'Flash flood hazard / Heavy downpour';
    });
    // 3. Exceptionally clean air because of rain washing away pollutants
    result.airQuality.forEach(aq => {
      aq.aqi = Math.max(5, Math.floor(aq.aqi * 0.25));
      aq.status = 'Good';
      aq.pm25 = Math.max(1.0, Number((aq.pm25 * 0.25).toFixed(1)));
    });
    // 4. Bus routes delayed due to flash flooding
    const bus = result.transit.find(t => t.id === 'TR2');
    if (bus) {
      bus.status = 'Delayed';
      bus.delayMinutes = 20;
    }
    // 5. Events cancelled or modified
    result.events.forEach(e => {
      if (e.id === 'E1') {
        e.title = "Farmer's Market Expo (CLOSED early)";
        e.status = 'Completed';
        e.description = 'Closed early due to flash storm alert and high winds.';
      }
    });
  } else if (preset === 'MusicFestival') {
    // 1. New massive event: Metropolis Music Festival in Greenwood Park
    result.events.push({
      id: 'E_FEST',
      title: 'Metropolis Summer Sound Clash',
      type: 'Festival',
      locationName: 'Greenwood Park Great Lawn',
      impactRadius: 400,
      status: 'Active',
      trafficImpact: 'Severe',
      description: 'Outdoor electronic & rock music concert drawing over 45,000 attendees. Gates open from 1 PM to 11 PM.',
      coordinates: { x: 220, y: 130 }
    });
    // 2. Westside Highway and Grand Ave have heavy traffic near park
    const gr = result.traffic.find(t => t.id === 'T1');
    if (gr) {
      gr.status = 'Heavy';
      gr.speedMph = 14;
      gr.incident = 'Festival Traffic Gridlock';
    }
    const west = result.traffic.find(t => t.id === 'T2');
    if (west) {
      west.status = 'Heavy';
      west.speedMph = 11;
      west.incident = 'Pedestrian crossing closures near Greenwood';
    }
    // 3. Air Quality at Greenwood park drops due to event dust and high crowds
    const aq1 = result.airQuality.find(a => a.id === 'AQ1');
    if (aq1) {
      aq1.aqi = 65;
      aq1.status = 'Moderate';
      aq1.pm25 = 18.2;
    }
    // 4. Transit lines are overflowing but extra vehicles added
    const metro = result.transit.find(t => t.id === 'TR1');
    if (metro) {
      metro.status = 'Reduced Service';
      metro.delayMinutes = 5;
      // Add more trains
      metro.activeVehicles.push({ id: 'M-FEST-01', currentPosition: 0.35, speedMph: 35 });
    }
  }

  return result;
}
