export const REGIONS = [
  { id: 'east', label: 'East Cairo' },
  { id: 'west', label: 'West Cairo' },
  { id: 'sahel', label: 'North Coast (Sahel)' },
  { id: 'sokhna', label: 'Ain Sokhna' },
]

export function regionLabel(id) {
  return REGIONS.find((r) => r.id === id)?.label || id
}
