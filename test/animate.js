var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js'),
    wait = require('y-timers/wait');

t('animate',function*(){
  var d = document.createElement('div'),
      nite = Nite(d),
      {animate} = nite.std;

  nite.render(
    animate(['starting',0,20,'started'],['ending',0,'ended',20],phase => phase)
  );

  assert.strictEqual(d.innerHTML,'starting');
  yield wait(10);
  assert.strictEqual(d.innerHTML,'starting');
  yield wait(20);
  assert.strictEqual(d.innerHTML,'started');
  nite.detach();
  assert.strictEqual(d.innerHTML,'ending');
  yield wait(10);
  assert.strictEqual(d.innerHTML,'ended');
  yield wait(20);
  assert.strictEqual(d.innerHTML,'');
});
