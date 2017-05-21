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

  constructor(n,p){
    super(p);
    this[node] = n;
  }

  render(tree,args,thatArg){
    render(this,tree,args,thatArg,this);
  }

  renderAll(trees,args,thatArg){
    var tree;
    for(tree of trees) this.render(tree,args,thatArg);
  }

  child(){
    var ret = this.free();
    this.add(ret);
    return ret;
  }

  free(){
    return getChild(this,this);
  }

  get node(){
    return this[node];
  }

}

class Child extends DOMNite{

  constructor(n,s,e,p,dp){
    super(n,dp);
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

      if(tree.hasOwnProperty('init') && typeof tree.init == 'function'){
        render(that,tree.init(...(args || [])),args,thatArg,parent);
        break;
      }

      if(tree.prototype && tree.prototype.hasOwnProperty('init') && typeof tree.prototype.init == 'function'){
        child = getChild(that,parent);
        parent.add(child);

        try{
          tree = new tree(child);
          render(child,tree.init(...(args || [])),args,thatArg,child);
        }catch(e){ setTimeout(throwError,0,e); }

        break;
      }

      if(tree.prototype && args && !thatArg){
        thatArg = getChild(that,parent);
        parent.add(thatArg);
        parent = that = thatArg;
      }

      render(
        that,
        walk(tree,args || [parent.scope, that[node]],thatArg || that[node]),
        args,
        thatArg,
        parent
      );

      break;

    case 'object':

      if(tree.constructor == Object){
        let usedModifiers = new Set(),
            usedDirectives = new Set(),
            modifierFound, directiveFound;

        do{

          modifierFound = false;
          for(let key of Object.keys(tree)){

            if((key in parent.modifiers) && !usedModifiers.has(key)){

              modifierFound = true;
              usedModifiers.add(key);

              try{
                parent.modifiers[key](tree,parent.scope,that[node]);
              }catch(e){
                console.error(`Modifier ${key} threw an error:`, e);
              }

            }

          }

        }while(modifierFound);

        that[node][apply](tree,parent);

        do{

          directiveFound = false;
          for(let key of Object.keys(tree)){

            if((key in parent.directives) && !usedDirectives.has(key)){

              directiveFound = true;
              usedDirectives.add(key);

              render(that,parent.directives[key],[tree],null,parent);

            }

          }

        }while(directiveFound);

        break;
      }

      if(global.Node && tree instanceof Node){

        if(!tree.parentNode){
          that[node].insertBefore(tree,that[end]);
          nite = new DOMNite(tree);

          that.listen(that[node].removeChild,[tree],that[node]);
          for(child of (args || [])) render(nite,child,null,null,parent);
        }

        break;
      }

      if(tree instanceof Array){

        if(tree[0] == null){
          for(i = 1;i < tree.length;i++) render(that,tree[i],null,null,parent);
          break;
        }

        if(tree[0] instanceof Object){
          render(that,tree[0],tree.slice(1),null,parent);
          break;
        }

        n = document.createElement(tree[0]);
        nite = new DOMNite(n);
        if(tree.length > 1) render(nite,tree[1],null,null,parent);

        that[node].insertBefore(n,that[end]);
        that.listen(that[node].removeChild,[n],that[node]);
        for(i = 2;i < tree.length;i++) render(nite,tree[i],null,null,parent);

        break;
      }

      if(Yielded.is(tree)){
        child = getChild(that,parent);
        parent.add(child);

        tree.listen(renderYd,[child,args,thatArg]);
        break;
      }

      if(Getter.is(tree)){

        child = getChild(that,parent);
        parent.add(child);

        child.add(
          tree.watch(gWatcher,child,args,thatArg,{previous: child.child()})
        );

        break;
      }

      if(typeof tree.init == 'function'){
        render(that,tree.init(...(args || [])),args,thatArg,parent);
        break;
      }

      if(typeof tree.then == 'function'){
        render(that,Yielded.get(tree),args,thatArg,parent);
        break;
      }

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

function getChild(parent,dataParent){
  var document = parent[node].ownerDocument,
      s = document.createTextNode(''),
      e = document.createTextNode(''),
      ret;

  ret = new Child(parent[node],s,e,parent,dataParent);

  parent[node].insertBefore(s,parent[end]);
  parent[node].insertBefore(e,parent[end]);
  ret.listen(parent[node].removeChild,[s],parent[node]);
  ret.listen(parent[node].removeChild,[e],parent[node]);

  return ret;
}

/*/ exports /*/

module.exports = DOMNite;
