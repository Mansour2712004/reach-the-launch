import { Link } from 'react-router-dom'

// Clicking a developer opens ONLY that developer's launches (see DeveloperPage).
export default function DeveloperCard({ developer }) {
  return (
    <Link
      to={`/developers/${developer.id}`}
      className="flex flex-col rounded-xl overflow-hidden bg-surface border border-white/5 hover:border-teal/50 hover:-translate-y-0.5 transition-all group"
    >
      <div className="h-28 bg-surface2 overflow-hidden">
        {developer.logo ? (
          <img
            src={developer.logo}
            alt={developer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface2 to-ink">
            <span className="text-gold font-display font-bold text-3xl">{developer.name?.[0]}</span>
          </div>
        )}
      </div>
      <div className="py-3 px-2 text-center">
        <span className="text-sm font-medium text-white group-hover:text-gold transition-colors">
          {developer.name}
        </span>
      </div>
    </Link>
  )
}
