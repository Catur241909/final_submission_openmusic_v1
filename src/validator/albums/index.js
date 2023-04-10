const { albumPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const albumsValidator = {
  validatealbumPayloads: (payload) => {
    const validationResult = albumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = albumsValidator;
