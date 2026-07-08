import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createContactSubmission } from '../data/firestoreApi'

// unitType field is intentionally free-choice text/select; preferred date is optional.
const UNIT_TYPES = ['Apartment', 'Duplex', 'Penthouse', 'Townhouse', 'Twin House', 'Villa', 'Chalet', 'Not sure yet']

export default function ContactForm({ launchId = null, launchName = null }) {
  const { currentUser, isGuest, profile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [unitType, setUnitType] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  if (isGuest) {
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
  )
}
