var Nite = require('./base'),
    exports = require('./main'),
    parent = Symbol();

exports.Component = class extends Nite{

  constructor(p){
    super();
    p.add(this);
    this[parent] = p;
  }

  render(...args){
    return this[parent].render(...args);
  }

  renderAll(...args){
    return this[parent].renderAll(...args);
  }

  free(...args){
    return this[parent].free(...args);
  }

  child(...args){
    return this[parent].child(...args);
  }

  before(...args){
    return this[parent].before(...args);
  }

  after(...args){
    return this[parent].after(...args);
  }

  get node(){
    return this[parent].node;
  }

  get scope(){
    return this[parent].scope;
  }

};
