import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { getDefaultFeeds } from './src/data/defaultFeeds';
import { CityIncidentPreset, CityFeedsData } from './src/types';

// Lazy-initialize Gemini AI to prevent startup crashes if key is not set.
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory active incident override state
let activePreset: CityIncidentPreset = 'Normal';

// API: Get current city feed data
app.get('/api/feeds', (req, res) => {
  try {
    const feeds = getDefaultFeeds(activePreset);
    res.json(feeds);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Change the active incident override
app.post('/api/feeds/override', (req, res) => {
  const { preset } = req.body;
  if (!preset) {
    return res.status(400).json({ error: 'Missing preset parameter' });
  }
  activePreset = preset as CityIncidentPreset;
  const feeds = getDefaultFeeds(activePreset);
  res.json({ message: `Incident override set to ${preset}`, feeds });
});

// API: Chat streaming with real-time RAG
app.get('/api/chat', async (req, res) => {
  // Use SSE for live RAG pipeline logging + word-by-word Gemini streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const userQuery = req.query.message as string || '';
  const currentPreset = (req.query.preset as CityIncidentPreset) || activePreset;

  const sendEvent = (type: 'pipeline' | 'chunk' | 'done' | 'error', payload: any) => {
    res.write(`data: ${JSON.stringify({ type, ...payload })}\n\n`);
  };

  if (!userQuery) {
    sendEvent('error', { message: 'Empty query provided' });
    res.end();
    return;
  }

  try {
    // ---- STEP 1: ANALYZE ----
    sendEvent('pipeline', {
      step: 'ANALYZE',
      message: 'Analyzing query intent and keywords...',
      data: { query: userQuery, activeIncident: currentPreset }
    });
    await new Promise(r => setTimeout(r, 500));

    // ---- STEP 2: RETRIEVE (Semantic RAG search) ----
    const feeds = getDefaultFeeds(currentPreset);
    const lowercaseQuery = userQuery.toLowerCase();
    
    const retrievedDocs: Array<{ category: string; title: string; content: string }> = [];
    const citations: Array<{ category: string; title: string; detail: string }> = [];

    // Keyword categories matching
    const matchTraffic = /traffic|jam|delay|route|road|highway|expressway|avenue|boulevard|clear|drive|congestion|accident|avoid/.test(lowercaseQuery);
    const matchAir = /air|pollution|aqi|pm25|clean|smog|hazardous|oxygen|smoke|gas|leak/.test(lowercaseQuery);
    const matchWeather = /weather|rain|storm|sunny|temperature|temp|degrees|humidity|precipitation|wind|clouds/.test(lowercaseQuery);
    const matchTransit = /transit|metro|subway|bus|train|delay|schedule|on time|commute/.test(lowercaseQuery);
    const matchEvents = /event|festival|expo|protest|construction|rally|happen|marathon|parade/.test(lowercaseQuery);

    // Filter and document formulation
    if (matchTraffic || (!matchAir && !matchWeather && !matchTransit && !matchEvents)) {
      feeds.traffic.forEach(t => {
        const docText = `Road ${t.roadName} (ID: ${t.id}) status is ${t.status}. Speed: ${t.speedMph} mph (Normal: ${t.averageSpeedMph} mph). ${t.incident ? 'Active incident: ' + t.incident : 'No delays reported'}.`;
        retrievedDocs.push({ category: 'Traffic', title: t.roadName, content: docText });
        if (t.status !== 'Clear' || t.incident) {
          citations.push({ category: 'Traffic', title: t.roadName, detail: `${t.status} (${t.speedMph} mph) - ${t.incident || 'Slight Delay'}` });
        }
      });
    }

    if (matchAir || (!matchTraffic && !matchWeather && !matchTransit && !matchEvents)) {
      feeds.airQuality.forEach(a => {
        const docText = `Air Quality Sensor at ${a.locationName} (ID: ${a.id}) index is ${a.aqi} (${a.status}). PM2.5 levels: ${a.pm25} µg/m³, NO2 levels: ${a.no2} ppb.`;
        retrievedDocs.push({ category: 'AirQuality', title: a.locationName, content: docText });
        if (a.aqi > 50) {
          citations.push({ category: 'AirQuality', title: a.locationName, detail: `AQI ${a.aqi} (${a.status})` });
        }
      });
    }

    if (matchWeather || (!matchTraffic && !matchAir && !matchTransit && !matchEvents)) {
      feeds.weather.forEach(w => {
        const docText = `Weather Sensor at ${w.locationName} (ID: ${w.id}) reports ${w.tempF}°F, ${w.condition}. Humidity: ${w.humidity}%, Precipitation: ${w.precipitationChance}%.`;
        retrievedDocs.push({ category: 'Weather', title: w.locationName, content: docText });
        citations.push({ category: 'Weather', title: w.locationName, detail: `${w.tempF}°F - ${w.condition}` });
      });
    }

    if (matchTransit || (!matchTraffic && !matchAir && !matchWeather && !matchEvents)) {
      feeds.transit.forEach(tr => {
        const docText = `${tr.lineName} (${tr.type}) is operating at ${tr.status}. Current delay: ${tr.delayMinutes} mins. Active trains on route: ${tr.activeVehicles.length}.`;
        retrievedDocs.push({ category: 'Transit', title: tr.lineName, content: docText });
        if (tr.status !== 'On Time') {
          citations.push({ category: 'Transit', title: tr.lineName, detail: `${tr.status} (${tr.delayMinutes} min delay)` });
        }
      });
    }

    if (matchEvents || (!matchTraffic && !matchAir && !matchWeather && !matchTransit)) {
      feeds.events.forEach(e => {
        const docText = `Event "${e.title}" (${e.type}) at ${e.locationName} is ${e.status}. Traffic impact level is ${e.trafficImpact}. Description: ${e.description}`;
        retrievedDocs.push({ category: 'Events', title: e.title, content: docText });
        citations.push({ category: 'Events', title: e.title, detail: `${e.status} - ${e.trafficImpact} Impact` });
      });
    }

    // Fallback default: provide top indicators if specific document count is zero
    if (retrievedDocs.length === 0) {
      retrievedDocs.push({
        category: 'System',
        title: 'Sector 7 General Status',
        content: `Current City Incident Mode is ${feeds.activeIncident}. Traffic segments: ${feeds.traffic.length}, Weather stations: ${feeds.weather.length}, Transit lines: ${feeds.transit.length}.`
      });
    }

    sendEvent('pipeline', {
      step: 'RETRIEVE',
      message: `Retrieved ${retrievedDocs.length} matching feed documents from the city database.`,
      data: { documents: retrievedDocs, citationCount: citations.length }
    });
    await new Promise(r => setTimeout(r, 600));

    // ---- STEP 3: AUGMENT ----
    const contextText = retrievedDocs.map(doc => `[Category: ${doc.category} | Source: ${doc.title}]\n${doc.content}`).join('\n\n');
    const systemPrompt = `You are GuideLense, the expert AI City Intelligence Assistant for Metropolis Sector 7. 
Your task is to answer user queries accurately based ONLY on the provided live sensor/incident database documents.
Be warm, professional, highly precise with numbers, and explicitly cite the sensors or roads you retrieved from (e.g. Greenwood Park [AQ1], Grand Avenue [T1], Metro Line A [TR1]).
If there are any alerts (e.g. AQI > 100, delays, blocked roads), bold them as a warning and suggest alternate routes or protective actions.
`;

    const promptText = `
User Query: "${userQuery}"

--- CURRENT LIVE CITY SENSOR AND INTELLIGENCE DOCUMENTS ---
Active Incident Mode: ${feeds.activeIncident}
Timestamp: ${feeds.lastUpdated}

${contextText}
---------------------------------------------------------

Answer the User Query using the documents above. Highlight alerts in bold and explicitly cite source sensors or segment IDs in square brackets. Keep the answer concise and highly readable.
`;

    sendEvent('pipeline', {
      step: 'AUGMENT',
      message: 'Augmenting query with document context and configuring LLM parameters...',
      data: { systemInstructions: systemPrompt.slice(0, 150) + '...' }
    });
    await new Promise(r => setTimeout(r, 400));

    // ---- STEP 4: STREAM RESPONSE ----
    sendEvent('pipeline', {
      step: 'STREAM',
      message: 'Beginning real-time generative streaming response...',
      data: { citations }
    });

    const aiClient = getGeminiClient();

    if (aiClient) {
      // Real-time streaming from Gemini API
      const responseStream = await aiClient.models.generateContentStream({
        model: 'gemini-3.5-flash',
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          sendEvent('chunk', { text: chunk.text });
        }
      }
    } else {
      // Simulated Streaming RAG Generator (Fallback if key is absent)
      // Analyzes query and responds intelligently word-by-word with realistic telemetry data!
      let simulatedResponse = `**(Simulated Response - Please set your GEMINI_API_KEY in Settings > Secrets for live AI generation)**\n\n`;

      if (lowercaseQuery.includes('traffic') || lowercaseQuery.includes('route')) {
        if (currentPreset === 'Normal') {
          simulatedResponse += `Based on the latest feeds, **Grand Avenue [T1]** and the **Eastside Expressway [T3]** are running at peak speed of 45–55 mph. There are no major traffic jams reported in Sector 7 today. 

**Recommended route:** Taking **Grand Avenue [T1]** is the cleanest and fastest route to transit downtown. Avoid the slight minor slowing on **Westside Highway [T2]** where speeds have dipped to 35 mph due to regular lane checks.`;
        } else if (currentPreset === 'GasLeak') {
          simulatedResponse += `⚠️ **ALERT:** **Grand Avenue [T1]** is currently **Blocked** due to an active emergency HAZMAT dispatch responding to a Gas Main Leak near the Industrial Zone.

**Alternative Route:** Do NOT attempt to take Grand Avenue. Instead, divert to the **Eastside Expressway [T3]** which is completely clear (running at 55 mph), or take **Riverside Drive [T5]** (running at 40 mph). Expect medium delays on **Central Boulevard [T4]** due to redirected bypass traffic.`;
        } else if (currentPreset === 'TransitStrike') {
          simulatedResponse += `⚠️ **ALERT:** Severe traffic gridlock is occurring due to the active Transit Strike. **Grand Avenue [T1]** and **Central Boulevard [T4]** are showing **Heavy Congestion** with speeds reduced to a crawl of 10 mph.

**Alternative Route:** Use the **Eastside Expressway [T3]** where speeds are still moderate at 45 mph, or telecommute if possible. Avoid central terminals due to the active protest rally at Downtown Central Terminal [E_STRIKE].`;
        } else if (currentPreset === 'SuddenStorm') {
          simulatedResponse += `⛈️ **WEATHER ADVISORY:** Driving conditions are hazardous. All main roadways report **Moderate to Heavy traffic** due to flash flood hazards and water pooling on roadways. Speed limits are restricted to 15–25 mph for safety.

**Alternative Route:** The **Eastside Expressway [T3]** remains the sturdiest freeway route, though speeds are capped. Ensure you keep double braking distances.`;
        } else if (currentPreset === 'MusicFestival') {
          simulatedResponse += `🎉 **FESTIVAL TRAFFIC:** The *Metropolis Summer Sound Clash [E_FEST]* is active at Greenwood Park. Consequently, **Westside Highway [T2]** is experiencing heavy bumper-to-bumper pedestrian congestion (speeds at 11 mph) and **Grand Avenue [T1]** is locked at 14 mph.

**Alternative Route:** Bypass the west quadrant entirely. Take **Eastside Expressway [T3]** (running smoothly at 55 mph) and approach downtown from the east side.`;
        }
      } else if (lowercaseQuery.includes('air') || lowercaseQuery.includes('clean') || lowercaseQuery.includes('pollution')) {
        if (currentPreset === 'Normal') {
          simulatedResponse += `Currently, the area with the cleanest air is **Greenwood Park [AQ1]** with an excellent Air Quality Index of **22 (Good)**, followed closely by **Riverside Walk [AQ4]** with an AQI of **31 (Good)**.

The busy **Downtown Hub [AQ3]** has a moderate AQI of **54**. For outdoor activities or jogging tonight, Greenwood Park is highly recommended.`;
        } else if (currentPreset === 'GasLeak') {
          simulatedResponse += `⚠️ **CRITICAL AIR HAZARD ALERT:** The **Industrial District [AQ2]** is reporting an extremely hazardous Air Quality Index of **345 (Hazardous)** due to a pipeline rupture and HAZMAT gas incident. PM2.5 has spiked to **142.8 µg/m³**.

**Safety Recommendation:** Residents in the eastern industrial sector must close all windows, shut off ventilation, and stay indoors. The cleanest air remains at **Riverside Walk [AQ4]** (AQI 31) and **Greenwood Park [AQ1]** (AQI 22). Avoid the east quadrant completely.`;
        } else if (currentPreset === 'TransitStrike') {
          simulatedResponse += `In Sector 7, air quality has degraded in central zones due to idling combustion cars during the strike. **Downtown Hub [AQ3]** reports **112 (Unhealthy for Sensitive Groups)**.

The cleanest air is still located along the coastline at **Riverside Walk [AQ4]** with an AQI of **31 (Good)** and **Greenwood Park [AQ1]** with an AQI of **22 (Good)**. Avoid active congestion points.`;
        } else if (currentPreset === 'SuddenStorm') {
          simulatedResponse += `🍃 **EXCELLENT AIR QUALITY:** The severe downpour and winds have completely cleansed the atmosphere! All sensor stations are reporting pristine air:
- **Greenwood Park [AQ1]:** AQI 5 (Good)
- **Riverside Walk [AQ4]:** AQI 7 (Good)
- **Downtown Hub [AQ3]:** AQI 13 (Good)

Air is pristine across the entire Sector 7 grid this evening.`;
        } else {
          simulatedResponse += `The area with the cleanest air is **Riverside Walk [AQ4]** with an AQI of **31 (Good)**. **Greenwood Park [AQ1]** has slightly increased to **65 (Moderate)** due to dust, food truck vendors, and high attendance at the *Summer Sound Clash* festival. Avoid Greenwood Park if you have sensitive respiratory conditions.`;
        }
      } else {
        // General query
        simulatedResponse += `Hello! I have scanned the live city intelligence database. Currently, Sector 7 is operating under **${currentPreset}** mode. 

**Summary of Live Documents:**
- **Weather:** Downtown [W1] is reporting ${feeds.weather[0].tempF}°F, ${feeds.weather[0].condition}.
- **Traffic:** Road status ranges from *${feeds.traffic[0].status}* on Grand Avenue to *${feeds.traffic[1].status}* on Westside Highway.
- **Air Quality:** Greenwood Park AQ1 reports AQI of ${feeds.airQuality[0].aqi} (${feeds.airQuality[0].status}).
- **Transit:** Transit lines are showing *${feeds.transit[0].status}* on Metro A.

Ask me about traffic routes, air quality readings, active events, or public transport to see precise telemetry analysis!`;
      }

      // Stream the simulated response word-by-word
      const words = simulatedResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        sendEvent('chunk', { text: words[i] + ' ' });
        await new Promise(r => setTimeout(r, Math.max(10, Math.floor(Math.random() * 25))));
      }
    }

    sendEvent('done', {});
    res.end();
  } catch (error: any) {
    console.error('Error in chat stream:', error);
    sendEvent('error', { message: error.message || 'Internal Server Error' });
    res.end();
  }
});

// Start server and handle Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GuideLense] Server booting in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
  });
}

startServer();
