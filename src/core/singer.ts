import musicSdk from '@/utils/musicSdk'
import { deduplicationList, toNewMusicInfo } from '@/utils'

/**
 * 支持查看歌手信息的源
 */
export const SINGER_SUPPORT_SOURCES = ['kg', 'tx', 'wy'] as const
export type SingerSource = typeof SINGER_SUPPORT_SOURCES[number]

export const isSingerSupported = (source: LX.Source): source is SingerSource => {
  return (SINGER_SUPPORT_SOURCES as readonly string[]).includes(source)
}

export interface SingerInfoItem {
  id: string | number
  source: SingerSource
  name: string
}

export interface SingerInfo {
  source: string
  id: string | number
  info: {
    name: string
    desc?: string
    avatar?: string
    img?: string
    gender?: string
  }
  count?: {
    music?: number
    album?: number
  }
}

export interface SingerSongList {
  source: string
  list: LX.Music.MusicInfoOnline[]
  total: number
  page: number
  limit: number
}

export const getSingerInfo = async(source: SingerSource, singerId: string | number): Promise<SingerInfo> => {
  const info = await musicSdk[source]?.singer.getInfo(singerId) as SingerInfo
  return info
}

export const getSingerSongList = async(source: SingerSource, singerId: string | number, page: number, limit = 50): Promise<SingerSongList> => {
  const result = await musicSdk[source]?.singer.getSongList(singerId, page, limit) as {
    source: string
    list: any[]
    total: number
    page: number
    limit: number
  }
  return {
    ...result,
    list: deduplicationList(result.list.map(m => toNewMusicInfo(m)) as LX.Music.MusicInfoOnline[]),
  }
}
