var events = require('./utils/events'),
    Nite = require('../main');

module.exports = function(event,handler,useCapture){
  return [On,{event,useCapture,getNode},handler];
};

module.exports.document = function(event,handler,useCapture){
  return [On,{event,useCapture,getNode: getDocument},handler];
};

module.exports.window = function(event,handler,useCapture){
  return [On,{event,useCapture,getNode: getWindow},handler];
};

// Methods

class On extends Nite.Component{

  init({event,useCapture,getNode},...handler){
    var listener = {handleEvent,handler,nite: this,getNode};

    events.attach(getNode(this),event,listener,useCapture);
    this.listen(events.detach,[getNode(this),event,listener,useCapture]);
  }

}

function handleEvent(e){
  this.nite.renderAll(this.handler,[e],this.nite.node);
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
