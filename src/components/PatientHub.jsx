import { useState } from 'react';
import {
  Users, ArrowLeft, Calendar, FileText, MessageSquare,
  Bell, Search, Plus, ChevronRight, Activity, Clock,
  CheckCircle, AlertCircle, Phone, Mail, X, User
} from 'lucide-react';
import { useTheme, dark, light } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const MOCK_PATIENTS = [
  { id: 'P001', name: 'Siti Aminah binti Yusof', age: 52, ic: '720314-14-5821', phone: '+60 12-345 6789', dept: 'Cardiology', gp: 'Dr. Lim Wei Ming', nextAppt: '15 Jun 2026 2:30 PM', status: 'Active', conditions: ['Hypertension', 'T2DM'], lang: 'BM', followUp: 'Overdue', avatar: 'SA' },
  { id: 'P002', name: 'Lee Chong Wei', age: 41, ic: '850223-10-6614', phone: '+60 11-987 6543', dept: 'Oncology', gp: 'Dr. Ahmad Faris', nextAppt: '17 Jun 2026 10:00 AM', status: 'In Treatment', conditions: ['Breast Cancer (remission)'], lang: 'EN', followUp: 'Scheduled', avatar: 'LC' },
  { id: 'P003', name: 'Rajendran s/o Muthu', age: 67, ic: '580901-07-3345', phone: '+60 16-234 5678', dept: 'Nephrology', gp: 'Dr. Sarah Tan', nextAppt: '20 Jun 2026 9:00 AM', status: 'Chronic', conditions: ['CKD Stage 3', 'HTN', 'DM'], lang: 'EN', followUp: 'Scheduled', avatar: 'RM' },
  { id: 'P004', name: 'Priya d/o Ramasamy', age: 29, ic: '950712-05-8821', phone: '+60 19-876 5432', dept: 'Endocrinology', gp: 'Dr. Chan Mei Ling', nextAppt: '19 Jun 2026 11:30 AM', status: 'New', conditions: ['Hyperthyroidism'], lang: 'EN', followUp: 'N/A', avatar: 'PR' },
  { id: 'P005', name: 'Ahmad Faizal bin Zainudin', age: 48, ic: '760618-03-7712', phone: '+60 13-456 7890', dept: 'Cardiology', gp: 'Dr. Lim Wei Ming', nextAppt: '22 Jun 2026 3:00 PM', status: 'Post-Op', conditions: ['CABG', 'IHD'], lang: 'BM', followUp: 'Scheduled', avatar: 'AF' },
];

const APPOINTMENTS = [
  { time: '9:00 AM', patient: 'Rajendran s/o Muthu', dept: 'Nephrology', type: 'Follow-up', status: 'confirmed' },
  { time: '10:00 AM', patient: 'Lee Chong Wei', dept: 'Oncology', type: 'Review', status: 'confirmed' },
  { time: '11:30 AM', patient: 'Priya d/o Ramasamy', dept: 'Endocrinology', type: 'New Patient', status: 'confirmed' },
  { time: '1:00 PM', patient: '—', dept: '—', type: 'Lunch Break', status: 'break' },
  { time: '2:30 PM', patient: 'Siti Aminah binti Yusof', dept: 'Cardiology', type: 'Review', status: 'overdue' },
  { time: '3:00 PM', patient: 'Ahmad Faizal bin Zainudin', dept: 'Cardiology', type: 'Post-Op Check', status: 'confirmed' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'alert', text: 'Siti Aminah missed her 2:30 PM appointment — follow-up required', time: '14 min ago', read: false },
  { id: 2, type: 'info', text: 'Lab results ready for Rajendran s/o Muthu (Creatinine, eGFR)', time: '1 hr ago', read: false },
  { id: 3, type: 'success', text: 'Ahmad Faizal post-op review confirmed for 22 Jun 2026', time: '2 hrs ago', read: true },
  { id: 4, type: 'info', text: 'Priya Ramasamy: Thyroid function test due before next visit', time: '3 hrs ago', read: true },
];

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

function Avatar({ initials, color = 'from-violet-600 to-purple-700' }) {
  return (
    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    Active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    'In Treatment': 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    Chronic: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    New: 'text-violet-400 bg-violet-500/10 border-violet-500/25',
    'Post-Op': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[s] || 'text-neutral-400 bg-white/5 border-white/10'}`}>{s}</span>;
}

export default function PatientHub({ onBack }) {
  const { isDark } = useTheme();
  const T = isDark ? dark : light;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [newApptForm, setNewApptForm] = useState({ name: '', dept: 'Cardiology', date: '', time: '', type: 'Follow-up', notes: '' });
  const [apptSubmitted, setApptSubmitted] = useState(false);

  const filtered = MOCK_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.dept.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  }

  function submitAppt(e) {
    e.preventDefault();
    setApptSubmitted(true);
    setTimeout(() => { setShowNewAppt(false); setApptSubmitted(false); setNewApptForm({ name: '', dept: 'Cardiology', date: '', time: '', type: 'Follow-up', notes: '' }); }, 2000);
  }

  const avatarColors = ['from-violet-600 to-purple-700', 'from-blue-600 to-cyan-700', 'from-emerald-600 to-teal-700', 'from-rose-600 to-pink-700', 'from-amber-600 to-orange-700'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bg, color: isDark ? '#fff' : '#0f0f1a' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      <div className="fixed bottom-0 left-0 pointer-events-none" style={{
        width: '60vw', height: '60vw', maxWidth: 800,
        background: `radial-gradient(circle, ${isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)'} 0%, transparent 70%)`,
        filter: 'blur(80px)', borderRadius: '50%',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06]" style={{ background: T.navBg, backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-neutral-500 hover:text-white transition-colors mr-1">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm leading-none">Patient <span style={{ color: '#34d399' }}>Hub</span></h1>
              <p className="text-[10px] text-neutral-600 mt-0.5">Patient Engagement Platform · Beta</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={markAllRead} className="relative text-neutral-500 hover:text-white transition-colors p-2">
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
            <button onClick={() => setShowNewAppt(true)}
              className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <Plus className="w-3.5 h-3.5" /> New Appointment
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-6 pb-0 flex gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-all border-b-2"
              style={activeTab === t.id
                ? { color: '#34d399', borderColor: '#10b981' }
                : { color: '#6b7280', borderColor: 'transparent' }}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.id === 'messages' && unread > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: '#ef4444', color: '#fff' }}>{unread}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full relative z-10">

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Good morning, Doctor</h2>
              <p className="text-neutral-500 text-sm">Tuesday, 17 June 2026 · {APPOINTMENTS.filter(a => a.status !== 'break').length} appointments today</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Today's Appointments", value: '6', sub: '1 overdue', color: '#34d399', icon: Calendar },
                { label: 'Active Patients', value: '5', sub: 'under care', color: '#60a5fa', icon: Users },
                { label: 'Follow-ups Due', value: '2', sub: 'this week', color: '#f59e0b', icon: Clock },
                { label: 'Messages Unread', value: String(unread), sub: 'notifications', color: '#f87171', icon: Bell },
              ].map(k => (
                <div key={k.label} className="rounded-2xl p-4" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-neutral-500">{k.label}</p>
                    <k.icon className="w-3.5 h-3.5 text-neutral-700" />
                  </div>
                  <p className="text-3xl font-black" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-[11px] text-neutral-600 mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Today's schedule */}
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
                <div className="px-5 py-4 border-b border-white/[0.06]">
                  <p className="text-sm font-bold text-white">Today's Schedule</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {APPOINTMENTS.map((a, i) => (
                    <div key={i} className="px-5 py-3 flex items-center gap-4">
                      <span className="text-xs text-neutral-600 font-mono w-16 shrink-0">{a.time}</span>
                      {a.status === 'break' ? (
                        <span className="text-xs text-neutral-700 italic">Lunch Break</span>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{a.patient}</p>
                            <p className="text-[11px] text-neutral-600">{a.dept} · {a.type}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            a.status === 'overdue' ? 'text-red-400 bg-red-500/10 border-red-500/25' :
                            'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                          }`}>{a.status === 'overdue' ? 'Overdue' : 'Confirmed'}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Notifications</p>
                  <button onClick={markAllRead} className="text-[11px] text-neutral-600 hover:text-white transition-colors">Mark all read</button>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-5 py-3 flex items-start gap-3 ${n.read ? 'opacity-50' : ''}`}>
                      <div className="mt-0.5">
                        {n.type === 'alert' ? <AlertCircle className="w-3.5 h-3.5 text-red-400" /> :
                         n.type === 'success' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> :
                         <Bell className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-300 leading-relaxed">{n.text}</p>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PATIENTS ── */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search patients by name, ID, or department…"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  style={{ background: T.inputBg, border: `1px solid ${T.border}` }}
                />
              </div>
              <p className="text-xs text-neutral-600 whitespace-nowrap">{filtered.length} patients</p>
            </div>
            <div className="space-y-3">
              {filtered.map((p, i) => (
                <div key={p.id} onClick={() => setSelectedPatient(p)}
                  className="rounded-2xl p-5 cursor-pointer transition-all hover:border-white/15 group"
                  style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
                  <div className="flex items-start gap-4">
                    <Avatar initials={p.avatar} color={avatarColors[i % avatarColors.length]} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-white text-sm">{p.name}</span>
                        <StatusBadge s={p.status} />
                        {p.followUp === 'Overdue' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-red-400 bg-red-500/10 border-red-500/25">Follow-up Overdue</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">{p.id} · Age {p.age} · {p.dept} · {p.lang}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.conditions.map(c => (
                          <span key={c} className="text-[10px] px-2 py-0.5 rounded-full text-neutral-400" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-neutral-600 mb-1">Next appt</p>
                      <p className="text-xs text-neutral-300">{p.nextAppt}</p>
                      <ChevronRight className="w-4 h-4 text-neutral-700 mt-2 ml-auto group-hover:text-neutral-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Schedule</h2>
                <p className="text-neutral-500 text-sm mt-0.5">Tuesday, 17 June 2026</p>
              </div>
              <button onClick={() => setShowNewAppt(true)}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl"
                style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                <Plus className="w-4 h-4" /> Book Appointment
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.cardBg }}>
              {APPOINTMENTS.map((a, i) => (
                <div key={i} className="flex items-center gap-5 px-6 py-4 border-b border-white/[0.04] last:border-0">
                  <div className="w-20 shrink-0">
                    <p className="text-sm font-bold text-white">{a.time}</p>
                  </div>
                  <div className="w-1 h-8 rounded-full shrink-0" style={{
                    background: a.status === 'break' ? 'rgba(255,255,255,0.05)' :
                      a.status === 'overdue' ? '#ef4444' : '#10b981',
                  }} />
                  {a.status === 'break' ? (
                    <span className="text-sm text-neutral-700 italic">Lunch Break</span>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{a.patient}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{a.dept} · {a.type}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                        a.status === 'overdue' ? 'text-red-400 bg-red-500/10 border-red-500/25' :
                        'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                      }`}>{a.status === 'overdue' ? '⚠ Missed' : '✓ Confirmed'}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white">Notifications & Alerts</h2>
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className={`rounded-2xl p-5 flex items-start gap-4 transition-all ${n.read ? 'opacity-60' : ''}`}
                  style={{ border: `1px solid ${n.type === 'alert' ? 'rgba(239,68,68,0.2)' : n.type === 'success' ? 'rgba(16,185,129,0.2)' : T.border}`, background: T.cardBg }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: n.type === 'alert' ? 'rgba(239,68,68,0.15)' : n.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                  }}>
                    {n.type === 'alert' ? <AlertCircle className="w-4 h-4 text-red-400" /> :
                     n.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                     <Bell className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-200 leading-relaxed">{n.text}</p>
                    <p className="text-xs text-neutral-600 mt-1">{n.time}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      className="text-[11px] text-neutral-600 hover:text-white transition-colors whitespace-nowrap">
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Patient Detail Modal ── */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: T.modalBg, border: `1px solid ${T.border}` }}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar initials={selectedPatient.avatar} color={avatarColors[MOCK_PATIENTS.indexOf(selectedPatient) % avatarColors.length]} />
                <div>
                  <h3 className="font-bold text-white">{selectedPatient.name}</h3>
                  <p className="text-xs text-neutral-500">{selectedPatient.id} · Age {selectedPatient.age}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-neutral-600 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Department', value: selectedPatient.dept },
                { label: 'Attending Physician', value: selectedPatient.gp },
                { label: 'Next Appointment', value: selectedPatient.nextAppt },
                { label: 'Language Preference', value: selectedPatient.lang === 'BM' ? 'Bahasa Malaysia' : 'English' },
                { label: 'Follow-up Status', value: selectedPatient.followUp },
                { label: 'IC Number', value: selectedPatient.ic },
                { label: 'Phone', value: selectedPatient.phone },
              ].map(f => (
                <div key={f.label} className="flex justify-between py-2 border-b border-white/[0.05]">
                  <span className="text-xs text-neutral-500">{f.label}</span>
                  <span className={`text-xs font-medium ${f.label === 'Follow-up Status' && f.value === 'Overdue' ? 'text-red-400' : 'text-white'}`}>{f.value}</span>
                </div>
              ))}
              <div>
                <p className="text-xs text-neutral-500 mb-2">Active Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.conditions.map(c => (
                    <span key={c} className="text-xs px-3 py-1 rounded-full text-neutral-300" style={{ background: T.codeBlock, border: `1px solid ${T.border}` }}>{c}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={`tel:${selectedPatient.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <button onClick={() => setShowNewAppt(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}>
                  <Calendar className="w-3.5 h-3.5" /> Book Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New Appointment Modal ── */}
      {showNewAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md rounded-3xl p-6" style={{ background: T.modalBg, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg">Book Appointment</h3>
              <button onClick={() => setShowNewAppt(false)} className="text-neutral-600 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {apptSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-bold">Appointment Booked!</p>
                <p className="text-neutral-500 text-sm mt-1">Patient will receive a confirmation.</p>
              </div>
            ) : (
              <form onSubmit={submitAppt} className="space-y-4">
                {[
                  { label: 'Patient Name', key: 'name', type: 'text', placeholder: 'Full name' },
                  { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                  { label: 'Time', key: 'time', type: 'time', placeholder: '' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">{f.label}</label>
                    <input type={f.type} required value={newApptForm[f.key]} placeholder={f.placeholder}
                      onChange={e => setNewApptForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-neutral-700 focus:outline-none"
                      style={{ background: T.inputBg, border: `1px solid ${T.border}` }} />
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Department</label>
                  <select value={newApptForm.dept} onChange={e => setNewApptForm(p => ({ ...p, dept: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none appearance-none"
                    style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
                    {['Cardiology', 'Oncology', 'Nephrology', 'Endocrinology', 'General Medicine', 'Surgery'].map(d => (
                      <option key={d} value={d} style={{ background: T.modalBg }}>{d}</option>
                    ))}
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', boxShadow: '0 8px 30px rgba(16,185,129,0.3)' }}>
                  Confirm Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
