const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this.collaborationsService = collaborationsService;
    this.validator = validator;
    this.playlistsService = playlistsService;
    this.usersService = usersService;
    autoBind(this);
  }

  async postCollaborationsHandler(request, h) {
    this.validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.usersService.checkUser(userId);
    await this.playlistsService.checkPlaylist(playlistId);
    const collaborationId = await this.collaborationsService.addCollaboration(request.payload);
    return h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationsHandler(request, h) {
    this.validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.usersService.checkUser(userId);
    await this.playlistsService.checkPlaylist(playlistId);
    await this.collaborationsService.deleteCollaborations(request.payload);
    return h.response({
      status: 'success',
      message: 'Berhasil Menghapus Collaborations',
    }).code(200);
  }
}

module.exports = CollaborationsHandler;
