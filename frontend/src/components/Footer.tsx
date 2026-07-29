import { Mail, Phone, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { language } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold">
                C
              </div>
              <h3 className="text-xl font-bold">Coaching Platform</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {getTranslation('professionalCoachingServices', language)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getTranslation('quickLinks', language)}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  {getTranslation('home', language)}
                </a>
              </li>
              <li>
                <a href="/booking" className="hover:text-white transition-colors">
                  {getTranslation('bookSession', language)}
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-white transition-colors">
                  {getTranslation('events', language)}
                </a>
              </li>
              <li>
                <a href="/admin/login" className="hover:text-white transition-colors">
                  {getTranslation('adminDashboard', language)}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getTranslation('contact', language)}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:coach@example.com" className="hover:text-white transition-colors">
                  coach@example.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{getTranslation('followUs', language)}</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center text-gray-400 text-sm">
            <p>&copy; {currentYear} Professional Coaching Platform. {getTranslation('allRightsReserved', language)}.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                {getTranslation('privacyPolicy', language)}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {getTranslation('termsOfService', language)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
