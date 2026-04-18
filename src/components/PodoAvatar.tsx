import { useState } from 'react'

export const PODO_IMAGE_URL = 'https://cdn.jotfor.ms/assets/resources/podo/n_podo_2.png'

type PodoAvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface PodoAvatarProps {
  size?: PodoAvatarSize
  glowing?: boolean
  alt?: string
  className?: string
}

const sizeClassMap: Record<PodoAvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-24 w-24',
  xl: 'h-40 w-40',
}

const PodoAvatar = ({
  size = 'md',
  glowing = false,
  alt = 'Podo',
  className = '',
}: PodoAvatarProps) => {
  const [hasError, setHasError] = useState(false)

  const baseClasses = `${sizeClassMap[size]} rounded-full border border-amber-300 object-cover shadow-sm`
  const glowClasses = glowing
    ? 'ring-4 ring-amber-400/80 ring-offset-2 ring-offset-stone-50 animate-podo-glow'
    : ''

  if (hasError) {
    return (
      <div
        aria-label={alt}
        className={`${sizeClassMap[size]} flex items-center justify-center rounded-full border border-amber-400 bg-amber-600 font-semibold text-white ${glowClasses} ${className}`}
      >
        P
      </div>
    )
  }

  return (
    <img
      src={PODO_IMAGE_URL}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${baseClasses} ${glowClasses} ${className}`}
    />
  )
}

export default PodoAvatar
