var walk = require('y-walk'),
    {Yielded} = require('y-resolver'),
    {Getter} = require('y-setter'),
    apply = require('u-proto/apply'),
    Nite = require('./base.js'),

    node = Symbol(),
    start = Symbol(),
    end = Symbol(),
    parent = Symbol(),
    dataParent = Symbol(),
    map = Symbol();

class DOMNite extends Nite{

  constructor(n){
    super();
    this[node] = n;
    this[map] = new WeakMap();
  }

  render(tree,args,thatArg){
    render(this,tree,args,thatArg,this);
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

    this[node].insertBefore(s,this[end]);
    this[node].insertBefore(e,this[end]);
    ret.listen(this[node].removeChild,[s],this[node]);
    ret.listen(this[node].removeChild,[e],this[node]);

    return ret;
  }

  set(key,value){
    return this[map].set(key,value);
  }

  get(key){
    if(this[map].has(key)) return this[map].get(key);
    if(this[dataParent]) return this[dataParent].get(key);
  }

  has(key){
    if(this[map].has(key)) return true;
    if(this[dataParent]) return this[dataParent].has(key);
    return false;
  }

  delete(key){
    return this[map].delete(key);
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
    this[dataParent] = p;
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

// Render

function render(that,tree,args,thatArg,parent){
  var document,i,n,nite,child;

  if(that.done || tree === null) return;
  document = that[node].ownerDocument;

  switch(typeof tree){

    case 'number':
      tree += '';
    case 'string':
      n = document.createTextNode(tree);
      that[node].insertBefore(n,that[end]);
      that.listen(that[node].removeChild,[n],that[node]);
      break;

    case 'function':

      render(
        that,
        walk(tree,args || [that[node]],thatArg || that[node]),
        args,
        thatArg,
        parent
      );

      break;

    case 'object':

      if(global.Node && tree instanceof Node){
        that[node].insertBefore(tree,that[end]);
        return;
      }

      if(tree instanceof Array){

        if(tree[0] == null){
          for(i = 1;i < tree.length;i++) render(that,tree[i],[that[node]],that[node],parent);
          return;
        }

        if(tree[0] instanceof Object){
          render(that,tree[0],tree.slice(1),thatArg,parent);
          return;
        }

        n = document.createElement(tree[0]);
        that[node].insertBefore(n,that[end]);
        nite = new DOMNite(n);

        that.listen(that[node].removeChild,[n],that[node]);
        for(i = 1;i < tree.length;i++) render(nite,tree[i],[nite[node]],nite[node],parent);

        return;
      }

      if(typeof tree.controller == 'function'){
        child = that.free();
        child[dataParent] = parent;
        parent.add(child);

        try{ new tree.controller(child,tree,...(args || [])); }
        catch(e){ setTimeout(throwError,0,e); }
        return;
      }

      if(typeof tree.then == 'function') tree = Yielded.get(tree);

      if(Yielded.is(tree)){
        child = that.free();
        child[dataParent] = parent;
        parent.add(child);

        tree.listen(renderYd,[child,args,thatArg]);
        return;
      }

      if(Getter.is(tree)){

        child = that.free();
        child[dataParent] = parent;
        parent.add(child);

        child.add(
          tree.watch(gWatcher,child,args,thatArg,{previous: child.child()})
        );

        return;
      }

      that[node][apply](tree,that);
      break;

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
