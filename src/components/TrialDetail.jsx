import { X, ExternalLink, MapPin, Phone, Mail, ClipboardList, Info } from 'lucide-react';
import { formatPhase } from '../utils/api';
import EligibilitySimplifier from './EligibilitySimplifier';

function StatusPill({ status }) {
  const map = {
    RECRUITING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ACTIVE_NOT_RECRUITING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    COMPLETED: 'bg-white/5 text-neutral-500 border-white/10',
    NOT_YET_RECRUITING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    TERMINATED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const cls = map[status] || 'bg-white/5 text-neutral-500 border-white/10';
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cls}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

export default function TrialDetail({ trial, onClose }) {
  const p = trial.protocolSection;
  const id = p?.identificationModule;
  const status = p?.statusModule;
  const design = p?.designModule;
  const desc = p?.descriptionModule;
  const eligibility = p?.eligibilityModule;
  const contacts = p?.contactsLocationsModule;
  const sponsor = p?.sponsorCollaboratorsModule;
  const interventions = p?.armsInterventionsModule?.interventions || [];

  const nctId = id?.nctId;
  const title = id?.officialTitle || id?.briefTitle;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#111] border-b border-white/10 p-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <StatusPill status={status?.overallStatus} />
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-neutral-400">
                {formatPhase(design?.phases?.[0])}
              </span>
              <span className="text-[10px] text-neutral-700 font-mono">{nctId}</span>
            </div>
            <h2 className="font-bold text-white text-sm leading-snug">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg shrink-0 transition-colors">
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {desc?.briefSummary && (
            <section>
              <h4 className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest mb-2">Summary</h4>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">{desc.briefSummary}</p>
            </section>
          )}

          {eligibility && (
            <section>
              <h4 className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                <ClipboardList className="w-3 h-3" /> Eligibility
              </h4>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {eligibility.minimumAge && (
                  <div className="border border-white/10 rounded-xl p-3 text-center bg-white/[0.03]">
                    <p className="text-[10px] text-neutral-600 mb-1">Min Age</p>
                    <p className="text-sm font-semibold text-white">{eligibility.minimumAge}</p>
                  </div>
                )}
                {eligibility.maximumAge && (
                  <div className="border border-white/10 rounded-xl p-3 text-center bg-white/[0.03]">
                    <p className="text-[10px] text-neutral-600 mb-1">Max Age</p>
                    <p className="text-sm font-semibold text-white">{eligibility.maximumAge}</p>
                  </div>
                )}
                {eligibility.sex && (
                  <div className="border border-white/10 rounded-xl p-3 text-center bg-white/[0.03]">
                    <p className="text-[10px] text-neutral-600 mb-1">Sex</p>
                    <p className="text-sm font-semibold text-white capitalize">{eligibility.sex.toLowerCase()}</p>
                  </div>
                )}
              </div>
              {eligibility.eligibilityCriteria && (
                <>
                  <EligibilitySimplifier eligibilityCriteria={eligibility.eligibilityCriteria} />
                  <details className="mt-2">
                    <summary className="text-xs text-neutral-600 cursor-pointer hover:text-neutral-400 transition-colors">Full eligibility criteria</summary>
                    <div className="text-xs text-neutral-500 border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed mt-2">
                      {eligibility.eligibilityCriteria}
                    </div>
                  </details>
                </>
              )}
            </section>
          )}

          {interventions.length > 0 && (
            <section>
              <h4 className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest mb-3">Interventions</h4>
              <div className="space-y-2">
                {interventions.map((inv, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-white/10 text-neutral-300 rounded font-medium">
                      {inv.type}
                    </span>
                    <span className="text-neutral-300">{inv.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {contacts?.locations?.length > 0 && (
            <section>
              <h4 className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Locations ({contacts.locations.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {contacts.locations.map((loc, i) => (
                  <div key={i} className="border border-white/10 rounded-xl p-3 bg-white/[0.03]">
                    <p className="text-sm font-medium text-white">{loc.facility}</p>
                    <p className="text-xs text-neutral-600">{[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {contacts?.centralContacts?.length > 0 && (
            <section>
              <h4 className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest mb-3">Contact</h4>
              {contacts.centralContacts.map((c, i) => (
                <div key={i} className="flex flex-wrap gap-3 text-sm">
                  {c.name && <span className="text-white font-medium">{c.name}</span>}
                  {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"><Phone className="w-3 h-3" />{c.phone}</a>}
                  {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"><Mail className="w-3 h-3" />{c.email}</a>}
                </div>
              ))}
            </section>
          )}

          <div className="pt-3 border-t border-white/10">
            <div className="flex items-start gap-1.5 text-xs text-neutral-700 mb-4">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              Information from ClinicalTrials.gov. Always verify with your healthcare provider before enrolling.
            </div>
            <a
              href={`https://clinicaltrials.gov/study/${nctId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-sm font-semibold transition-colors"
            >
              View Full Details on ClinicalTrials.gov <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
