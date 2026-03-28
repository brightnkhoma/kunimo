// 'use client';

// import { useState, useRef, useEffect, useCallback } from 'react';
// import dynamic from 'next/dynamic';
// import { Incident, WeatherStation, WeatherData, SEED_INCIDENTS, WEATHER_STATIONS } from '@/lib/types';

// const MapComponent = dynamic(() => import('@/components/map'), {
//   ssr: false,
//   loading: () => (
//     <div className="flex items-center justify-center h-full">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//         <span className="text-slate-500 text-sm font-mono">Loading map...</span>
//       </div>
//     </div>
//   ),
// });

// type GpsStatus = 'idle' | 'loading' | 'success' | 'error';

// const REGION_DOT: Record<string, string> = {
//   N: 'bg-blue-400',
//   C: 'bg-amber-400',
//   S: 'bg-red-400',
// };

// const TYPE_BADGE: Record<string, string> = {
//   Flood:     'bg-blue-500/15 text-blue-300 border-blue-500/30',
//   Cyclone:   'bg-violet-500/15 text-violet-300 border-violet-500/30',
//   Landslide: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
//   Drought:   'bg-orange-500/15 text-orange-300 border-orange-500/30',
// };

// const TYPE_ICON: Record<string, string> = {
//   Flood: '🌊', Cyclone: '🌀', Landslide: '⛰️', Drought: '☀️',
// };

// function wxIcon(rain: number, temp: number) {
//   if (rain > 5) return '⛈';
//   if (rain > 1) return '🌧';
//   if (rain > 0) return '🌦';
//   if (temp > 32) return '☀️';
//   if (temp > 26) return '⛅';
//   return '🌤';
// }

// function timeAgo(ts: string) {
//   const diff = (Date.now() - new Date(ts).getTime()) / 1000;
//   if (diff < 60) return 'just now';
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// }

// interface HomePageProps {
//   incidents: Incident[];
//   onAddIncident: (inc: Incident) => void;
// }

// export default function HomePage({ incidents, onAddIncident }: HomePageProps) {
//   const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
//   const [gpsError, setGpsError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [expandedStation, setExpandedStation] = useState<string | null>(null);
//   const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
//   const [wxUpdated, setWxUpdated] = useState('');
//   const [wxOpen, setWxOpen] = useState(true);
//   const latRef = useRef<HTMLInputElement>(null);
//   const lngRef = useRef<HTMLInputElement>(null);

//   // Fetch all weather stations
//   const fetchWeather = useCallback(async () => {
//     const init: Record<string, WeatherData> = {};
//     WEATHER_STATIONS.forEach(s => { init[s.name] = { temp:0, humidity:0, rainfall:0, loading:true, error:false }; });
//     setWeatherData(init);

//     const lats = WEATHER_STATIONS.map(s => s.lat).join(',');
//     const lngs = WEATHER_STATIONS.map(s => s.lng).join(',');
//     try {
//       const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Africa%2FBlantyre`);
//       const json = await res.json();
//       const results = Array.isArray(json) ? json : [json];
//       const updated: Record<string, WeatherData> = {};
//       WEATHER_STATIONS.forEach((s, i) => {
//         const d = results[i];
//         if (!d?.current) { updated[s.name] = { temp:0, humidity:0, rainfall:0, loading:false, error:true }; return; }
//         updated[s.name] = {
//           temp: Math.round(d.current.temperature_2m),
//           humidity: Math.round(d.current.relative_humidity_2m),
//           rainfall: parseFloat((d.current.precipitation ?? 0).toFixed(1)),
//           loading: false, error: false,
//         };
//       });
//       setWeatherData(updated);
//       setWxUpdated(new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }));
//     } catch {
//       const err: Record<string, WeatherData> = {};
//       WEATHER_STATIONS.forEach(s => { err[s.name] = { temp:0, humidity:0, rainfall:0, loading:false, error:true }; });
//       setWeatherData(err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchWeather();
//     const iv = setInterval(fetchWeather, 15 * 60 * 1000);
//     return () => clearInterval(iv);
//   }, [fetchWeather]);

//   const handleGetLocation = () => {
//     if (!navigator.geolocation) { setGpsStatus('error'); setGpsError('Geolocation not supported.'); return; }
//     setGpsStatus('loading');
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         if (latRef.current) latRef.current.value = pos.coords.latitude.toFixed(6);
//         if (lngRef.current) lngRef.current.value = pos.coords.longitude.toFixed(6);
//         setGpsStatus('success');
//         setTimeout(() => setGpsStatus('idle'), 3000);
//       },
//       err => {
//         setGpsStatus('error');
//         setGpsError(err.code === 1 ? 'Access denied.' : err.code === 2 ? 'Unavailable.' : 'Timed out.');
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const fd = new FormData(e.currentTarget);
//     const lat = parseFloat(fd.get('lat') as string);
//     const lng = parseFloat(fd.get('lng') as string);
//     const type = fd.get('type') as Incident['type'];
//     const desc = fd.get('desc') as string;
//     const newInc: Incident = {
//       id: incidents.length + 1,
//       type, lat, lng, desc,
//       title: `${type} Report #${incidents.length + 1}`,
//       loc: `${Math.abs(lat).toFixed(2)}°S ${Math.abs(lng).toFixed(2)}°E`,
//       timestamp: new Date().toISOString(),
//     };
//     onAddIncident(newInc);
//     e.currentTarget.reset();
//     setGpsStatus('idle');
//     setShowForm(false);
//   };

//   const counts = {
//     Flood: incidents.filter(i => i.type === 'Flood').length,
//     Cyclone: incidents.filter(i => i.type === 'Cyclone').length,
//     Landslide: incidents.filter(i => i.type === 'Landslide').length,
//     Drought: incidents.filter(i => i.type === 'Drought').length,
//   };

//   return (
//     <div className="flex flex-1 overflow-hidden">

//       {/* ════════════ LEFT SIDEBAR ════════════ */}
//       <aside className="w-80 shrink-0 flex flex-col overflow-hidden border-r border-slate-700/50 bg-[#111827]">

//         {/* ── Active Incidents 
//      /*   <div className="p-4 border-b border-slate-700/50">
//           <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-3">Active Incidents</p>
//           <div className="flex items-end gap-3 mb-4">
//             <span className="text-5xl font-black text-red-500 leading-none tabular-nums">{incidents.length}</span>
//             <div className="pb-0.5">
//               <p className="text-xs text-slate-400">across Malawi</p>
//               <div className="flex items-center gap-1 mt-0.5">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                 <span className="text-[10px] text-slate-600 font-mono">LIVE</span>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             {(Object.entries(counts) as [string, number][]).map(([type, count]) => (
//               <div key={type} className="flex items-center gap-1.5">
//                 <span className="text-sm leading-none">{TYPE_ICON[type]}</span>
//                 <span className="text-xs text-slate-400 flex-1 truncate">{type}</span>
//                 <span className={`text-xs font-bold font-mono tabular-nums ${count > 0 ? 'text-red-400' : 'text-slate-700'}`}>{count}</span>
//               </div>
//             ))}
//           </div>
//         </div>── */}

//         {/* ── Live Feed ── */}
//         <div className="px-4 py-2.5 border-b border-slate-700/50 flex items-center gap-2">
//           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
//           <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Live Feed</span>
//         </div>
//         <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 flex flex-col gap-2">
//           {[...incidents].reverse().map(inc => (
//             <div key={inc.id} className="bg-[#1a2035] border border-slate-700/40 rounded-lg p-2.5 text-xs">
//               <div className="flex items-center gap-1.5 mb-1">
//                 <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${TYPE_BADGE[inc.type]}`}>{inc.type}</span>
//                 <span className="text-slate-600 text-[10px] ml-auto font-mono">{timeAgo(inc.timestamp)}</span>
//               </div>
//               <p className="text-slate-300 leading-relaxed line-clamp-2">{inc.desc}</p>
//               <p className="text-slate-600 font-mono text-[10px] mt-1">📍 {inc.loc}</p>
//             </div>
//           ))}
//         </div>

//         {/* ── Weather Stations ── */}
//         <div className="border-t border-slate-700/50 shrink-0">
//           <button
//             onClick={() => setWxOpen(o => !o)}
//             className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/50 transition-colors"
//           >
//             <div className="flex items-center gap-2">
//               <span className="text-sm">🌦</span>
//               <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Weather Stations</span>
//             </div>
//             <div className="flex items-center gap-2">
//               {wxUpdated && <span className="text-[9px] text-slate-700 font-mono">↻{wxUpdated}</span>}
//               <svg className={`w-3 h-3 text-slate-600 transition-transform ${wxOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
//               </svg>
//             </div>
//           </button>

//           {wxOpen && (
//             <div className="max-h-56 overflow-y-auto">
//               {/* Legend */}
//               <div className="flex gap-3 px-4 pb-2">
//                 {[['N','Northern','bg-blue-400'],['C','Central','bg-amber-400'],['S','Southern','bg-red-400']].map(([k,l,c])=>(
//                   <div key={k} className="flex items-center gap-1">
//                     <span className={`w-1.5 h-1.5 rounded-full ${c}`}/>
//                     <span className="text-[9px] text-slate-600">{l}</span>
//                   </div>
//                 ))}
//               </div>

//               {WEATHER_STATIONS.map(station => {
//                 const w = weatherData[station.name];
//                 const isExp = expandedStation === station.name;
//                 const icon = w && !w.loading && !w.error ? wxIcon(w.rainfall, w.temp) : '—';
//                 return (
//                   <div key={station.name} className="border-t border-slate-700/30">
//                     <button
//                       onClick={() => setExpandedStation(isExp ? null : station.name)}
//                       className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800/40 transition-colors text-left"
//                     >
//                       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${REGION_DOT[station.region]}`} />
//                       <span className="text-xs text-slate-300 flex-1 truncate">{station.name}</span>
//                       <span className="text-sm leading-none shrink-0">{icon}</span>
//                       {w?.loading
//                         ? <span className="text-[10px] text-slate-600 font-mono w-9 text-right animate-pulse">···</span>
//                         : w?.error
//                           ? <span className="text-[10px] text-slate-700 font-mono w-9 text-right">N/A</span>
//                           : <span className="text-xs font-bold font-mono text-white w-9 text-right tabular-nums">{w?.temp}°C</span>
//                       }
//                       <svg className={`w-2.5 h-2.5 text-slate-700 shrink-0 transition-transform ${isExp ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
//                       </svg>
//                     </button>
//                     {isExp && w && !w.loading && !w.error && (
//                       <div className="px-3 pb-2.5 bg-slate-900/40">
//                         <div className="grid grid-cols-3 gap-1.5 pt-1.5 mb-2">
//                           <div className="bg-slate-800/60 rounded-lg p-1.5 text-center">
//                             <p className="text-sm">🌡</p>
//                             <p className="text-xs font-bold font-mono text-orange-300">{w.temp}°C</p>
//                             <p className="text-[9px] text-slate-600">Temp</p>
//                           </div>
//                           <div className="bg-slate-800/60 rounded-lg p-1.5 text-center">
//                             <p className="text-sm">💧</p>
//                             <p className="text-xs font-bold font-mono text-blue-300">{w.humidity}%</p>
//                             <p className="text-[9px] text-slate-600">Humid</p>
//                           </div>
//                           <div className="bg-slate-800/60 rounded-lg p-1.5 text-center">
//                             <p className="text-sm">🌧</p>
//                             <p className="text-xs font-bold font-mono text-cyan-300">{w.rainfall}mm</p>
//                             <p className="text-[9px] text-slate-600">Rain</p>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-[10px] mb-1">
//                             <span className="text-slate-600">Flood risk</span>
//                             <span className={`font-semibold font-mono ${w.rainfall > 5 ? 'text-red-400' : w.rainfall > 1 ? 'text-amber-400' : 'text-green-400'}`}>
//                               {w.rainfall > 5 ? 'HIGH' : w.rainfall > 1 ? 'MOD' : 'LOW'}
//                             </span>
//                           </div>
//                           <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
//                             <div className={`h-full rounded-full ${w.rainfall > 5 ? 'bg-red-500' : w.rainfall > 1 ? 'bg-amber-500' : 'bg-green-500'}`}
//                               style={{ width: `${Math.min(100, (w.rainfall / 10) * 100)}%` }} />
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     {isExp && w?.loading && (
//                       <div className="grid grid-cols-3 gap-1.5 px-3 pb-2.5 pt-1.5 bg-slate-900/40">
//                         {[1,2,3].map(n => <div key={n} className="h-12 bg-slate-800/60 rounded-lg animate-pulse" />)}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//               <div className="px-4 py-1.5 border-t border-slate-700/30">
//                 <p className="text-[9px] text-slate-700 font-mono text-center">Open-Meteo · refreshes 15min</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ════════════ MAP + REPORT PANEL ════════════ */}
//       <div className="flex flex-1 overflow-hidden relative">

//         {/* Map */}
//         <div className="flex-1 relative">
//           <MapComponent incidents={incidents} />
//           {/* Report button overlay */}
//           <button
//             onClick={() => setShowForm(f => !f)}
//             className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
//             </svg>
//             {showForm ? 'Close' : 'Report Incident'}
//           </button>
//         </div>

//         {/* Slide-in report form */}
//         {showForm && (
//           <div className="w-80 shrink-0 bg-[#111827] border-l border-slate-700/50 overflow-y-auto p-5">
//             <h2 className="text-base font-bold text-white mb-1">Report an Incident</h2>
//             <p className="text-xs text-slate-500 mb-5 leading-relaxed">Submit a new disaster observation to the KUNIMO live map.</p>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               <div>
//                 <label className="block text-xs text-slate-500 mb-1.5">Disaster Type</label>
//                 <select name="type" required className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
//                   <option value="Flood">Flood</option>
//                   <option value="Cyclone">Cyclone / Wind</option>
//                   <option value="Drought">Drought</option>
//                   <option value="Landslide">Landslide</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs text-slate-500 mb-1.5">Coordinates</label>
//                 <div className="flex gap-2 mb-2">
//                   <input type="number" step="any" name="lat" placeholder="Latitude" required ref={latRef}
//                     className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
//                   <input type="number" step="any" name="lng" placeholder="Longitude" required ref={lngRef}
//                     className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <button type="button" onClick={handleGetLocation} disabled={gpsStatus === 'loading'}
//                   className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-sm transition-colors disabled:opacity-50">
//                   {gpsStatus === 'loading' && <><svg className="animate-spin w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg><span className="text-blue-400 text-xs">Getting location...</span></>}
//                   {gpsStatus === 'success' && <span className="text-green-400 text-xs">✓ Location captured</span>}
//                   {gpsStatus === 'error' && <span className="text-red-400 text-xs">{gpsError}</span>}
//                   {gpsStatus === 'idle' && <><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><span className="text-slate-300 text-xs">Use GPS Location</span></>}
//                 </button>
//               </div>

//               <div>
//                 <label className="block text-xs text-slate-500 mb-1.5">Description</label>
//                 <textarea name="desc" rows={3} required placeholder="Describe the situation..."
//                   className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-blue-500" />
//               </div>

//               <div>
//                 <label className="block text-xs text-slate-500 mb-1.5">Upload Photo</label>
//                 <input type="file" name="image" accept="image/*"
//                   className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600" />
//               </div>

//               <button type="submit" className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors text-sm">
//                 Submit Report
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
