import { X, ExternalLink, MapPin, Phone, Mail, Calendar, Users, ClipboardList, Info } from 'lucide-react';
import { formatPhase, statusColor } from '../utils/api';
import EligibilitySimplifier from './EligibilitySimplifier';

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
  const outcomes = p?.outcomesModule;

  const nctId = id?.nctId;
  const title = id?.officialTitle || id?.briefTitle;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(status?.overallStatus)}`}>
                {status?.overallStatus?.replace(/_/g, ' ')}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {formatPhase(design?.phases?.[0])}
              </span>
              <span className="text-xs text-gray-400 font-mono">{nctId}</span>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Summary */}
          {desc?.briefSummary && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Summary</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{desc.briefSummary}</p>
            </section>
          )}

          {/* Eligibility */}
          {eligibility && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <ClipboardList className="w-3 h-3" /> Eligibility
              </h4>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {eligibility.minimumAge && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Min Age</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{eligibility.minimumAge}</p>
                  </div>
                )}
                {eligibility.maximumAge && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Max Age</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{eligibility.maximumAge}</p>
                  </div>
                )}
                {eligibility.sex && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Sex</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">{eligibility.sex}</p>
                  </div>
                )}
              </div>
              {eligibility.eligibilityCriteria && (
                <>
                  <EligibilitySimplifier eligibilityCriteria={eligibility.eligibilityCriteria} />
                  <details className="mt-2">
                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Full eligibility criteria</summary>
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed mt-1">
                      {eligibility.eligibilityCriteria}
                    </div>
                  </details>
                </>
              )}
            </section>
          )}

          {/* Interventions */}
          {interventions.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Interventions</h4>
              <div className="space-y-2">
                {interventions.map((inv, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="shrink-0 text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded font-medium">
                      {inv.type}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{inv.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Locations */}
          {contacts?.locations?.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Locations ({contacts.locations.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {contacts.locations.map((loc, i) => (
                  <div key={i} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                    <p className="font-medium">{loc.facility}</p>
                    <p className="text-xs text-gray-400">{[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}</p>
                    {loc.status && <span className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded ${statusColor(loc.status)}`}>{loc.status}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contacts */}
          {contacts?.centralContacts?.length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact</h4>
              {contacts.centralContacts.map((c, i) => (
                <div key={i} className="flex flex-wrap gap-3 text-sm">
                  {c.name && <span className="text-gray-700 dark:text-gray-300 font-medium">{c.name}</span>}
                  {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-teal-600 hover:underline"><Phone className="w-3 h-3" />{c.phone}</a>}
                  {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-teal-600 hover:underline"><Mail className="w-3 h-3" />{c.email}</a>}
                </div>
              ))}
            </section>
          )}

          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-1 text-xs text-gray-400 mb-3">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              This information comes directly from ClinicalTrials.gov. Always verify with your healthcare provider before enrolling in any trial.
            </div>
            <a
              href={`https://clinicaltrials.gov/study/${nctId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              View Full Details on ClinicalTrials.gov <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
