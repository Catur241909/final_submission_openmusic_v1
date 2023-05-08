const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateSongsPayload(request.payload);
    const songId = await this.service.addSong(request.payload);
    return h.response({
      status: 'success',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(request, h) {
    const songs = await this.service.getSongs(request.query);
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    }).code(200);
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    }).code(200);
  }

  async putSongByIdHandler(request, h) {
    this.validator.validateSongsPayload(request.payload);
    const { id } = request.params;
    await this.service.editSongById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Song Berhasil Update',
    }).code(200);
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'Songs Berhasil di Delete',
    }).code(200);
  }
}

module.exports = SongsHandler;
