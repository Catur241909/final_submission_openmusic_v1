const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapPlaylistToDBModel } = require('../../utils');

class PlaylistsService {
  constructor(songsService, collaborationsService) {
    this.pool = new Pool();
    this.songsService = songsService;
    this.collaborationsService = collaborationsService;
  }

  async addPlaylist(owner, { name }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal dimasukan');
    }
    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE collaborations.user_id = $1 OR playlists.owner = $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows.map(mapPlaylistToDBModel);
  }

  // check playlist exist or not
  async checkPlaylist(id) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    try {
      const result = await this.pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Playlist tidak Ditemukan');
      }
    } catch (error) {
      throw new InvariantError(error);
    }
  }

  async addSongToPlaylist(playlistId, { songId }) {
    await this.songsService.getSongById(songId);
    const id = `playlist_songs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Songs gagal ditambahkan ke Playlist');
    }
  }

  async getPlaylistInformation(playlistId) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      INNER JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  async getSongsPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('playlist tidak ditemukan');
    }
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, { songId }) {
    await this.songsService.getSongById(songId);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2',
      values: [songId, playlistId],
    };
    await this.pool.query(query);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }
      try {
        await this.collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
    }
  }
}

module.exports = PlaylistsService;
