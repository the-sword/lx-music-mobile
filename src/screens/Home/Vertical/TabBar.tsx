import { useEffect, useRef } from 'react'
import { Animated, View, TouchableOpacity } from 'react-native'
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

const TabItem = ({ id, icon, label, active, activeColor, inactiveColor, onPress }: {
  id: NAV_ID_Type
  icon: string
  label: string
  active: boolean
  activeColor: string
  inactiveColor: string
  onPress: (id: NAV_ID_Type) => void
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.28, duration: 130, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start()
    }
  }, [active, scaleAnim])

  const color = active ? activeColor : inactiveColor
  return (
    <TouchableOpacity style={styles.tab} activeOpacity={0.6} onPress={() => { onPress(id) }}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Icon name={icon} color={color} size={20} />
      </Animated.View>
      <Text size={10} color={color} style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

export default () => {
  const theme = useTheme()
  const t = useI18n()
  const activeId = useNavActiveId()

  const handlePress = (id: NAV_ID_Type) => {
    setNavActiveId(id)
  }

  return (
    <View style={{
      ...styles.tabBar,
      borderTopColor: theme['c-border-background'],
      backgroundColor: theme['c-content-background'],
    }}>
      {TABS.map(tab => (
        <TabItem
          key={tab.id}
          id={tab.id}
          icon={tab.icon}
          label={t(tab.id)}
          active={tab.id === activeId}
          activeColor={theme['c-primary']}
          inactiveColor={theme['c-500']}
          onPress={handlePress}
        />
      ))}
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
