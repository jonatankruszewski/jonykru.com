import { useEffect } from 'react'

const ESCAPE_KEY = 27

export const useEscapeKey = (
  callback: (e: { keyCode: number }) => void,
  {
    dependencies = []
  }: {
    dependencies?: (string | number | boolean)[]
    window?: Window | null
  } = {}
) => {
  const onKeyPress = (event: { keyCode: number }) =>
    event.keyCode === ESCAPE_KEY && callback(event)

  useEffect(() => {
    if (!window || !callback) {
      return
    }

    if (!Array.isArray(dependencies)) {
      return
    }

    window.document.addEventListener('keydown', onKeyPress)
    return () => {
      window.document.removeEventListener('keydown', onKeyPress)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies])
}

export default useEscapeKey
