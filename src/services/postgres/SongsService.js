const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongsToDBModel } = require('../../utils');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs({ title = null, performer = null }) {
    if (title && performer) {
      const result = await this.pool.query(
        `SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' AND lower(performer) LIKE '%${performer}%'`,
      );
      return result.rows;
    }
    if (title || performer) {
      const result = await this.pool.query(
        `SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' OR lower(performer) LIKE '%${performer}%'`,
      );
      return result.rows;
    }
    const result = await this.pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Songs Tidak Ditemukan');
    }
    return result.rows.map(mapSongsToDBModel)[0];
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    // Pemeriksaan dilakukan agar ketika 'duration' & 'albumId' tidak kosong di database
    // tetapi di payload null, maka nilai di database tidak ikut null
    const text = 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4';
    if (duration && albumId) {
      const query = {
        text: text.concat(', duration = $5, album_id = &6 WHERE id = $7 RETURNING id'),
        values: [title, year, genre, performer, duration, albumId, id],
      };
      const result = await this.pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Song Tidak Ditemukan');
      }
    } else if (duration) {
      const query = {
        text: text.concat(', duration = $5 WHERE id = $6 RETURNING id'),
        values: [title, year, genre, performer, duration, id],
      };
      const result = await this.pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Song Tidak Ditemukan');
      }
    } else if (albumId) {
      const query = {
        text: text.concat(', album_id = $5 WHERE id = $6 RETURNING id'),
        values: [title, year, genre, performer, albumId, id],
      };
      const result = await this.pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Song Tidak Ditemukan');
      }
    } else {
      const query = {
        text: text.concat(' WHERE id = $5 RETURNING id'),
        values: [title, year, genre, performer, id],
      };
      const result = await this.pool.query(query);
      if (!result.rows.length) {
        throw new NotFoundError('Song Tidak Ditemukan');
      }
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE  id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Song Tidak Ditemukan');
    }
  }
}

module.exports = SongsService;
