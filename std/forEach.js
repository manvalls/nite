
module.exports = function(getter,callback,options = {}){
  return {getter,callback,options,controller};
};

function controller(nite,ctx){

  if(!nite.isVar(ctx.getter)) ctx.getter = nite.var(ctx.getter);

  nite.add(
    ctx.getter.watch(
      watcher,
      {
        callback: ctx.callback,
        options: ctx.options,
        children: new Set(),
        map: new Map(),
        nite
      }
    )
  );

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
        child.render(callback,[obj,child.index.getter]);

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
      child.render(callback,[obj,child.index.getter]);

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
