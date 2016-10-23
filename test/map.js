var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('map',function*(){
  var d = document.createElement('div'),
      nite = Nite(d);

  nite.data.prop = true;
  nite.render(class extends Nite.Component{

    init(){
      var nite = this;

      assert('prop' in this.data);
      assert.strictEqual(nite.data.prop,true);

      assert(!('prop2' in this.data));
      this.data.prop2 = 'foo';

      this.render(['div',
        ['span'],
        ['span',
          class extends Nite.Component{

            init(){
              var nite2 = this;

              assert.strictEqual(nite.data.prop2,nite2.data.prop2);
              assert.strictEqual(nite.data.prop2,'foo');
              delete nite.data.prop2;
              assert.strictEqual(nite2.data.prop2,undefined);
            }

          }
        ]
      ]);

    }

  });

});
