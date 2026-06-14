import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Brain, Users, FlaskConical, Activity,
  Shield, Globe, ChevronRight, Building2, Lock,
  Clock, TrendingUp, BarChart2, Target, Zap, CheckCircle
} from 'lucide-react';
import { useTheme, dark, light } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

/* ─── Animated counter ─── */
function Counter({ to, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * to));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── SVG Bar Chart ─── */
function BarChart({ data, title, subtitle }) {
  const { isDark } = useTheme();
  const T = isDark ? dark : light;
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="rounded-2xl p-5 backdrop-blur-sm" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
      <p className="text-xs font-semibold text-white mb-0.5">{title}</p>
      <p className="text-[11px] text-neutral-500 mb-5">{subtitle}</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-neutral-400">{d.label}</span>
              <span className="text-white font-medium">{d.display}</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 delay-300"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  background: d.color || 'linear-gradient(90deg,#7c3aed,#4f46e5)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart ─── */
function DonutChart({ percentage, label, sublabel, color = '#7c3aed' }) {
  const { isDark } = useTheme();
  const T = isDark ? dark : light;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (percentage / 100) * circ;
  return (
    <div className="rounded-2xl p-5 backdrop-blur-sm flex flex-col items-center" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
      <p className="text-xs font-semibold text-white mb-4 self-start">{label}</p>
      <div className="relative">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={r} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} strokeWidth="10" />
          <circle
            cx="55" cy="55" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <p className="text-[11px] text-neutral-500 mt-3 text-center">{sublabel}</p>
    </div>
  );
}

/* ─── Sparkline ─── */
function Sparkline({ data, color = '#7c3aed', label, value, trend }) {
  const { isDark } = useTheme();
  const T = isDark ? dark : light;
  const max = Math.max(...data), min = Math.min(...data);
  const w = 200, h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="rounded-2xl p-5 backdrop-blur-sm" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
      <p className="text-xs font-semibold text-white mb-0.5">{label}</p>
      <div className="flex items-end justify-between mb-3">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-emerald-400 font-medium">{trend}</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 60 }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${h} ${pts} ${w},${h}`}
          fill={`url(#grad-${label})`}
        />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
    </div>
  );
}

const MODULES = [
  {
    icon: FlaskConical,
    tag: 'Clinical Intelligence',
    title: 'Trial Matcher',
    desc: 'AI-powered matching engine that connects patients to active clinical trials across global registries — live, in seconds.',
    features: ['Real-time ClinicalTrials.gov sync', 'Eligibility AI screening', 'Phase & condition filters', 'One-click doctor sharing'],
    gradient: 'from-violet-600/20 via-purple-900/10 to-transparent',
    border: 'border-violet-500/25',
    glowColor: 'rgba(124,58,237,0.15)',
    badge: 'Live',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    mockView: 'trials',
  },
  {
    icon: Brain,
    tag: 'Clinical AI',
    title: 'AI Copilot',
    desc: 'Ambient AI assistant for clinicians — drafts discharge summaries, flags drug interactions, and surfaces evidence at the point of care.',
    features: ['Discharge summary generation', 'Drug interaction alerts', 'Clinical note drafting', 'ICD-10 auto-coding'],
    gradient: 'from-blue-600/20 via-cyan-900/10 to-transparent',
    border: 'border-blue-500/25',
    glowColor: 'rgba(59,130,246,0.15)',
    badge: 'Beta',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    mockView: 'copilot',
  },
  {
    icon: Users,
    tag: 'Patient Engagement',
    title: 'Patient Hub',
    desc: 'Unified patient portal with AI-assisted appointment booking, health record access, and post-discharge follow-up automation.',
    features: ['Smart appointment scheduling', 'Health record access', 'Post-discharge follow-ups', 'Multilingual (BM / EN / ZH)'],
    gradient: 'from-emerald-600/20 via-teal-900/10 to-transparent',
    border: 'border-emerald-500/25',
    glowColor: 'rgba(16,185,129,0.15)',
    badge: 'Beta',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    mockView: 'hub',
  },
];

const HOSPITALS = ['KPJ Healthcare', 'Sunway Medical', 'Gleneagles KL', 'Columbia Asia', 'Pantai Holdings'];

const STEPS = [
  { num: '01', title: 'Connect Your Hospital', desc: 'Integrate with your existing HIS/EMR in days via HL7 FHIR or custom APIs. No rip-and-replace required.' },
  { num: '02', title: 'AI Learns Your Workflows', desc: 'Models adapt to your clinical protocols, formulary, and documentation standards automatically.' },
  { num: '03', title: 'Measurable Outcomes', desc: 'Track time saved, trials matched, and patient outcomes from a unified analytics dashboard.' },
];

export default function LandingPage({ onLaunchApp, onLaunchCopilot, onLaunchHub }) {
  const { isDark } = useTheme();
  const T = isDark ? dark : light;
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

  function launchModule(view) {
    if (view === 'trials') onLaunchApp();
    else if (view === 'copilot') onLaunchCopilot();
    else if (view === 'hub') onLaunchHub();
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: T.bg, color: isDark ? '#fff' : '#0f0f1a' }}>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          top: '-30vh', left: '-10vw',
          width: '80vw', height: '80vw', maxWidth: 1000, maxHeight: 1000,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.orb1} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'pulse 10s ease-in-out infinite',
        }} />
        <div className="absolute" style={{
          top: '40vh', right: '-20vw',
          width: '70vw', height: '70vw', maxWidth: 900, maxHeight: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.orb2} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'pulse 14s ease-in-out infinite 2s',
        }} />
        <div className="absolute" style={{
          bottom: '-10vh', left: '25vw',
          width: '60vw', height: '60vw', maxWidth: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.orb3} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          animation: 'pulse 18s ease-in-out infinite 4s',
        }} />
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'border-b' : ''}`}
        style={{
          borderColor: T.border,
          background: scrolled ? T.navBg : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">MedOS <span style={{ color: '#a78bfa' }}>AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-500">
            {['Products', 'Analytics', 'How it Works', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`}
                className="hover:text-white transition-colors duration-200">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={onLaunchApp}
              className="hidden md:block text-sm text-neutral-500 hover:text-white transition-colors px-4 py-2">
              Launch App
            </button>
            <a href="#contact"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
              Request Demo
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border text-xs font-medium px-4 py-2 rounded-full mb-10"
            style={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', color: '#c4b5fd' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Built for Malaysian Healthcare — PDPA Compliant
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.02] mb-7">
            <span className="text-white">The AI Operating System</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              for Modern Hospitals
            </span>
          </h1>

          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Unify clinical trial matching, AI-assisted documentation, and patient engagement into one platform — purpose-built for Malaysia's private healthcare sector.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a href="#contact"
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)', boxShadow: '0 8px 40px rgba(124,58,237,0.35)' }}>
              Request a Demo <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={onLaunchApp}
              className="inline-flex items-center gap-2 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all"
              style={{ background: T.codeBlock }}>
              Try Trial Matcher <FlaskConical className="w-4 h-4" />
            </button>
          </div>

          {/* Hospital trust strip */}
          <div>
            <p className="text-[11px] text-neutral-700 uppercase tracking-[0.2em] mb-5">Targeting Malaysia's leading private hospital groups</p>
            <div className="flex flex-wrap justify-center gap-8">
              {HOSPITALS.map(h => (
                <span key={h} className="text-neutral-600 text-sm font-medium hover:text-neutral-400 transition-colors">{h}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" style={{ borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: 50000, suf: '+', label: 'Active Trials Indexed', color: '#a78bfa' },
            { val: 3, suf: 's', label: 'Avg Match Time', color: '#60a5fa' },
            { val: 78, suf: '%', label: 'Admin Time Saved', color: '#34d399' },
            { val: 99, suf: '.9%', label: 'Platform Uptime', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-black mb-1" style={{ color: s.color }}>
                <Counter to={s.val} suffix={s.suf} />
              </div>
              <div className="text-xs text-neutral-600 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERFORMANCE ANALYTICS ── */}
      <section id="analytics" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>Performance Impact</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Real outcomes. Measurable savings.</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Hospitals using MedOS AI report dramatic reductions in administrative burden and faster patient-to-trial matching.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
            <BarChart
              title="Time to Match a Patient (hours)"
              subtitle="Manual process vs MedOS AI"
              data={[
                { label: 'Manual Search', value: 240, display: '4 hrs', color: 'rgba(239,68,68,0.6)' },
                { label: 'Competitor Tools', value: 60, display: '1 hr', color: 'rgba(245,158,11,0.6)' },
                { label: 'MedOS AI', value: 3, display: '3 min', color: 'linear-gradient(90deg,#7c3aed,#4f46e5)' },
              ]}
            />
            <BarChart
              title="Discharge Summary Time (mins)"
              subtitle="Clinician effort per patient"
              data={[
                { label: 'Manual Drafting', value: 25, display: '25 min', color: 'rgba(239,68,68,0.6)' },
                { label: 'Template Tools', value: 12, display: '12 min', color: 'rgba(245,158,11,0.6)' },
                { label: 'AI Copilot', value: 2, display: '2 min', color: 'linear-gradient(90deg,#3b82f6,#06b6d4)' },
              ]}
            />
            <BarChart
              title="Trial Enrollment Rate"
              subtitle="% of eligible patients enrolled"
              data={[
                { label: 'Without MedOS', value: 8, display: '8%', color: 'rgba(239,68,68,0.6)' },
                { label: 'Industry Avg', value: 15, display: '15%', color: 'rgba(245,158,11,0.6)' },
                { label: 'With MedOS AI', value: 43, display: '43%', color: 'linear-gradient(90deg,#10b981,#06b6d4)' },
              ]}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <DonutChart percentage={78} label="Admin Time Saved" sublabel="Staff hours freed per week per ward" color="#7c3aed" />
            <DonutChart percentage={94} label="Match Accuracy" sublabel="Eligibility screening precision" color="#3b82f6" />
            <DonutChart percentage={89} label="Clinician Adoption" sublabel="After 30-day pilot period" color="#10b981" />
            <div className="space-y-4">
              <Sparkline
                label="Trials Matched / Day"
                value="247"
                trend="↑ 340% vs baseline"
                color="#7c3aed"
                data={[12, 18, 22, 31, 45, 67, 89, 120, 156, 198, 220, 247]}
              />
              <div className="border border-white/[0.08] rounded-2xl p-4 bg-white/[0.03] text-center">
                <p className="text-[11px] text-neutral-500 mb-2">Estimated Annual Savings</p>
                <p className="text-3xl font-black" style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RM 2.4M</p>
                <p className="text-[11px] text-neutral-600 mt-1">per 500-bed hospital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="products" className="py-24 px-6" style={{ borderTop: `1px solid ${T.divider}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>Platform Modules</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">One platform. Three superpowers.</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Each module works standalone or as part of the full MedOS suite. All live and deployable today.</p>
          </div>

          <div className="flex gap-2 justify-center mb-10 flex-wrap">
            {MODULES.map((m, i) => (
              <button key={m.title} onClick={() => setActiveModule(i)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border"
                style={activeModule === i
                  ? { background: 'rgba(124,58,237,0.2)', borderColor: 'rgba(124,58,237,0.5)', color: '#c4b5fd' }
                  : { background: T.cardBg, borderColor: T.border, color: '#6b7280' }}>
                <m.icon className="w-3.5 h-3.5" />
                {m.title}
              </button>
            ))}
          </div>

          {MODULES.map((m, i) => (
            <div key={m.title} className={activeModule === i ? 'block' : 'hidden'}>
              <div className={`border ${m.border} rounded-3xl p-8 md:p-12`}
                style={{ background: `linear-gradient(135deg, ${m.glowColor} 0%, rgba(3,3,8,0.8) 60%)`, boxShadow: `0 0 80px ${m.glowColor}` }}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className={`inline-flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-full mb-6 ${m.badgeColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {m.badge}
                    </div>
                    <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-2">{m.tag}</p>
                    <h3 className="text-4xl font-black mb-5">{m.title}</h3>
                    <p className="text-neutral-400 leading-relaxed mb-8 text-base">{m.desc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {m.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                          <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => launchModule(m.mockView)}
                      className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)', boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }}>
                      Open {m.title} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mock UI */}
                  <div className="border border-white/10 rounded-2xl p-6 space-y-3"
                    style={{ background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: `1px solid ${T.border}` }}>
                    {i === 0 && <>
                      <div className="text-[11px] text-neutral-600 font-mono mb-4">// Live Trial Matching — Breast Cancer</div>
                      {[
                        { id: 'NCT05234521', title: 'Phase III HER2+ Breast Cancer', match: '97%', status: 'Recruiting', color: '#10b981' },
                        { id: 'NCT04892341', title: 'Phase II TNBC Immunotherapy', match: '89%', status: 'Recruiting', color: '#10b981' },
                        { id: 'NCT05102847', title: 'Phase I CDK4/6 Inhibitor', match: '74%', status: 'Active', color: '#3b82f6' },
                      ].map(t => (
                        <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: T.codeBlock, border: `1px solid ${T.border}` }}>
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-300 font-medium truncate">{t.title}</p>
                            <p className="text-[10px] text-neutral-600 font-mono">{t.id}</p>
                          </div>
                          <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>{t.match}</span>
                        </div>
                      ))}
                      <div className="pt-1 text-[11px] text-neutral-600">↑ 3 of 47 matched · 3 sec</div>
                    </>}
                    {i === 1 && <>
                      <div className="text-[11px] text-neutral-600 font-mono mb-4">// AI Copilot — Auto Draft</div>
                      <div className="p-4 rounded-xl text-xs font-mono leading-relaxed" style={{ background: T.codeBlock, border: `1px solid ${T.border}` }}>
                        <span style={{ color: '#60a5fa' }}>Patient:</span><span className="text-neutral-300"> Ahmad bin Hassan, 54M</span><br/>
                        <span style={{ color: '#60a5fa' }}>Dx:</span><span className="text-neutral-300"> T2DM (E11.9), HTN (I10)</span><br/>
                        <span style={{ color: '#60a5fa' }}>Discharge Rx:</span><span className="text-neutral-300"> Metformin 500mg BD...</span><br/>
                        <span style={{ color: '#34d399' }}>✓ ICD-10 auto-coded</span><br/>
                        <span style={{ color: '#f87171' }}>⚠ Interaction: Metformin + Contrast</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        {['2 min draft', 'ICD coded', 'Reviewed'].map((tag, ti) => (
                          <span key={ti} className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>{tag}</span>
                        ))}
                      </div>
                    </>}
                    {i === 2 && <>
                      <div className="text-[11px] text-neutral-600 font-mono mb-4">// Patient Hub — Today's Schedule</div>
                      {[
                        { name: 'Siti Aminah binti Yusof', dept: 'Cardiology', time: '2:30 PM', status: 'Confirmed', color: '#10b981' },
                        { name: 'Lee Chong Wei', dept: 'Oncology', time: '4:00 PM', status: 'Follow-up', color: '#3b82f6' },
                        { name: 'Priya Ramasamy', dept: 'Endocrinology', time: '4:45 PM', status: 'New Patient', color: '#f59e0b' },
                      ].map((p, pi) => (
                        <div key={pi} className="p-3 rounded-xl" style={{ background: T.codeBlock, border: `1px solid ${T.border}` }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-white">{p.name}</span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>{p.status}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                            <span>{p.dept}</span><span>·</span><span>{p.time}</span>
                          </div>
                        </div>
                      ))}
                    </>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6" style={{ borderTop: `1px solid ${T.divider}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>Deployment</p>
            <h2 className="text-4xl font-black tracking-tight mb-4">Up and running in days</h2>
            <p className="text-neutral-400 max-w-lg mx-auto">No rip-and-replace. MedOS AI integrates with your existing hospital information systems.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.num} className="rounded-2xl p-6 transition-all hover:border-violet-500/20 group"
                style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
                <div className="text-5xl font-black font-mono mb-5" style={{ color: 'rgba(124,58,237,0.2)' }}>{s.num}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-16 px-6" style={{ borderTop: `1px solid ${T.divider}` }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'PDPA Compliant', desc: "Fully compliant with Malaysia's Personal Data Protection Act 2010. All data stays in-country." },
            { icon: Lock, title: 'HL7 FHIR Ready', desc: 'Integrates with any HIS/EMR via standard healthcare data APIs. No custom connectors needed.' },
            { icon: Globe, title: 'Multilingual', desc: 'Bahasa Malaysia, English, and Mandarin Chinese support across all modules out of the box.' },
          ].map(t => (
            <div key={t.title} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)' }}>
                <t.icon className="w-4 h-4" style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <div className="font-bold text-white text-sm mb-1">{t.title}</div>
                <div className="text-xs text-neutral-500 leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(67,56,202,0.08) 50%, rgba(3,3,8,0.95) 100%)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%)',
            }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">Ready to transform your hospital?</h2>
              <p className="text-neutral-400 mb-8">Request a 15-minute demo. We'll show you how MedOS AI saves your team hours every day — no commitment required.</p>

              {submitted ? (
                <div className="rounded-xl px-6 py-4 text-sm" style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#6ee7b7' }}>
                  Email client opened with your demo request. We'll respond within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleDemoRequest} className="flex flex-col sm:flex-row gap-3">
                  <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                    placeholder="your@hospital.com.my" required
                    className="flex-1 px-4 py-3 text-sm text-white placeholder-neutral-600 rounded-xl focus:outline-none transition-colors"
                    style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: isDark ? '#fff' : '#0f0f1a' }}
                  />
                  <button type="submit"
                    className="text-white px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)', boxShadow: '0 8px 30px rgba(124,58,237,0.35)' }}>
                    Request Demo →
                  </button>
                </form>
              )}
              <p className="text-xs text-neutral-700 mt-4">Direct contact: <span className="text-neutral-500">gaminggamermincraft@gmail.com</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${T.divider}` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4338ca)' }}>
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm text-white">MedOS AI</span>
            <span className="text-neutral-700 text-xs ml-2">Malaysia's Healthcare OS</span>
          </div>
          <div className="text-xs text-neutral-700">© 2026 MedOS AI Sdn Bhd. Kuala Lumpur, Malaysia. PDPA Compliant.</div>
        </div>
      </footer>
    </div>
  );
}
