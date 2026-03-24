'use client';

import { useState } from 'react';
import HomePage from '@/components/HomePage';
import ProjectsPage from '@/components/ProjectsPage';
import ContributePage from '@/components/ContributePage';
import AccountPage from '@/components/AccountPage';
import AboutPage from '@/components/AboutPage';
import { Incident, PageView, SEED_INCIDENTS } from '@/lib/types';

const NAV_ITEMS: { id: PageView; label: string }[] = [
  { id: 'home',       label: 'Home' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contribute', label: 'Contribute' },
  { id: 'account',    label: 'Account' },
  { id: 'about',      label: 'About' },
];

export default function KunimoApp() {
  const [page, setPage] = useState<PageView>('home');
  const [incidents, setIncidents] = useState<Incident[]>(SEED_INCIDENTS);

  const addIncident = (inc: Incident) => setIncidents(prev => [...prev, inc]);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e17] text-slate-200 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ══════ NAVBAR ══════ */}
      <header className="shrink-0 bg-[#0e1120]/95 backdrop-blur border-b border-slate-700/50 px-5 flex items-center justify-between h-20 z-50">

        {/* Brand */}
        <button onClick={() => setPage('home')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 stroke-white fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
            </svg>
          </div>
          <div>
            <p className="text-[20px] font-black tracking-widest text-white leading-none">KUNIMO</p>
            <p className="text-[10px] text-slate-600 font-mono leading-none mt-0.5 hidden sm:block">Live Response Map</p>
          </div>
        </button>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Quick report shortcut */}
           
        </nav>
      </header>

      {/* ══════ PAGE CONTENT ══════
          Home page renders its own full-height layout with the map + sidebar.
          All other pages render without the sidebar — they are full-width scrollable. */}
      <main className="flex flex-1 overflow-hidden">
        {page === 'home' && (
          <HomePage incidents={incidents} onAddIncident={addIncident} />
        )}
        {page === 'projects' && <ProjectsPage />}
        {page === 'contribute' && <ContributePage />}
        {page === 'account' && <AccountPage />}
        {page === 'about' && <AboutPage />}
      </main>
    </div>
  );
}
