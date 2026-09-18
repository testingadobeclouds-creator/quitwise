import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, loginWithGoogle } from '../lib/firebase'

const addictions = [
  { value: 'alcohol',      label: '🍺 Alcohol' },
  { value: 'tobacco',      label: '🚬 Tobacco / Smoking' },
  { value: 'drugs',        label: '💊 Drugs / Substances' },
  { value: 'gambling',     label: '🎰 Gambling' },
  { value: 'gaming',       label: '🎮 Gaming' },
  { value: 'social_media', label: '📱 Social Media' },
]

export default function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '', addiction: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleStep1(e) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return }
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.addiction) { setError('Please select your addiction type.'); return }
    setLoading(true)
    setError('')
    try {
      await registerUser(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow--purple" />
      <div className="auth-glow auth-glow--green" />

      <div className="auth-card">
        <Link to="/" className="auth-logo">🌿 QuitWise</Link>

        {step === 1 ? (
          <>
            <h1 className="auth-title">Start your recovery</h1>
            <p className="auth-sub">Free forever. No credit card needed.</p>

            <button className="auth-google-btn" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <div className="auth-divider"><span>or</span></div>

            <form className="auth-form" onSubmit={handleStep1}>
              <div className="auth-field">
                <label>Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat password" required />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="btn btn--primary auth-submit-btn">Continue →</button>
            </form>
          </>
        ) : (
          <>
            <h1 className="auth-title">What are you quitting?</h1>
            <p className="auth-sub">This helps us personalize your recovery plan.</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="addiction-select-grid">
                {addictions.map(a => (
                  <label key={a.value} className={`addiction-option${form.addiction === a.value ? ' addiction-option--active' : ''}`}>
                    <input type="radio" name="addiction" value={a.value} onChange={handleChange} hidden />
                    {a.label}
                  </label>
                ))}
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="btn btn--primary auth-submit-btn" disabled={loading}>
                {loading ? 'Creating account…' : '🌿 Begin My Journey'}
              </button>
              <button type="button" className="auth-back-btn" onClick={() => setStep(1)}>← Back</button>
            </form>
          </>
        )}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Please choose a stronger password.',
    'auth/popup-closed-by-user': 'Google sign-up was cancelled.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
