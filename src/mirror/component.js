var Nite = require('nite'),
    view = require('./view.js');

class Mirror extends Nite.Component{

  init(){
    this.text = this.var();
    this.render( view(this) );
  }

  mirror(text){
    return text.split('').reverse().join('');
  }

}

module.exports = Mirror;
