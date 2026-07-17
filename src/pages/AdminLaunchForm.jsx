import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { REGIONS } from '../data/constants'
import {
  createDeveloper,
  createLaunch,
  getAllDevelopers,
  getLaunchById,
  updateLaunch,
} from '../data/firestoreApi'

const UNIT_TYPE_OPTIONS = ['Apartment', 'Duplex', 'Penthouse', 'Townhouse', 'Twin House', 'Villa', 'Chalet']

const emptyForm = {
  name: '',
  developerId: '',
  developerName: '',
  region: 'east',
  coverImage: '',
  gallery: '',
  priceStart: '',
  launchStart: '',
  launchEnd: '',
  bestTimeToBuy: '',
  unitTypes: [],
  description: '',
  keywords: '',
}

export default function AdminLaunchForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [developers, setDevelopers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [newDevName, setNewDevName] = useState('')
  const [showNewDev, setShowNewDev] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      const devs = await getAllDevelopers()
      setDevelopers(devs)
      if (isEdit) {
        const launch = await getLaunchById(id)
        if (launch) {
          setForm({
            ...emptyForm,
            ...launch,
            gallery: (launch.gallery || []).join(', '),
            unitTypes: launch.unitTypes || [],
            keywords: (launch.keywords || []).join(', '),
          })
        }
        setLoading(false)
      }
    })()
  }, [id, isEdit])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleUnitType(u) {
    setForm((f) => ({
      ...f,
      unitTypes: f.unitTypes.includes(u) ? f.unitTypes.filter((x) => x !== u) : [...f.unitTypes, u],
    }))
  }

  async function handleAddDeveloper() {
    if (!newDevName.trim()) return
    const ref = await createDeveloper({ name: newDevName.trim(), logo: '', description: '' })
    const dev = { id: ref.id, name: newDevName.trim() }
    setDevelopers((d) => [...d, dev])
    setForm((f) => ({ ...f, developerId: dev.id, developerName: dev.name }))
    setNewDevName('')
    setShowNewDev(false)
  }

  function handleDeveloperSelect(e) {
    const dev = developers.find((d) => d.id === e.target.value)
    setForm((f) => ({ ...f, developerId: dev?.id || '', developerName: dev?.name || '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.developerId || !form.region) {
      setError('Name, developer and region are required.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        gallery: form.gallery.split(',').map((s) => s.trim()).filter(Boolean),
        keywords: form.keywords.split(',').map((s) => s.trim()).filter(Boolean),
      }
      if (isEdit) {
        await updateLaunch(id, payload)
      } else {
        await createLaunch(payload)
      }
      navigate('/admin')
    } catch (err) {
      console.error(err)
      setError('Could not save the launch. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-64 rounded-xl bg-surface animate-pulse" />

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 bg-surface border border-white/5 rounded-xl p-6">
      <h2 className="font-display font-semibold text-lg">{isEdit ? 'Edit Launch' : 'Add New Launch'}</h2>

      <div>
        <label className="block text-sm text-mist mb-1">Project Name</label>
        <input value={form.name} onChange={(e) => update('name', e.target.value)} required
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Developer</label>
        <div className="flex gap-2">
          <select value={form.developerId} onChange={handleDeveloperSelect} required
            className="flex-1 rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold">
            <option value="" disabled>Select developer</option>
            {developers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button type="button" onClick={() => setShowNewDev((s) => !s)}
            className="px-3 rounded-lg border border-white/10 text-sm text-mist hover:text-white">
            + New
          </button>
        </div>
        {showNewDev && (
          <div className="flex gap-2 mt-2">
            <input value={newDevName} onChange={(e) => setNewDevName(e.target.value)} placeholder="Developer name"
              className="flex-1 rounded-lg bg-surface2 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            <button type="button" onClick={handleAddDeveloper}
              className="px-3 rounded-lg bg-teal text-ink text-sm font-semibold">Save</button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Region</label>
        <select value={form.region} onChange={(e) => update('region', e.target.value)}
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold">
          {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Cover Image URL</label>
        <input value={form.coverImage} onChange={(e) => update('coverImage', e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Gallery Image URLs <span className="text-mist/60">(comma separated)</span></label>
        <textarea value={form.gallery} onChange={(e) => update('gallery', e.target.value)} rows={2}
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-mist mb-1">Starting Price</label>
          <input value={form.priceStart} onChange={(e) => update('priceStart', e.target.value)} placeholder="EGP 3,500,000"
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="block text-sm text-mist mb-1">Launch Start</label>
          <input value={form.launchStart} onChange={(e) => update('launchStart', e.target.value)} placeholder="Aug 2026"
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Launch End <span className="text-mist/60">(optional)</span></label>
        <input value={form.launchEnd} onChange={(e) => update('launchEnd', e.target.value)} placeholder="Sep 2026"
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Best Time to Buy</label>
        <textarea value={form.bestTimeToBuy} onChange={(e) => update('bestTimeToBuy', e.target.value)} rows={2}
          placeholder="e.g. Register in the first launch phase for pre-launch pricing before the official price list is released."
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-2">Unit Types</label>
        <div className="flex flex-wrap gap-2">
          {UNIT_TYPE_OPTIONS.map((u) => (
            <button key={u} type="button" onClick={() => toggleUnitType(u)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                form.unitTypes.includes(u) ? 'border-gold text-gold' : 'border-white/10 text-mist'
              }`}>
              {u}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={5}
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1">
          SEO Keywords <span className="text-mist/60">(comma separated)</span>
        </label>
        <textarea
          value={form.keywords}
          onChange={(e) => update('keywords', e.target.value)}
          rows={2}
          placeholder="e.g. شقق للبيع في التجمع الخامس, apartments New Cairo, villa Sokhna, best launch East Cairo 2026"
          className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
        />
        <p className="text-mist/60 text-xs mt-1">
          Add every phrase someone might search for — Arabic and English, area names, unit types.
          These show up on the project page and help it get found in search engines.
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors disabled:opacity-60">
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Launch'}
      </button>
    </form>
  )
}
