import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Target, Briefcase, Star, ArrowRight } from 'lucide-react'
import api from '../services/api'
import { Coach } from '../types'
import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../utils/translations'

export default function Overview() {
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()

  const fallbackBio = "Je m'appelle Malak Labidi, professeure de langue et de littérature françaises. J'enseigne le français en Tunisie depuis 1998.\n\nMon parcours a été marqué par de nombreuses épreuves qui m'ont poussée à chercher le changement, la connaissance et le bonheur. Face à la maladie, j'ai choisi de relever le défi plutôt que de me résigner. À travers les livres, les formations en ligne et la découverte du monde, j'ai trouvé un nouveau chemin vers l'épanouissement et la joie de vivre.\n\nC'est de cette quête qu'est né ce site, créé avec amour pour partager avec vous mes découvertes et vous accompagner sur le chemin de la connaissance et du bonheur."
  const fallbackPhoto = '/coach.jpg'
  const displayName = 'Malak Labidi'
  const displayTitle = 'Professeure de langue et de littérature françaises'

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const data = await api.getCoachPublicProfile()
        setCoach(data)
      } catch (error) {
        console.error('Failed to fetch coach profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoach()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{getTranslation('loading', language)}</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slideUp">
              <p className="text-primary-600 font-semibold mb-2 uppercase tracking-widest">
                {getTranslation('welcome', language)}
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {displayName}
              </h1>
              <p className="text-2xl text-secondary-600 font-semibold mb-4">
                {displayTitle}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl whitespace-pre-line">
                {fallbackBio}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="btn-primary inline-flex items-center justify-center">
                  {getTranslation('bookASession', language)}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <button className="btn-outline inline-flex items-center justify-center">
                  {getTranslation('learnMore', language)}
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="animate-fadeIn">
              <img
                src={fallbackPhoto}
                alt={displayName}
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{getTranslation('areasOfExpertise', language)}</h2>
            <p className="section-subtitle">
              {getTranslation('specializingInHelpingProfessionals', language)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <Target className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">{getTranslation('careerDevelopment', language)}</h3>
              <p className="text-gray-600">
                {getTranslation('careerDevelopmentDesc', language)}
              </p>
            </div>

            <div className="card">
              <Award className="text-secondary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">{getTranslation('personalGrowth', language)}</h3>
              <p className="text-gray-600">
                {getTranslation('personalGrowthDesc', language)}
              </p>
            </div>

            <div className="card">
              <Briefcase className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">{getTranslation('executiveCoaching', language)}</h3>
              <p className="text-gray-600">
                {getTranslation('executiveCoachingDesc', language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      {coach?.certifications && (
        <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center">{getTranslation('certificationsAndCredentials', language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {coach.certifications.split(',').map((cert, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Star className="text-secondary-600 flex-shrink-0" size={24} />
                  <p className="text-lg text-gray-700">{cert.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">{getTranslation('readyToTransform', language)}</h2>
          <p className="section-subtitle">
            {getTranslation('letWorkTogether', language)}
          </p>

          <Link to="/booking" className="btn-primary inline-block mt-8">
            {getTranslation('scheduleFirstSession', language)}
          </Link>
        </div>
      </section>
    </div>
  )
}
