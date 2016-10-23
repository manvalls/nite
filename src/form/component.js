var Nite = require('nite'),
    view = require('./view');

class Form extends Nite.Component{

  init(){

    this.vars({
      title: 'Mx.',
      name: ''
    });

    this.titles = ['Mx.','Mr.','Ms.'];
    this.render( view(this, this.std) );

  }

}

module.exports = Form;
