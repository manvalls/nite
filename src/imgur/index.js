var Nite = require('nite');

Nite(document.body).render({
  controller: require('./controller'),
  view: require('./view'),
  clientID: IMGUR_CLIENT_ID
});
