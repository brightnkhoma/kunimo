'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ContribMap = dynamic(() => import('@/components/ContribMap'), { ssr: false });

type WorkflowStep = 0 | 1 | 2;

const PROJECTS = [
  {
    id: 'nkhotakota',
    title: '2025 Flooding in Nkhotakota',
    focus: 'Focusing on lake-shore communities and Dwangwa.',
    harvestStep: 1,
  },
  {
    id: 'kasungu',
    title: '2025 Flooding in Kasungu',
    focus: 'Monitoring road network and infrastructure damage.',
    harvestStep: 2,
  },
];

const SAMPLE_POSTS = [
  '"Water levels at the Dwangwa bridge are rising fast. The surrounding villages are already being evacuated."',
  '"Ndikuona madzi akukwera kwambiri ku Nkhotakota — anthu akuthawa ku matchalitchi."',
  '"M1 road near Kasungu completely flooded — trucks cannot pass as of this morning."',
  '"Relief teams from Red Cross arrived in Dwangwa around 2pm with food and blankets."',
  '"My house in Nkhotakota is underwater. We need boats to rescue the elderly."',
  '"Masiku ano madzi atiphera. Shire River yatsika mtsinje. Tiphatsidwe!"',
];

export default function ContributePage() {
  const [selectedProject, setSelectedProject] = useState('nkhotakota');
  const [step, setStep] = useState<WorkflowStep>(0);
  const [postIdx, setPostIdx] = useState(0);
  const [relFeedback, setRelFeedback] = useState<{ text: string; type: 'yes' | 'no' } | null>(null);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapFinalized, setMapFinalized] = useState(false);
  const [harvestSubmitted, setHarvestSubmitted] = useState(false);
  const [langs, setLangs] = useState({ English: true, Chichewa: true, Tumbuka: false });
  const [exhausted, setExhausted] = useState(false);

  const handleRelevancy = (relevant: boolean) => {
    setRelFeedback({ text: relevant ? '✓ Marked relevant! Loading next post...' : '✗ Marked irrelevant. Loading next post...', type: relevant ? 'yes' : 'no' });
    setTimeout(() => {
      setPostIdx(i => (i + 1) % SAMPLE_POSTS.length);
      setRelFeedback(null);
    }, 1100);
  };

  const handleFinalize = () => {
    if (!mapCoords) { alert('Click the map to place a pin first.'); return; }
    setMapFinalized(true);
    setTimeout(() => setMapFinalized(false), 3500);
  };

  const stepLabels: [string, string, string] = ['Harvest', 'Relevancy', 'Mapping'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0e17]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Contribute Data</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Support ongoing disaster response by processing social media feeds — harvest posts, assess relevancy, and geolocate damage reports. Every post you process helps responders on the ground.
          </p>
        </div>

        {/* Project selector */}
        <div className="flex flex-col gap-3 mb-8">
          {PROJECTS.map(proj => (
            <button
              key={proj.id}
              onClick={() => setSelectedProject(proj.id)}
              className={`flex items-center gap-4 text-left p-4 rounded-2xl border transition-all ${
                selectedProject === proj.id
                  ? 'bg-blue-600/10 border-blue-500/40'
                  : 'bg-[#131724] border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{proj.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{proj.focus}</p>
              </div>
              {/* Steps indicator */}
              <div className="flex items-center gap-1.5">
                {stepLabels.map((label, i) => {
                  const done = i < proj.harvestStep - 1;
                  const active = i === proj.harvestStep - 1;
                  return (
                    <div key={label} className="flex items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                        done ? 'bg-green-500 border-green-500 text-white'
                          : active ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-700 text-slate-600'
                      }`}>
                        {done ? '✓' : i + 1}
                      </div>
                      {i < 2 && <div className={`w-4 h-px ${done ? 'bg-green-500' : 'bg-slate-700'}`} />}
                    </div>
                  );
                })}
              </div>
            </button>
          ))}
        </div>

        {/* Workspace */}
        <div className="bg-[#131724] border border-slate-700/50 rounded-2xl overflow-hidden">
          {/* Step tabs */}
          <div className="flex border-b border-slate-700/50">
            {stepLabels.map((label, i) => (
              <button
                key={label}
                onClick={() => setStep(i as WorkflowStep)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors border-r border-slate-700/50 last:border-r-0 ${
                  step === i ? 'bg-blue-600/15 text-blue-300 border-b-2 border-b-blue-500' : 'text-slate-500 hover:text-white'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 ${step === i ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── STEP 0: HARVEST ── */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Target Location</label>
                  <input type="text" placeholder="e.g. Dwangwa, Nkhotakota, Lake Malawi"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Languages to Include</label>
                  <div className="flex gap-4">
                    {(Object.keys(langs) as (keyof typeof langs)[]).map(lang => (
                      <label key={lang} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={langs[lang]} onChange={e => setLangs(l => ({ ...l, [lang]: e.target.checked }))}
                          className="accent-blue-500 w-4 h-4"/>
                        <span className="text-sm text-slate-300">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Choose Search Term</label>
                  <input type="text" placeholder={`e.g. "Dwangwa flood" OR "madzi Nkhotakota"`}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 mb-3"/>
                  <div className="flex gap-3">
                    <a href="https://twitter.com/search" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-blue-400 text-sm transition-colors">
                      Search X (Twitter) ↗
                    </a>
                    <a href="https://www.facebook.com/search/" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-blue-400 text-sm transition-colors">
                      Search Facebook ↗
                    </a>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Paste Post Text</label>
                  <textarea rows={4} placeholder="Paste social media post content here..."
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-blue-500"/>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Upload Media (Pictures / Screenshots)</label>
                  <input type="file" accept="image/*" multiple
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"/>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={exhausted} onChange={e => setExhausted(e.target.checked)}
                    className="accent-blue-500 w-4 h-4 mt-0.5 shrink-0"/>
                  <span className="text-sm text-slate-400">I have exhausted all relevant results for this term.</span>
                </label>
                <button onClick={() => { setHarvestSubmitted(true); setTimeout(() => { setHarvestSubmitted(false); setStep(1); }, 1200); }}
                  className="self-start px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
                  {harvestSubmitted ? '✓ Submitted!' : 'Submit to Relevancy Queue →'}
                </button>
              </div>
            )}

            {/* ── STEP 1: RELEVANCY ── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-sm text-slate-400 mb-4">Is the following post related to flood damage or response?</p>
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 mb-5 text-sm text-slate-200 leading-relaxed italic">
                    {SAMPLE_POSTS[postIdx]}
                  </div>
                  {relFeedback ? (
                    <p className={`text-sm font-medium ${relFeedback.type === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                      {relFeedback.text}
                    </p>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => handleRelevancy(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold transition-colors">
                        ✓ YES — Relevant
                      </button>
                      <button onClick={() => handleRelevancy(false)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500/12 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl text-sm font-semibold transition-colors">
                        ✗ NO — Irrelevant
                      </button>
                    </div>
                  )}
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-400">Tip:</strong> Mark a post as relevant if it describes flood damage, displacement, road blockages, water levels, or emergency response in the target area. Unrelated posts, adverts, or duplicates should be marked irrelevant.
                </div>
              </div>
            )}

            {/* ── STEP 2: MAPPING ── */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-400">
                  Identify coordinates for: <strong className="text-white">"Dwangwa River Bridge Crossing"</strong>
                </p>
                <p className="text-xs text-slate-600">Click on the map to drop a pin at the described location.</p>
                <div className="rounded-xl overflow-hidden border border-slate-700/50 h-60">
                  <ContribMap onCoordinates={(lat, lng) => setMapCoords({ lat, lng })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Latitude</label>
                    <input type="number" step="any" value={mapCoords?.lat?.toFixed(6) ?? ''} readOnly
                      placeholder="-12.500000"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none"/>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Longitude</label>
                    <input type="number" step="any" value={mapCoords?.lng?.toFixed(6) ?? ''} readOnly
                      placeholder="34.200000"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none"/>
                  </div>
                </div>
                {mapFinalized ? (
                  <div className="flex items-center gap-3 text-green-400 text-sm font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Coordinates recorded and added to the dataset!
                  </div>
                ) : (
                  <button onClick={handleFinalize}
                    className="self-start px-6 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-colors">
                    Finalize Mapping →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
