import { MapPin, Calendar, Users, ChevronRight, Phone, Mail, ExternalLink, Heart } from 'lucide-react';
import { formatPhase, statusColor, parseAge } from '../utils/api';

export default function TrialCard({ trial, onSelect, onSave, saved }) {
  const p = trial.protocolSection;
  const id = p?.identificationModule;
  const status = p?.statusModule;
  const design = p?.designModule;
  const desc = p?.descriptionModule;
  const eligibility = p?.eligibilityModule;
  const contacts = p?.contactsLocationsModule;
  const sponsor = p?.sponsorCollaboratorsModule;

  const nctId = id?.nctId;
  const title = id?.briefTitle || 'Untitled Trial';
  const phase = formatPhase(design?.phases?.[0]);
  const overallStatus = status?.overallStatus;
  const conditions = p?.conditionsModule?.conditions?.join(', ');
  const summary = desc?.briefSummary?.slice(0, 200) + (desc?.briefSummary?.length > 200 ? '…' : '');
  const minAge = eligibility?.minimumAge;
  const maxAge = eligibility?.maximumAge;
  const enrollment = design?.enrollmentInfo?.count;
  const startDate = status?.startDateStruct?.date;
  const sponsor_name = sponsor?.leadSponsor?.name;

  const locations = contacts?.locations?.slice(0, 3).map(l =>
    [l.city, l.state, l.country].filter(Boolean).join(', ')
  ) || [];

  const centralContacts = contacts?.centralContacts?.slice(0, 1) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(overallStatus)}`}>
              {overallStatus?.replace(/_/g, ' ') || 'Unknown'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">
              {phase}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onSave(nctId)}
            className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
            title={saved ? 'Remove from saved' : 'Save trial'}
          >
            <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {conditions && (
        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-2">{conditions}</p>
      )}
      {summary && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{summary}</p>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3">
        {(minAge || maxAge) && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3 shrink-0" />
            <span>{minAge || '0'} – {maxAge || 'No limit'}</span>
          </div>
        )}
        {enrollment && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3 shrink-0" />
            <span>~{enrollment} participants</span>
          </div>
        )}
        {startDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Started {startDate}</span>
          </div>
        )}
        {sponsor_name && (
          <div className="flex items-center gap-1 text-xs text-gray-500 col-span-2 truncate">
            <span className="truncate">{sponsor_name}</span>
          </div>
        )}
      </div>

      {locations.length > 0 && (
        <div className="mb-3">
          {locations.map((loc, i) => (
            <div key={i} className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
              {loc}
            </div>
          ))}
        </div>
      )}

      {centralContacts.length > 0 && (
        <div className="mb-3 space-y-1">
          {centralContacts.map((c, i) => (
            <div key={i} className="flex flex-wrap gap-3 text-xs text-gray-500">
              {c.phone && (
                <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-teal-500">
                  <Phone className="w-3 h-3" /> {c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-teal-500">
                  <Mail className="w-3 h-3" /> {c.email}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{nctId}</span>
        <div className="flex gap-2">
          <a
            href={`https://clinicaltrials.gov/study/${nctId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            View on ClinicalTrials.gov <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => onSelect(trial)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
