var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js'),
    nite = Nite();

t('Getter hook',function(){
  var test = nite.var(),
      s,child;

  s = document.createElement('div');
  child = Nite(s).child();
  child.render(['span',test]);
  assert.strictEqual(s.innerHTML,'<span></span>');

  test.value = 'foo';
  assert.strictEqual(s.innerHTML,'<span>foo</span>');

  child.detach();
  test.value = 'bar';
  assert.strictEqual(s.innerHTML,'');
});
