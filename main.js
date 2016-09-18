/*/ polyfills /*/

require('babel-polyfill');

/*/ app /*/

var Nite = require('nite');

Nite(document.head).render(
  <frag>
    <title>Nite</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
  </frag>
);

Nite(document.body).render({
  controller: require('./src/controller'),
  view: require('./src/view')
});
