var Detacher = require('detacher'),
    {Yielded} = require('y-resolver'),
    Setter = require('y-setter'),
    {Getter,Hybrid} = Setter,

    data = Symbol(),

    std;

class Nite extends Detacher{

  constructor(p){
    super();
    if(p) this[data] = Object.create(p.data);
    else this[data] = {};
  }

  promise(p){
    p = Yielded.get(p);
    return {
      done: p.get('done',this),
      success: p.get('accepted',this),
      failure: p.get('rejected',this),
      result: p.get('value',this),
      error: p.get('error',this)
    };
  }

  var(value){
    var h;

    if(this.isVar(value)) return value;
    h = new Hybrid(this);
    h.value = value;
    return h;
  }

  isVar(data){
    return Getter.is(data);
  }

  vars(obj,ret){
    var key;

    ret = ret || this;
    for(key of Object.keys(obj)){
      if(obj[key] && obj[key].constructor == Object) ret[key] = this.vars(obj[key],ret[key] || {});
      else ret[key] = this.var(obj[key]);
    }

    return ret;
  }

  values(obj){
    var ret = {},
        key;

    for(key of Object.keys(obj)){
      if(obj[key] && obj[key].constructor == Object) ret[key] = this.values(obj[key]);
      else if(Getter.is(obj[key])) ret[key] = obj[key].value;
    }

    return ret;
  }

  transform(){
    return Getter.transform.apply(this,arguments);
  }

  watch(){
    return Getter.watch.apply(this,arguments);
  }

  observe(){
    return Getter.observe.apply(this,arguments);
  }

  glance(){
    return Getter.glance.apply(this,arguments);
  }

  get std(){
    return std;
  }

  get data(){
    return this[data];
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
  forEach: require('./std/forEach')
});
