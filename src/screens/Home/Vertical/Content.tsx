import { View } from 'react-native'
import Header from './Header'
import Main from './Main'

const Content = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Main />
    </View>
  )
}

export default Content
