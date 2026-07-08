import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo size="sm" />
        <p className="text-sm text-mist text-center md:text-left">
          Reach The Launch tracks the best time to buy in every new real estate launch across
          East Cairo, West Cairo, Sahel and Sokhna.
        </p>
        <p className="text-xs text-mist/60">&copy; {new Date().getFullYear()} Reach The Launch</p>
      </div>
    </footer>
  )
}
