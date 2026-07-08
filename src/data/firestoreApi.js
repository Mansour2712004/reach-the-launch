import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

/* ---------------- Launches ---------------- */

export async function getAllLaunches() {
  const q = query(collection(db, 'launches'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getLaunchById(id) {
  const snap = await getDoc(doc(db, 'launches', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getLaunchesByRegion(region) {
  const q = query(collection(db, 'launches'), where('region', '==', region))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getLaunchesByDeveloper(developerId) {
  const q = query(collection(db, 'launches'), where('developerId', '==', developerId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createLaunch(data) {
  return addDoc(collection(db, 'launches'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateLaunch(id, data) {
  return updateDoc(doc(db, 'launches', id), data)
}

export async function deleteLaunch(id) {
  return deleteDoc(doc(db, 'launches', id))
}

/* ---------------- Developers ---------------- */

export async function getAllDevelopers() {
  const snap = await getDocs(collection(db, 'developers'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createDeveloper(data) {
  return addDoc(collection(db, 'developers'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateDeveloper(id, data) {
  return updateDoc(doc(db, 'developers', id), data)
}

export async function deleteDeveloper(id) {
  return deleteDoc(doc(db, 'developers', id))
}

/* ---------------- Contact Submissions ---------------- */

export async function createContactSubmission(data) {
  return addDoc(collection(db, 'contactSubmissions'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function getAllContactSubmissions() {
  const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/* ---------------- Users (for superadmin promotion) ---------------- */

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function setUserRole(uid, role) {
  return updateDoc(doc(db, 'users', uid), { role })
}
