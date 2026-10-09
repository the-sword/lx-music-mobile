import { memo, useEffect, useState } from 'react'
import { View } from 'react-native'
import ImageColors from 'react-native-image-colors'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default memo(() => {
  const musicInfo = usePlayerMusicInfo()
  const [color, setColor] = useState<string | null>(null)

  useEffect(() => {
    const pic = musicInfo.pic
    if (!pic) {
      setColor(null)
      return
    }
    let canceled = false
    void ImageColors.getColors(pic, {
      fallback: '#000000',
      cache: true,
      key: musicInfo.id,
    }).then(result => {
      if (canceled) return
      if (result.platform == 'android') {
        setColor(result.vibrant ?? result.dominant ?? null)
      } else {
        setColor((result.primary as string | undefined) ?? null)
      }
    }).catch(() => {})
    return () => { canceled = true }
  }, [musicInfo.pic])

  if (!color) return null

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={{ ...styles.glow, backgroundColor: hexToRgba(color, 0.32) }} />
      <View style={{ ...styles.topTint, backgroundColor: hexToRgba(color, 0.16) }} />
    </View>
  )
})

const styles = createStyle({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  glow: {
    position: 'absolute',
    top: '8%',
    alignSelf: 'center',
    width: '72%',
    aspectRatio: 1,
    borderRadius: 999,
  },
})
