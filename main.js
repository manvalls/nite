var Nite = require('./base.js'),
    DOMNite = require('./dom.js');

module.exports = function(){
  if(arguments.length) return new DOMNite(arguments[0]);
  return new Nite();
};
