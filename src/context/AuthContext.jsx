import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

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

  async function register({ name, email, password, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const userDoc = {
      name,
      email,
      phone: phone || '',
      role: 'user',
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), userDoc)
    setProfile(userDoc)
    return cred.user
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    setProfile(snap.exists() ? snap.data() : null)
    return cred.user
  }

  // "Continue with Google" — same idea as Facebook/Google sign-in on other
  // apps: the person picks their Gmail account and never types a password
  // for this site. First-time Google sign-ins get a 'user' profile created
  // automatically; returning ones just log in.
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const ref = doc(db, 'users', cred.user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      const userDoc = {
        name: cred.user.displayName || 'New User',
        email: cred.user.email,
        phone: '',
        role: 'user',
        createdAt: serverTimestamp(),
      }
      await setDoc(ref, userDoc)
      setProfile(userDoc)
    } else {
      setProfile(snap.data())
    }
    return cred.user
  }

  function logout() {
    return signOut(auth)
  }

  const role = profile?.role || (currentUser ? 'user' : 'guest')
  const isGuest = !currentUser
  const isAdmin = role === 'admin' || role === 'superadmin'
  const isSuperAdmin = role === 'superadmin'

  const value = {
    currentUser,
    profile,
    role,
    isGuest,
    isAdmin,
    isSuperAdmin,
    loading,
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
