/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  name,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  name,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { mapDBToModel };
