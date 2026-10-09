import { memo } from 'react'
import { View } from 'react-native'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'
import { hexToRgba, usePicColor } from '@/utils/usePicColor'

export default memo(() => {
  const musicInfo = usePlayerMusicInfo()
  const color = usePicColor(musicInfo.pic, musicInfo.id)

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
