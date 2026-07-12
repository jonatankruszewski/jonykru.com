'use client'

import { Check, X } from 'lucide-react'
import { Toast } from 'radix-ui'
import { useI18n } from '@/context/i18nContext'

interface SuccessToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SuccessToast = ({ open, onOpenChange }: SuccessToastProps) => {
  const { t, isRTL } = useI18n()

  return (
    <Toast.Provider swipeDirection={isRTL ? 'left' : 'right'}>
      <Toast.Root
        open={open}
        onOpenChange={onOpenChange}
        className="flex items-center gap-4 border border-ink bg-canvas p-5 min-w-[320px] max-w-[420px]"
      >
        <span
          className="flex items-center justify-center w-9 h-9 bg-accent text-accent-ink shrink-0"
          aria-hidden
        >
          <Check size={18} strokeWidth={3} />
        </span>

        <Toast.Title className="flex-1 min-w-0 text-ink font-semibold">
          {t('contact.toast.success')}
        </Toast.Title>

        <Toast.Action asChild altText={t('nav.close')}>
          <button
            type="button"
            aria-label={t('nav.close')}
            onClick={() => onOpenChange(false)}
            className="shrink-0 text-ink-muted hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-0 end-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-3 p-6 outline-none" />
    </Toast.Provider>
  )
}

export default SuccessToast
