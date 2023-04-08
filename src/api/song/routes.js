const routes = (handler) => [
    {
      method: 'POST',
      path: '/songs',
      handler: handler.postsongHandler
    },
    {
      method: 'GET',
      path: '/songs',
      handler: handler.getsongsHandler
    },
    {
      method: 'GET',
      path: '/songs/{id}',
      handler: handler.getsongByIdHandler
    },
    {
      method: 'PUT',
      path: '/songs/{id}',
      handler: handler.putsongByIdHandler
    },
    {
      method: 'DELETE',
      path: '/songs/{id}',
      handler: handler.deletesongByIdHandler
    }
  ]
  
  module.exports = routes