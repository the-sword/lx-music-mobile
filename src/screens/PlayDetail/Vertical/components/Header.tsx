import { memo, useRef } from 'react'

import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { pop, navigations } from '@/navigation'
import StatusBar from '@/components/common/StatusBar'
import { useTheme } from '@/store/theme/hook'
import { usePlayMusicInfo } from '@/store/player/hook'
import { isSingerSupported } from '@/core/singer'
import { toast } from '@/utils/tools'
import Text from '@/components/common/Text'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT as _HEADER_HEIGHT, NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import commonState from '@/store/common/state'
import SettingPopup, { type SettingPopupType } from '../../components/SettingPopup'
import { useStatusbarHeight } from '@/store/common/hook'
import Btn from './Btn'
import TimeoutExitBtn from './TimeoutExitBtn'

export const HEADER_HEIGHT = scaleSizeH(_HEADER_HEIGHT)


const Title = () => {
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
    <View style={styles.titleContent}>
      <Text numberOfLines={1} style={styles.title}>{musicInfo?.name ?? ''}</Text>
      <TouchableOpacity onPress={handleJumpToSinger}>
        <Text numberOfLines={1} style={styles.title} size={12} color={theme['c-font-label']}>{musicInfo?.singer ?? ''}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default memo(() => {
  const popupRef = useRef<SettingPopupType>(null)
  const statusBarHeight = useStatusbarHeight()

  const back = () => {
    void pop(commonState.componentIds.playDetail!)
  }
  const showSetting = () => {
    popupRef.current?.show()
  }

  return (
    <View style={{ height: HEADER_HEIGHT + statusBarHeight, paddingTop: statusBarHeight }} nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_header}>
      <StatusBar />
      <View style={styles.container}>
        <Btn icon="chevron-left" onPress={back} />
        <Title />
        <TimeoutExitBtn />
        <Btn icon="slider" onPress={showSetting} />
      </View>
      <SettingPopup ref={popupRef} direction="vertical" />
    </View>
  )
})


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'center',
    height: '100%',
  },
  titleContent: {
    flex: 1,
    paddingHorizontal: 5,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // flex: 1,
    // textAlign: 'center',
  },
  icon: {
    paddingLeft: 4,
    paddingRight: 4,
  },
})
