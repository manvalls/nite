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
          walk(tree,args || [this[node]],thatArg || this[node])
        );

        break;

      case 'object':

        if(tree instanceof Array){

          if(tree[0] === undefined){
            for(i = 1;i < tree.length;i++) this.render(tree[i]);
            return;
          }

          n = document.createElement(tree[0]);
          this[node].insertBefore(n,this[end]);
          nite = new DOMNite(n);

          this.add(nite);
          nite.listen(this[node].removeChild,[n],this[node]);
          for(i = 1;i < tree.length;i++) nite.render(tree[i]);

          return;
        }

        if(typeof tree.controller == 'function'){
          child = this.child();

          try{ ctrl = new tree.controller(child,tree); }
          catch(e){
            ctrl = {};
            setTimeout(throwError,0,e);
          }

          if(typeof tree.view == 'function') child.render(tree.view(ctrl,tree,child.std));
          return;
        }

        if(typeof tree.then == 'function') tree = Yielded.get(tree);

        if(Yielded.is(tree)){
          child = this.child();
          tree.listen(renderYd,[child]);
          return;
        }

        if(Getter.is(tree)){

          child = this.child();
          child.add(
            tree.watch(gWatcher,child,{previous: child.child()})
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

function renderYd(child){
  child.render(this.value);
}

function gWatcher(v,ov,d,parent,ctx){
  ctx.previous.detach();
  ctx.previous = parent.child();
  ctx.previous.render(v);
}

function throwError(e){
  throw e;
}

/*/ exports /*/

module.exports = DOMNite;
