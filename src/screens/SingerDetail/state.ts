import { createContext, useContext } from 'react'
import { type SingerInfoItem } from '@/core/singer'

export type { SingerInfoItem }

export const SingerInfoContext = createContext<SingerInfoItem>({
  id: '',
  source: 'kg',
  name: '',
})

export const useSingerInfo = () => {
  return useContext(SingerInfoContext)
}
