import { REGIONS } from '../data/constants'

// Step 1: pick a region -> only launches in that region show.
// Step 2: optionally narrow further to one developer within that region.
export default function RegionFilter({
  selectedRegion,
  onSelectRegion,
  developersInRegion = [],
  selectedDeveloper,
  onSelectDeveloper,
}) {
  return (
    <div className="bg-surface border border-white/5 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-mist mb-3">Browse by Region</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onSelectRegion(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedRegion ? 'bg-gold text-ink' : 'bg-surface2 text-mist hover:text-white'
          }`}
        >
          All Regions
        </button>
        {REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectRegion(r.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedRegion === r.id ? 'bg-gold text-ink' : 'bg-surface2 text-mist hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {selectedRegion && developersInRegion.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-mist mb-3">
            Narrow to a Developer in this Region
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectDeveloper(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !selectedDeveloper ? 'border-teal text-teal' : 'border-white/10 text-mist hover:text-white'
              }`}
            >
              All Developers
            </button>
            {developersInRegion.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelectDeveloper(d.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedDeveloper === d.id ? 'border-teal text-teal' : 'border-white/10 text-mist hover:text-white'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
