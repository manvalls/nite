var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('once',function(){
  var d = document.createElement('div'),
      nite = Nite(d),
      n = 0,
      that,event;

  nite.render([,
    nite.std.once('click',function(e){
      that = this;
      event = e;
      n++;
    }),
    nite.std.once.window('click',function(e){
      that = this;
      event = e;
      n++;
    }),
    nite.std.once.document('click',function(e){
      that = this;
      event = e;
      n++;
    })
  ]);

  document.body.appendChild(d);

  d.click();
  assert.strictEqual(n,3);
  assert.strictEqual(event.type,'click');

  nite.render(
    nite.std.once('click',function(e){
      that = this;
      event = e;
      n++;
    })
  );

  d.click();
  assert.strictEqual(n,4);
  assert.strictEqual(event.type,'click');

  nite.render(
    nite.std.once('click',function(e){
      that = this;
      event = e;
      n++;
    })
  );

  nite.detach();
  d.click();
  assert.strictEqual(n,4);

});
