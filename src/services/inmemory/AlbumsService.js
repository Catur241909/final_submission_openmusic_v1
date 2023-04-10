const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this.Album = [];
  }

  addAlbum({ name, year }) {
    const id = nanoid(16);

    const newAlbum = {
      name, year, id,
    };
    this.Albums.push(newAlbum);
    const isSuccess = this.Albums.filter((Album) => Album.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbumById(id) {
    const Album = this.Albums.filter((n) => n.id === id)[0];
    if (!Album) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return Album;
  }

  getsongsbyalbumId(id) {
    const song = this.Song.filter((album) => album.id === id)[0];
    if (!song) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
    return song;
  }

  editAlbumById(id, { name, year }) {
    const index = this.Albums.findIndex((Album) => Album.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
    }

    this.Albums[index] = {
      ...this.Albums[index],
      name,
      year,
    };
  }

  deleteAlbumById(id) {
    const index = this.Albums.findIndex((Album) => Album.id === id);
    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
    this.Albums.splice(index, 1);
  }
}
module.exports = AlbumsService;
