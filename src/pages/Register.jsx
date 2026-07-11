import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loginWithGoogle, currentUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (currentUser) navigate('/')
  }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      const user = await loginWithGoogle()
      if (user) navigate('/') // null on mobile — redirect handles it
    } catch (err) {
      if (err.message === 'auth/in-app-browser') {
        setError(
          'Google sign-in doesn\'t work inside this app\'s built-in browser. Tap the ⋯ or share icon and choose "Open in Browser" (Safari or Chrome), or use email/password below instead.'
        )
      } else {
        setError(
          err.message === 'auth/timeout'
            ? 'This is taking too long — check your connection and try again.'
            : 'Could not sign in with Google. Please try again.'
        )
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await register({ name, email, password, phone })
      navigate('/')
    } catch (err) {
      if (err.message === 'auth/timeout') {
        setError('This is taking too long — check your connection and try again.')
      } else {
        setError(err.code === 'auth/email-already-in-use' ? 'That email is already registered.' : 'Could not create account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-display font-bold mb-1">Create Your Account</h1>
      <p className="text-mist text-sm mb-8">Join Reach The Launch to contact us about any project.</p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-full bg-white text-ink font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-60 mb-4"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.1 27 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.7 16.3 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.6 5.6C40.9 36.4 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"/>
        </svg>
        {googleLoading ? 'Connecting…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-mist">or sign up with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-white/5 rounded-xl p-6">
        <div>
          <label className="block text-sm text-mist mb-1">Full Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Phone Number</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors disabled:opacity-60">
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-mist mt-4 text-center">
        Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
