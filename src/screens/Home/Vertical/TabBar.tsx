import { View, TouchableOpacity } from 'react-native'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId } from '@/store/common/hook'
import { setNavActiveId } from '@/core/common'
import { useI18n } from '@/lang'
import { type NAV_ID_Type } from '@/config/constant'
import { createStyle } from '@/utils/tools'
import { BorderWidths } from '@/theme'

const TABS: ReadonlyArray<{ id: NAV_ID_Type, icon: string }> = [
  { id: 'nav_love', icon: 'love' },
  { id: 'nav_songlist', icon: 'album' },
  { id: 'nav_top', icon: 'leaderboard' },
  { id: 'nav_search', icon: 'search-2' },
  { id: 'nav_setting', icon: 'setting' },
]

export default () => {
  const theme = useTheme()
  const t = useI18n()
  const activeId = useNavActiveId()

  const handlePress = (id: NAV_ID_Type) => {
    setNavActiveId(id)
    global.app_event.changeMenuVisible(false)
  }

  return (
    <View style={{
      ...styles.tabBar,
      borderTopColor: theme['c-border-background'],
      backgroundColor: theme['c-content-background'],
    }}>
      {TABS.map(tab => {
        const active = tab.id === activeId
        const color = active ? theme['c-primary'] : theme['c-500']
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} activeOpacity={0.6} onPress={() => { handlePress(tab.id) }}>
            <Icon name={tab.icon} color={color} size={20} />
            <Text size={10} color={color} style={styles.label}>{t(tab.id)}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = createStyle({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: BorderWidths.normal2,
    paddingTop: 4,
    paddingBottom: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  label: {
    marginTop: 2,
  },
})
