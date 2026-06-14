import { formatPhase } from '../utils/api';

function StatCard({ label, value, sub }) {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/[0.03]">
      <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Bar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-400 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-neutral-500 w-8 text-right">{count}</span>
    </div>
  );
}

export default function Analytics({ trials }) {
  if (!trials || trials.length === 0) return null;

  // Phase distribution
  const phases = {};
  // Status distribution
  const statuses = {};
  // Enrollment
  let totalEnrollment = 0;
  let enrollmentCount = 0;
  // Top conditions
  const conditions = {};

  for (const trial of trials) {
    const p = trial.protocolSection;
    const phase = formatPhase(p?.designModule?.phases?.[0]);
    phases[phase] = (phases[phase] || 0) + 1;

    const status = p?.statusModule?.overallStatus?.replace(/_/g, ' ') || 'Unknown';
    statuses[status] = (statuses[status] || 0) + 1;

    const enroll = p?.designModule?.enrollmentInfo?.count;
    if (enroll) { totalEnrollment += enroll; enrollmentCount++; }

    (p?.conditionsModule?.conditions || []).forEach(c => {
      conditions[c] = (conditions[c] || 0) + 1;
    });
  }

  const recruiting = statuses['RECRUITING'] || 0;
  const avgEnrollment = enrollmentCount ? Math.round(totalEnrollment / enrollmentCount) : null;

  const topPhases = Object.entries(phases).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topConditions = Object.entries(conditions).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const phaseColors = ['#fff', '#ccc', '#aaa', '#888', '#666'];
  const condColors = ['#fff', '#d4d4d4', '#aaa', '#888', '#666'];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Search Analytics</h3>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Trials Found" value={trials.length + '+'} />
        <StatCard
          label="Recruiting"
          value={recruiting}
          sub={`${trials.length ? Math.round((recruiting / trials.length) * 100) : 0}% of results`}
        />
        {avgEnrollment && <StatCard label="Avg Enrollment" value={avgEnrollment.toLocaleString()} sub="participants per trial" />}
        <StatCard label="Phases" value={topPhases.length} sub="distinct phases" />
      </div>

      {/* Phase & Condition breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-white/10 rounded-xl p-4 bg-white/[0.03]">
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-3">By Phase</p>
          <div className="space-y-2.5">
            {topPhases.map(([phase, count], i) => (
              <Bar key={phase} label={phase} count={count} total={trials.length} color={phaseColors[i]} />
            ))}
          </div>
        </div>
        <div className="border border-white/10 rounded-xl p-4 bg-white/[0.03]">
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-3">Top Conditions</p>
          <div className="space-y-2.5">
            {topConditions.map(([cond, count], i) => (
              <Bar key={cond} label={cond} count={count} total={trials.length} color={condColors[i]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
