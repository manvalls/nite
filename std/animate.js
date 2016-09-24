var walk = require('y-walk'),
    wait = require('y-timers/wait');

module.exports = function(elem,start,end){
  return {elem,start,end,controller};
};

function controller(nite,ctx){
  var {elem,start,end} = ctx,
      child = nite.free(),
      phase = child.var();

  walk(run,[start || [],end || [],nite,child,phase]);
  child.render(elem,[phase.getter]);
}

function* run(start,end,parent,child,phase){
  var step;

  for(step of start){
    if(typeof step == 'number') yield wait(step);
    else phase.set(step);
  }

  yield parent;

  for(step of end){
    if(typeof step == 'number') yield wait(step);
    else phase.set(step);
  }

  child.detach();

}
