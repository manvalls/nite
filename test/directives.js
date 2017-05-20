var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('directives',function*(){
  var d = document.createElement('div'),
      nite = Nite(d),
      value;

  nite.directives.foo = function({foo}){
    this.node.foo = foo;
  };

  nite.render({
    foo: 'bar'
  });

  assert.strictEqual(d.foo, 'bar');

});
