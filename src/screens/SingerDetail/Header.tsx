import { forwardRef, useImperativeHandle, useState } from 'react'
import { View } from 'react-native'
import { BorderWidths } from '@/theme'
import ActionBar from './ActionBar'
import { scaleSizeW } from '@/utils/pixelRatio'
import { useTheme } from '@/store/theme/hook'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import Image from '@/components/common/Image'
import { useSingerInfo } from './state'
import { useStatusbarHeight } from '@/store/common/hook'

const IMAGE_WIDTH = scaleSizeW(70)


const Pic = ({ imgUrl }: { imgUrl?: string }) => {
  return (
    <View style={{ ...styles.listItemImg, width: IMAGE_WIDTH, height: IMAGE_WIDTH }}>
      <Image url={imgUrl} style={{ flex: 1, borderRadius: 4 }} />
    </View>
  )
}

export interface HeaderType {
  setInfo: (info: DetailInfo) => void
}
export interface DetailInfo {
  name: string
  desc: string
  count: string
  imgUrl?: string
}

export default forwardRef<HeaderType, { componentId: string }>(({ componentId }, ref) => {
  const statusBarHeight = useStatusbarHeight()
  const theme = useTheme()
  const info = useSingerInfo()
  const [detailInfo, setDetailInfo] = useState<DetailInfo>({ name: info.name, desc: '', count: '', imgUrl: undefined })

  useImperativeHandle(ref, () => ({
    setInfo(info) {
      setDetailInfo(info)
    },
  }), [])

  return (
    <View style={{ ...styles.container, paddingTop: statusBarHeight, borderBottomColor: theme['c-border-background'] }}>
      <View style={{ flexDirection: 'row', flexGrow: 0, flexShrink: 0, padding: 10 }}>
        <Pic imgUrl={detailInfo.imgUrl} />
        <View style={{ flexDirection: 'column', flexGrow: 1, flexShrink: 1, paddingLeft: 5 }}>
          <Text size={14} numberOfLines={ 1 }>{detailInfo.name}</Text>
          <Text size={12} color={theme['c-font-label']} numberOfLines={ 1 }>{detailInfo.count}</Text>
          <View style={{ flexGrow: 0, flexShrink: 1 }}>
            <Text size={13} color={theme['c-font-label']} numberOfLines={ 4 }>{detailInfo.desc}</Text>
          </View>
        </View>
      </View>
      <ActionBar />
    </View>
  )
})

const styles = createStyle({
  container: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    borderBottomWidth: BorderWidths.normal,
  },
  listItemImg: {
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
  },
})
