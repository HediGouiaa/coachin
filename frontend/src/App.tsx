import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Overview from './pages/Overview'
import Booking from './pages/Booking'
import Events from './pages/Events'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <WhatsAppButton />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Overview />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/events" element={<Events />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  )
}

export default App
