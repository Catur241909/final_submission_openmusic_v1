const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivitiesService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylistActivities(playlistId, { songId }, userId, action) {
    const id = `playlist-activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist Activities Gagal ditambahkan');
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, a.action, a.time FROM playlist_song_activities a
      LEFT JOIN users u ON u.id = a.user_id 
      LEFT JOIN songs s ON s.id = a.song_id
      WHERE a.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Activities gagal diambil');
    }
    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;
