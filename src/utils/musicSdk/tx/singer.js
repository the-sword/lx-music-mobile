import { httpFetch } from '../../request'

import { formatPlayTime, sizeFormate } from '../../index'
import { formatSingerName } from '../utils'

export const filterMusicInfoItem = item => {
  const types = []
  const _types = {}
  if (item.file.size_128mp3 != 0) {
    let size = sizeFormate(item.file.size_128mp3)
    types.push({ type: '128k', size })
    _types['128k'] = {
      size,
    }
  }
  if (item.file.size_320mp3 !== 0) {
    let size = sizeFormate(item.file.size_320mp3)
    types.push({ type: '320k', size })
    _types['320k'] = {
      size,
    }
  }
  if (item.file.size_flac !== 0) {
    let size = sizeFormate(item.file.size_flac)
    types.push({ type: 'flac', size })
    _types.flac = {
      size,
    }
  }
  if (item.file.size_hires !== 0) {
    let size = sizeFormate(item.file.size_hires)
    types.push({ type: 'flac24bit', size })
    _types.flac24bit = {
      size,
    }
  }

  const albumId = item.album.id ?? ''
  const albumMid = item.album.mid ?? ''
  const albumName = item.album.name ?? ''
  return {
    source: 'tx',
    singer: formatSingerName(item.singer, 'name'),
    singerIds: item.singer?.map(s => s.mid).filter(Boolean),
    name: item.title,
    albumName,
    albumId,
    albumMid,
    interval: formatPlayTime(item.interval),
    songId: item.id,
    songmid: item.mid,
    strMediaMid: item.file.media_mid,
    img: (albumId === '' || albumId === '空')
      ? item.singer?.length ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg` : ''
      : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${albumMid}.jpg`,
    types,
    _types,
    typeUrl: {},
  }
}


/**
 * 创建一个适用于TX的Http请求
 * @param {*} data
 * @param {*} retryNum
 */
const createMusicuFetch = async(data, retryNum = 0) => {
  if (retryNum > 2) throw new Error('try max num')

  let result
  try {
    result = await httpFetch('https://u.y.qq.com/cgi-bin/musicu.fcg', {
      method: 'POST',
      body: {
        comm: {
          cv: 4747474,
          ct: 24,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          uin: 0,
        },
        ...data,
      },
      headers: {
        'User-Angent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
      },
    }).promise
  } catch (err) {
    console.log(err)
    return createMusicuFetch(data, ++retryNum)
  }
  if (result.statusCode !== 200 || result.body.code != 0) return createMusicuFetch(data, ++retryNum)

  return result.body
}

export default {
  /**
   * 获取歌手信息
   * 歌手详情接口已失效，改为通过歌曲、专辑列表接口获取名字与数量
   * @param {*} id
   */
  async getInfo(id) {
    const [songResult, albumResult] = await Promise.all([
      this.getSongList(id, 1, 1),
      this.getAlbumList(id, 1, 1),
    ])

    let name = ''
    const firstSong = songResult.rawList?.[0]?.songInfo
    name = firstSong?.singer?.find(s => s.mid == id)?.name ?? firstSong?.singer?.[0]?.name ?? ''

    return {
      source: 'tx',
      id,
      info: {
        name,
        desc: '',
        avatar: `https://y.gtimg.cn/music/photo_new/T001R500x500M000${id}.jpg`,
      },
      count: {
        music: songResult.total,
        album: albumResult.total,
      },
    }
  },
  /**
   * 获取歌手专辑列表
   * @param {*} id
   * @param {*} page
   * @param {*} limit
   */
  getAlbumList(id, page = 1, limit = 10) {
    return createMusicuFetch({
      req: {
        module: 'music.musichallAlbum.AlbumListServer',
        method: 'GetAlbumList',
        param: {
          singerMid: id,
          order: 0,
          begin: (page - 1) * limit,
          num: limit,
          songNumTag: 0,
          singerID: 0,
        },
      },
    }).then(body => {
      if (body.req.code != 0) throw new Error('get singer album faild.')

      const list = this.filterAlbumList(body.req.data.albumList)
      return {
        source: 'tx',
        list,
        limit,
        page,
        total: body.req.data.total,
      }
    })
  },
  /**
   * 获取歌手歌曲列表
   * @param {*} id
   * @param {*} page
   * @param {*} limit
   */
  async getSongList(id, page = 1, limit = 100) {
    return createMusicuFetch({
      req: {
        module: 'musichall.song_list_server',
        method: 'GetSingerSongList',
        param: {
          singerMid: id,
          order: 1,
          begin: (page - 1) * limit,
          num: limit,
        },
      },
    }).then(body => {
      if (body.req.code != 0) throw new Error('get singer song list faild.')

      const list = this.filterSongList(body.req.data.songList)
      return {
        source: 'tx',
        list,
        rawList: body.req.data.songList,
        limit,
        page,
        total: body.req.data.totalNum,
      }
    })
  },
  filterAlbumList(raw) {
    return raw.map(item => {
      return {
        id: item.albumID,
        mid: item.albumMid,
        count: item.totalNum,
        info: {
          name: item.albumName,
          author: item.singerName,
          img: `https://y.gtimg.cn/music/photo_new/T002R500x500M000${item.albumMid}.jpg`,
          desc: null,
        },
      }
    })
  },
  filterSongList(raw) {
    return raw.map(item => {
      return filterMusicInfoItem(item.songInfo)
    })
  },
}
