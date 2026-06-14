import { useState } from 'react';
import { Loader, AlertTriangle, Bookmark, Clipboard, Mail, ChevronRight, ArrowLeft, Activity } from 'lucide-react';
import SearchForm from './components/SearchForm';
import TrialCard from './components/TrialCard';
import TrialDetail from './components/TrialDetail';
import Analytics from './components/Analytics';
import { searchTrials } from './utils/api';
import SmokeBackground from './components/SmokeBackground';
import LandingPage from './components/LandingPage';
import AICopilot from './components/AICopilot';
import PatientHub from './components/PatientHub';

export default function App() {
  const [view, setView] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [savedTrials, setSavedTrials] = useState(new Set());
  const [nextPageToken, setNextPageToken] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [tab, setTab] = useState('results');

  async function handleSearch(params) {
    setLoading(true);
    setError(null);
    setResults(null);
    setNextPageToken(null);
    setLastParams(params);
    setTab('results');
    try {
      const data = await searchTrials({ ...params, pageSize: 20 });
      setResults(data.studies || []);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!nextPageToken || !lastParams) return;
    setLoading(true);
    try {
      const data = await searchTrials({ ...lastParams, pageSize: 20, pageToken: nextPageToken });
      setResults(prev => [...(prev || []), ...(data.studies || [])]);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleSave(nctId) {
    setSavedTrials(prev => {
      const next = new Set(prev);
      if (next.has(nctId)) next.delete(nctId);
      else next.add(nctId);
      return next;
    });
  }

  const savedList = results?.filter(t => savedTrials.has(t.protocolSection?.identificationModule?.nctId)) || [];

  function savedToText() {
    return savedList.map(t => {
      const id = t.protocolSection;
      const nct = id?.identificationModule?.nctId;
      const title = id?.identificationModule?.briefTitle;
      const status = id?.statusModule?.overallStatus;
      const phase = id?.designModule?.phases?.join(', ') || 'N/A';
      const cond = id?.conditionsModule?.conditions?.join(', ') || '';
      return `${title}\nNCT: ${nct} | Status: ${status} | Phase: ${phase}\nCondition: ${cond}\nhttps://clinicaltrials.gov/study/${nct}`;
    }).join('\n\n---\n\n');
  }

  const [copied, setCopied] = useState(false);
  function copyToClipboard() {
    navigator.clipboard.writeText(savedToText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function emailSaved() {
    const subject = encodeURIComponent(`Saved Clinical Trials (${savedList.length})`);
    const body = encodeURIComponent('Here are the clinical trials I saved:\n\n' + savedToText());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  const displayList = tab === 'saved' ? savedList : (results || []);

  if (view === 'landing') {
    return <LandingPage
      onLaunchApp={() => setView('app')}
      onLaunchCopilot={() => setView('copilot')}
      onLaunchHub={() => setView('hub')}
    />;
  }
  if (view === 'copilot') return <AICopilot onBack={() => setView('landing')} />;
  if (view === 'hub') return <PatientHub onBack={() => setView('landing')} />;

  return (
    <div className="min-h-screen text-white relative" style={{ background: '#030308' }}>
      {/* Dark grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {/* Ambient orb */}
      <div className="fixed top-0 left-0 pointer-events-none" style={{
        width: '70vw', height: '70vw', maxWidth: 900,
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        filter: 'blur(100px)', borderRadius: '50%',
      }} />
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 z-20" style={{ background: 'rgba(3,3,8,0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white text-sm leading-none">MedOS <span className="text-violet-400">AI</span> — Trial Matcher</h1>
              <p className="text-[10px] text-neutral-600 mt-0.5">Powered by ClinicalTrials.gov</p>
            </div>
          </div>
          {savedTrials.size > 0 && (
            <button
              onClick={() => setTab(tab === 'saved' ? 'results' : 'saved')}
              className="text-xs flex items-center gap-1.5 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all"
            >
              <Bookmark className="w-3 h-3" fill="currentColor" /> {savedTrials.size} saved
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3 pb-2">
          <p className="text-[11px] font-medium text-neutral-600 uppercase tracking-[0.2em]">Clinical Trial Discovery</p>
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Find trials that<br />match your needs
          </h2>
          <p className="text-neutral-600 max-w-md mx-auto text-sm leading-relaxed">
            A smarter way to navigate ClinicalTrials.gov — built for patients and families.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Disclaimer */}
        <div className="border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-neutral-700">
          Always consult your oncologist or healthcare provider before contacting or enrolling in any clinical trial.
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 border border-red-500/20 rounded-xl text-sm text-red-400 bg-red-500/5">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Loading */}
        {loading && !results && (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-5 h-5 animate-spin text-neutral-600" />
          </div>
        )}

        {/* Results */}
        {results !== null && (
          <div className="space-y-8">
            {/* Analytics */}
            {results.length > 0 && tab === 'results' && <Analytics trials={results} />}

            {/* Tab bar + count */}
            {results.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  {tab === 'saved'
                    ? `${savedList.length} saved trial${savedList.length !== 1 ? 's' : ''}`
                    : `${results.length}+ trials found`}
                </p>
                <div className="flex gap-1 p-1 border border-white/10 rounded-xl bg-white/[0.02]">
                  {[{ key: 'results', label: 'All Results' }, { key: 'saved', label: `Saved (${savedTrials.size})` }].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${tab === t.key ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved actions */}
            {tab === 'saved' && savedList.length > 0 && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 border border-white/10 text-neutral-400 rounded-lg hover:border-white/30 hover:text-white transition-all">
                  <Clipboard className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy all'}
                </button>
                <button onClick={emailSaved}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 border border-white/10 text-neutral-400 rounded-lg hover:border-white/30 hover:text-white transition-all">
                  <Mail className="w-3 h-3" /> Email to Doctor
                </button>
              </div>
            )}

            {/* Empty states */}
            {results.length === 0 && (
              <p className="text-center text-neutral-600 py-16">No trials found. Try different keywords or broaden your filters.</p>
            )}
            {tab === 'saved' && savedList.length === 0 && (
              <p className="text-center text-neutral-600 py-16">No saved trials yet. Bookmark trials using the icon on each card.</p>
            )}

            {/* Trial list */}
            <div className="space-y-3">
              {displayList.map(trial => (
                <TrialCard
                  key={trial.protocolSection?.identificationModule?.nctId}
                  trial={trial}
                  onSelect={setSelectedTrial}
                  onSave={toggleSave}
                  saved={savedTrials.has(trial.protocolSection?.identificationModule?.nctId)}
                />
              ))}
            </div>

            {/* Load more */}
            {tab === 'results' && nextPageToken && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 border border-white/10 hover:border-white/30 disabled:opacity-30 text-neutral-400 hover:text-white rounded-xl text-sm font-medium flex items-center gap-2 mx-auto transition-all"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                  Load More Trials
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pre-search feature cards */}
        {results === null && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[
              { title: 'Smart Search', desc: 'Filter by condition, phase, age, and recruitment status' },
              { title: 'Analytics', desc: 'Instant breakdown of phases, conditions, and enrollment across results' },
              { title: 'Save & Share', desc: 'Bookmark trials and email a summary directly to your doctor' },
            ].map((f, i) => (
              <div key={f.title} className="border border-white/[0.06] rounded-2xl p-5 bg-white/[0.02]">
                <div className="w-6 h-6 border border-white/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-[10px] text-neutral-600 font-mono">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedTrial && <TrialDetail trial={selectedTrial} onClose={() => setSelectedTrial(null)} />}
      </div>
    </div>
  );
}
