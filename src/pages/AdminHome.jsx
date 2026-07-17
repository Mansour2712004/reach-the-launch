import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminHome() {
  const { permissions, isSuperAdmin } = useAuth()

  const cards = [
    { key: 'launches', to: '/admin/launches', title: 'Launches', desc: 'Add, edit, and remove property launches.' },
    { key: 'developers', to: '/admin/developers', title: 'Developers', desc: 'Manage developer companies and logos.' },
    { key: 'offers', to: '/admin/special-offer', title: 'Special Offer', desc: 'Set or remove the homepage offer banner.' },
    { key: 'submissions', to: '/admin/submissions', title: 'Contact Submissions', desc: 'See and manage everyone who reached out.' },
  ].filter((c) => permissions[c.key])

  if (isSuperAdmin) {
    cards.push(
      { key: 'whatsapp', to: '/admin/whatsapp', title: 'WhatsApp Number', desc: 'Set the number clients can reach you on directly.' },
      { key: 'users', to: '/admin/users', title: 'Manage Admins', desc: 'Grant or revoke admin access and permissions.' }
    )
  }

  if (cards.length === 0) {
    return (
      <div className="bg-surface border border-white/5 rounded-xl p-8 text-center">
        <p className="text-mist">
          You don't have any admin permissions switched on yet. Ask your Super Admin to grant
          you access from "Manage Admins".
        </p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((c) => (
        <Link key={c.key} to={c.to} className="bg-surface border border-white/5 rounded-xl p-6 hover:border-gold/40 transition-colors">
          <h3 className="font-display font-semibold text-lg mb-1">{c.title}</h3>
          <p className="text-mist text-sm">{c.desc}</p>
        </Link>
      ))}
    </div>
  )
}
