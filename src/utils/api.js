// ClinicalTrials.gov v2 API — no API key required
const BASE = 'https://clinicaltrials.gov/api/v2';

export async function searchTrials({ query, condition, age, phase, status = 'RECRUITING', pageSize = 20, pageToken }) {
  const params = new URLSearchParams();
  if (query) params.set('query.term', query);
  if (condition) params.set('query.cond', condition);
  params.set('filter.overallStatus', status);
  params.set('pageSize', pageSize);
  if (pageToken) params.set('pageToken', pageToken);
  const url = `${BASE}/studies?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ClinicalTrials.gov API error: ${res.status}`);
  return res.json();
}

export async function getTrialDetail(nctId) {
  const url = `${BASE}/studies/${nctId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch trial ${nctId}: ${res.status}`);
  return res.json();
}

// Parse age string like "18 Years" => number
export function parseAge(ageStr) {
  if (!ageStr) return null;
  const m = ageStr.match(/(\d+)\s*(year|month|week)/i);
  if (!m) return null;
  const n = parseInt(m[1]);
  const unit = m[2].toLowerCase();
  if (unit.startsWith('year')) return n;
  if (unit.startsWith('month')) return Math.round(n / 12);
  if (unit.startsWith('week')) return Math.round(n / 52);
  return n;
}

export function formatPhase(phase) {
  if (!phase) return 'N/A';
  return phase.replace('PHASE', 'Phase ').replace(/_/g, '/').replace('NA', 'N/A');
}

export function statusColor(status) {
  const map = {
    RECRUITING: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ACTIVE_NOT_RECRUITING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    COMPLETED: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    NOT_YET_RECRUITING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    TERMINATED: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}
