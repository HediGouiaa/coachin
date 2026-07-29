import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Globe size={18} className="text-gray-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  )
}
