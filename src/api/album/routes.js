const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postalbumHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getalbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putalbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deletealbumByIdHandler,
  },
];
module.exports = routes;
