'use client';

import { useState } from 'react';

type AccSection = 'auth' | 'notifications' | 'security';
type AuthTab = 'login' | 'signup';

const NOTIFICATION_PREFS = [
  { key: 'incidents', label: 'New incident reports', desc: 'Alert when a new disaster is submitted in your district' },
  { key: 'critical', label: 'Critical urgency alerts', desc: 'Immediate push for critical-level events' },
  { key: 'projects', label: 'Project status updates', desc: 'Notify when a project you follow changes status' },
  { key: 'contrib', label: 'Contribution confirmations', desc: 'Receipt when harvest data is accepted' },
  { key: 'digest', label: 'Weekly digest', desc: 'Summary of all activity in your region every Monday' },
];

export default function AccountPage() {
  const [section, setSection] = useState<AccSection>('auth');
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [notifState, setNotifState] = useState<Record<string, boolean>>({
    incidents: true, critical: true, projects: false, contrib: true, digest: false,
  });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(authTab === 'login' ? '✓ Signed in successfully! Welcome back.' : '✓ Account created! You can now contribute and create projects.');
  };

  const handlePwUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('✓ Password updated successfully.');
  };

  const sidebarItems: { id: AccSection; label: string }[] = [
    { id: 'auth', label: 'Sign In / Sign Up' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0e17]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome.</h1>
          <p className="text-slate-400 text-sm">You can create projects and contribute data if you have an account.</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-52 shrink-0">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-mono px-3 mb-3">Settings</p>
            <div className="flex flex-col gap-1">
              {sidebarItems.map(item => (
                <button key={item.id} onClick={() => setSection(item.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                    section === item.id ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Toast */}
            {toast && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-green-500/12 border border-green-500/25 rounded-xl text-green-400 text-sm font-medium">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {toast}
              </div>
            )}

            {/* ── AUTH ── */}
            {section === 'auth' && (
              <div className="bg-[#131724] border border-slate-700/50 rounded-2xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-700/50">
                  {(['login', 'signup'] as AuthTab[]).map(tab => (
                    <button key={tab} onClick={() => setAuthTab(tab)}
                      className={`flex-1 py-3.5 text-sm font-semibold transition-colors capitalize ${
                        authTab === tab ? 'text-blue-300 border-b-2 border-blue-500 bg-blue-600/10' : 'text-slate-400 hover:text-white'
                      }`}>
                      {tab === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {authTab === 'login' ? (
                    <form onSubmit={handleAuth} className="flex flex-col gap-4 max-w-sm">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Email Address</label>
                        <input type="email" required placeholder="you@example.com"
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Password</label>
                        <input type="password" required placeholder="••••••••"
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                      </div>
                      <button type="submit" className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">Sign In</button>
                      <p className="text-xs text-slate-600">Forgot your password? <a href="#" className="text-blue-400 hover:underline">Reset here</a></p>
                    </form>
                  ) : (
                    <form onSubmit={handleAuth} className="grid grid-cols-2 gap-4 max-w-lg">
                      <div className="col-span-2">
                        <label className="block text-xs text-slate-500 mb-1.5">Full Name</label>
                        <input type="text" required placeholder="Grace Mwale"
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Email Address</label>
                        <input type="email" required placeholder="you@example.com"
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1.5">Affiliation / Organisation</label>
                        <input type="text" required placeholder="DoDMA, Red Cross, MUBAS..."
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-slate-500 mb-1.5">Password</label>
                        <input type="password" required placeholder="••••••••"
                          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                      </div>
                      <div className="col-span-2">
                        <button type="submit" className="py-2.5 px-8 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">Create Account</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {section === 'notifications' && (
              <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-6">
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">Choose how you receive alerts from KUNIMO.</p>
                <div className="flex flex-col divide-y divide-slate-700/40">
                  {NOTIFICATION_PREFS.map(pref => (
                    <div key={pref.key} className="flex items-start justify-between gap-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{pref.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifState(s => ({ ...s, [pref.key]: !s[pref.key] }))}
                        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${notifState[pref.key] ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifState[pref.key] ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {section === 'security' && (
              <div className="flex flex-col gap-5">
                <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-5">Update Password</h3>
                  <form onSubmit={handlePwUpdate} className="flex flex-col gap-4 max-w-sm">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Current Password</label>
                      <input type="password" required placeholder="••••••••"
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">New Password</label>
                      <input type="password" required placeholder="••••••••"
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Confirm New Password</label>
                      <input type="password" required placeholder="••••••••"
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"/>
                    </div>
                    <button type="submit" className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">Update Password</button>
                  </form>
                </div>
                <div className="bg-[#131724] border border-red-500/20 rounded-2xl p-6">
                  <p className="text-sm font-bold text-red-400 mb-1">Danger Zone</p>
                  <p className="text-xs text-slate-500 mb-4">Permanently delete your KUNIMO account and all associated data.</p>
                  <button type="button" className="text-xs px-4 py-2 border border-red-500/35 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">Delete account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
