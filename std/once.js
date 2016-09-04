
module.exports = function(event,handler,useCapture){
  return {controller,event,handler,useCapture};
};

function controller(nite,{event,handler,useCapture}){
  var listener = {handleEvent,handler,nite,event,useCapture};

  nite.node.addEventListener(event,listener,useCapture || false);
  nite.listen(nite.node.removeEventListener,[event,listener,useCapture || false],nite.node);
}

function handleEvent(e){
  this.nite.node.removeEventListener(this.event,this,this.useCapture || false);
  this.nite.render(this.handler,[e],this.nite.node);
}
