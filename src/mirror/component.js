var Nite = require('nite'),
    view = require('./view.js');

class Mirror extends Nite.Component{

  init(){
    this.text = this.var();
    return view(this);
  }

  mirror(text){
    return text.split('').reverse().join('');
  }

}

module.exports = Mirror;
