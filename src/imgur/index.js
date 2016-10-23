var Nite = require('nite'),
    Imgur = require('./component');

Nite(document.body).render(
  <Imgur clientID={IMGUR_CLIENT_ID}/>
);
