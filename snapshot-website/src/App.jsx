import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import RequireAdmin from './pages/admin/RequireAdmin'

export default function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  if (loading && !isAdminRoute) return <LoadingScreen />

  if (isAdminRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        } />
      </Routes>
    )
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/our-work" element={<PortfolioPage />} />
          <Route path="/contact"  element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}
