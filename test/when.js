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

  s = document.createElement('div');
  child = Nite(s).child();
  child.render(
    child.std.when(test.is(1),[document.createElement('span'),'one'])
    .elseWhen(test.is(2),[document.createElement('span'),'two'])
    .else(document.createElement('span'))
  );

  assert.strictEqual(s.innerHTML,'<span></span>');

  test.value = 1;
  assert.strictEqual(s.innerHTML,'<span>one</span>');

  test.value = 2;
  assert.strictEqual(s.innerHTML,'<span>two</span>');

  child.detach();
  test.value = 'bar';
  assert.strictEqual(s.innerHTML,'');

});
