var Nite = require('../main.js'),
    walk = require('y-walk'),
    wait = require('y-timers/wait');

module.exports = function(start,end,elem){
  return [Animate,{start,end},elem];
};

class Animate extends Nite.Component{

  init({start,end},...children){
    var child = this.free(),
        phase = child.var();

    start = parseArray(start);
    end = parseArray(end);

    walk(run,[start,end,this,child,phase]);
    child.renderAll(children,[phase.getter]);
  }

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

function parseArray(arr){
  arr = arr || [];
  if(typeof arr == 'string') arr = arr.split(',').map(s => s.trim()).map(s => isNaN(s) ? s : parseInt(s));
  return arr;
}
