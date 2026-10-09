import { type SingerSource } from '@/core/singer'

interface SingerDetailInfo {
  id: string | number
  source: SingerSource
  list: LX.Music.MusicInfoOnline[]
  page: number
  limit: number
  total: number
  maxPage: number
}

export const singerDetailState: SingerDetailInfo = {
  id: '',
  source: 'kg',
  list: [],
  page: 0,
  limit: 50,
  total: 0,
  maxPage: 0,
}

export const clearSingerDetail = () => {
  singerDetailState.id = ''
  singerDetailState.list = []
  singerDetailState.page = 0
  singerDetailState.total = 0
  singerDetailState.maxPage = 0
}
