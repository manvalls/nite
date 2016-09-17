var walk = require('y-walk'),
    {Yielded} = require('y-resolver'),
    {Getter} = require('y-setter'),
    apply = require('u-proto/apply'),
    Nite = require('./base.js'),

    node = Symbol(),
    start = Symbol(),
    end = Symbol(),
    parent = Symbol();

class DOMNite extends Nite{

  constructor(n){
    super();
    this[node] = n;
  }

  render(tree,args,thatArg){
    var document,i,n,nite,child,ctrl;

    if(this.done || tree === null) return;
    document = this[node].ownerDocument;

    switch(typeof tree){

      case 'number':
        tree += '';
      case 'string':
        n = document.createTextNode(tree);
        this[node].insertBefore(n,this[end]);
        this.listen(this[node].removeChild,[n],this[node]);
        break;

      case 'function':

        this.render(
          walk(tree,args || [this[node]],thatArg || this[node]),
          args,
          thatArg
        );

        break;

      case 'object':

        if(tree instanceof Array){

          if(tree[0] == null){
            for(i = 1;i < tree.length;i++) this.render(tree[i],args,thatArg);
            return;
          }

          if(tree[0] instanceof Object){
            this.render(tree[0],tree.slice(1),thatArg);
            return;
          }

          n = document.createElement(tree[0]);
          this[node].insertBefore(n,this[end]);
          nite = new DOMNite(n);

          this.add(nite);
          nite.listen(this[node].removeChild,[n],this[node]);
          for(i = 1;i < tree.length;i++) nite.render(tree[i],args,thatArg);

          return;
        }

        if(typeof tree.controller == 'function'){
          child = this.child();

          try{ ctrl = new tree.controller(child,tree,...(args || [])); }
          catch(e){
            ctrl = {};
            setTimeout(throwError,0,e);
          }

          return;
        }

        if(typeof tree.then == 'function') tree = Yielded.get(tree);

        if(Yielded.is(tree)){
          child = this.child();
          tree.listen(renderYd,[child,args,thatArg]);
          return;
        }

        if(Getter.is(tree)){

          child = this.child();
          child.add(
            tree.watch(gWatcher,child,args,thatArg,{previous: child.child()})
          );

          return;
        }

        this[node][apply](tree,this);
        break;

    }

  }

  child(){
    var ret = this.free();
    this.add(ret);
    return ret;
  }

  free(){
    var document = this[node].ownerDocument,
        s = document.createTextNode(''),
        e = document.createTextNode(''),
        ret;

    ret = new Child(this[node],s,e,this);

    if(!this.done){
      this[node].insertBefore(s,this[end]);
      this[node].insertBefore(e,this[end]);
      ret.listen(this[node].removeChild,[s],this[node]);
      ret.listen(this[node].removeChild,[e],this[node]);
    }

    return ret;
  }

  get node(){
    return this[node];
  }

}

class Child extends DOMNite{

  constructor(n,s,e,p){
    super();
    this[node] = n;
    this[start] = s;
    this[end] = e;
    this[parent] = p;
  }

  after(){
    var document = this[node].ownerDocument,
        s = document.createTextNode(''),
        e = document.createTextNode(''),
        ret;

    ret = new Child(this[node],s,e,this[parent]);

    if(!this[parent].done){
      this[node].insertBefore(e,this[end].nextSibling);
      this[node].insertBefore(s,this[end].nextSibling);
      ret.listen(this[node].removeChild,[s],this[node]);
      ret.listen(this[node].removeChild,[e],this[node]);
    }

    this[parent].add(ret);
    return ret;
  }

  before(){
    var document = this[node].ownerDocument,
        s = document.createTextNode(''),
        e = document.createTextNode(''),
        ret;

    ret = new Child(this[node],s,e,this[parent]);

    if(!this[parent].done){
      this[node].insertBefore(s,this[start]);
      this[node].insertBefore(e,this[start]);
      ret.listen(this[node].removeChild,[s],this[node]);
      ret.listen(this[node].removeChild,[e],this[node]);
    }

    this[parent].add(ret);
    return ret;
  }

}

// Listeners

function renderYd(child,args,thatArg){
  child.render(this.value,args,thatArg);
}

function gWatcher(v,ov,d,parent,args,thatArg,ctx){
  ctx.previous.detach();
  ctx.previous = parent.child();
  ctx.previous.render(v,args,thatArg);
}

function throwError(e){
  throw e;
}

/*/ exports /*/

module.exports = DOMNite;
