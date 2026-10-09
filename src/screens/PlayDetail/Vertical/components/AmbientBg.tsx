import { memo, useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { usePlayerMusicInfo, useIsPlay } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'
import { hexToRgba, usePicColor } from '@/utils/usePicColor'

export default memo(() => {
  const musicInfo = usePlayerMusicInfo()
  const color = usePicColor(musicInfo.pic, musicInfo.id)
  const isPlaying = useIsPlay()
  const breathAnim = useRef(new Animated.Value(0.32)).current

  useEffect(() => {
    if (isPlaying) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 0.5,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(breathAnim, {
            toValue: 0.32,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      )
      loop.start()
      return () => { loop.stop() }
    } else {
      breathAnim.stopAnimation()
      breathAnim.setValue(0.32)
    }
    return undefined
  }, [isPlaying, breathAnim])

  if (!color) return null

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={{ ...styles.glow, backgroundColor: color, opacity: breathAnim }} />
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
