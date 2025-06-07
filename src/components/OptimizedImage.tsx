import { useEffect, useLayoutEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  preload?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  width = 0,
  height = 0,
  className = '',
  priority = false,
  preload = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [actualSrc, setActualSrc] = useState(src)
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px'
  })

  useEffect(() => {
    if (priority || preload || inView) {
      setActualSrc(src)
    }
  }, [src, priority, preload, inView])

  useLayoutEffect(() => {
    if (preload && typeof window !== 'undefined') {
      const linkEl = document.createElement('link')
      linkEl.rel = 'preload'
      linkEl.as = 'image'
      linkEl.href = src
      document.head.appendChild(linkEl)

      return () => {
        document.head.removeChild(linkEl)
      }
    }
  }, [src, preload])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className} ${
        isLoaded ? 'image-loaded' : 'image-loading'
      }`}
      style={{
        width: width || 'auto',
        height: height || 'auto',
        background: '#f0f0f0' // Placeholder color
      }}
    >
      {actualSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={actualSrc}
          alt={alt}
          width={width || undefined}
          height={height || undefined}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </div>
  )
}
