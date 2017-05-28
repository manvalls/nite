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
      itemMap = new Map(),
      getKey = options.key || (item => item),
      item,child,increment,it,key,oldChild,temp;

  try{

    for(let item of (newList || [])){

      try{
        key = getKey(item);
        itemMap.set(key, item);
      }catch(e){ }

    }

  }catch(e){ }

  // Ordered creation

  if(options.reorder !== false){

    it = children.values();
    increment = true;

    for([key, item] of itemMap.entries()){

      if(increment) oldChild = it.next();

    	if(oldChild.done) child = nite.child();
      else if(oldChild.value.key !== key) child = oldChild.value.before();
      else increment = true;

      if(child){

        if(map.has(key)){

          // Partial cleanup

          temp = map.get(key);
          children.delete(temp);
          temp.detach();

        }

        child.index = nite.var();
        child.index.value = i;
        child.renderAll(callback,[item,child.index.getter],child.node);

        child.key = key;
        map.set(key,child);
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

  else for([key, item] of itemMap.entries()){

  	if(map.has(key)){

      child = map.get(key);
      child.index.value = i;
      newChildren.add(child);

  	}else{

      child = nite.child();
      child.index = nite.var();
      child.index.value = i;
      child.renderAll(callback,[item,child.index.getter],child.node);

      child.key = key;
      map.set(key,child);
      newChildren.add(child);

  	}

    i++;

  }

  // Cleanup

  for(child of children){

  	if(!newChildren.has(child)){
  	  if(map.get(child.key) == child) map.delete(child.key);
      child.detach();
  	}

  }

  ctx.children = newChildren;

}
