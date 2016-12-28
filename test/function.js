var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js'),
    wait = require('y-timers/wait');

t('Function',function*(){
  var d = document.createElement('div'),
      nite = Nite(d);

  nite.render(function*(){
    e = this;
    yield wait(0);
    return ['span','foo'];
  });

  assert.strictEqual(e,d);
  assert.strictEqual(d.innerHTML,'');
  yield wait(100);
  assert.strictEqual(d.innerHTML,'<span>foo</span>');

  d = document.createElement('div');
  nite = Nite(d);
  nite.render(Promise.resolve(['span','hi']));

  assert.strictEqual(d.innerHTML,'');
  yield wait(10);
  assert.strictEqual(d.innerHTML,'<span>hi</span>');

  d = document.createElement('div');
  nite = Nite(d);
  
  nite.render([function(one,two,three){
    var four = this.var();
    setTimeout(() => four.set(4), 100);
    return [,one,two,three,four];
  },1,2,3]);

  assert.strictEqual(d.innerHTML,'123');
  yield wait(200);
  assert.strictEqual(d.innerHTML,'1234');
});
