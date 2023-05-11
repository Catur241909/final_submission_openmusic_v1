const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this.service = albumsService;
    this.storageService = storageService;
    this.validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.validator.validateAlbumsPayload(request.payload);
    const albumId = await this.service.addAlbum(request.payload);
    return h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this.service.getAlbumById(id);
    const songs = await this.service.getSongsByAlbumId(id);
    return h.response({
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl: album.cover,
          songs,
        },
      },
    }).code(200);
  }

  async putAlbumByIdHandler(request, h) {
    this.validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;
    await this.service.editAlbumById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Berhasil Update Album',
    }).code(200);
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteAlbumById(id);
    return h.response({
      status: 'success',
      message: 'Berhasil Delete Album',
    }).code(200);
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this.validator.validateCoverHeaders(cover.hapi.headers);
    const filename = await this.storageService.writeFile(cover, cover.hapi);
    await this.service.addCoverAlbum(id, `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`);
    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.getAlbumById(id);
    await this.service.addLikeDislikeAlbum(id, credentialId);
    return h.response({
      status: 'success',
      message: 'Berhasil like Album',
    }).code(201);
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    await this.service.getAlbumById(id);
    const result = await this.service.getLikes(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: result.likes,
      },
    });
    response.code(200);
    response.header('X-Data-Source', result.source);
    return response;
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.getAlbumById(id);
    await this.service.deleteLikes(id, credentialId);
    return h.response({
      status: 'success',
      message: 'Batal menyukai album',
    }).code(200);
  }
}

module.exports = AlbumsHandler;
