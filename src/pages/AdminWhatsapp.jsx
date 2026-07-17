import { useEffect, useState } from 'react'
import { getWhatsappNumber, setWhatsappNumber } from '../data/firestoreApi'

export default function AdminWhatsapp() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setPhone((await getWhatsappNumber()) || '')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await setWhatsappNumber(phone.trim())
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 rounded-xl bg-surface animate-pulse" />

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 bg-surface border border-white/5 rounded-xl p-6">
      <div>
        <h2 className="font-display font-semibold text-lg mb-1">WhatsApp Contact Number</h2>
        <p className="text-mist text-sm">
          When this is set, every visitor gets a "Continue via WhatsApp" option next to the
          contact form — guests go straight to WhatsApp, and signed-in clients can choose between
          WhatsApp or submitting the form. Leave it empty to turn this off.
        </p>
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Phone Number (with country code)</label>
        <input
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setSaved(false) }}
          placeholder="e.g. +201001234567"
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        <p className="text-mist/60 text-xs mt-1">Include the country code (e.g. 20 for Egypt). Spaces and dashes are fine.</p>
      </div>

      {saved && <p className="text-teal text-sm">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
