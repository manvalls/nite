var Detacher = require('detacher'),
    {Yielded} = require('y-resolver'),
    Setter = require('y-setter'),
    {Getter,Hybrid} = Setter,

    scope = Symbol(),
    modifiers = Symbol(),
    directives = Symbol(),

    std;

class Nite extends Detacher{

  constructor(p){
    super();

    if(p){
      this[scope] = Object.create(p.scope);
      this[modifiers] = Object.create(p.modifiers);
      this[directives] = Object.create(p.directives);
    }else{
      this[scope] = Object.create(null);
      this[modifiers] = Object.create(null);
      this[directives] = Object.create(null);
    }
  }

  var(value){
    var h;

    if(Getter.is(value)) return value;
    h = new Hybrid(this);
    h.value = value;
    return h;
  }

  const(value){
    var s = new Setter();

    if(Getter.is(value)) s.value = Getter.value;
    else s.value = value
    s.freeze();

    return s.getter;
  }

  vars(obj){
    var ret,key,i;

    if(!(obj instanceof Object)) return this.var(obj);

    if(obj instanceof Array){
      ret = [];
      for(i = 0;i < obj.length;i++) ret[i] = this.var(obj[i]);
      return ret;
    }

    ret = {};
    for(key of Object.keys(obj)) ret[key] = this.var(obj[key]);
    return ret;
  }

  get std(){
    return std;
  }

  get scope(){
    return this[scope];
  }

  get modifiers(){
    return this[modifiers];
  }

  get directives(){
    return this[directives];
  }

  get self(){
    return this;
  }

}

/*/ exports /*/

module.exports = Nite;
require('./component');

std = Object.freeze({
  on: require('./std/on'),
  once: require('./std/once'),
  when: require('./std/when'),
  animate: require('./std/animate'),
  forEach: require('./std/forEach'),
  model: require('./std/model'),
  flow: require('./std/flow'),
  timers: require('y-timers')
});
