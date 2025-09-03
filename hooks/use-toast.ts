import { toast as sonnerToast } from 'sonner'

type ToastVariant = 'default' | 'destructive' | 'success'

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
    const message = description ? `${title}: ${description}` : title

    switch (variant) {
      case 'destructive':
        sonnerToast.error(message)
        break
      case 'success':
        sonnerToast.success(message)
        break
      default:
        sonnerToast.info(message)
    }
  }

  return { toast }
}
