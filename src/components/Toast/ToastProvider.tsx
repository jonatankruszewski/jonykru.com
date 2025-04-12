// see: https://codesandbox.io/p/sandbox/framer-motion-x-radix-ui-toast-99i4sc?file=%2Fsrc%2Fstyles.css%3A6%2C6

// const [toasts, setToasts] = useState(new Set<ToastItem>())
//
// const addToast = (message: string) => {
//   const id = crypto.randomUUID()
//   const newToast = { id, message }
//   setToasts(new Set([...toasts, newToast]))
//
//   setTimeout(() => {
//     const filteredToasts = [...toasts].filter((t) => t.id !== id)
//     setToasts(new Set(filteredToasts))
//   }, 3000) // auto-close
// }
//
// const removeToast = (id: string) => {
//   const filteredToasts = [...toasts].filter((t) => t.id !== id)
//   setToasts(new Set(filteredToasts))
// }

// {/*  <AnimatePresence>*/}
// {/*    {[...toasts].map((toast) => (*/}
// {/*      <Toast.Root*/}
// {/*        className="flex justify-between items-center gap-x-[15px] rounded-lg bg-white p-[15px]"*/}
// {/*        key={toast.id}*/}
// {/*        asChild*/}
// {/*        forceMount*/}
// {/*        onOpenChange={(open) => {*/}
// {/*          // if (!open) {*/}
// {/*          //   removeToast(toast.id)*/}
// {/*          // }*/}
// {/*        }}*/}
// {/*      >*/}
// {/*        <motion.div*/}
// {/*          initial={{ opacity: 0, x: 100 }}*/}
// {/*          animate={{ opacity: 1, x: 0 }}*/}
// {/*          exit={{ opacity: 0 }}*/}
// {/*          transition={{ duration: 0.2 }}*/}
// {/*          className="flex justify-between items-center gap-x-[15px] rounded-lg bg-white p-[15px] w-full shadow"*/}
// {/*        >*/}
// {/*          <Toast.Title className="flex gap-3 items-center text-[15px] font-medium text-slate12">*/}
// {/*            <Check className="text-green-500" size={28} />*/}
// {/*            {toast.message}*/}
// {/*          </Toast.Title>*/}
// {/*          <Toast.Action asChild altText="Close">*/}
// {/*            <button*/}
// {/*              onClick={() => removeToast(toast.id)}*/}
// {/*              className="cursor-pointer ml-auto"*/}
// {/*            >*/}
// {/*              <X*/}
// {/*                className="text-slate-500 hover:text-slate-900"*/}
// {/*                size={28}*/}
// {/*              />*/}
// {/*            </button>*/}
// {/*          </Toast.Action>*/}
// {/*        </motion.div>*/}
// {/*      </Toast.Root>*/}
// {/*    ))}*/}
// {/*  </AnimatePresence>*/}
// {/*  <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 outline-none [--viewport-padding:_25px]" />*/}
// {/*</Toast.Provider>*/}
