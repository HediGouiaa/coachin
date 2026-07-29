import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890'
  const message = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello, I would like to know more about your coaching services.'

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-fadeIn"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  )
}
