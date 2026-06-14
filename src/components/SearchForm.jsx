import { useState } from 'react';
import { Search, Loader, SlidersHorizontal } from 'lucide-react';

const CONDITIONS = [
  'Breast Cancer', 'Lung Cancer', 'Leukemia', 'Lymphoma', 'Brain Tumor',
  'Colorectal Cancer', 'Ovarian Cancer', 'Melanoma', "Alzheimer's Disease",
  "Parkinson's Disease", 'Diabetes', 'Heart Failure', 'COVID-19',
];

const PHASES = [
  { value: '', label: 'Any Phase' },
  { value: 'PHASE1', label: 'Phase 1' },
  { value: 'PHASE2', label: 'Phase 2' },
  { value: 'PHASE3', label: 'Phase 3' },
  { value: 'PHASE4', label: 'Phase 4' },
];

const STATUSES = [
  { value: 'RECRUITING', label: 'Recruiting' },
  { value: 'NOT_YET_RECRUITING', label: 'Not Yet Recruiting' },
  { value: 'ACTIVE_NOT_RECRUITING', label: 'Active, Not Recruiting' },
  { value: 'COMPLETED', label: 'Completed' },
];

const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30 transition-colors';
const selectCls = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none';

export default function SearchForm({ onSearch, loading }) {
  const [condition, setCondition] = useState('');
  const [keywords, setKeywords] = useState('');
  const [phase, setPhase] = useState('');
  const [status, setStatus] = useState('RECRUITING');
  const [age, setAge] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ condition, query: keywords, phase, status, age });
  }

  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Condition / Disease</label>
            <input
              type="text"
              value={condition}
              onChange={e => setCondition(e.target.value)}
              placeholder="e.g., Breast Cancer, Leukemia…"
              list="conditions-list"
              className={inputCls}
            />
            <datalist id="conditions-list">
              {CONDITIONS.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="e.g., immunotherapy, pediatric…"
              className={inputCls}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          {showAdvanced ? 'Hide' : 'Advanced'} filters
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Phase</label>
              <select value={phase} onChange={e => setPhase(e.target.value)} className={selectCls}>
                {PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Patient Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="Age in years"
                min={0} max={120}
                className={inputCls}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!condition && !keywords)}
          className="w-full py-3.5 bg-white hover:bg-neutral-200 disabled:opacity-30 text-black rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Find Clinical Trials
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <span className="text-[11px] text-neutral-600 uppercase tracking-widest">Try:</span>
        {['Pediatric Leukemia', 'Triple Negative Breast Cancer', 'Glioblastoma', 'CAR-T therapy'].map(ex => (
          <button
            key={ex}
            onClick={() => { setCondition(ex); onSearch({ condition: ex, status: 'RECRUITING' }); }}
            className="text-xs px-3 py-1 border border-white/10 text-neutral-400 rounded-lg hover:border-white/30 hover:text-white transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
