import { useState } from 'react';
import { Search, Loader, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Condition / Disease</label>
            <div className="relative">
              <input
                type="text"
                value={condition}
                onChange={e => setCondition(e.target.value)}
                placeholder="e.g., Breast Cancer, Leukemia…"
                list="conditions-list"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <datalist id="conditions-list">
                {CONDITIONS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Keywords (optional)</label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="e.g., immunotherapy, pediatric…"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
        >
          <SlidersHorizontal className="w-3 h-3" />
          {showAdvanced ? 'Hide' : 'Show'} advanced filters
          {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phase</label>
              <select
                value={phase}
                onChange={e => setPhase(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Patient Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="Age in years"
                min={0}
                max={120}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!condition && !keywords)}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Find Clinical Trials
        </button>
      </form>

      {/* Quick examples */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-gray-400">Try:</span>
        {['Pediatric Leukemia', 'Triple Negative Breast Cancer', 'Glioblastoma', 'CAR-T therapy'].map(ex => (
          <button
            key={ex}
            onClick={() => { setCondition(ex); onSearch({ condition: ex, status: 'RECRUITING' }); }}
            className="text-xs px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded hover:bg-teal-100 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
