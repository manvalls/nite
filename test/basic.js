var t = require('u-test'),
    assert = require('assert'),
    Nite = require('../main.js');

t('Element creation and appending',function(){
  var e;

  e = [,
    {style: {color: 'black'}},
    'Hello world!',
    ['div',
      {style: {color: 'green'}},
      'Hi again!'
    ],
    document.createElement('span')
  ];

  document.body.innerHTML = '';
  Nite(document.body).render(e);

  assert.strictEqual(document.body.innerHTML,'Hello world!<div style="color: green;">Hi again!</div><span></span>');
  assert.strictEqual(document.body.style.color,'black');
});
