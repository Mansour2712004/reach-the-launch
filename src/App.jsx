import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import AllLaunches from './pages/AllLaunches'
import LaunchDetail from './pages/LaunchDetail'
import Developers from './pages/Developers'
import DeveloperPage from './pages/DeveloperPage'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './pages/AdminLayout'
import AdminHome from './pages/AdminHome'
import AdminLaunches from './pages/AdminLaunches'
import AdminLaunchForm from './pages/AdminLaunchForm'
import AdminDevelopers from './pages/AdminDevelopers'
import AdminSubmissions from './pages/AdminSubmissions'
import AdminSpecialOffer from './pages/AdminSpecialOffer'
import AdminUsers from './pages/AdminUsers'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<AllLaunches />} />
          <Route path="/launch/:id" element={<LaunchDetail />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/developers/:id" element={<DeveloperPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route
              path="launches"
              element={
                <ProtectedRoute requirePermission="launches">
                  <AdminLaunches />
                </ProtectedRoute>
              }
            />
            <Route
              path="launches/new"
              element={
                <ProtectedRoute requirePermission="launches">
                  <AdminLaunchForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="launches/:id/edit"
              element={
                <ProtectedRoute requirePermission="launches">
                  <AdminLaunchForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="developers"
              element={
                <ProtectedRoute requirePermission="developers">
                  <AdminDevelopers />
                </ProtectedRoute>
              }
            />
            <Route
              path="submissions"
              element={
                <ProtectedRoute requirePermission="submissions">
                  <AdminSubmissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="special-offer"
              element={
                <ProtectedRoute requirePermission="offers">
                  <AdminSpecialOffer />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requireRole="superadmin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
