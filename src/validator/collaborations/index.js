const CollaborationsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
  validateCollaborationsPayload: (payload) => {
    const validationResult = CollaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
};

module.exports = CollaborationsValidator;