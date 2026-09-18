import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logoutUser, updateUserData, db } from '../lib/firebase'
import {
  collection, addDoc, query, where,
  orderBy, getDocs, serverTimestamp, limit,
} from 'firebase/firestore'
import AIChat from '../components/AIChat'
import DailyQuote from '../components/DailyQuote'

/* ── Constants ────────────────────────────────────────────── */
const NAV = [
  { id: 'home',        icon: '🏠', label: 'Overview' },
  { id: 'chat',        icon: '🤖', label: 'AI Counselor' },
  { id: 'journal',     icon: '📔', label: 'Journal' },
  { id: 'meditation',  icon: '🧘', label: 'Meditation' },
  { id: 'progress',    icon: '📈', label: 'Progress' },
  { id: 'inspiration', icon: '🌿', label: 'Inspiration' },
]

const ADDICTION_LABELS = {
  alcohol:      '🍺 Alcohol',
  tobacco:      '🚬 Tobacco',
  drugs:        '💊 Drugs',
  gambling:     '🎰 Gambling',
  gaming:       '🎮 Gaming',
  social_media: '📱 Social Media',
}

const TIPS = [
  'Drink a full glass of water when a craving hits.',
  'Inhale 4s · Hold 4s · Exhale 4s — repeat 4 times.',
  'Call or text a trusted friend right now.',
  'Go for a 10-minute walk outside in fresh air.',
  'Write down 3 things you are grateful for today.',
  'Listen to your favourite uplifting song.',
  'Do 20 jumping jacks to release endorphins.',
  'This craving will pass in 15–20 minutes. Ride it out.',
  'Remind yourself exactly why you started this journey.',
  'Splash cold water on your face and take 5 deep breaths.',
]

const MOODS = [
  { emoji: '😊', label: 'Great' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😟', label: 'Low' },
  { emoji: '😤', label: 'Angry' },
  { emoji: '😢', label: 'Sad' },
]

const MILESTONES = [
  { day: 1,   icon: '🌱', title: 'First Step',     desc: 'You made the commitment. The hardest step is done.' },
  { day: 3,   icon: '💧', title: '72 Hours Free',  desc: 'Initial withdrawal easing. Body flushing toxins.' },
  { day: 7,   icon: '⚡', title: 'One Week',        desc: 'Sleep quality improving. Energy levels rising.' },
  { day: 14,  icon: '🧠', title: 'Two Weeks',       desc: 'Mental clarity returning. Mood more stable.' },
  { day: 30,  icon: '💪', title: 'One Month',       desc: 'Physical cravings significantly reduced!' },
  { day: 60,  icon: '❤️', title: 'Two Months',      desc: 'Emotional balance restoring. Relationships healing.' },
  { day: 90,  icon: '🌟', title: 'Three Months',    desc: 'New neural pathways forming. Habits solidifying.' },
  { day: 180, icon: '🏆', title: 'Six Months',      desc: 'Brain chemistry significantly restored. Remarkable!' },
  { day: 365, icon: '💎', title: 'One Year',        desc: 'A full year of freedom! You are an inspiration.' },
]

const EXERCISES = [
  {
    id: 'box', label: 'Box Breathing', desc: 'Stress reduction',
    color: '#3B82F6',
    phases: [{ label: 'Inhale', secs: 4 }, { label: 'Hold', secs: 4 }, { label: 'Exhale', secs: 4 }, { label: 'Hold', secs: 4 }],
  },
  {
    id: '478', label: '4-7-8 Breathing', desc: 'Anxiety & sleep',
    color: '#7C3AED',
    phases: [{ label: 'Inhale', secs: 4 }, { label: 'Hold', secs: 7 }, { label: 'Exhale', secs: 8 }],
  },
  {
    id: 'deep', label: 'Deep Breathing', desc: 'Quick relaxation',
    color: '#10B981',
    phases: [{ label: 'Inhale', secs: 5 }, { label: 'Exhale', secs: 5 }],
  },
]

/* ── Helpers ──────────────────────────────────────────────── */
function getTimeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function getTodayTip() {
  return TIPS[new Date().getDate() % TIPS.length]
}

function getMilestones(streak) {
  return MILESTONES.map(m => ({ ...m, achieved: streak >= m.day }))
}

/* ── Streak Ring (SVG) ────────────────────────────────────── */
function StreakRing({ streak, goal = 30, size = 96 }) {
  const r    = size * 0.38
  const circ = 2 * Math.PI * r
  const pct  = Math.min(streak / goal, 1)
  const cx   = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke="url(#rg)" strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${pct * circ} ${circ}`}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)' }}
      />
      <text x={cx} y={cx - 4} textAnchor="middle" fill="white" fontSize={size * 0.22} fontWeight="800" fontFamily="system-ui">{streak}</text>
      <text x={cx} y={cx + 12} textAnchor="middle" fill="#9CA3AF" fontSize={size * 0.11} fontFamily="system-ui">days</text>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, userData, refreshUserData } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('home')

  const name    = user?.displayName?.split(' ')[0] || 'Friend'
  const streak  = userData?.streak ?? 0
  const addiction = userData?.addictionType || null

  async function handleLogout() {
    await logoutUser()
    navigate('/')
  }

  return (
    <div className="d2">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="d2__sidebar">
        <div className="d2__sb-top">
          <div className="d2__brand">
            <span>🌿</span><span>QuitWise</span>
          </div>

          {/* Streak Ring */}
          <div className="d2__ring-wrap">
            <StreakRing streak={streak} />
            <p className="d2__ring-label">🔥 {streak}-Day Streak</p>
            <p className="d2__ring-sub">Keep going, {name}!</p>
          </div>

          {/* Nav */}
          <nav className="d2__nav">
            {NAV.map(n => (
              <button
                key={n.id}
                className={`d2__nav-item${tab === n.id ? ' active' : ''}`}
                onClick={() => setTab(n.id)}
              >
                <span className="d2__nav-icon">{n.icon}</span>
                <span className="d2__nav-label">{n.label}</span>
                {tab === n.id && <span className="d2__nav-pip" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="d2__sb-bottom">
          <a href="tel:9152987821" className="d2__crisis-btn">
            🚨 Crisis Helpline
          </a>
          <div className="d2__user-row">
            <div className="d2__user-avi">
              {user?.photoURL
                ? <img src={user.photoURL} alt="" />
                : name[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div className="d2__user-name">{user?.displayName || name}</div>
              <div className="d2__user-type">{ADDICTION_LABELS[addiction] || '💪 Recovery'}</div>
            </div>
            <button className="d2__logout-btn" onClick={handleLogout} title="Sign Out">↩</button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="d2__main">
        {tab === 'home'        && <HomeTab user={user} userData={userData} name={name} streak={streak} setTab={setTab} refreshUserData={refreshUserData} />}
        {tab === 'chat'        && <ChatTab />}
        {tab === 'journal'     && <JournalTab user={user} />}
        {tab === 'meditation'  && <MeditationTab />}
        {tab === 'progress'    && <ProgressTab streak={streak} />}
        {tab === 'inspiration' && <InspirationTab />}
      </main>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════
   HOME TAB
═══════════════════════════════════════════════════════════ */
function HomeTab({ user, userData, name, streak, setTab, refreshUserData }) {
  const [mood, setMood]       = useState(null)
  const [moodSaved, setMoodSaved] = useState(false)
  const [checkedInToday, setCheckedInToday] = useState(() => {
    const today = new Date().toDateString()
    return userData?.lastCheckInDate === today || localStorage.getItem(`cw_checkin_${user?.uid}`) === today
  })
  const [tasks, setTasks]     = useState({
    meditation: false, mood: false, quote: false, chat: false,
  })

  async function handleCheckIn() {
    if (checkedInToday) return
    const today = new Date().toDateString()
    const newStreak = (streak || 0) + 1
    const newLongest = Math.max(newStreak, userData?.longestStreak || 0)
    setCheckedInToday(true)
    if (user) {
      localStorage.setItem(`cw_checkin_${user.uid}`, today)
      try {
        await updateUserData(user.uid, {
          streak: newStreak,
          longestStreak: newLongest,
          lastCheckInDate: today,
        })
        if (refreshUserData) refreshUserData()
      } catch (err) {
        console.warn('Could not sync streak to cloud, saved locally:', err)
      }
    }
  }

  async function saveMood(val) {
    setMood(val)
    if (user) {
      try {
        await updateUserData(user.uid, {
          lastMood: val, lastMoodDate: new Date().toISOString(),
        })
      } catch (err) {
        console.warn('Could not sync mood to cloud:', err)
      }
      setMoodSaved(true)
      setTasks(t => ({ ...t, mood: true }))
    }
  }

  const doneCount = Object.values(tasks).filter(Boolean).length
  const milestones = getMilestones(streak)
  const nextMilestone = milestones.find(m => !m.achieved)

  const todayTasks = [
    { key: 'meditation', icon: '🧘', label: 'Morning meditation', action: () => setTab('meditation') },
    { key: 'mood',       icon: '😊', label: 'Log your mood today', action: null },
    { key: 'quote',      icon: '🌿', label: "Read today's quote",   action: () => setTab('inspiration') },
    { key: 'chat',       icon: '🤖', label: 'Check in with AI',     action: () => setTab('chat') },
  ]

  return (
    <div className="d2__scroll">
      {/* Header */}
      <div className="d2__home-header">
        <div>
          <h1 className="d2__greeting">
            Good {getTimeOfDay()}, {name} {streak > 0 ? '🔥' : '👋'}
          </h1>
          <p className="d2__greeting-date">{formatDate()}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`d2__checkin-btn${checkedInToday ? ' d2__checkin-btn--done' : ''}`}
            onClick={handleCheckIn}
            disabled={checkedInToday}
          >
            {checkedInToday ? '✨ Checked in Today' : '⚡ Complete Daily Check-in (+1 Day)'}
          </button>
          {nextMilestone && (
            <div className="d2__next-badge">
              <span>{nextMilestone.icon}</span>
              <div>
                <div className="d2__next-badge-title">Next: {nextMilestone.title}</div>
                <div className="d2__next-badge-sub">Day {nextMilestone.day} · {Math.max(nextMilestone.day - streak, 0)} days away</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="d2__stat-grid">
        <div className="d2__sc d2__sc--1">
          <div className="d2__sc-emoji">🔥</div>
          <div className="d2__sc-val">{streak}</div>
          <div className="d2__sc-name">Day Streak</div>
          <div className="d2__sc-bar">
            <div className="d2__sc-fill" style={{ width: `${Math.min(streak / 30 * 100, 100)}%` }} />
          </div>
          <div className="d2__sc-hint">Goal: 30 days</div>
        </div>
        <div className="d2__sc d2__sc--2">
          <div className="d2__sc-emoji">🏆</div>
          <div className="d2__sc-val">{getMilestones(streak).filter(m => m.achieved).length}</div>
          <div className="d2__sc-name">Badges Earned</div>
          <div className="d2__sc-hint">{getMilestones(streak).filter(m => m.achieved).slice(-1)[0]?.title || 'Start today!'}</div>
        </div>
        <div className="d2__sc d2__sc--3">
          <div className="d2__sc-emoji">✅</div>
          <div className="d2__sc-val">{doneCount}/4</div>
          <div className="d2__sc-name">Tasks Today</div>
          <div className="d2__sc-hint">{doneCount === 4 ? '🎉 All done!' : `${4 - doneCount} remaining`}</div>
        </div>
        <div className="d2__sc d2__sc--4">
          <div className="d2__sc-emoji">💪</div>
          <div className="d2__sc-val">{userData?.longestStreak ?? 0}</div>
          <div className="d2__sc-name">Best Streak</div>
          <div className="d2__sc-hint">
            {streak > 0 && streak >= (userData?.longestStreak ?? 0) ? '🎉 New record!' : 'Keep pushing!'}
          </div>
        </div>
      </div>

      <div className="d2__two-col">
        {/* Tasks */}
        <div className="d2__card">
          <div className="d2__card-head">
            <h3>Today&apos;s Tasks</h3>
            <span className="d2__pill d2__pill--green">{doneCount}/4 done</span>
          </div>
          <div className="d2__tasks">
            {todayTasks.map(t => (
              <div key={t.key} className={`d2__task${tasks[t.key] ? ' done' : ''}`}>
                <button
                  className="d2__task-check"
                  onClick={() => setTasks(p => ({ ...p, [t.key]: !p[t.key] }))}
                >
                  {tasks[t.key] ? '✓' : ''}
                </button>
                <span className="d2__task-icon">{t.icon}</span>
                <span className="d2__task-text">{t.label}</span>
                {t.action && !tasks[t.key] && (
                  <button className="d2__task-go" onClick={t.action}>→</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tip + Emergency */}
        <div className="d2__card d2__card--glow">
          <div className="d2__card-head"><h3>💡 Today&apos;s Tip</h3></div>
          <p className="d2__tip-text">{getTodayTip()}</p>
          <hr className="d2__divider" />
          <div className="d2__card-head"><h3>🚨 Emergency</h3></div>
          <p className="d2__tip-text" style={{ marginBottom: 12 }}>
            Intense craving? You&apos;re not alone.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="d2__emg-btn d2__emg-btn--ai" onClick={() => setTab('chat')}>
              🤖 Talk to AI
            </button>
            <a href="tel:9152987821" className="d2__emg-btn d2__emg-btn--call">
              📞 Helpline
            </a>
          </div>
        </div>
      </div>

      {/* Mood tracker */}
      <div className="d2__card">
        <div className="d2__card-head">
          <h3>How are you feeling right now?</h3>
          {moodSaved && <span className="d2__pill d2__pill--green">✓ Logged</span>}
        </div>
        <div className="d2__mood-row">
          {MOODS.map(m => (
            <button
              key={m.label}
              className={`d2__mood-btn${mood === m.label ? ' active' : ''}`}
              onClick={() => saveMood(m.label)}
            >
              <span className="d2__mood-emoji">{m.emoji}</span>
              <span className="d2__mood-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recovery timeline preview */}
      <div className="d2__card">
        <div className="d2__card-head">
          <h3>❤️ Recovery Timeline</h3>
          <button className="d2__link-btn" onClick={() => setTab('progress')}>
            View all →
          </button>
        </div>
        <div className="d2__tl-preview">
          {getMilestones(streak).slice(0, 6).map((m, i, arr) => (
            <div key={m.day} className={`d2__tl-item${m.achieved ? ' done' : ''}`}>
              <div className="d2__tl-dot">{m.achieved ? '✓' : m.icon}</div>
              {i < arr.length - 1 && <div className={`d2__tl-line${m.achieved ? ' done' : ''}`} />}
              <div className="d2__tl-info">
                <span className="d2__tl-day">Day {m.day}</span>
                <span className="d2__tl-name">{m.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   AI CHAT TAB
═══════════════════════════════════════════════════════════ */
function ChatTab() {
  return (
    <div className="d2__scroll d2__scroll--chat">
      <div className="d2__tab-header">
        <h1 className="d2__tab-title">🤖 AI Recovery Counselor</h1>
        <p className="d2__tab-sub">Your personal AI — available 24/7, fully judgment-free</p>
      </div>
      <div className="d2__chat-wrap">
        <AIChat fullPage />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   JOURNAL TAB
═══════════════════════════════════════════════════════════ */
function JournalTab({ user }) {
  const [text, setText]       = useState('')
  const [entryMood, setEntryMood] = useState('')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (user?.uid) {
      // First load immediately from localStorage for instant, reliable persistence
      const cached = localStorage.getItem(`cw_journals_${user.uid}`)
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setEntries(parsed)
        } catch (e) {
          console.warn('Failed to parse cached journals', e)
        }
      }
      loadEntries()
    }
  }, [user?.uid])

  async function loadEntries() {
    if (!user?.uid) return
    try {
      // Try compound query first
      let snap
      try {
        const q = query(
          collection(db, 'journals'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20),
        )
        snap = await getDocs(q)
      } catch (err) {
        // Fallback: If composite index is missing, query by uid only and sort in memory
        console.warn('Composite index may be missing, falling back to client sort:', err)
        const qSimple = query(
          collection(db, 'journals'),
          where('uid', '==', user.uid)
        )
        snap = await getDocs(qSimple)
      }

      if (snap && !snap.empty) {
        const cloudEntries = snap.docs.map(d => {
          const data = d.data()
          return {
            id: d.id,
            text: data.text,
            mood: data.mood,
            dateStr: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            }) || data.dateStr || 'Recent',
            rawTime: data.createdAt?.toMillis?.() || Date.now(),
          }
        }).sort((a, b) => b.rawTime - a.rawTime)

        setEntries(cloudEntries)
        localStorage.setItem(`cw_journals_${user.uid}`, JSON.stringify(cloudEntries))
      }
    } catch (err) {
      console.warn('Firestore journal load error, using local storage:', err)
    }
  }

  async function handleSave() {
    if (!text.trim() || !user) return
    setSaving(true)

    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    const newEntry = {
      id: 'local_' + Date.now(),
      text: text.trim(),
      mood: entryMood || '📔',
      dateStr: dateStr,
      rawTime: Date.now(),
    }

    // Immediately update UI & persist to localStorage so it is never lost
    setEntries(prev => {
      const updated = [newEntry, ...prev]
      localStorage.setItem(`cw_journals_${user.uid}`, JSON.stringify(updated))
      return updated
    })

    setText('')
    setEntryMood('')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)

    // Sync in background to Firestore
    try {
      await addDoc(collection(db, 'journals'), {
        uid: user.uid,
        text: newEntry.text,
        mood: newEntry.mood,
        dateStr: dateStr,
        createdAt: serverTimestamp(),
      })
    } catch (e) {
      console.warn('Saved locally, Firestore sync pending:', e)
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="d2__scroll">
      <div className="d2__tab-header">
        <h1 className="d2__tab-title">📔 Daily Journal</h1>
        <p className="d2__tab-sub">Your private space — write freely, no judgment</p>
      </div>

      <div className="d2__card d2__journal-card">
        <div className="d2__card-head">
          <h3>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          {saved && <span className="d2__pill d2__pill--green">✓ Saved!</span>}
        </div>
        <div className="d2__journal-mood-row">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Today&apos;s mood:</span>
          {['😊','😌','😐','😟','😤','😢'].map(e => (
            <button
              key={e}
              className={`d2__jmood${entryMood === e ? ' active' : ''}`}
              onClick={() => setEntryMood(e)}
            >{e}</button>
          ))}
        </div>
        <textarea
          className="d2__journal-ta"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="How are you feeling today? What challenges did you face? What are you grateful for?

Write anything — this is your private space..."
          rows={7}
        />
        <div className="d2__journal-footer">
          <span className="d2__char-count">{text.length} characters</span>
          <button
            className="btn btn--primary btn--sm"
            onClick={handleSave}
            disabled={!text.trim() || saving}
          >
            {saving ? 'Saving…' : '💾 Save Entry'}
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="d2__card">
          <div className="d2__card-head"><h3>📖 Past Entries</h3></div>
          <div className="d2__entry-list">
            {entries.map(e => (
              <div key={e.id} className="d2__entry">
                <div className="d2__entry-meta">
                  <span className="d2__entry-emoji">{e.mood || '📔'}</span>
                  <span className="d2__entry-date">
                    {e.dateStr || e.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    }) || 'Recent'}
                  </span>
                </div>
                <p className="d2__entry-text">{e.text}</p>
              </div>

            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MEDITATION TAB
═══════════════════════════════════════════════════════════ */
function MeditationTab() {
  const [exercise, setExercise] = useState(EXERCISES[0])
  const [running, setRunning]   = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(EXERCISES[0].phases[0].secs)
  const [cycles, setCycles]     = useState(0)

  const timerRef = useRef(null)
  const stateRef = useRef({
    running: false,
    exercise: EXERCISES[0],
    phaseIdx: 0,
    timeLeft: EXERCISES[0].phases[0].secs,
  })

  // Synchronize stateRef with current props/states
  stateRef.current.exercise = exercise
  stateRef.current.running = running

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    stateRef.current.running = false
    stateRef.current.phaseIdx = 0
    stateRef.current.timeLeft = exercise.phases[0].secs
    setRunning(false)
    setPhaseIdx(0)
    setTimeLeft(exercise.phases[0].secs)
  }

  function start() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    const startSecs = exercise.phases[0].secs
    stateRef.current.running = true
    stateRef.current.phaseIdx = 0
    stateRef.current.timeLeft = startSecs
    setRunning(true)
    setPhaseIdx(0)
    setTimeLeft(startSecs)
    setCycles(0)

    timerRef.current = setInterval(() => {
      if (!stateRef.current.running) return

      stateRef.current.timeLeft -= 1

      if (stateRef.current.timeLeft <= 0) {
        const curEx = stateRef.current.exercise
        const nextIdx = (stateRef.current.phaseIdx + 1) % curEx.phases.length
        const nextDuration = curEx.phases[nextIdx].secs

        stateRef.current.phaseIdx = nextIdx
        stateRef.current.timeLeft = nextDuration

        setPhaseIdx(nextIdx)
        setTimeLeft(nextDuration)

        if (nextIdx === 0) {
          setCycles(c => c + 1)
        }
      } else {
        setTimeLeft(stateRef.current.timeLeft)
      }
    }, 1000)
  }

  function pickExercise(ex) {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    stateRef.current.running = false
    stateRef.current.exercise = ex
    stateRef.current.phaseIdx = 0
    stateRef.current.timeLeft = ex.phases[0].secs

    setRunning(false)
    setExercise(ex)
    setPhaseIdx(0)
    setTimeLeft(ex.phases[0].secs)
    setCycles(0)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const phase = exercise.phases[phaseIdx] || exercise.phases[0]
  const isInhale = phase.label.toLowerCase().includes('inhale')
  const isExhale = phase.label.toLowerCase().includes('exhale')
  const circleState = !running ? 'idle' : isInhale ? 'in' : isExhale ? 'out' : 'hold'



  return (
    <div className="d2__scroll d2__scroll--center">
      <div className="d2__tab-header">
        <h1 className="d2__tab-title">🧘 Meditation & Breathing</h1>
        <p className="d2__tab-sub">Breathe through cravings. Calm your nervous system.</p>
      </div>

      {/* Exercise selector */}
      <div className="d2__ex-row">
        {EXERCISES.map(ex => (
          <button
            key={ex.id}
            className={`d2__ex-btn${exercise.id === ex.id ? ' active' : ''}`}
            onClick={() => pickExercise(ex)}
            style={{ '--ex-color': ex.color }}
          >
            <span className="d2__ex-name">{ex.label}</span>
            <span className="d2__ex-desc">{ex.desc}</span>
          </button>
        ))}
      </div>

      {/* Breathing circle */}
      <div className="d2__breath-stage">
        <div className={`d2__breath-glow d2__breath-glow--${circleState || 'idle'}`} />
        <div
          className={`d2__breath-outer d2__breath-outer--${circleState || 'idle'}`}
          style={{ '--phase-duration': `${phase?.secs || 4}s` }}
        >
          <div className={`d2__breath-inner d2__breath-inner--${circleState || 'idle'}`}>
            <div className="d2__breath-core">
              {running ? (
                <>
                  <span className="d2__breath-label">{phase.label}</span>
                  <span className="d2__breath-count">{timeLeft}s</span>
                  <span className="d2__breath-cycle">Cycle {cycles + 1}</span>
                </>
              ) : (
                <>
                  <span className="d2__breath-label">Ready</span>
                  <span className="d2__breath-idle">🌬️</span>
                </>
              )}
            </div>
          </div>
        </div>


        <button
          className={`d2__breath-btn${running ? ' d2__breath-btn--stop' : ''}`}
          onClick={running ? stop : start}
        >
          {running ? '⏹ Stop' : '▶ Start Breathing'}
        </button>

        {cycles > 0 && (
          <div className="d2__cycles-badge">
            ✓ {cycles} cycle{cycles > 1 ? 's' : ''} completed — great work!
          </div>
        )}
      </div>

      {/* Phase guide */}
      <div className="d2__card d2__phases-card">
        <div className="d2__card-head">
          <h3>{exercise.label} — Phase Guide</h3>
          <span className="d2__pill" style={{ '--pill-color': exercise.color }}>{exercise.desc}</span>
        </div>
        <div className="d2__phase-list">
          {exercise.phases.map((p, i) => (
            <div
              key={i}
              className={`d2__phase-item${running && phaseIdx === i ? ' active' : ''}`}
              style={{ '--ex-color': exercise.color }}
            >
              <div className="d2__phase-num">{i + 1}</div>
              <div className="d2__phase-info">
                <span className="d2__phase-name">{p.label}</span>
                <span className="d2__phase-secs">{p.secs}s</span>
              </div>
              {running && phaseIdx === i && (
                <div className="d2__phase-bar">
                  <div
                    className="d2__phase-bar-fill"
                    style={{ animationDuration: `${p.secs}s`, '--ex-color': exercise.color }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS TAB
═══════════════════════════════════════════════════════════ */
function ProgressTab({ streak }) {
  const milestones = getMilestones(streak)
  const earned = milestones.filter(m => m.achieved)

  return (
    <div className="d2__scroll">
      <div className="d2__tab-header">
        <h1 className="d2__tab-title">📈 Your Progress</h1>
        <p className="d2__tab-sub">Every single day counts. Look how far you&apos;ve come.</p>
      </div>

      {/* Streak hero */}
      <div className="d2__streak-hero">
        <div className="d2__streak-hero-bg" />
        <StreakRing streak={streak} size={120} />
        <div className="d2__streak-hero-text">
          <h2>{streak} Days of Freedom</h2>
          <p>
            {streak === 0
              ? 'Every journey starts with a single step. Today is day one.'
              : streak < 7
              ? `${7 - streak} more days until your first week badge! 💪`
              : streak < 30
              ? `Only ${30 - streak} days to the 30-day milestone! 🌟`
              : 'You are absolutely incredible. Keep going! 🏆'}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="d2__card">
        <div className="d2__card-head">
          <h3>🏆 Achievement Badges</h3>
          <span className="d2__pill d2__pill--green">{earned.length} / {milestones.length} earned</span>
        </div>
        <div className="d2__badge-grid">
          {milestones.map(m => (
            <div key={m.day} className={`d2__badge${m.achieved ? ' earned' : ''}`}>
              <div className="d2__badge-icon">{m.achieved ? m.icon : '🔒'}</div>
              <div className="d2__badge-name">{m.title}</div>
              <div className="d2__badge-day">Day {m.day}</div>
              {m.achieved && <div className="d2__badge-check">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Full health timeline */}
      <div className="d2__card">
        <div className="d2__card-head">
          <h3>❤️ Health Recovery Timeline</h3>
        </div>
        <div className="d2__health-tl">
          {milestones.map((m, i) => (
            <div key={m.day} className={`d2__htl-item${m.achieved ? ' done' : ''}`}>
              <div className="d2__htl-left">
                <div className="d2__htl-dot">{m.achieved ? '✓' : m.icon}</div>
                {i < milestones.length - 1 && (
                  <div className={`d2__htl-line${m.achieved ? ' done' : ''}`} />
                )}
              </div>
              <div className="d2__htl-body">
                <div className="d2__htl-head">
                  <span className="d2__htl-title">{m.title}</span>
                  <span className={`d2__htl-tag${m.achieved ? ' done' : ''}`}>
                    {m.achieved ? '✓ Achieved' : `Day ${m.day}`}
                  </span>
                </div>
                <p className="d2__htl-desc">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   INSPIRATION TAB
═══════════════════════════════════════════════════════════ */
function InspirationTab() {
  return (
    <div className="d2__scroll">
      <div className="d2__tab-header">
        <h1 className="d2__tab-title">🌿 Daily Inspiration</h1>
        <p className="d2__tab-sub">A new quote and nature scene, every single day.</p>
      </div>
      <DailyQuote />
    </div>
  )
}
