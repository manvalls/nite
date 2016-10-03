var events = require('./utils/events');

module.exports = function(event,handler,useCapture){
  return {controller,event,handler,useCapture,getNode};
};

module.exports.document = function(event,handler,useCapture){
  return {controller,event,handler,useCapture,getNode: getDocument};
};

module.exports.window = function(event,handler,useCapture){
  return {controller,event,handler,useCapture,getNode: getWindow};
};

// Methods

function controller(nite,{event,handler,useCapture,getNode}){
  var listener = {handleEvent,handler,nite,getNode};

  events.attach(getNode(nite),event,listener,useCapture);
  nite.listen(events.detach,[getNode(nite),event,listener,useCapture]);
}

function handleEvent(e){
  this.nite.render(this.handler,[e],this.getNode(this.nite));
}

// Node getters

function getNode(nite){
  return nite.node;
}

function getDocument(nite){
  return nite.node.ownerDocument;
}

function getWindow(nite){
  var document = getDocument(nite);
  return document.defaultView || document.parentWindow;
}
