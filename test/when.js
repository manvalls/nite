var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js'),
    nite = Nite();

t('when',function(){
  var test = nite.var(),
      s,child;

  s = document.createElement('div');
  child = Nite(s).child();
  child.render(
    child.std.when(test.is(1),'one')
    .elseWhen(test.is(2),'two')
    .else('three')
  );

  assert.strictEqual(s.innerHTML,'three');

  test.value = 1;
  assert.strictEqual(s.innerHTML,'one');

  test.value = 2;
  assert.strictEqual(s.innerHTML,'two');

  child.detach();
  test.value = 'bar';
  assert.strictEqual(s.innerHTML,'');
});
