import { memo } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

import { navigations } from '@/navigation'
import { useTheme } from '@/store/theme/hook'
import { usePlayMusicInfo } from '@/store/player/hook'
import { isSingerSupported } from '@/core/singer'
import { toast } from '@/utils/tools'
import Text from '@/components/common/Text'
import commonState from '@/store/common/state'
import { TextSizes } from '@/theme'

/**
 * Apple Music 风格曲目信息：封面下方，左侧大标题 + 主题色歌手名（可点进歌手页）。
 */
export default memo(() => {
  const theme = useTheme()
  const playMusicInfo = usePlayMusicInfo().musicInfo
  const musicInfo = playMusicInfo == null
    ? null
    : ('metadata' in playMusicInfo ? playMusicInfo.metadata.musicInfo : playMusicInfo)

  const handleJumpToSinger = () => {
    if (musicInfo == null) return
    const singerId = musicInfo.meta.singerIds?.[0]
    const source = musicInfo.source
    if (singerId == null || !isSingerSupported(source)) {
      toast(global.i18n.t('singer_detail_unsupport_tip'))
      return
    }
    navigations.pushSingerDetailScreen(commonState.componentIds.playDetail!, {
      id: singerId,
      source,
      name: musicInfo.singer,
    })
  }

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.name} size={TextSizes.title3}>{musicInfo?.name ?? ''}</Text>
      <TouchableOpacity onPress={handleJumpToSinger} activeOpacity={0.6} hitSlop={4}>
        <Text numberOfLines={1} style={styles.singer} size={TextSizes.subhead} color={theme['c-primary']}>{musicInfo?.singer ?? ''}</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 2,
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: '600',
  },
  singer: {
    marginTop: 2,
  },
})
