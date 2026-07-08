import { Link } from 'react-router-dom'
import { regionLabel } from '../data/constants'

export default function LaunchCard({ launch }) {
  return (
    <Link
      to={`/launch/${launch.id}`}
      className="group block rounded-xl overflow-hidden bg-surface border border-white/5 hover:border-gold/40 transition-colors"
    >
      <div className="h-44 overflow-hidden">
        <img
          src={launch.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'}
          alt={launch.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-teal">{regionLabel(launch.region)}</span>
          {launch.priceStart && (
            <span className="text-xs text-mist">From {launch.priceStart}</span>
          )}
        </div>
        <h3 className="font-display font-semibold text-white group-hover:text-gold transition-colors truncate">
          {launch.name}
        </h3>
        <p className="text-sm text-mist truncate">{launch.developerName}</p>
      </div>
    </Link>
  )
}
