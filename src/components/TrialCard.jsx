import { MapPin, Calendar, Users, ChevronRight, Phone, Mail, ExternalLink, Bookmark } from 'lucide-react';
import { formatPhase, parseAge } from '../utils/api';

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
      {status?.replace(/_/g, ' ') || 'Unknown'}
    </span>
  );
}

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
  const conditions = p?.conditionsModule?.conditions?.slice(0, 2).join(', ');
  const summary = desc?.briefSummary?.slice(0, 180) + (desc?.briefSummary?.length > 180 ? '…' : '');
  const minAge = eligibility?.minimumAge;
  const maxAge = eligibility?.maximumAge;
  const enrollment = design?.enrollmentInfo?.count;
  const startDate = status?.startDateStruct?.date;
  const sponsorName = sponsor?.leadSponsor?.name;

  const locations = contacts?.locations?.slice(0, 2).map(l =>
    [l.city, l.state, l.country].filter(Boolean).join(', ')
  ) || [];

  const contact = contacts?.centralContacts?.[0];

  return (
    <div className="group border border-white/10 rounded-2xl p-5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <StatusPill status={overallStatus} />
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-neutral-400">
              {phase}
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug">{title}</h3>
        </div>
        <button
          onClick={() => onSave(nctId)}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${saved ? 'text-white bg-white/10' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}
          title={saved ? 'Remove from saved' : 'Save trial'}
        >
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {conditions && (
        <p className="text-xs text-neutral-400 font-medium mb-2">{conditions}</p>
      )}
      {summary && (
        <p className="text-xs text-neutral-600 mb-4 leading-relaxed">{summary}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        {(minAge || maxAge) && (
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <Users className="w-3 h-3" />
            {minAge || '0'} – {maxAge || 'any age'}
          </div>
        )}
        {enrollment && (
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <Users className="w-3 h-3" />
            ~{enrollment.toLocaleString()} participants
          </div>
        )}
        {startDate && (
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <Calendar className="w-3 h-3" />
            {startDate}
          </div>
        )}
        {sponsorName && (
          <div className="text-xs text-neutral-600 truncate max-w-[200px]">{sponsorName}</div>
        )}
      </div>

      {locations.length > 0 && (
        <div className="mb-3 space-y-1">
          {locations.map((loc, i) => (
            <div key={i} className="flex items-center gap-1 text-xs text-neutral-600">
              <MapPin className="w-3 h-3 shrink-0" /> {loc}
            </div>
          ))}
        </div>
      )}

      {contact && (
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-neutral-600">
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> {contact.phone}
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail className="w-3 h-3" /> {contact.email}
            </a>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] text-neutral-700 font-mono">{nctId}</span>
        <div className="flex gap-3">
          <a
            href={`https://clinicaltrials.gov/study/${nctId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            ClinicalTrials.gov <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => onSelect(trial)}
            className="text-xs text-white flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
