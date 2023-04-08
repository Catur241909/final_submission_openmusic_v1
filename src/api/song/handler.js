const ClientError = require('../../exceptions/ClientError')

class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postsongHandler = this.postsongHandler.bind(this)
    this.getsongsHandler = this.getsongsHandler.bind(this)
    this.getsongByIdHandler = this.getsongByIdHandler.bind(this)
    this.putsongByIdHandler = this.putsongByIdHandler.bind(this)
    this.deletesongByIdHandler = this.deletesongByIdHandler.bind(this)
  }

  async postsongHandler (request, h) {
    try {
      this._validator.validatesongPayloads(request.payload)
      const { title = 'untitled', year, genre, performer, duration, albumId } = request.payload
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
      const response = h.response({
        status: 'success',
        message: 'lagu berhasil ditambahkan',
        data: {
          songId
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

  async getsongsHandler () {
    const songs = await this._service.getSongs()
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getsongByIdHandler (request, h) {
    try {
      const { id } = request.params
      const song = await this._service.getSongById(id)
      return {
        status: 'success',
        data: {
          song
        }
      }
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

  async putsongByIdHandler (request, h) {
    try {
      this._validator.validatesongPayloads(request.payload)
      const { id } = request.params
      await this._service.editSongById(id, request.payload)
      return {
        status: 'success',
        message: 'lagu berhasil diperbarui'
      }
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

  async deletesongByIdHandler (request, h) {
    try {
      const { id } = request.params
      await this._service.deleteSongById(id)
      return {
        status: 'success',
        message: 'lagu berhasil dihapus'
      }
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
module.exports = SongsHandler