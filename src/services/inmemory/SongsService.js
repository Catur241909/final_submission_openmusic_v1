const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongsService {
  constructor () {
    this._Song = []
  }

  addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16)

    const newSong = {
      id, title, year, genre, performer, duration, albumId
    }
    this._Songs.push(newSong)
    const isSuccess = this._Songs.filter((Song) => Song.id === id).length > 0
    if (!isSuccess) {
      throw new InvariantError('lagu gagal ditambahkan')
    }

    return id
  }

  getSongs () {
    return this._Songs
  }

  getSongById (id) {
    const Song = this._Songs.filter((n) => n.id === id)[0]
    if (!Song) {
      throw new NotFoundError('lagu tidak ditemukan')
    }
    return Song
  }

  editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const index = this._Songs.findIndex((Song) => Song.id === id)

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
    }

    this._Songs[index] = {
      ...this._Songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    }
  }

  deleteSongById (id) {
    const index = this._Songs.findIndex((Song) => Song.id === id)
    if (index === -1) {
      throw new NotFoundError('lagu gagal dihapus. Id tidak ditemukan')
    }
    this._Songs.splice(index, 1)
  }
}
module.exports = SongsService