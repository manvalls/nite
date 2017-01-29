var Nite = require('../main');

module.exports = function($,callback,options = {}){
  return [ForEach,{$,options},callback];
};

class ForEach extends Nite.Component{

  init({$,options},...children){

    if(!this.std.model.isVar($)){
      $ = this.var($);
      $.freeze();
    }

    this.add(
      $.watch(
        watcher,
        {
          callback: children,
          options,
          children: new Set(),
          map: new Map(),
          nite: this
        }
      )
    );

  }

}

function watcher(newList,ov,d,{
  callback,
  nite,
  options,
  map,
  children
}){
  var i = 0,
      ctx = arguments[3],
      newChildren = new Set(),
      obj,child,increment,it,oldChild,temp;

  try{ newList = new Set(newList || []); }
  catch(e){ newList = new Set(); }

  // Ordered creation

  if(options.reorder !== false){

    it = children.values();
    increment = true;

    for(obj of newList){

      if(increment) oldChild = it.next();

    	if(oldChild.done) child = nite.child();
      else if(oldChild.value.obj !== obj) child = oldChild.value.before();
      else increment = true;

      if(child){

        if(map.has(obj)){

          // Partial cleanup

          temp = map.get(obj);
          children.delete(temp);
          temp.detach();

        }

        child.index = nite.var();
        child.index.value = i;
        child.renderAll(callback,[obj,child.index.getter]);

        child.obj = obj;
        map.set(obj,child);
        newChildren.add(child);

        increment = false;
        child = null;

      }else{

        oldChild.value.index.value = i;
        newChildren.add(oldChild.value);
        increment = true;

      }

      i++;

    }

  }

  // Unordered creation

  else for(obj of newList){

  	if(map.has(obj)){

      child = map.get(obj);
      child.index.value = i;
      newChildren.add(child);

  	}else{

      child = nite.child();
      child.index = nite.var();
      child.index.value = i;
      child.renderAll(callback,[obj,child.index.getter]);

      child.obj = obj;
      map.set(obj,child);
      newChildren.add(child);

  	}

    i++;

  }

  // Cleanup

  for(child of children){

  	if(!newChildren.has(child)){
  	  if(map.get(child.obj) == child) map.delete(child.obj);
      child.detach();
  	}

  }

  ctx.children = newChildren;

}
