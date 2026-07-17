import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createContactSubmission, getWhatsappNumber } from '../data/firestoreApi'

// unitType field is intentionally free-choice text/select; preferred date is optional.
const UNIT_TYPES = ['Apartment', 'Duplex', 'Penthouse', 'Townhouse', 'Twin House', 'Villa', 'Chalet', 'Not sure yet']

function buildWhatsappLink(rawPhone, launchName) {
  const digits = rawPhone.replace(/\D/g, '')
  const message = launchName
    ? `Hi, I'm interested in ${launchName}. Could you share more details?`
    : "Hi, I'd like more information about your real estate launches."
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

function WhatsappButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#25D366] text-ink font-semibold text-sm hover:brightness-105 transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.08 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z"/>
      </svg>
      Continue via WhatsApp
    </a>
  )
}

export default function ContactForm({ launchId = null, launchName = null }) {
  const { currentUser, isGuest, profile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [unitType, setUnitType] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [whatsappNumber, setWhatsappNumber] = useState(null)
  const [whatsappLoaded, setWhatsappLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setWhatsappNumber(await getWhatsappNumber())
      } finally {
        setWhatsappLoaded(true)
      }
    })()
  }, [])

  const whatsappHref = whatsappNumber ? buildWhatsappLink(whatsappNumber, launchName) : null

  if (isGuest) {
    if (whatsappLoaded && whatsappHref) {
      return (
        <div className="bg-surface border border-white/5 rounded-xl p-6 space-y-3">
          {launchName && (
            <p className="text-xs uppercase tracking-wider text-gold">Regarding: {launchName}</p>
          )}
          <p className="text-mist text-sm mb-1">Reach us directly on WhatsApp — no account needed.</p>
          <WhatsappButton href={whatsappHref} />
        </div>
      )
    }
    if (whatsappLoaded) {
      return (
        <div className="bg-surface border border-white/5 rounded-xl p-6 text-center">
          <p className="text-mist mb-4">Please sign in to leave your details with us.</p>
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors"
          >
            Sign In to Continue
          </Link>
        </div>
      )
    }
    return <div className="h-40 rounded-xl bg-surface animate-pulse" />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !unitType) return
    setStatus('sending')
    try {
      await createContactSubmission({
        name: name.trim(),
        phone: phone.trim(),
        unitType,
        preferredDate: preferredDate || null,
        launchId,
        launchName,
        userId: currentUser.uid,
        userEmail: currentUser.email,
      })
      setStatus('sent')
      setUnitType('')
      setPreferredDate('')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-surface border border-teal/40 rounded-xl p-6 text-center">
        <p className="text-teal font-semibold">Thanks — our team will reach out shortly.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {whatsappHref && (
        <>
          <WhatsappButton href={whatsappHref} />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-mist">or leave your details below</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="bg-surface border border-white/5 rounded-xl p-6 space-y-4">
        {launchName && (
          <p className="text-xs uppercase tracking-wider text-gold">Regarding: {launchName}</p>
        )}
        <div>
          <label className="block text-sm text-mist mb-1">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            type="tel"
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Unit Type</label>
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            required
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
          >
            <option value="" disabled>Select unit type</option>
            {UNIT_TYPES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Preferred Date <span className="text-mist/60">(optional)</span></label>
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
          />
        </div>
        {status === 'error' && <p className="text-red-400 text-sm">Something went wrong — please try again.</p>}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
