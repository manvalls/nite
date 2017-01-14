var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('map',function*(){
  var d = document.createElement('div'),
      nite = Nite(d);

  nite.scope.prop = true;
  nite.render(class extends Nite.Component{

    init(){
      var nite = this;

      assert('prop' in this.scope);
      assert.strictEqual(nite.scope.prop,true);

      assert(!('prop2' in this.scope));
      this.scope.prop2 = 'foo';

      this.render(['div',
        ['span'],
        ['span',
          class extends Nite.Component{

            init(){
              var nite2 = this;

              assert.strictEqual(nite.scope.prop2,nite2.scope.prop2);
              assert.strictEqual(nite.scope.prop2,'foo');
              delete nite.scope.prop2;
              assert.strictEqual(nite2.scope.prop2,undefined);
            }

          }
        ]
      ]);

    }

  });

});
