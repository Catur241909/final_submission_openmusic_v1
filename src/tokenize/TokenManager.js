const Jwt = require('@hapi/jwt');

const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken); // decoded refresh token to artifacts
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY); // cek Signature

      const { payload } = artifacts.decoded; // decode kembali
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
