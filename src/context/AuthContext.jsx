import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

// If Firebase Auth genuinely hangs (flaky network, an ad-blocker/extension
// interfering with Google's scripts, etc.) the person should see a clear
// error and be able to retry — never an endless spinner.
function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('auth/timeout')), ms)
    ),
  ])
}

// Most mobile browsers (mobile Safari especially, and any in-app browser
// like Instagram/Facebook's) block or silently fail signInWithPopup.
// Redirect-based sign-in is the reliable option there.
const isMobile =
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()
  const userDoc = {
    name: user.displayName || 'New User',
    email: user.email,
    phone: '',
    role: 'user',
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, userDoc)
  return userDoc
}

// Roles: 'user' (client), 'admin' (sub-admin, promoted), 'superadmin' (first/root admin)
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null) // firebase auth user
  const [profile, setProfile] = useState(null) // firestore user doc (has role, name, phone)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // Picks up the result once the browser comes back from a Google
  // redirect sign-in (mobile flow). No-op on every other page load.
  const [authError, setAuthError] = useState('')

  // Picks up the result once the browser comes back from a Google
  // redirect sign-in (mobile flow). This was previously only checking for
  // errors and silently discarding a *successful* result — meaning a new
  // Google user on mobile never got their Firestore profile created, and
  // any real failure (e.g. domain not authorized) was invisible in the UI.
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return // normal page load, not a return from redirect
        const userDoc = await ensureUserDoc(result.user)
        setProfile(userDoc)
      })
      .catch((err) => {
        console.error('Google redirect sign-in failed', err)
        setAuthError(
          err.code === 'auth/unauthorized-domain'
            ? "This site's domain isn't authorized for Google sign-in yet."
            : 'Google sign-in failed. Please try again.'
        )
      })
  }, [])

  async function register({ name, email, password, phone }) {
    const cred = await withTimeout(createUserWithEmailAndPassword(auth, email, password))
    await withTimeout(updateProfile(cred.user, { displayName: name }))
    const userDoc = {
      name,
      email,
      phone: phone || '',
      role: 'user',
      createdAt: serverTimestamp(),
    }
    await withTimeout(setDoc(doc(db, 'users', cred.user.uid), userDoc))
    setProfile(userDoc)
    return cred.user
  }

  async function login(email, password) {
    const cred = await withTimeout(signInWithEmailAndPassword(auth, email, password))
    const snap = await withTimeout(getDoc(doc(db, 'users', cred.user.uid)))
    setProfile(snap.exists() ? snap.data() : null)
    return cred.user
  }

  // "Continue with Google" — same idea as Facebook/Google sign-in on other
  // apps: the person picks their Gmail account and never types a password
  // for this site. First-time Google sign-ins get a 'user' profile created
  // automatically; returning ones just log in.
  //
  // Desktop: opens a popup and resolves once it closes.
  // Mobile: redirects away and back (popups aren't reliable there); in that
  // case this function's promise never resolves on this page load — the
  // getRedirectResult effect above and onAuthStateChanged pick it up once
  // the browser returns.
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()

    if (isMobile) {
      await signInWithRedirect(auth, provider)
      return null
    }

    try {
      const cred = await withTimeout(signInWithPopup(auth, provider))
      const userDoc = await withTimeout(ensureUserDoc(cred.user))
      setProfile(userDoc)
      return cred.user
    } catch (err) {
      // Popup blocked/closed/unsupported (e.g. Safari with strict tracking
      // prevention) — fall back to redirect instead of failing outright.
      if (
        ['auth/popup-blocked', 'auth/popup-closed-by-user', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(err.code)
      ) {
        await signInWithRedirect(auth, provider)
        return null
      }
      throw err
    }
  }

  function logout() {
    return signOut(auth)
  }

  const role = profile?.role || (currentUser ? 'user' : 'guest')
  const isGuest = !currentUser
  const isAdmin = role === 'admin' || role === 'superadmin'
  const isSuperAdmin = role === 'superadmin'

  // Superadmin always has every permission. A regular admin only has the
  // specific ones the superadmin has switched on for them.
  const permissions = isSuperAdmin
    ? { launches: true, developers: true, submissions: true, offers: true }
    : {
        launches: Boolean(profile?.permissions?.launches),
        developers: Boolean(profile?.permissions?.developers),
        submissions: Boolean(profile?.permissions?.submissions),
        offers: Boolean(profile?.permissions?.offers),
      }

  const value = {
    currentUser,
    profile,
    role,
    isGuest,
    isAdmin,
    isSuperAdmin,
    permissions,
    loading,
    authError,
    register,
    login,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
