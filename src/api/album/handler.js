const ClientError = require('../../exceptions/ClientError')

class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postalbumHandler = this.postalbumHandler.bind(this)
    this.getalbumByIdHandler = this.getalbumByIdHandler.bind(this)
    this.putalbumByIdHandler = this.putalbumByIdHandler.bind(this)
    this.deletealbumByIdHandler = this.deletealbumByIdHandler.bind(this)
  }

  async postalbumHandler (request, h) {
    try {
      this._validator.validatealbumPayloads(request.payload)
      const { name = 'untitled', year } = request.payload
      const albumId = await this._service.addAlbum({ name, year })
      const response = h.response({
        status: 'success',
        message: 'album berhasil ditambahkan',
        data: {
          albumId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getalbumByIdHandler (request, h) {
    try {
      const { id, albumId } = request.params
      const albumdata = await this._service.getAlbumById(id)
      const songs = await this._service.getsongsbyalbumId(albumId)
      const response = h.response({
        status: 'success',
        message: 'berhasil mendapatkan album',
        data: {
          ...albumdata,
          songs
        }
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async putalbumByIdHandler (request, h) {
    try {
      await this._validator.validatealbumPayloads(request.payload)
      const { id } = request.params
      await this._service.editAlbumById(id, request.payload)
      const response = h.response({
        status: 'success',
        message: 'album berhasil diubah'
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deletealbumByIdHandler (request, h) {
    try {
      const { id } = request.params
      await this._service.deleteAlbumById(id)
      const response = h.response({
        status: 'success',
        message: 'album berhasil dihapus'
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}
module.exports = AlbumsHandler