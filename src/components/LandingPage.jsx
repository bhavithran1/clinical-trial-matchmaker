import { useState, useEffect } from 'react';
import {
  ArrowRight, Brain, Users, FlaskConical, BarChart3, Shield,
  Zap, Globe, ChevronRight, Star, Building2, Activity,
  FileText, MessageSquare, Calendar, Database, Lock, TrendingUp
} from 'lucide-react';

const MODULES = [
  {
    icon: FlaskConical,
    tag: 'Clinical Intelligence',
    title: 'Trial Matcher',
    desc: 'AI-powered matching engine that connects patients to active clinical trials across global registries — live, in seconds.',
    features: ['Real-time ClinicalTrials.gov sync', 'Eligibility AI screening', 'Phase & condition filters', 'One-click doctor sharing'],
    gradient: 'from-violet-500/20 to-purple-600/10',
    border: 'border-violet-500/20',
    glow: 'shadow-violet-500/10',
    badge: 'Live',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  {
    icon: Brain,
    tag: 'Clinical AI',
    title: 'AI Copilot',
    desc: 'Ambient AI assistant for clinicians — drafts discharge summaries, flags drug interactions, and surfaces evidence at the point of care.',
    features: ['Discharge summary generation', 'Drug interaction alerts', 'Clinical note drafting', 'ICD-10 auto-coding'],
    gradient: 'from-blue-500/20 to-cyan-600/10',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/10',
    badge: 'Beta',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    icon: Users,
    tag: 'Patient Engagement',
    title: 'Patient Hub',
    desc: 'Unified patient portal with AI-assisted appointment booking, health record access, and post-discharge follow-up automation.',
    features: ['Smart appointment scheduling', 'Health record access', 'Post-discharge follow-ups', 'Multilingual (BM / EN / ZH)'],
    gradient: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/10',
    badge: 'Coming Soon',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
];

const STATS = [
  { value: '50,000+', label: 'Active Trials Indexed' },
  { value: '< 3s', label: 'Match Time' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: 'PDPA', label: 'Compliant' },
];

const STEPS = [
  { num: '01', title: 'Connect Your Hospital', desc: 'Integrate with your existing HIS/EMR in days, not months. We support HL7 FHIR and custom APIs.' },
  { num: '02', title: 'AI Learns Your Workflows', desc: 'Our models adapt to your clinical protocols, formulary, and documentation standards automatically.' },
  { num: '03', title: 'Measurable Outcomes', desc: 'Track time saved, trials matched, and patient outcomes from a unified analytics dashboard.' },
];

const HOSPITALS = ['KPJ Healthcare', 'Sunway Medical', 'Gleneagles KL', 'Columbia Asia', 'Pantai Holdings'];

export default function LandingPage({ onLaunchApp }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function handleDemoRequest(e) {
    e.preventDefault();
    if (!emailInput) return;
    const subject = encodeURIComponent('Demo Request — MedOS AI');
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to schedule a demo of MedOS AI for our hospital.\n\nContact email: ${emailInput}\n\nLooking forward to hearing from you.`
    );
    window.open(`mailto:gaminggamermincraft@gmail.com?subject=${subject}&body=${body}`);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white overflow-x-hidden">

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20vh] left-[-10vw] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-violet-600/8 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[30vh] right-[-15vw] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-blue-600/6 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[-10vh] left-[20vw] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-purple-600/5 blur-[100px] animate-pulse" style={{ animationDuration: '16s' }} />
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#05050a]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">MedOS <span className="text-violet-400">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
            <a href="#modules" className="hover:text-white transition-colors">Products</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="hidden md:block text-sm text-neutral-400 hover:text-white transition-colors px-4 py-2"
            >
              Launch App
            </button>
            <a href="#contact" className="text-sm bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-neutral-100 transition-colors">
              Request Demo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Built for Malaysian Healthcare
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            The AI Operating System<br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              for Modern Hospitals
            </span>
          </h1>

          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Unify clinical intelligence, patient engagement, and trial matching into one platform — purpose-built for Malaysia's private healthcare sector.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-500/25">
              Request a Demo <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-2 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all">
              Try Trial Matcher <FlaskConical className="w-4 h-4" />
            </button>
          </div>

          {/* Hospital trust strip */}
          <div className="mt-16">
            <p className="text-xs text-neutral-600 uppercase tracking-widest mb-6">Targeting Malaysia's leading private hospital groups</p>
            <div className="flex flex-wrap justify-center gap-6">
              {HOSPITALS.map(h => (
                <div key={h} className="text-neutral-600 text-sm font-medium hover:text-neutral-400 transition-colors cursor-default">{h}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">Platform Modules</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">One platform. Three superpowers.</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Each module works standalone or as part of the full MedOS suite.</p>
          </div>

          {/* Module tabs */}
          <div className="flex gap-2 justify-center mb-12 flex-wrap">
            {MODULES.map((m, i) => (
              <button
                key={m.title}
                onClick={() => setActiveModule(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeModule === i
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'border-white/[0.06] text-neutral-500 hover:text-neutral-300 hover:border-white/10'
                }`}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.title}
              </button>
            ))}
          </div>

          {/* Active module detail */}
          {MODULES.map((m, i) => (
            <div key={m.title} className={`transition-all duration-300 ${activeModule === i ? 'block' : 'hidden'}`}>
              <div className={`border ${m.border} rounded-3xl bg-gradient-to-br ${m.gradient} p-8 md:p-12 shadow-xl ${m.glow}`}>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <div className={`inline-flex items-center gap-2 border text-xs font-medium px-3 py-1 rounded-full mb-6 ${m.badgeColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {m.badge}
                    </div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">{m.tag}</p>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{m.title}</h3>
                    <p className="text-neutral-400 leading-relaxed mb-8">{m.desc}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {m.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    {i === 0 && (
                      <button
                        onClick={onLaunchApp}
                        className="mt-8 inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors">
                        Try it Now <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {i !== 0 && (
                      <a href="#contact" className="mt-8 inline-flex items-center gap-2 border border-white/20 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-white/40 transition-colors">
                        Join Waitlist <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Mock UI panel */}
                  <div className="border border-white/10 rounded-2xl bg-black/30 backdrop-blur-sm p-6 space-y-3">
                    {i === 0 && (
                      <>
                        <div className="text-xs text-neutral-500 mb-4 font-mono">// Live Trial Match</div>
                        {['NCT05234521 — Lung Cancer Phase III', 'NCT04892341 — Breast Cancer Phase II', 'NCT05102847 — Colorectal Phase I/II'].map((t, ti) => (
                          <div key={ti} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span className="text-xs text-neutral-300 font-mono">{t}</span>
                          </div>
                        ))}
                        <div className="pt-2 text-xs text-neutral-600">↑ 3 of 47 matched trials</div>
                      </>
                    )}
                    {i === 1 && (
                      <>
                        <div className="text-xs text-neutral-500 mb-4 font-mono">// AI Copilot — Discharge Draft</div>
                        <div className="text-xs text-neutral-400 leading-relaxed border border-white/[0.06] rounded-xl p-4 bg-white/[0.02] font-mono">
                          <span className="text-blue-400">Patient:</span> Ahmad bin Hassan, 54M<br/>
                          <span className="text-blue-400">Dx:</span> T2DM, HTN<br/>
                          <span className="text-blue-400">Rx:</span> Metformin 500mg BD...<br/>
                          <span className="text-emerald-400">✓ ICD-10: E11.9, I10</span><br/>
                          <span className="text-violet-400">⚠ Drug interaction flagged</span>
                        </div>
                      </>
                    )}
                    {i === 2 && (
                      <>
                        <div className="text-xs text-neutral-500 mb-4 font-mono">// Patient Hub</div>
                        {[
                          { name: 'Siti Aminah', appt: 'Cardiology — 15 Jun 2:30pm', status: 'Confirmed' },
                          { name: 'Lee Chong Wei', appt: 'Oncology — 17 Jun 10am', status: 'Follow-up' },
                        ].map((p, pi) => (
                          <div key={pi} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-white">{p.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{p.status}</span>
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-1">{p.appt}</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">Deployment</p>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Up and running in days</h2>
            <p className="text-neutral-400 max-w-lg mx-auto">No rip-and-replace. MedOS AI integrates with your existing hospital systems.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.num} className="border border-white/[0.06] rounded-2xl p-6 bg-white/[0.02] hover:border-white/10 transition-colors">
                <div className="text-4xl font-bold text-white/10 font-mono mb-4">{s.num}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="py-16 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'PDPA Compliant', desc: 'Fully compliant with Malaysia\'s Personal Data Protection Act 2010.' },
            { icon: Lock, title: 'HL7 FHIR Ready', desc: 'Integrates with any HIS/EMR via standard healthcare APIs.' },
            { icon: Globe, title: 'Multilingual', desc: 'Bahasa Malaysia, English, and Mandarin support out of the box.' },
          ].map(t => (
            <div key={t.title} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                <t.icon className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm mb-1">{t.title}</div>
                <div className="text-xs text-neutral-500 leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="border border-violet-500/20 rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-600/5 p-10 md:p-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to transform your hospital?</h2>
            <p className="text-neutral-400 mb-8">Request a 15-minute demo. We'll show you how MedOS AI works with your existing systems — no commitment required.</p>

            {submitted ? (
              <div className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 rounded-xl px-6 py-4 text-sm">
                Your email client will open with a pre-filled demo request. We'll respond within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleDemoRequest} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="your@hospital.com.my"
                  required
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/25 whitespace-nowrap">
                  Request Demo →
                </button>
              </form>
            )}
            <p className="text-xs text-neutral-600 mt-4">Or email us directly: <span className="text-neutral-400">gaminggamermincraft@gmail.com</span></p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">MedOS AI</span>
            <span className="text-neutral-700 text-xs ml-2">Malaysia's Healthcare Operating System</span>
          </div>
          <div className="text-xs text-neutral-700">© 2026 MedOS AI. All rights reserved. Kuala Lumpur, Malaysia.</div>
        </div>
      </footer>
    </div>
  );
}
