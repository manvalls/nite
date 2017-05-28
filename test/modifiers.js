var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('modifiers',function*(){
  var d = document.createElement('div'),
      nite = Nite(d),
      value;

  nite.plugin({

    plug(nite){
      nite.modifiers.foo = function(props){
        props.style = {color: props.foo};
      };
    }

  });

  nite.render({
    foo: 'black'
  });

  assert.strictEqual(d.style.color, 'black');

});
