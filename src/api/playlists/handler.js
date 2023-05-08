const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, playlistActivitiesService, validator) {
    this.playlistsService = playlistsService;
    this.playlistActivitiesService = playlistActivitiesService;
    this.validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this.validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this.playlistsService.addPlaylist(credentialId, request.payload);
    return h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.playlistsService.getPlaylists(credentialId);
    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    }).code(200);
  }

  async deletePlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this.playlistsService.verifyPlaylistOwner(id, credentialId);
    await this.playlistsService.deletePlaylist(id);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    }).code(200);
  }

  async postSongToPlaylistHandler(request, h) {
    this.validator.validateSongOnPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistsService.verifyPlaylistAccess(id, credentialId);
    await this.playlistsService.addSongToPlaylist(id, request.payload);
    await this.playlistActivitiesService.addPlaylistActivities(id, request.payload, credentialId, 'add');
    return h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke Playlist',
    }).code(201);
  }

  async getSongsPlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistsService.verifyPlaylistAccess(id, credentialId);
    const playlistInformation = await this.playlistsService.getPlaylistInformation(id);
    const songs = await this.playlistsService.getSongsPlaylist(id);
    return h.response({
      status: 'success',
      data: {
        playlist: {
          id: playlistInformation.id,
          name: playlistInformation.name,
          username: playlistInformation.username,
          songs,
        },
      },
    }).code(200);
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this.validator.validateSongOnPlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistsService.verifyPlaylistAccess(id, credentialId);
    await this.playlistsService.deleteSongFromPlaylist(id, request.payload);
    await this.playlistActivitiesService.addPlaylistActivities(id, request.payload, credentialId, 'delete');
    return h.response({
      status: 'success',
      message: 'Berhasil Menghapus Song dari playlist',
    }).code(200);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistsService.checkPlaylist(playlistId);
    await this.playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this.playlistActivitiesService.getPlaylistActivities(playlistId);
    return h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    }).code(200);
  }
}

module.exports = PlaylistsHandler;
