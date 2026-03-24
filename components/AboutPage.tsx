'use client';

const STATS = [
  { val: '4', label: 'GIS Projects' },
  { val: '2', label: 'Active Now' },
  { val: '28', label: 'Districts Covered' },
  { val: '2024', label: 'Founded at MUBAS' },
];

export default function AboutPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0e17]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 stroke-white fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">Our Story</h1>
              <p className="text-slate-400 text-sm mt-1">Turning social media data into disaster resilience for Malawi.</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-300 text-xs font-mono">
            KUNIMO = <em>Kuthana ndi Madzi Osefukira</em> — "dealing with flood water"
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {STATS.map(s => (
            <div key={s.label} className="bg-[#131724] border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-400 font-mono">{s.val}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Genesis: Cyclone Freddy */}
        <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-7 mb-5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             The Genesis: Cyclone Freddy
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Early thoughts for this platform emerged during the dark days of{' '}
            <strong className="text-white">Tropical Cyclone Freddy</strong>, one of the most devastating tropical cyclones to hit Southern Africa. As the storm caused widespread flooding, mudslides, and landslides, the open mapping community in Malawi identified a critical "missed opportunity" in how disaster data was being captured.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            While social media holds immense potential for real-time disaster response, it became evident that a dedicated platform for crowdsourcing the harvesting of social media feeds was missing. This framework and the underlying research were later published in the{' '}
            <a href="https://onlinelibrary.wiley.com/doi/10.1111/jfr3.12938" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Journal of Flood Risk Management
            </a>.
          </p>
          <div className="border-l-2 border-blue-500 bg-blue-500/5 rounded-r-xl pl-5 pr-4 py-4">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "There is an African Proverb that says: 'If you want to go fast, go alone; but if you want to go far, we have to go together.'
              In flood response life or death depends on how quick we respond — to harvest social media data it is currently tedious and we must work together to generate tangible information that can be used by response teams."
            </p>
          </div>
        </div>

        {/* Two-column section */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Nkhotakota */}
          <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              The Nkhotakota Floods
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              In early 2024, the necessity of an automated system was starkly highlighted.{' '}
              <strong className="text-white">Mr. Patrick Kalonde</strong> and his colleague,{' '}
              <strong className="text-white">Dr. Precious Mastala</strong> (a veterinary doctor), attempted to manually harvest social media feeds following the February 28 floods in Nkhotakota.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              The exercise proved that manual monitoring is too laborious to scale during a crisis. The experience reinforced that a platform to quickly identify damage and inform responders is no longer a luxury — but a necessity.
            </p>
          </div>

          {/* MUBAS Hackathon */}
          <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              Building the Foundation
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              In November 2024, a hackathon was organised at the{' '}
              <strong className="text-white">Malawi University of Business and Applied Sciences (MUBAS)</strong>. The primary goal was to develop the technical foundation for a platform that could achieve rapid social media harvesting and geolocation.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Participants suggested names and the name <strong className="text-white">KUNIMO</strong> — "Kuthana ndi Madzi Osefukira" (dealing with flood water) — was voted for.
            </p>
            <img
              src="https://kunimo-mapper.github.io/kunimo/graphics/hackathon.jpg"
              alt="Developers collaborating at the MUBAS Hackathon, November 2024"
              className="w-full rounded-xl border border-slate-700/40 mt-2"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <p className="text-xs text-slate-600 mt-2">Developers collaborating at the MUBAS Hackathon, November 2024.</p>
          </div>
        </div>

        {/* What comes next */}
        <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-7 mb-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            What Comes Next
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-3">
            After the initial development at the hackathon, interest in operationalising KUNIMO re-emerged in <strong className="text-white">December 2025</strong>. As flooding remains a recurring threat, our mission is to ensure this platform remains minimum usable and openly accessible.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            KUNIMO is an <strong className="text-white">open project</strong>. Anyone can contribute, improve the code, and help us build a more resilient Malawi. The platform combines crowdsourced social media harvesting, volunteer relevancy assessment, and collaborative GIS mapping into a single workflow that emergency responders can act on in real time.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#131724] border border-slate-700/50 rounded-2xl p-7 flex items-center justify-between gap-6">
          <div>
            <p className="text-base font-bold text-white mb-1">Join the Community</p>
            <p className="text-sm text-slate-400">Help us turn social media data into life-saving information.</p>
          </div>
          <a href="@/components/ContributePage.tsx" className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
            Contribute to KUNIMO →
          </a>
        </div>
      </div>
    </div>
  );
}
