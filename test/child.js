var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js'),
    nite = Nite();

t('child(), before() and after()',function(){
  var test = nite.var(),
      s,parent,c1,c2,c3;

  s = document.createElement('div');
  parent = Nite(s);
  c1 = parent.child();
  c3 = c1.after();
  c2 = c3.before();

  c1.render(1);
  c2.render(2);
  c3.render(3);

  assert.strictEqual(c1,c1.self);
  assert.strictEqual(s.innerHTML,'123');
  c2.detach();
  assert.strictEqual(s.innerHTML,'13');
  parent.detach();
  assert.strictEqual(s.innerHTML,'');
});
