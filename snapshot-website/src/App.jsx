import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import RequireAdmin from './pages/admin/RequireAdmin'

export default function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    // Quick 600ms branded entrance for public visitors
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading && !isAdminRoute && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {isAdminRoute ? (
        <Routes>
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Dashboard Route at /admin */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />

          {/* Alias /admin/dashboard -> redirect to /admin */}
          <Route
            path="/admin/dashboard"
            element={<Navigate to="/admin" replace />}
          />

          {/* Fallback for unknown /admin/* -> /admin */}
          <Route
            path="/admin/*"
            element={<Navigate to="/admin" replace />}
          />
        </Routes>
      ) : (
        <>
          <CustomCursor />
          <Navbar />
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/our-work" element={<Navigate to="/#our-work" replace />} />
            <Route path="/contact"  element={<ContactPage />} />
            {/* Catch-all for public routes */}
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  )
}
