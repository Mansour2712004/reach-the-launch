import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router keeps the browser's scroll position by default when
// navigating between pages. Without this, clicking a link halfway down
// Home (e.g. a developer card) opens the new page already scrolled down
// to that same spot instead of starting at the top.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
