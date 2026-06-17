import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/site'

/**
 * Site-wide floating WhatsApp button. Opens a chat with a general enquiry
 * message prefilled. Sits below modal/drawer overlays (z-40 < z-50).
 */
export function WhatsAppFab() {
  const href = whatsappLink("Hi Aussie Vape, I have a question about your products.")

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-lg transition-all hover:pr-5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  )
}
