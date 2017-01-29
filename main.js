var Nite;

module.exports = function(){

  if(arguments.length){
    let DOMNite = require('./dom.js');
    return new DOMNite(arguments[0]);
  }

  return new Nite();
};

Nite = require('./base.js');
