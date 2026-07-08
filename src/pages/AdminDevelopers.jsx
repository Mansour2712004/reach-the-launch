import { useEffect, useState } from 'react'
import {
  createDeveloper,
  deleteDeveloper,
  getAllDevelopers,
  getAllLaunches,
  updateDeveloper,
} from '../data/firestoreApi'

const emptyForm = { name: '', logo: '', description: '' }

export default function AdminDevelopers() {
  const [developers, setDevelopers] = useState([])
  const [launches, setLaunches] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [devs, ls] = await Promise.all([getAllDevelopers(), getAllLaunches()])
      setDevelopers(devs)
      setLaunches(ls)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function launchCountFor(devId) {
    return launches.filter((l) => l.developerId === devId).length
  }

  function startEdit(dev) {
    setEditingId(dev.id)
    setForm({ name: dev.name || '', logo: dev.logo || '', description: dev.description || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError('Developer name is required.')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateDeveloper(editingId, form)
      } else {
        await createDeveloper(form)
      }
      cancelEdit()
      load()
    } catch (err) {
      console.error(err)
      setError('Could not save the developer. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(dev) {
    const count = launchCountFor(dev.id)
    if (count > 0) {
      window.alert(
        `"${dev.name}" still has ${count} launch(es) assigned. Delete or reassign those launches first.`
      )
      return
    }
    if (!window.confirm(`Delete developer "${dev.name}"? This cannot be undone.`)) return
    await deleteDeveloper(dev.id)
    load()
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-1 space-y-4 bg-surface border border-white/5 rounded-xl p-6 h-fit">
        <h2 className="font-display font-semibold text-lg">
          {editingId ? 'Edit Developer' : 'Add New Developer'}
        </h2>

        <div>
          <label className="block text-sm text-mist mb-1">Company Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm text-mist mb-1">Logo Image URL <span className="text-mist/60">(optional)</span></label>
          <input
            value={form.logo}
            onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
            placeholder="https://..."
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
          {form.logo && (
            <div className="mt-2 w-14 h-14 rounded-full overflow-hidden border border-white/10">
              <img src={form.logo} alt="Logo preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-mist mb-1">Description <span className="text-mist/60">(optional)</span></label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full rounded-lg bg-surface2 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold2 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Developer'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2.5 rounded-full border border-white/10 text-mist text-sm hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-2">
        {loading ? (
          <div className="h-48 rounded-xl bg-surface animate-pulse" />
        ) : developers.length === 0 ? (
          <p className="text-mist text-sm py-16 text-center">No developers yet — add your first one.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {developers.map((d) => (
              <div key={d.id} className="bg-surface border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface2 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                    {d.logo ? (
                      <img src={d.logo} alt={d.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gold font-display font-bold">{d.name?.[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{d.name}</p>
                    <p className="text-xs text-mist">{launchCountFor(d.id)} launch(es)</p>
                  </div>
                </div>
                {d.description && <p className="text-sm text-mist line-clamp-2">{d.description}</p>}
                <div className="flex gap-3 mt-auto pt-2 border-t border-white/5">
                  <button onClick={() => startEdit(d)} className="text-teal text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(d)} className="text-red-400 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
