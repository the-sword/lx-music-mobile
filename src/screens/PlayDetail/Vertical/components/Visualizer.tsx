import { memo, useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { useIsPlay } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

const BAR_COUNT = 5
const BAR_HEIGHT = 18

export default memo(() => {
  const theme = useTheme()
  const isPlaying = useIsPlay()
  const anims = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))).current

  useEffect(() => {
    if (!isPlaying) {
      anims.forEach(anim => {
        anim.stopAnimation()
        anim.setValue(0.2)
      })
      return undefined
    }
    const loops = anims.map((anim, i) => Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 320 + i * 90,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.15,
          duration: 340 + i * 70,
          useNativeDriver: true,
        }),
      ]),
    ))
    loops.forEach(loop => { loop.start() })
    return () => {
      loops.forEach(loop => { loop.stop() })
    }
  }, [isPlaying, anims])

  return (
    <View style={styles.container} pointerEvents="none">
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 3,
            height: BAR_HEIGHT,
            marginHorizontal: 2.5,
            borderRadius: 2,
            backgroundColor: theme['c-primary'],
            transform: [{ scaleY: anim }],
          }}
        />
      ))}
    </View>
  )
})

const styles = createStyle({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: BAR_HEIGHT + 4,
  },
})
