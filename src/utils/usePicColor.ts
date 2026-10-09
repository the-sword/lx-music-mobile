import { useEffect, useState } from 'react'
import ImageColors from 'react-native-image-colors'

export const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export const usePicColor = (pic: string | undefined | null, key: string) => {
  const [color, setColor] = useState<string | null>(null)

  useEffect(() => {
    if (!pic) {
      setColor(null)
      return
    }
    let canceled = false
    void ImageColors.getColors(pic, {
      fallback: '#000000',
      cache: true,
      key,
    }).then(result => {
      if (canceled) return
      if (result.platform == 'android') {
        setColor(result.vibrant ?? result.dominant ?? null)
      } else if (result.platform == 'ios') {
        setColor(result.primary ?? null)
      } else {
        setColor(result.vibrant ?? result.dominant ?? null)
      }
    }).catch(() => {})
    return () => { canceled = true }
  }, [pic, key])

  return color
}
