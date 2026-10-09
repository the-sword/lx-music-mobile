import { httpFetch } from '../../request'
// import { decodeName, formatPlayTime, sizeFormate } from '../../index'
// import { signatureParams } from './util'
import { getMusicInfosByList } from './musicInfo'

export default {
  filterAlbum(rawList) {
    return rawList.map((albumInfo) => {
      return {
        name: albumInfo.albumname,
        author: albumInfo.singername,
        img: albumInfo.imgurl ? albumInfo.imgurl.replace('{size}', '480') : null,
        album_id: albumInfo.albumid,
        count: albumInfo.songcount,
        desc: albumInfo.intro,
      }
    })
  },
  async getInfo(singerid) {
    if (singerid == 0) throw new Error('歌手不存在') // kg源某些歌曲在歌手没被kg收录时返回的歌手id为0
    const requestObj = httpFetch(`http://mobiles.kugou.com/api/v5/singer/info?singerid=${singerid}`)
    let { body, statusCode } = await requestObj.promise
    if (statusCode !== 200 || !body.data) throw new Error('获取歌手信息失败')
    return {
      source: 'kg',
      singerid,
      info: {
        name: body.data.singername,
        desc: body.data.intro || body.data.profile,
        img: body.data.imgurl ? body.data.imgurl.replace('{size}', '480') : null,
      },
      count: {
        music: body.data.songcount,
        album: body.data.albumcount,
      },
    }
  },
  async getSongList(singerid, page, limit) {
    if (singerid == 0) throw new Error('歌手不存在') // kg源某些歌曲在歌手没被kg收录时返回的歌手id为0
    const requestObj = httpFetch(`http://mobiles.kugou.com/api/v5/singer/song?singerid=${singerid}&page=${page}&pagesize=${limit}`)
    let { body, statusCode } = await requestObj.promise
    if (statusCode !== 200 || !body.data) throw new Error('获取歌手歌曲列表失败')
    let listData = await getMusicInfosByList(body.data.info)
    return {
      source: 'kg',
      list: listData,
      id: `kg__singer_${singerid}`,
      singerid,
      total: body.data.total,
      allPage: Math.ceil(body.data.total / limit),
      page,
      limit,
    }
  },
  async getAlbumList(singerid, page, limit) {
    if (singerid == 0) throw new Error('歌手不存在') // kg源某些歌曲在歌手没被kg收录时返回的歌手id为0
    const requestObj = httpFetch(`http://mobiles.kugou.com/api/v5/singer/album?singerid=${singerid}&page=${page}&pagesize=${limit}`)
    let { body, statusCode } = await requestObj.promise
    if (statusCode !== 200 || !body.data) throw new Error('获取歌手专辑列表失败')
    return {
      source: 'kg',
      albums: this.filterAlbum(body.data.info),
      singerid,
      total: body.data.total,
      allPage: Math.ceil(body.data.total / limit),
      page,
      limit,
    }
  },
}
