import { Link } from 'react-router-dom'

// Clicking a developer opens ONLY that developer's launches (see DeveloperPage).
export default function DeveloperCard({ developer }) {
  return (
    <Link
      to={`/developers/${developer.id}`}
      className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-surface border border-white/5 hover:border-teal/50 hover:-translate-y-0.5 transition-all"
    >
      <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center overflow-hidden border border-white/10">
        {developer.logo ? (
          <img src={developer.logo} alt={developer.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gold font-display font-bold text-lg">{developer.name?.[0]}</span>
        )}
      </div>
      <span className="text-sm font-medium text-white text-center">{developer.name}</span>
    </Link>
  )
}
