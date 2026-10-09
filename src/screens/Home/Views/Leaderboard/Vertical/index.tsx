import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'

import MusicList, { type MusicListType } from '../MusicList'
import { getLeaderboardSetting, saveLeaderboardSetting } from '@/utils/data'
import HeaderBar, { type HeaderBarType, type HeaderBarProps } from './HeaderBar'
import { useTheme } from '@/store/theme/hook'
import { BorderRadius } from '@/theme'
import BoardsList, { type BoardsListType, type BoardsListProps } from '../BoardsList'
import { getBoardsList } from '@/core/leaderboard'
import { handleCollect, handlePlay } from '../listAction'
import boardState from '@/store/leaderboard/state'

export default () => {
  const theme = useTheme()
  const [boardsVisible, setBoardsVisible] = useState(false)
  const musicListRef = useRef<MusicListType>(null)
  const isUnmountedRef = useRef(false)
  const boardsListRef = useRef<BoardsListType>(null)
  const headerBarRef = useRef<HeaderBarType>(null)
  const boundInfo = useRef<{ source: LX.OnlineSource, id: string | null }>({ source: 'kw', id: null })
  const boardsRef = useRef<Array<{ id: string, name: string }>>([])

  const handleBoundChange = (source: LX.OnlineSource, id: string) => {
    musicListRef.current?.loadList(source, id)
    void saveLeaderboardSetting({
      source,
      boardId: id,
    })
  }

  const onBoundChange: BoardsListProps['onBoundChange'] = (id) => {
    boundInfo.current.id = id
    headerBarRef.current?.setBound(boundInfo.current.source, id, boardsRef.current.find(b => b.id == id)?.name ?? 'Unknown')
    handleBoundChange(boundInfo.current.source, id)
    setBoardsVisible(false)
  }
  const onPlay: BoardsListProps['onPlay'] = (id) => {
    boundInfo.current.id = id
    void handlePlay(id, boardState.listDetailInfo.list)
  }
  const onCollect: BoardsListProps['onCollect'] = (id, name) => {
    boundInfo.current.id = id
    void handleCollect(id, name, boundInfo.current.source)
  }
  const onShowBound = () => {
    setBoardsVisible(v => !v)
  }
  const onSourceChange: HeaderBarProps['onSourceChange'] = (source) => {
    boundInfo.current.source = source
    void getBoardsList(source).then(list => {
      boardsRef.current = list
      const id = list[0].id
      const name = list[0].name
      boardsListRef.current?.setList(list, id)
      headerBarRef.current?.setBound(source, id, name ?? 'Unknown')
      handleBoundChange(source, id)
    })
  }

  useEffect(() => {
    isUnmountedRef.current = false
    void getLeaderboardSetting().then(({ source, boardId }) => {
      boundInfo.current.source = source
      boundInfo.current.id = boardId
      void getBoardsList(source).then(list => {
        boardsRef.current = list
        const bound = list.find(l => l.id == boardId)
        boardsListRef.current?.setList(list, boardId)
        headerBarRef.current?.setBound(source, boardId, bound?.name ?? 'Unknown')
      })
      musicListRef.current?.loadList(source, boardId)
    })

    return () => {
      isUnmountedRef.current = true
    }
  }, [])


  return (
    <View style={styles.container}>
      <HeaderBar ref={headerBarRef} onShowBound={onShowBound} onSourceChange={onSourceChange} />
      <View style={{ flex: 1 }}>
        <MusicList ref={musicListRef} />
        <View style={{
          ...styles.boardsPanel,
          display: boardsVisible ? 'flex' : 'none',
          backgroundColor: theme['c-content-background'],
        }}>
          <BoardsList
            ref={boardsListRef}
            onBoundChange={onBoundChange}
            onCollect={onCollect}
            onPlay={onPlay}
          />
        </View>
      </View>
    </View>
  )
}

const styles = createStyle({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  boardsPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    margin: 8,
    marginTop: 0,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    elevation: 4,
  },
})
