/* eslint-disable camelcase */
const mapAlbumsToDBModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapSongsToDBModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapPlaylistToDBModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = { mapAlbumsToDBModel, mapSongsToDBModel, mapPlaylistToDBModel };
