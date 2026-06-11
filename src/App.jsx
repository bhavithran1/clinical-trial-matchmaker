import { useDarkMode } from './hooks/useDarkMode';
import DarkToggle from './components/DarkToggle';
import { useState } from 'react';
import { Heart, Loader, AlertTriangle, ChevronLeft, ChevronRight, Clipboard, Mail } from 'lucide-react';
import SearchForm from './components/SearchForm';
import TrialCard from './components/TrialCard';
import TrialDetail from './components/TrialDetail';
import TrialMap from './components/TrialMap';
import { searchTrials } from './utils/api';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [savedTrials, setSavedTrials] = useState(new Set());
  const [pageToken, setPageToken] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [tab, setTab] = useState('results');

  async function handleSearch(params) {
    setLoading(true);
    setError(null);
    setResults(null);
    setPageToken(null);
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
      const url = `https://clinicaltrials.gov/study/${nct}`;
      return `${title}\nNCT: ${nct} | Status: ${status} | Phase: ${phase}\nCondition: ${cond}\n${url}`;
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
    const text = savedToText();
    const subject = encodeURIComponent(`Saved Clinical Trials (${savedList.length})`);
    const body = encodeURIComponent('Here are the clinical trials I saved:\n\n' + text);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-none">Clinical Trial Matchmaker</h1>
              <p className="text-xs text-gray-400 mt-0.5">Powered by ClinicalTrials.gov</p>
            </div>
          </div>
          {savedTrials.size > 0 && (
            <button
              onClick={() => setTab(tab === 'saved' ? 'results' : 'saved')}
              className="text-xs flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
            >
              <Heart className="w-3 h-3 fill-current" /> {savedTrials.size} saved
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Find Clinical Trials</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
            A friendlier way to search ClinicalTrials.gov — designed for patients and families navigating oncology and other serious conditions.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} loading={loading} />

        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 rounded-xl p-3 text-xs text-teal-700 dark:text-teal-400">
          This tool searches the public ClinicalTrials.gov database. Always consult your oncologist or healthcare provider before contacting or enrolling in any clinical trial.
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {results !== null && (
          <div>
            {results.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {tab === 'saved' ? savedList.length + ' saved trials' : results.length + '+ trials found'}
                </h3>
                <div className="flex gap-2">
                  {['results', 'saved'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={"text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors " + (tab === t ? 'bg-teal-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700')}
                    >
                      {t === 'saved' ? `Saved (${savedTrials.size})` : 'All Results'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 && tab === 'results' && (
              <TrialMap trials={results} />
            )}

            {results.length === 0 && (
              <p className="text-center text-gray-400 py-8">No trials found. Try different keywords or broaden your filters.</p>
            )}

            {tab === 'saved' && savedList.length > 0 && (
              <div className="flex gap-2 mb-4">
                <button onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors">
                  <Clipboard className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button onClick={emailSaved}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors">
                  <Mail className="w-3 h-3" /> Email to Doctor
                </button>
              </div>
            )}

            <div className="space-y-4">
              {(tab === 'saved' ? savedList : results).map(trial => (
                <TrialCard
                  key={trial.protocolSection?.identificationModule?.nctId}
                  trial={trial}
                  onSelect={setSelectedTrial}
                  onSave={toggleSave}
                  saved={savedTrials.has(trial.protocolSection?.identificationModule?.nctId)}
                />
              ))}
            </div>

            {tab === 'results' && nextPageToken && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                  Load More Trials
                </button>
              </div>
            )}
          </div>
        )}

        {results === null && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: '🔍', title: 'Smart Search', desc: 'Filter by condition, phase, age, and recruitment status' },
              { icon: '📍', title: 'Location Aware', desc: 'See trial sites near you with contact information' },
              { icon: '💾', title: 'Save Trials', desc: 'Bookmark interesting trials to discuss with your doctor' },
            ].map(f => (
              <div key={f.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedTrial && <TrialDetail trial={selectedTrial} onClose={() => setSelectedTrial(null)} />}
    </div>
  );
}
