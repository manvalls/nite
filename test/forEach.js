var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('forEach',function(){

  t('Basic',function(){
    var test,d,nite;

    d = document.createElement('div');
    nite = Nite(d);
    test = nite.var([]);

    nite.render([,
      'foo',nite.std.forEach(test,(n,index) => ['span',`${n},`,index]),'bar'
    ]);

    assert.strictEqual(d.innerHTML,'foobar');

    test.value = [1,2,3];
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>2,1</span><span>3,2</span>bar');

    test.value.splice(1,1);
    test.update();
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>3,1</span>bar');

    nite.detach();
    nite = Nite(d);
    test = nite.var([1,3]);

    nite.render(nite.std.forEach(test,n => n));
    assert.strictEqual(d.innerHTML,'13');

    test.value.splice(1,0,2);
    test.update();
    assert.strictEqual(d.innerHTML,'123');

    test.value.splice(1,1);
    test.value.push(2,4);
    test.update();
    assert.strictEqual(d.innerHTML,'1324');

    test.value = [1,2,3];
    assert.strictEqual(d.innerHTML,'123');

    test.value.splice(0,2);
    test.update();
    assert.strictEqual(d.innerHTML,'3');

    test.value = {};
    assert.strictEqual(d.innerHTML,'');

    nite.detach();
    nite = Nite(d);
    test = [1,2,3];

    nite.render(nite.std.forEach(test,n => n));
    assert.strictEqual(d.innerHTML,'123');

  });

  t('No reordering',function(){
    var test,d,nite;

    d = document.createElement('div');
    nite = Nite(d);
    test = nite.var([]);

    nite.render([,
      'foo',
      nite.std.forEach(test,(n,index) => ['span',`${n},`,index],{reorder: false}),
      'bar'
    ]);

    assert.strictEqual(d.innerHTML,'foobar');

    test.value = [1,2,3];
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>2,1</span><span>3,2</span>bar');

    test.value.splice(1,1);
    test.update();
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>3,1</span>bar');

    test.value = [1,2,3];
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>3,2</span><span>2,1</span>bar');

  });

});
