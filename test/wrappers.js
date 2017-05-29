var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('wrappers', function*(){
  var d = document.createElement('div'),
      nite = Nite(d),
      value;

  nite.wrappers.foo = function(arg, child){
    this.scope.foo = 'bar';
    return ['span',{},child];
  };

  nite.wrappers.bar = function(arg, child){
    return ['div',{},arg,this.scope.foo,child];
  };

  nite.render(['span', {
    foo: true,
    bar: 'hi'
  }]);

  assert.strictEqual(d.innerHTML, '<span><div>hibar<span></span></div></span>');

});
