var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('wrappers', function*(){
  var nite = Nite();

  nite.addons.echo = nite => nite;
  assert.strictEqual(nite.addon('echo'), nite);

  nite.addons.constructor = class {

    constructor(nite){
      this.nite = nite;
    }

  };

  assert.strictEqual(nite.addon('constructor').nite, nite);

});
