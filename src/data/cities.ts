export interface TrafficFeedItem {
  road: string;
  status: 'Clear' | 'Moderate' | 'Heavy' | 'Blocked';
  speed: string;
  delay: string;
  incident?: string;
}

export interface PollutionData {
  aqi: number;
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number;  // ppb
  status: 'Good' | 'Moderate' | 'Poor' | 'Unhealthy' | 'Hazardous';
  advice: string;
}

export interface WeatherData {
  tempF: number;
  tempC: number;
  condition: string;
  humidity: number;
  wind: string;
  precipitation: string;
  forecast: Array<{ day: string; tempF: number; tempC: number; condition: string }>;
}

export interface LocalEventItem {
  title: string;
  date: string;
  type: 'Festival' | 'Cultural' | 'Sports' | 'Construction' | 'Standard';
  location: string;
  status: string;
  trafficImpact: 'Low' | 'Medium' | 'High' | 'Severe';
  description: string;
}

export interface TransitItem {
  line: string;
  type: 'Metro' | 'Bus' | 'Auto-Rickshaw' | 'Train' | 'E-Rickshaw';
  status: 'On Time' | 'Delayed' | 'Suspended' | 'Reduced Frequency';
  frequency: string;
  delay: string;
  routes: string;
}

export interface CityData {
  id: string;
  name: string;
  alternativeName?: string;
  state?: string;
  country: string;
  tagline: string;
  shortDescription: string;
  overallStatus: 'Optimal' | 'Normal' | 'Moderate Congestion' | 'Weather Alert' | 'Active Festival';
  imageUrl: string;
  traffic: TrafficFeedItem[];
  pollution: PollutionData;
  weather: WeatherData;
  events: LocalEventItem[];
  transit: TransitItem[];
}

export const CITIES_DATABASE: Record<string, CityData> = {
  prayagraj: {
    id: 'prayagraj',
    name: 'Prayagraj',
    alternativeName: 'Allahabad',
    state: 'Uttar Pradesh',
    country: 'India',
    tagline: 'The Sacred Land of Triveni Sangam',
    shortDescription: 'One of the oldest cities in India, located at the sacred confluence (Sangam) of Ganga, Yamuna, and the mythical Saraswati. Famous for Kumbh Mela, colonial-era heritage, and high administrative importance.',
    overallStatus: 'Active Festival',
    imageUrl: 'https://images.unsplash.com/photo-1600100397990-24b321a34711?auto=format&fit=crop&w=800&q=80',
    traffic: [
      {
        road: 'Shastri Bridge (GT Road)',
        status: 'Heavy',
        speed: '12 km/h',
        delay: '15 mins',
        incident: 'Pedestrian rush heading towards Sangam Ghats'
      },
      {
        road: 'Civil Lines High Street',
        status: 'Moderate',
        speed: '28 km/h',
        delay: '5 mins',
        incident: 'Regular shopping hours crowd'
      },
      {
        road: 'Naini Bridge (New)',
        status: 'Clear',
        speed: '55 km/h',
        delay: 'None'
      },
      {
        road: 'Collectorate Crossing',
        status: 'Heavy',
        speed: '10 km/h',
        delay: '10 mins',
        incident: 'Administrative office hour congestion'
      },
      {
        road: 'University Road',
        status: 'Clear',
        speed: '35 km/h',
        delay: 'None'
      }
    ],
    pollution: {
      aqi: 142,
      pm25: 58.4,
      pm10: 112.1,
      no2: 24.5,
      status: 'Poor',
      advice: 'Sensitive individuals should wear masks outdoors, particularly near major junctions like Civil Lines and GT Road.'
    },
    weather: {
      tempF: 92,
      tempC: 33,
      condition: 'Sunny & Humid',
      humidity: 68,
      wind: '8 km/h East',
      precipitation: '5%',
      forecast: [
        { day: 'Today', tempF: 92, tempC: 33, condition: 'Sunny' },
        { day: 'Tomorrow', tempF: 94, tempC: 34, condition: 'Clear Sky' },
        { day: 'Friday', tempF: 89, tempC: 32, condition: 'Thunderstorm' },
        { day: 'Saturday', tempF: 87, tempC: 31, condition: 'Rainy' },
        { day: 'Sunday', tempF: 90, tempC: 32, condition: 'Partly Cloudy' }
      ]
    },
    events: [
      {
        title: 'Maha Aarti at Triveni Sangam',
        date: 'Every Evening (6:30 PM)',
        type: 'Cultural',
        location: 'Sangam Ghats, Prayagraj',
        status: 'Active',
        trafficImpact: 'High',
        description: 'Spectacular collective evening prayers by the riverside drawing thousands of devotees.'
      },
      {
        title: 'Magh Mela Prep Works',
        date: 'Ongoing phase',
        type: 'Construction',
        location: 'Sangam Area Sandbox Sector 1-4',
        status: 'Active',
        trafficImpact: 'Medium',
        description: 'Levelling and temporary pontoon bridge layouts for incoming seasonal bathers.'
      },
      {
        title: 'Prayagraj Heritage Walking Tour',
        date: 'Saturday Mornings',
        type: 'Cultural',
        location: 'Alfred Park (Chandra Shekhar Azad Park) to High Court Heritage Wing',
        status: 'Active',
        trafficImpact: 'Low',
        description: 'Guided architectural walk highlighting colonial-era buildings and India\'s freedom struggle sites.'
      }
    ],
    transit: [
      {
        line: 'Civil Lines - Phaphamau (Route 4A)',
        type: 'Bus',
        status: 'Delayed',
        frequency: 'Every 20 mins',
        delay: '12 mins',
        routes: 'Civil Lines Bus Depot → Prayagraj Junction → Phaphamau Crossing'
      },
      {
        line: 'Sangam Special Electric Rickshaw Shuttle',
        type: 'E-Rickshaw',
        status: 'On Time',
        frequency: 'Continuous',
        delay: 'None',
        routes: 'Daraganj Metro Junction → Sangam Parking Lot'
      },
      {
        line: 'Prayagraj Jn - Naini Local Special',
        type: 'Train',
        status: 'On Time',
        frequency: '4 runs daily',
        delay: 'None',
        routes: 'PRYJ Main → Naini Junction'
      },
      {
        line: 'City Shared Auto-Rickshaw Ring Feeders',
        type: 'Auto-Rickshaw',
        status: 'On Time',
        frequency: 'Every 2-3 mins',
        delay: 'None',
        routes: 'Railway Station → Katra Market → University Crossing'
      }
    ]
  },
  newyork: {
    id: 'newyork',
    name: 'New York City',
    alternativeName: 'NYC',
    state: 'New York',
    country: 'United States',
    tagline: 'The City That Never Sleeps',
    shortDescription: 'One of the world\'s major commercial, financial, and cultural centers. Celebrated for its iconic skyscrapers, Broadway shows, and bustling subway networks.',
    overallStatus: 'Moderate Congestion',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    traffic: [
      {
        road: 'Holland Tunnel (Inbound)',
        status: 'Blocked',
        speed: '4 mph',
        delay: '35 mins',
        incident: 'Active maintenance and lane narrowing'
      },
      {
        road: 'FDR Drive North',
        status: 'Moderate',
        speed: '32 mph',
        delay: '10 mins',
        incident: 'Slight merging bottleneck near 34th St'
      },
      {
        road: 'Brooklyn Bridge (Eastbound)',
        status: 'Clear',
        speed: '45 mph',
        delay: 'None'
      },
      {
        road: 'Broadway (Times Square zone)',
        status: 'Heavy',
        speed: '8 mph',
        delay: '18 mins',
        incident: 'High pedestrian and tour bus crossing rates'
      }
    ],
    pollution: {
      aqi: 54,
      pm25: 12.8,
      pm10: 24.5,
      no2: 15.2,
      status: 'Moderate',
      advice: 'Air quality is acceptable. Very sensitive individuals should monitor outdoor activities for slight pollen levels.'
    },
    weather: {
      tempF: 73,
      tempC: 23,
      condition: 'Partly Cloudy',
      humidity: 55,
      wind: '12 mph West',
      precipitation: '15%',
      forecast: [
        { day: 'Today', tempF: 73, tempC: 23, condition: 'Partly Cloudy' },
        { day: 'Tomorrow', tempF: 78, tempC: 26, condition: 'Sunny' },
        { day: 'Friday', tempF: 82, tempC: 28, condition: 'Mostly Sunny' },
        { day: 'Saturday', tempF: 71, tempC: 22, condition: 'Heavy Rain' },
        { day: 'Sunday', tempF: 68, tempC: 20, condition: 'Windy & Clear' }
      ]
    },
    events: [
      {
        title: 'Central Park SummerStage Concerts',
        date: 'Tonight (7:00 PM)',
        type: 'Festival',
        location: 'Rumsey Playfield, Central Park',
        status: 'Active',
        trafficImpact: 'Medium',
        description: 'Live musical performances drawing crowds. High taxi demand along 5th Ave.'
      },
      {
        title: 'Times Square Street Fair',
        date: 'This Weekend',
        type: 'Cultural',
        location: '42nd to 46th St pedestrian plazas',
        status: 'Upcoming',
        trafficImpact: 'High',
        description: 'Local food stalls, vintage art dealers, and musical activities blocking Broadway lanes.'
      }
    ],
    transit: [
      {
        line: 'MTA Subway Line L (Canarsie)',
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 4-6 mins',
        delay: 'None',
        routes: '8th Ave (Manhattan) ↔ Rockaway Parkway (Brooklyn)'
      },
      {
        line: 'Subway Line N/Q Express Trunk',
        type: 'Metro',
        status: 'Delayed',
        frequency: 'Every 8 mins',
        delay: '9 mins',
        routes: 'Astoria Ditmars Blvd ↔ Coney Island Stillwell Ave'
      },
      {
        line: 'M15 Select Bus Service',
        type: 'Bus',
        status: 'On Time',
        frequency: 'Every 5 mins',
        delay: 'None',
        routes: 'East Harlem ↔ South Ferry via 2nd Ave'
      }
    ]
  },
  london: {
    id: 'london',
    name: 'London',
    alternativeName: 'Greater London',
    country: 'United Kingdom',
    tagline: 'A Modern Metropolis Steeped in History',
    shortDescription: 'The capital of the United Kingdom, defined by its historic architecture, modern financial districts, and the iconic River Thames snaking through its center.',
    overallStatus: 'Normal',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    traffic: [
      {
        road: 'Tower Bridge Approach (A100)',
        status: 'Moderate',
        speed: '18 mph',
        delay: '8 mins',
        incident: 'Standard congestion inside Ultra Low Emission Zone (ULEZ)'
      },
      {
        road: 'M25 Orbital Freeway (Junction 12)',
        status: 'Clear',
        speed: '62 mph',
        delay: 'None'
      },
      {
        road: 'Piccadilly Circus Circus Road',
        status: 'Heavy',
        speed: '9 mph',
        delay: '14 mins',
        incident: 'High tourist bus occupancy'
      }
    ],
    pollution: {
      aqi: 38,
      pm25: 7.2,
      pm10: 14.1,
      no2: 12.0,
      status: 'Good',
      advice: 'The air is exceptionally clean. Great day for walks along the South Bank or visiting Hyde Park.'
    },
    weather: {
      tempF: 62,
      tempC: 17,
      condition: 'Light Drizzle',
      humidity: 82,
      wind: '14 mph SouthWest',
      precipitation: '60%',
      forecast: [
        { day: 'Today', tempF: 62, tempC: 17, condition: 'Light Drizzle' },
        { day: 'Tomorrow', tempF: 64, tempC: 18, condition: 'Overcast' },
        { day: 'Friday', tempF: 68, tempC: 20, condition: 'Partly Sunny' },
        { day: 'Saturday', tempF: 65, tempC: 18, condition: 'Showers' },
        { day: 'Sunday', tempF: 63, tempC: 17, condition: 'Windy & Rain' }
      ]
    },
    events: [
      {
        title: 'West End Theatre Festivals',
        date: 'Daily',
        type: 'Cultural',
        location: 'Shaftesbury Avenue Theatre Belt',
        status: 'Active',
        trafficImpact: 'Medium',
        description: 'Dozens of simultaneous plays and musicals drawing huge pedestrian rushes around 7 PM.'
      }
    ],
    transit: [
      {
        line: 'Underground: Jubilee Line',
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 3 mins',
        delay: 'None',
        routes: 'Stanmore ↔ Stratford via London Bridge'
      },
      {
        line: 'Underground: Central Line',
        type: 'Metro',
        status: 'Delayed',
        frequency: 'Every 10 mins',
        delay: '6 mins',
        routes: 'West Ruislip ↔ Epping via Bank'
      },
      {
        line: 'Red Double-Decker Route 15',
        type: 'Bus',
        status: 'On Time',
        frequency: 'Every 8 mins',
        delay: 'None',
        routes: 'Trafalgar Square ↔ Tower of London'
      }
    ]
  },
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo',
    alternativeName: 'Edo',
    country: 'Japan',
    tagline: 'Where Neon Shines on Ancient Traditions',
    shortDescription: 'The world\'s most populous metropolitan area, balancing futuristic skyscrapers, neon-lit tech centers, and quiet, pristine historical Shinto shrines.',
    overallStatus: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    traffic: [
      {
        road: 'Shibuya Scramble Crossing Perimeter',
        status: 'Moderate',
        speed: '15 km/h',
        delay: '4 mins',
        incident: 'Controlled pedestrian timing cycles'
      },
      {
        road: 'Shuto Expressway (Route C1 Loop)',
        status: 'Clear',
        speed: '70 km/h',
        delay: 'None'
      },
      {
        road: 'Chuo-Dori Street (Ginza Shopping Area)',
        status: 'Clear',
        speed: '30 km/h',
        delay: 'None',
        incident: 'Pedestrian-only zoning active on weekend afternoons'
      }
    ],
    pollution: {
      aqi: 28,
      pm25: 4.8,
      pm10: 10.2,
      no2: 8.5,
      status: 'Good',
      advice: 'Perfect air quality. Ideal for visiting outdoor temples or strolls through Shinjuku Gyoen National Garden.'
    },
    weather: {
      tempF: 77,
      tempC: 25,
      condition: 'Sunny',
      humidity: 45,
      wind: '6 km/h North',
      precipitation: '0%',
      forecast: [
        { day: 'Today', tempF: 77, tempC: 25, condition: 'Sunny' },
        { day: 'Tomorrow', tempF: 80, tempC: 27, condition: 'Sunny' },
        { day: 'Friday', tempF: 82, tempC: 28, condition: 'Sunny' },
        { day: 'Saturday', tempF: 75, tempC: 24, condition: 'Cloudy' },
        { day: 'Sunday', tempF: 73, tempC: 23, condition: 'Light Rain' }
      ]
    },
    events: [
      {
        title: 'Asakusa Kannon Temple Matsuri',
        date: 'This Friday',
        type: 'Festival',
        location: 'Senso-ji Temple grounds',
        status: 'Active',
        trafficImpact: 'Medium',
        description: 'Traditional procession, food stalls, and folk dancing celebrating seasonal heritage.'
      }
    ],
    transit: [
      {
        line: 'JR Yamanote Ring Line',
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 2 mins',
        delay: 'None',
        routes: 'Circular route connecting Tokyo, Shinjuku, Shibuya, Ikebukuro'
      },
      {
        line: 'Tokyo Metro Ginza Line',
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 3 mins',
        delay: 'None',
        routes: 'Shibuya ↔ Asakusa'
      },
      {
        line: 'Toei Bus Route Green 11',
        type: 'Bus',
        status: 'On Time',
        frequency: 'Every 10 mins',
        delay: 'None',
        routes: 'Otemachi ↔ Ryogoku Sumo Hall'
      }
    ]
  },
  newdelhi: {
    id: 'newdelhi',
    name: 'New Delhi',
    alternativeName: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    tagline: 'The Dynamic Capital of Contrast and Culture',
    shortDescription: 'The political and administrative capital of India. Celebrated for its historic Red Fort, modern Metro system, spacious avenues, and rich culinary culture.',
    overallStatus: 'Moderate Congestion',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    traffic: [
      {
        road: 'Ring Road (AIIMS Crossing)',
        status: 'Heavy',
        speed: '15 km/h',
        delay: '20 mins',
        incident: 'Peak hour office congestion'
      },
      {
        road: 'Connaught Place Outer Circle',
        status: 'Moderate',
        speed: '25 km/h',
        delay: '8 mins',
        incident: 'Standard evening commercial rush'
      },
      {
        road: 'Barapullah Flyover',
        status: 'Clear',
        speed: '50 km/h',
        delay: 'None'
      },
      {
        road: 'DND Flyway (to Noida)',
        status: 'Clear',
        speed: '65 km/h',
        delay: 'None'
      }
    ],
    pollution: {
      aqi: 185,
      pm25: 98.6,
      pm10: 165.2,
      no2: 38.4,
      status: 'Unhealthy',
      advice: 'The air index is high today. Use N95 masks when walking along busy arterial routes and avoid strenuous outdoor exercise in the early mornings.'
    },
    weather: {
      tempF: 102,
      tempC: 39,
      condition: 'Hot & Hazy',
      humidity: 42,
      wind: '10 km/h West',
      precipitation: '0%',
      forecast: [
        { day: 'Today', tempF: 102, tempC: 39, condition: 'Hot & Hazy' },
        { day: 'Tomorrow', tempF: 104, tempC: 40, condition: 'Very Hot' },
        { day: 'Friday', tempF: 100, tempC: 38, condition: 'Dust Storm' },
        { day: 'Saturday', tempF: 95, tempC: 35, condition: 'Partly Cloudy' },
        { day: 'Sunday', tempF: 92, tempC: 33, condition: 'Monsoon Showers' }
      ]
    },
    events: [
      {
        title: 'Crafts Bazaar at Dilli Haat',
        date: 'All Week (11 AM - 9 PM)',
        type: 'Cultural',
        location: 'Dilli Haat, INA',
        status: 'Active',
        trafficImpact: 'Low',
        description: 'Exhibition of handmade textiles, pottery, and regional foods from artisans across all Indian states.'
      },
      {
        title: 'Metro Extension Track Assembly',
        date: 'Nightly (11 PM - 5 AM)',
        type: 'Construction',
        location: 'Outer Ring Road (Janakpuri Sector)',
        status: 'Active',
        trafficImpact: 'Low',
        description: 'Structural steel installation for Phase 4 elevated metro line. Minor lane diversions at night.'
      }
    ],
    transit: [
      {
        line: 'Delhi Metro Yellow Line',
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 2.5 mins',
        delay: 'None',
        routes: 'Samaypur Badli ↔ HUDA City Centre (Gurugram)'
      },
      {
        line: 'Delhi Metro Blue Line',
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 3 mins',
        delay: 'None',
        routes: 'Dwarka Sector 21 ↔ Noida Electronic City / Vaishali'
      },
      {
        line: 'DTC Electric Bus Route 502',
        type: 'Bus',
        status: 'Delayed',
        frequency: 'Every 15 mins',
        delay: '10 mins',
        routes: 'Mori Gate Terminal ↔ Mehrauli'
      }
    ]
  }
};

/**
 * Returns dynamic, authentic-looking mock data for any typed city name
 * to ensure that user searches for any city (e.g. Paris, Mumbai) always work flawlessly.
 */
export function generateDynamicCityData(cityName: string): CityData {
  const normalized = cityName.trim();
  const lowerName = normalized.toLowerCase();
  
  // If we already have it pre-configured, return it
  if (CITIES_DATABASE[lowerName]) {
    return CITIES_DATABASE[lowerName];
  }
  
  // Hash function to make simulated values consistent for the same city name
  let hash = 0;
  for (let i = 0; i < lowerName.length; i++) {
    hash = lowerName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Generate deterministic but dynamic data
  const tempC = 15 + (hash % 25); // 15 to 40°C
  const tempF = Math.round((tempC * 9/5) + 32);
  const aqi = 15 + (hash % 230); // 15 to 245
  
  let aqiStatus: PollutionData['status'] = 'Good';
  let advice = 'The air is clean. Enjoy your day!';
  if (aqi > 150) {
    aqiStatus = 'Unhealthy';
    advice = 'Air pollutants are elevated. Sensitive individuals should consider wearing protection near busy streets.';
  } else if (aqi > 100) {
    aqiStatus = 'Poor';
    advice = 'Mild pollutants present. Monitor prolonged strenuous outdoor actions.';
  } else if (aqi > 50) {
    aqiStatus = 'Moderate';
    advice = 'Air quality is acceptable for most citizens.';
  }

  const conditions = ['Sunny', 'Mostly Cloudy', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Windy', 'Mist'];
  const condition = conditions[hash % conditions.length];

  const overallStatuses: CityData['overallStatus'][] = ['Optimal', 'Normal', 'Moderate Congestion', 'Weather Alert'];
  const overallStatus = overallStatuses[hash % overallStatuses.length];

  return {
    id: lowerName,
    name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
    country: hash % 2 === 0 ? 'India' : 'International Hub',
    tagline: `Discover the Vibrancy and Local Energy of ${normalized}`,
    shortDescription: `A dynamically explored global city. Explore its real-time street traffic, meteorological parameters, historical and ongoing events, and municipal transportation systems.`,
    overallStatus,
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80',
    traffic: [
      {
        road: 'Main Central Boulevard',
        status: hash % 3 === 0 ? 'Heavy' : hash % 3 === 1 ? 'Moderate' : 'Clear',
        speed: `${20 + (hash % 40)} km/h`,
        delay: hash % 3 === 0 ? '12 mins' : 'None',
        incident: hash % 3 === 0 ? 'Minor vehicle breakdown blocking left lane' : undefined
      },
      {
        road: 'Ring Bypass Highway',
        status: hash % 4 === 0 ? 'Moderate' : 'Clear',
        speed: `${60 + (hash % 30)} km/h`,
        delay: 'None'
      },
      {
        road: 'Downtown Interceptor Crossing',
        status: hash % 2 === 0 ? 'Moderate' : 'Clear',
        speed: `${22 + (hash % 15)} km/h`,
        delay: hash % 2 === 0 ? '4 mins' : 'None'
      }
    ],
    pollution: {
      aqi,
      pm25: Number((aqi * 0.4 + 2).toFixed(1)),
      pm10: Number((aqi * 0.75 + 5).toFixed(1)),
      no2: Number((10 + (hash % 35)).toFixed(1)),
      status: aqiStatus,
      advice
    },
    weather: {
      tempF,
      tempC,
      condition,
      humidity: 35 + (hash % 55),
      wind: `${5 + (hash % 20)} km/h`,
      precipitation: `${hash % 85}%`,
      forecast: [
        { day: 'Today', tempF, tempC, condition },
        { day: 'Tomorrow', tempF: tempF + 2, tempC: tempC + 1, condition: 'Sunny' },
        { day: 'Friday', tempF: tempF - 3, tempC: tempC - 2, condition: 'Cloudy' },
        { day: 'Saturday', tempF: tempF + 1, tempC: tempC, condition: 'Partly Cloudy' },
        { day: 'Sunday', tempF: tempF, tempC: tempC, condition: 'Clear Sky' }
      ]
    },
    events: [
      {
        title: `${normalized} Local Food & Arts Expo`,
        date: 'This Weekend',
        type: 'Festival',
        location: 'Municipal Exhibition Plaza',
        status: 'Active',
        trafficImpact: 'Medium',
        description: `Stalls, street food, and interactive craft assemblies capturing local heritage in the heart of ${normalized}.`
      },
      {
        title: 'Core Utility Water Mains Upgrades',
        date: 'Ongoing phase',
        type: 'Construction',
        location: 'Southern Arterial Avenue',
        status: 'Active',
        trafficImpact: 'Low',
        description: 'Routine maintenance of municipal water pipelines. Watch for minor lane shifts.'
      }
    ],
    transit: [
      {
        line: `${normalized} Central Rapid Line`,
        type: 'Metro',
        status: 'On Time',
        frequency: 'Every 5 mins',
        delay: 'None',
        routes: 'Central Station ↔ Northern Suburbs'
      },
      {
        line: 'City Shuttle Route 100',
        type: 'Bus',
        status: hash % 3 === 0 ? 'Delayed' : 'On Time',
        frequency: 'Every 15 mins',
        delay: hash % 3 === 0 ? '8 mins' : 'None',
        routes: 'Downtown Plaza ↔ Waterfront Boulevard'
      }
    ]
  };
}
