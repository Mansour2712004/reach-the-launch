import { createContext, useContext, useEffect, useState } from "react";
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
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

// Most mobile browsers (mobile Safari especially, and any in-app browser
// like Instagram/Facebook's) block or silently fail signInWithPopup.
// Redirect-based sign-in is the reliable option there.
const isMobile =
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  const userDoc = {
    name: user.displayName || "New User",
    email: user.email,
    phone: "",
    role: "user",
    createdAt: serverTimestamp(),
  };
  await setDoc(ref, userDoc);
  return userDoc;
}

// Roles: 'user' (client), 'admin' (sub-admin, promoted), 'superadmin' (first/root admin)
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        setProfile(snap.exists() ? snap.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.error("Google redirect sign-in failed", err);
    });
  }, []);

  async function register({ name, email, password, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const userDoc = {
      name,
      email,
      phone: phone || "",
      role: "user",
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), userDoc);
    setProfile(userDoc);
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    setProfile(snap.exists() ? snap.data() : null);
    return cred.user;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    if (isMobile) {
      await signInWithRedirect(auth, provider);
      return null;
    }

    try {
      const cred = await signInWithPopup(auth, provider);
      const userDoc = await ensureUserDoc(cred.user);
      setProfile(userDoc);
      return cred.user;
    } catch (err) {
      if (
        [
          "auth/popup-blocked",
          "auth/popup-closed-by-user",
          "auth/operation-not-supported-in-this-environment",
          "auth/cancelled-popup-request",
        ].includes(err.code)
      ) {
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw err;
    }
  }

  function logout() {
    return signOut(auth);
  }

  const role = profile?.role || (currentUser ? "user" : "guest");
  const isGuest = !currentUser;
  const isAdmin = role === "admin" || role === "superadmin";
  const isSuperAdmin = role === "superadmin";

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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
