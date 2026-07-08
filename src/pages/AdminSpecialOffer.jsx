import { useEffect, useState } from 'react'
import { deleteSpecialOffer, getSpecialOffer, setSpecialOffer } from '../data/firestoreApi'

const emptyForm = { title: '', description: '', image: '', ctaText: '', ctaLink: '' }

export default function AdminSpecialOffer() {
  const [form, setForm] = useState(emptyForm)
  const [exists, setExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      const offer = await getSpecialOffer()
      if (offer) {
        setForm({ ...emptyForm, ...offer })
        setExists(true)
      } else {
        setForm(emptyForm)
        setExists(false)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setSavedMsg('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('A title is required.')
      return
    }
    setSaving(true)
    try {
      await setSpecialOffer(form)
      setExists(true)
      setSavedMsg('Saved — now live on the homepage.')
    } catch (err) {
      console.error(err)
      setError('Could not save the offer. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Remove the special offer from the homepage?')) return
    setSaving(true)
    try {
      await deleteSpecialOffer()
      setForm(emptyForm)
      setExists(false)
      setSavedMsg('Removed — the section is gone from the homepage.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-64 rounded-xl bg-surface animate-pulse" />

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 bg-surface border border-white/5 rounded-xl p-6">
      <div>
        <h2 className="font-display font-semibold text-lg">Homepage Special Offer</h2>
        <p className="text-mist text-sm mt-1">
          {exists
            ? 'This banner is currently showing on the homepage right under the carousel.'
            : "No offer is set — nothing shows on the homepage until you save one here."}
        </p>
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Title</label>
        <input value={form.title} onChange={(e) => update('title', e.target.value)} required
          placeholder="e.g. 0% Down Payment This Weekend Only"
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Description <span className="text-mist/60">(optional)</span></label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3}
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Image URL <span className="text-mist/60">(optional)</span></label>
        <input value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..."
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-mist mb-1">Button Text <span className="text-mist/60">(optional)</span></label>
          <input value={form.ctaText} onChange={(e) => update('ctaText', e.target.value)} placeholder="Learn More"
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Button Link <span className="text-mist/60">(optional)</span></label>
          <input value={form.ctaLink} onChange={(e) => update('ctaLink', e.target.value)} placeholder="/launch/xyz or /launches"
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {savedMsg && <p className="text-teal text-sm">{savedMsg}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : exists ? 'Save Changes' : 'Publish Offer'}
        </button>
        {exists && (
          <button type="button" onClick={handleDelete} disabled={saving}
            className="px-5 py-2.5 rounded-full border border-red-400/50 text-red-400 text-sm hover:bg-red-400/10 transition-colors disabled:opacity-60">
            Remove from Homepage
          </button>
        )}
      </div>
    </form>
  )
}
