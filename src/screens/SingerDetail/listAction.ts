import { setTempList } from '@/core/list'
import { playList } from '@/core/player/player'
import { LIST_IDS } from '@/config/constant'
import { type SingerSource } from '@/core/singer'

export const handlePlay = async(id: string | number, source: SingerSource, list: LX.Music.MusicInfoOnline[], index = 0) => {
  const listId = `${source}__singer_${id}`
  if (!list.length) return
  await setTempList(listId, [...list])
  void playList(LIST_IDS.TEMP, index)
}
