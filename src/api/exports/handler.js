const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this.service = exportsService;
    this.playlistsService = playlistsService;
    this.validator = validator;
    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this.validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    await this.playlistsService.verifyPlaylistOwner(playlistId, request.auth.credentials.id);
    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this.service.sendMessage('export:playlist', JSON.stringify(message));
    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
