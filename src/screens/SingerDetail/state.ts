import { createContext, useContext } from 'react'
import { type SingerSource } from '@/core/singer'

export interface SingerInfoItem {
  id: string | number
  source: SingerSource
  name: string
}

export const SingerInfoContext = createContext<SingerInfoItem>({
  id: '',
  source: 'kg',
  name: '',
})

export const useSingerInfo = () => {
  return useContext(SingerInfoContext)
}
