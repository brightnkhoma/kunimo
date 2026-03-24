'use client';

import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  location: string;
  region: string;
  status: 'active' | 'past';
  archived?: string;
  description: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: '2025 Flooding in Nkhotakota',
    location: 'Dwangwa Area',
    region: 'Central Region',
    status: 'active',
    description: 'Ongoing real-time monitoring of flooding impacts in Nkhotakota district, focusing on lake-shore communities and Dwangwa. Social media feeds are being harvested and geolocated by volunteers.',
    tags: ['Flood', 'Lakeshore', 'Active Response'],
  },
  {
    id: 2,
    title: '2025 Flooding in Kasungu',
    location: 'Kasungu, along M1 road',
    region: 'Central Region',
    status: 'active',
    description: 'Ongoing real-time monitoring of flooding and road accessibility in Kasungu district. M1 road impassable at several points. Volunteers are assessing infrastructure damage from crowdsourced posts.',
    tags: ['Flood', 'Road Damage', 'Infrastructure'],
  },
  {
    id: 3,
    title: '2023 Cyclone Freddy Flooding',
    location: 'Southern Malawi',
    region: 'Southern Region',
    status: 'past',
    archived: 'October 2023',
    description: 'Retrospective monitoring and damage assessment of flooding in Southern Malawi caused by Cyclone Freddy — one of the most devastating tropical cyclones in recorded history. Methodology published in the Journal of Flood Risk Management.',
    tags: ['Cyclone', 'Archived', 'Research'],
  },
  {
    id: 4,
    title: '2024 Flooding in Nkhotakota',
    location: 'Nkhotakota Coastal Zones',
    region: 'Central Region',
    status: 'past',
    archived: 'June 2024',
    description: 'Analysis of inland flooding and lake-level rise impacts along the Nkhotakota coastline following February 2024 rains. First operational test of the manual harvesting workflow by Patrick Kalonde and colleagues.',
    tags: ['Flood', 'Archived', 'Lake Malawi'],
  },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'active' | 'past'>('active');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = PROJECTS.filter(p => p.status === filter);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0e17]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Projects</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            GIS monitoring projects tracking disaster events across Malawi. Each project coordinates a volunteer team to harvest, assess, and geolocate social media data in support of active disaster response.
          </p>
        </div>

        {/* Filter + New Project */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-[#131724] border border-slate-700/60 rounded-xl p-1">
            <button
              onClick={() => setFilter('active')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'active' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >Active</button>
            <button
              onClick={() => setFilter('past')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'past' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >Past</button>
          </div>
          <button
            onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            New Project
          </button>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-4 mb-10">
          {filtered.map(project => (
            <div key={project.id} className="bg-[#131724] border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <strong className="text-slate-300">Location:</strong> {project.location}
                    </span>
                    {project.archived && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                        <strong className="text-slate-300">Status:</strong> Archived {project.archived}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border ${
                  project.status === 'active'
                    ? 'bg-green-500/10 text-green-400 border-green-500/25'
                    : 'bg-slate-700/40 text-slate-500 border-slate-700'
                }`}>
                  {project.status === 'active' ? '● ACTIVE MONITORING' : '✓ COMPLETED'}
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">{tag}</span>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-600">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p className="text-sm">No {filter} projects.</p>
            </div>
          )}
        </div>

        {/* Propose new project */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="bg-[#131724] border border-amber-500/20 rounded-2xl p-5 mb-6 flex gap-4">
            <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01"/></svg>
            <p className="text-sm text-slate-400">
              To ensure data integrity, only registered users can propose new GIS projects.{' '}
              <a href="#" className="text-blue-400 hover:underline">Login</a> or{' '}
              <a href="#" className="text-blue-400 hover:underline">Create an Account</a> to continue.
            </p>
          </div>

          {showForm && (
            <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-5">Propose New Project</h3>
              {submitted ? (
                <div className="flex items-center gap-3 py-6 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span className="text-sm font-medium">Project proposal submitted for review!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1.5">Project Title</label>
                    <input type="text" required placeholder="e.g. 2025 Flooding in Salima"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Exact Location</label>
                    <input type="text" required placeholder="e.g. Salima, Lake Malawi shoreline"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Organisation / Affiliation</label>
                    <input type="text" required placeholder="e.g. DoDMA, Red Cross, MUBAS"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1.5">Keywords</label>
                    <input type="text" required placeholder="e.g. flood, road damage, displacement"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                  </div>
                  <div className="col-span-2 flex gap-3">
                    <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">Create Project</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
