var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('map',function*(){
  var d = document.createElement('div'),
      nite = Nite(d),
      {animate} = nite.std,
      prop = {};

  nite.set(prop);

  nite.render({
    controller: function(nite){
      var prop2 = {};

      assert(nite.has(prop));
      assert.strictEqual(nite.get(prop),undefined);

      assert(!nite.has(prop2));
      nite.set(prop2,'foo');

      nite.render(['div',
        ['span'],
        ['span',
          {
            controller: function(nite2){
              assert.strictEqual(nite.get(prop2),nite2.get(prop2));
              assert.strictEqual(nite.get(prop2),'foo');
              nite.delete(prop2);
              assert.strictEqual(nite2.get(prop2),undefined);
            }
          }
        ]
      ]);

    }
  });

});
