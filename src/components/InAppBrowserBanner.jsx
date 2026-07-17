import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

// Shown site-wide (not just on the login page) so someone who opened the
// site from WhatsApp/Instagram/etc. knows to switch browsers *before*
// trying to sign in, rather than hitting a confusing dead end.
export default function InAppBrowserBanner() {
  const { isInAppBrowser } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!isInAppBrowser || dismissed) return null

  return (
    <div className="bg-gold text-ink text-sm px-4 py-2 flex items-center justify-between gap-3">
      <p className="flex-1">
        For the smoothest experience (and to sign in with Google), open this page in Safari or
        Chrome instead of this app's built-in browser — tap ⋯ or the share icon above and choose
        "Open in Browser".
      </p>
      <button onClick={() => setDismissed(true)} className="font-semibold flex-shrink-0" aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
