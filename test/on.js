var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('on',function(){
  var d = document.createElement('div'),
      nite = Nite(d),
      n = 0,
      that,event;

  nite.render(
    nite.std.on('click',function(e){
      that = this;
      event = e;
      n++;
    })
  );

  d.click();
  assert.strictEqual(n,1);
  assert.strictEqual(that,d);
  assert.strictEqual(event.type,'click');

  d.click();
  assert.strictEqual(n,2);
  assert.strictEqual(that,d);
  assert.strictEqual(event.type,'click');

  nite.detach();
  d.click();
  assert.strictEqual(n,2);

});
