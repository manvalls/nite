
exports.attach = function(element,event,listener,useCapture){
  if(element.addEventListener) element.addEventListener(event,listener,useCapture || false);
  else element.attachEvent(event,listener.ieListener = e => listener.handleEvent(e));
};

exports.detach = function(element,event,listener,useCapture){
  if(element.removeEventListener) element.removeEventListener(event,listener,useCapture || false);
  else element.detachEvent(event,listener.ieListener);
}
