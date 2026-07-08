import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-display font-bold text-gold mb-3">404</h1>
      <p className="text-mist mb-6">This page doesn't exist.</p>
      <Link to="/" className="text-gold hover:underline">Back to Home</Link>
    </div>
  )
}
