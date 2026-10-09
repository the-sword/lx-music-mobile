import { memo } from 'react'
import { View } from 'react-native'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { confirmDialog, createStyle, exitApp as backHome } from '@/utils/tools'
import { exitApp } from '@/core/common'
import Button from '../../components/Button'

export default memo(() => {
  const t = useI18n()
  const showBackBtn = useSettingValue('common.showBackBtn')
  const showExitBtn = useSettingValue('common.showExitBtn')

  if (!showBackBtn && !showExitBtn) return null

  const handleExit = () => {
    void confirmDialog({
      message: global.i18n.t('exit_app_tip'),
      confirmButtonText: global.i18n.t('list_remove_tip_button'),
    }).then(isExit => {
      if (!isExit) return
      exitApp('Exit Btn')
    })
  }

  return (
    <View style={styles.content}>
      {showBackBtn ? <Button onPress={backHome}>{t('back_home')}</Button> : null}
      {showExitBtn ? <Button onPress={handleExit}>{t('nav_exit')}</Button> : null}
    </View>
  )
})

const styles = createStyle({
  content: {
    marginTop: 8,
    flexDirection: 'row',
  },
})
