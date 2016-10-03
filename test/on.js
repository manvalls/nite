var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('on',function(){
  var d = document.createElement('div'),
      nite = Nite(d),
      n = 0,
      that,event;

  nite.render([,
    nite.std.on('click',function(e){
      that = this;
      event = e;
      n++;
    }),
    nite.std.on.document('click',function(e){
      that = this;
      event = e;
      n++;
    }),
    nite.std.on.window('click',function(e){
      that = this;
      event = e;
      n++;
    })
  ]);

  document.body.appendChild(d);

  d.click();
  assert.strictEqual(n,3);
  assert.strictEqual(event.type,'click');

  d.click();
  assert.strictEqual(n,6);
  assert.strictEqual(event.type,'click');

  nite.detach();
  d.click();
  assert.strictEqual(n,6);

});
