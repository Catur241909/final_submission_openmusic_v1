const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistsPayloadSchema, SongOnPlaylistSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
  validateSongOnPlaylistPayload: (payload) => {
    const validationResult = SongOnPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
};

module.exports = PlaylistsValidator;
