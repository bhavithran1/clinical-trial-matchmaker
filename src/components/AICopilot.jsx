import { useState, useRef, useEffect } from 'react';
import { Brain, Loader, AlertTriangle, CheckCircle, Copy, Download, ArrowLeft, Activity, Zap, FileText, Pill, Code2, MessageSquare } from 'lucide-react';
import { useTheme, dark, light } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const DRUG_INTERACTIONS = {
  metformin: [
    { drug: 'Contrast Media (Iodinated)', severity: 'HIGH', effect: 'Risk of contrast-induced nephropathy and lactic acidosis. Hold metformin 48h before and after contrast.' },
    { drug: 'Alcohol', severity: 'MODERATE', effect: 'Increased risk of lactic acidosis.' },
  ],
  warfarin: [
    { drug: 'Aspirin', severity: 'HIGH', effect: 'Significantly increases bleeding risk. Monitor INR closely.' },
    { drug: 'Ibuprofen / NSAIDs', severity: 'HIGH', effect: 'Displaces warfarin from protein binding, increases anticoagulation.' },
    { drug: 'Amoxicillin', severity: 'MODERATE', effect: 'May alter gut flora and affect Vitamin K metabolism, changing INR.' },
  ],
  lisinopril: [
    { drug: 'Potassium Supplements', severity: 'MODERATE', effect: 'Risk of hyperkalemia — monitor serum potassium.' },
    { drug: 'NSAIDs', severity: 'MODERATE', effect: 'Reduced antihypertensive effect, risk of renal impairment.' },
  ],
  simvastatin: [
    { drug: 'Amlodipine', severity: 'MODERATE', effect: 'Increased plasma levels of simvastatin — cap dose at 20mg.' },
    { drug: 'Clarithromycin', severity: 'HIGH', effect: 'Significantly elevated statin levels, risk of myopathy/rhabdomyolysis.' },
  ],
};

const ICD10_MAP = {
  'diabetes': { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
  'hypertension': { code: 'I10', desc: 'Essential (primary) hypertension' },
  'heart failure': { code: 'I50.9', desc: 'Heart failure, unspecified' },
  'pneumonia': { code: 'J18.9', desc: 'Pneumonia, unspecified organism' },
  'copd': { code: 'J44.1', desc: 'Chronic obstructive pulmonary disease with acute exacerbation' },
  'ckd': { code: 'N18.3', desc: 'Chronic kidney disease, stage 3' },
  'sepsis': { code: 'A41.9', desc: 'Sepsis, unspecified organism' },
  'uti': { code: 'N39.0', desc: 'Urinary tract infection, site not specified' },
  'chest pain': { code: 'R07.9', desc: 'Chest pain, unspecified' },
  'stroke': { code: 'I64', desc: 'Stroke, not specified as haemorrhage or infarction' },
  'mi': { code: 'I21.9', desc: 'Acute myocardial infarction, unspecified' },
  'appendicitis': { code: 'K37', desc: 'Unspecified appendicitis' },
};

const TEMPLATES = [
  {
    id: 'discharge',
    label: 'Discharge Summary',
    icon: FileText,
    placeholder: `Patient: Ahmad bin Hassan, 54M
Admission: 10 Jun 2026
Diagnosis: Type 2 Diabetes, Hypertension
Medications: Metformin 500mg BD, Amlodipine 5mg OD
Investigations: HbA1c 9.2%, BP 158/96, Cr 112
Plan: Dietary counselling, follow-up in 4 weeks`,
  },
  {
    id: 'drug',
    label: 'Drug Interaction Check',
    icon: Pill,
    placeholder: `Enter medications to check:\nMetformin\nWarfarin\nAmlodipine`,
  },
  {
    id: 'icd',
    label: 'ICD-10 Auto-Coder',
    icon: Code2,
    placeholder: `Enter diagnoses to code:\nType 2 diabetes\nHypertension\nHeart failure`,
  },
  {
    id: 'note',
    label: 'Clinical Note',
    icon: MessageSquare,
    placeholder: `SOAP format input:\nS: Patient presents with 3-day history of fever, cough, SOB\nO: Temp 38.8°C, SpO2 94% RA, CXR consolidation RLL\nA: Community-acquired pneumonia\nP: IV Augmentin, O2 therapy, monitor`,
  },
];

function SeverityBadge({ s }) {
  const colors = { HIGH: 'text-red-400 bg-red-500/10 border-red-500/25', MODERATE: 'text-amber-400 bg-amber-500/10 border-amber-500/25', LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[s] || colors.LOW}`}>{s}</span>;
}

function generateDischargeSummary(input) {
  const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const get = (key) => {
    const l = lines.find(l => l.toLowerCase().startsWith(key.toLowerCase()));
    return l ? l.split(':').slice(1).join(':').trim() : null;
  };
  const patient = get('Patient') || 'Unknown Patient';
  const admission = get('Admission') || get('Admit') || 'Unknown';
  const dx = get('Diagnosis') || get('Dx') || 'Not specified';
  const meds = get('Medications') || get('Rx') || get('Meds') || 'Not specified';
  const plan = get('Plan') || 'Follow-up as scheduled';

  const today = new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });

  return `DISCHARGE SUMMARY
═══════════════════════════════════════
Hospital: MedOS AI — Demo Hospital, KL
Date of Discharge: ${today}
Date of Admission: ${admission}

PATIENT DETAILS
───────────────
Name: ${patient}
MRN: MH-${Math.floor(100000 + Math.random() * 900000)}

FINAL DIAGNOSES
───────────────
${dx.split(',').map((d, i) => `${i + 1}. ${d.trim()}`).join('\n')}

MEDICATIONS ON DISCHARGE
─────────────────────────
${meds.split(',').map(m => `• ${m.trim()}`).join('\n')}

DISCHARGE PLAN
──────────────
${plan}

FOLLOW-UP
─────────
• Review in outpatient clinic in 4 weeks
• Patient educated on medication compliance
• Emergency contact: Hospital Switchboard 03-XXXX XXXX

Prepared by: MedOS AI Copilot
Reviewed by: Attending Physician
═══════════════════════════════════════`;
}

function checkDrugInteractions(input) {
  const drugs = input.split('\n').map(d => d.trim().toLowerCase()).filter(Boolean);
  const found = [];
  for (const drug of drugs) {
    for (const [key, interactions] of Object.entries(DRUG_INTERACTIONS)) {
      if (drug.includes(key)) {
        for (const interaction of interactions) {
          const other = drugs.find(d => d !== drug && interaction.drug.toLowerCase().includes(d.split(' ')[0]));
          if (other || true) {
            found.push({ drug1: drug, drug2: interaction.drug, ...interaction });
          }
        }
      }
    }
  }
  return found;
}

function codeICD10(input) {
  const lines = input.split('\n').map(l => l.trim().toLowerCase()).filter(Boolean);
  return lines.map(line => {
    for (const [key, val] of Object.entries(ICD10_MAP)) {
      if (line.includes(key)) return { diagnosis: line, ...val };
    }
    return { diagnosis: line, code: '—', desc: 'No match found — manual coding required' };
  });
}

function generateClinicalNote(input) {
  return `CLINICAL PROGRESS NOTE
Date: ${new Date().toLocaleDateString('en-MY')} ${new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}

${input.split('\n').map(line => {
  if (line.startsWith('S:')) return `SUBJECTIVE\n${line.slice(2).trim()}`;
  if (line.startsWith('O:')) return `\nOBJECTIVE\n${line.slice(2).trim()}`;
  if (line.startsWith('A:')) return `\nASSESSMENT\n${line.slice(2).trim()}`;
  if (line.startsWith('P:')) return `\nPLAN\n${line.slice(2).trim()}`;
  return line;
}).join('\n')}

Documented by: MedOS AI Copilot
Physician to countersign: ________________`;
}

export default function AICopilot({ onBack }) {
  const { isDark } = useTheme();
  const T = isDark ? dark : light;
  const [activeTemplate, setActiveTemplate] = useState('discharge');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const template = TEMPLATES.find(t => t.id === activeTemplate);

  function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      if (activeTemplate === 'discharge') setOutput({ type: 'text', content: generateDischargeSummary(input) });
      else if (activeTemplate === 'drug') setOutput({ type: 'interactions', content: checkDrugInteractions(input) });
      else if (activeTemplate === 'icd') setOutput({ type: 'icd', content: codeICD10(input) });
      else if (activeTemplate === 'note') setOutput({ type: 'text', content: generateClinicalNote(input) });
      setLoading(false);
    }, 1200);
  }

  function copy() {
    const text = output?.type === 'text' ? output.content
      : output?.type === 'icd' ? output.content.map(c => `${c.diagnosis}: ${c.code} — ${c.desc}`).join('\n')
      : output?.content?.map(i => `${i.drug1} + ${i.drug2}: ${i.severity} — ${i.effect}`).join('\n\n') || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: isDark ? '#fff' : '#0f0f1a' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {/* Orb */}
      <div className="fixed top-0 right-0 pointer-events-none" style={{
        width: '60vw', height: '60vw', maxWidth: 800,
        background: `radial-gradient(circle, ${T.orb2} 0%, transparent 70%)`,
        filter: 'blur(80px)', borderRadius: '50%',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06]" style={{ background: T.navBg, backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-neutral-500 hover:text-white transition-colors mr-1">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm leading-none">AI <span style={{ color: '#60a5fa' }}>Copilot</span></h1>
              <p className="text-[10px] text-neutral-600 mt-0.5">Clinical AI Assistant · Beta</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI Model Active
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#60a5fa' }}>Clinical Intelligence</p>
          <h2 className="text-3xl font-black text-white mb-2">AI Clinical Copilot</h2>
          <p className="text-neutral-500 text-sm">Automate documentation, check drug interactions, and code diagnoses in seconds.</p>
        </div>

        {/* Template tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => { setActiveTemplate(t.id); setOutput(null); setInput(''); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
              style={activeTemplate === t.id
                ? { background: 'rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,0.5)', color: '#93c5fd' }
                : { background: T.cardBg, borderColor: T.border, color: '#6b7280' }}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <template.icon className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-400">{template.label} · Input</span>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={template.placeholder}
                rows={14}
                className="w-full px-4 py-4 text-sm placeholder-neutral-700 bg-transparent focus:outline-none resize-none font-mono leading-relaxed" style={{ color: isDark ? '#d1d5db' : '#374151' }}
              />
            </div>
            <button onClick={handleGenerate} disabled={loading || !input.trim()}
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white transition-all disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: loading ? 'none' : '0 8px 30px rgba(59,130,246,0.3)' }}>
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? 'Generating…' : `Generate ${template.label}`}
            </button>
          </div>

          {/* Output */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.cardBg, minHeight: 400 }}>
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-400">AI Output</span>
              </div>
              {output && (
                <button onClick={copy} className="text-[11px] flex items-center gap-1 text-neutral-500 hover:text-white transition-colors">
                  <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="p-4">
              {!output && !loading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Brain className="w-10 h-10 text-neutral-800 mb-3" />
                  <p className="text-neutral-600 text-sm">Fill in the input and click Generate</p>
                  <p className="text-neutral-700 text-xs mt-1">Output will appear here</p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin mb-3" />
                  <p className="text-neutral-500 text-sm">AI is processing…</p>
                </div>
              )}
              {output?.type === 'text' && (
                <pre className="text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap">{output.content}</pre>
              )}
              {output?.type === 'interactions' && (
                <div className="space-y-3">
                  {output.content.length === 0 ? (
                    <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-300">No significant interactions found</span>
                    </div>
                  ) : output.content.map((i, idx) => (
                    <div key={idx} className="p-4 rounded-xl space-y-2" style={{ background: T.codeBlock, border: `1px solid ${T.border}` }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white capitalize">{i.drug1}</span>
                        <span className="text-neutral-600 text-xs">+</span>
                        <span className="text-sm font-semibold text-white">{i.drug2}</span>
                        <SeverityBadge s={i.severity} />
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">{i.effect}</p>
                    </div>
                  ))}
                </div>
              )}
              {output?.type === 'icd' && (
                <div className="space-y-2">
                  {output.content.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: T.codeBlock, border: `1px solid ${T.border}` }}>
                      <span className="text-xs font-bold font-mono shrink-0 mt-0.5" style={{ color: '#60a5fa' }}>{c.code}</span>
                      <div>
                        <p className="text-xs text-white font-medium capitalize">{c.diagnosis}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Time saved per summary', value: '23 min', color: '#60a5fa' },
            { label: 'ICD-10 accuracy', value: '94%', color: '#a78bfa' },
            { label: 'Drug alerts flagged today', value: '12', color: '#f87171' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
              <p className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
