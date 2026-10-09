import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import OnlineList, { type OnlineListType, type OnlineListProps } from '@/components/OnlineList'
import { getSingerInfo, getSingerSongList } from '@/core/singer'
import { handlePlay } from './listAction'
import Header, { type HeaderType } from './Header'
import { useSingerInfo } from './state'
import { singerDetailState, clearSingerDetail } from './detailState'
import { deduplicationList } from '@/utils'

export interface MusicListProps {
  componentId: string
}

export interface MusicListType {
  loadList: (source: LX.OnlineSource, singerId: string | number) => void
}

const PAGE_LIMIT = 50

export default forwardRef<MusicListType, MusicListProps>(({ componentId }, ref) => {
  const listRef = useRef<OnlineListType>(null)
  const headerRef = useRef<HeaderType>(null)
  const isUnmountedRef = useRef(false)
  const info = useSingerInfo()

  const updateHeaderInfo = async() => {
    try {
      const detail = await getSingerInfo(info.source, info.id)
      if (isUnmountedRef.current) return
      headerRef.current?.setInfo({
        name: detail.info.name || info.name,
        desc: detail.info.desc ?? '',
        count: detail.count?.music != null ? global.i18n.t('singer_detail_song_count', { num: detail.count.music }) : '',
        imgUrl: detail.info.avatar ?? detail.info.img,
      })
    } catch (err) {
      if (isUnmountedRef.current) return
      headerRef.current?.setInfo({
        name: info.name,
        desc: '',
        count: '',
        imgUrl: undefined,
      })
    }
  }

  useImperativeHandle(ref, () => ({
    async loadList(source, singerId) {
      clearSingerDetail()
      singerDetailState.id = singerId
      singerDetailState.source = info.source
      listRef.current?.setList([])
      listRef.current?.setStatus('loading')
      headerRef.current?.setInfo({ name: info.name, desc: '', count: '', imgUrl: undefined })
      void updateHeaderInfo()
      return getSingerSongList(info.source, singerId, 1, PAGE_LIMIT).then((result) => {
        singerDetailState.list = result.list
        singerDetailState.page = result.page
        singerDetailState.limit = result.limit
        singerDetailState.total = result.total
        singerDetailState.maxPage = Math.ceil(result.total / result.limit)
        if (isUnmountedRef.current) return
        requestAnimationFrame(() => {
          listRef.current?.setList(result.list)
          listRef.current?.setStatus(singerDetailState.maxPage <= 1 ? 'end' : 'idle')
        })
      }).catch(() => {
        if (isUnmountedRef.current) return
        listRef.current?.setStatus('error')
      })
    },
  }))

  useEffect(() => {
    isUnmountedRef.current = false
    return () => {
      isUnmountedRef.current = true
    }
  }, [])


  const handlePlayList: OnlineListProps['onPlayList'] = (index) => {
    void handlePlay(info.id, info.source, singerDetailState.list, index)
  }
  const handleRefresh: OnlineListProps['onRefresh'] = () => {
    listRef.current?.setStatus('refreshing')
    void updateHeaderInfo()
    getSingerSongList(info.source, info.id, 1, PAGE_LIMIT).then((result) => {
      singerDetailState.list = result.list
      singerDetailState.page = result.page
      singerDetailState.total = result.total
      singerDetailState.maxPage = Math.ceil(result.total / result.limit)
      if (isUnmountedRef.current) return
      listRef.current?.setList(result.list)
      listRef.current?.setStatus(singerDetailState.maxPage <= 1 ? 'end' : 'idle')
    }).catch(() => {
      listRef.current?.setStatus('error')
    })
  }
  const handleLoadMore: OnlineListProps['onLoadMore'] = () => {
    listRef.current?.setStatus('loading')
    const page = singerDetailState.list.length ? singerDetailState.page + 1 : 1
    getSingerSongList(info.source, info.id, page, PAGE_LIMIT).then((result) => {
      singerDetailState.list = deduplicationList([...singerDetailState.list, ...result.list])
      singerDetailState.page = result.page
      singerDetailState.total = result.total
      singerDetailState.maxPage = Math.ceil(result.total / result.limit)
      if (isUnmountedRef.current) return
      listRef.current?.setList(singerDetailState.list, true)
      listRef.current?.setStatus(singerDetailState.maxPage <= page ? 'end' : 'idle')
    }).catch(() => {
      listRef.current?.setStatus('error')
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const header = useMemo(() => <Header ref={headerRef} componentId={componentId} />, [])

  return <OnlineList
    ref={listRef}
    onPlayList={handlePlayList}
    onRefresh={handleRefresh}
    onLoadMore={handleLoadMore}
    ListHeaderComponent={header}
  />
})
