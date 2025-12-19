'use client'

import { Button } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
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
      <AnimatePresence>
        {open && (
          <Toast.Root
            key={crypto.randomUUID()}
            asChild
            forceMount
            className="group"
            open={open}
            onOpenChange={onOpenChange}
          >
            <motion.div
              layoutId={crypto.randomUUID()}
              initial={{ opacity: 0, x: isRTL ? -100 : 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRTL ? -100 : 100, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a2e] dark:to-[#16162a] rounded-2xl p-5 shadow-lg shadow-gray-900/10 dark:shadow-black/50 border border-gray-200/80 dark:border-gray-700/50 backdrop-blur-sm min-w-[320px] max-w-[420px]"
            >
              {/* Success Icon with Background */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 shadow-md shadow-green-500/20 dark:shadow-green-500/30">
                  <Check className="text-white" size={20} strokeWidth={3} />
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <Toast.Title className="text-base font-semibold text-gray-900 dark:text-white leading-tight">
                  {t('contact.toast.success')}
                </Toast.Title>
              </div>

              {/* Close Button */}
              <Toast.Action asChild altText="Close">
                <Button
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 active:scale-95 transition-all duration-200 cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  <X size={18} strokeWidth={2.5} />
                </Button>
              </Toast.Action>
            </motion.div>
          </Toast.Root>
        )}
      </AnimatePresence>
      <Toast.Viewport
        className={`fixed bottom-0 ${isRTL ? 'left-0' : 'right-0'} z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-3 p-6 outline-none`}
      />
    </Toast.Provider>
  )
}

export default SuccessToast

