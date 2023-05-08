const InvariantError = require('../../exceptions/InvariantError');
const { AlbumsPayloadSchema, ImageHeadersSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumsPayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
  validateCoverHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
};

module.exports = AlbumsValidator;
