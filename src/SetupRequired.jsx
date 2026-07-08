// Shown instead of a blank white page whenever the app is opened before
// .env.local has been filled in with real Firebase project keys.
export default function SetupRequired() {
  const keys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0B1220', color: 'white', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        <p style={{ color: '#D4AF6A', fontWeight: 700, fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>SETUP REQUIRED</p>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 26, marginBottom: 12 }}>
          Firebase isn't connected yet
        </h1>
        <p style={{ color: '#8B96A8', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
          This is expected — you haven't created your Firebase project keys yet. The site can't
          render real data until it knows which Firebase project to talk to.
        </p>

        <div style={{ background: '#111A2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#8B96A8', marginBottom: 12 }}>Do this:</p>
          <ol style={{ paddingInlineStart: 20, color: 'white', fontSize: 14, lineHeight: 1.9 }}>
            <li>Copy <code style={{ color: '#F0CE8B' }}>.env.example</code> to <code style={{ color: '#F0CE8B' }}>.env.local</code> in the project root.</li>
            <li>Fill in the 6 values from your Firebase project settings.</li>
            <li>Stop the dev server (Ctrl+C) and run <code style={{ color: '#F0CE8B' }}>npm run dev</code> again — env files are only read on startup.</li>
          </ol>
        </div>

        <div style={{ background: '#111A2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 13, color: '#8B96A8', marginBottom: 10 }}>Required keys in .env.local:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, fontFamily: 'monospace', color: '#1FB6A6', lineHeight: 1.9 }}>
            {keys.map((k) => <li key={k}>{k}=</li>)}
          </ul>
        </div>

        <p style={{ color: '#8B96A8', fontSize: 13, marginTop: 20 }}>
          Full step-by-step instructions are in <code style={{ color: '#F0CE8B' }}>README.md</code>.
        </p>
      </div>
    </div>
  )
}
