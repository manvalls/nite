var chain = Symbol();

class WhenComponent{

  constructor(getter,element){

    this[chain] = {
      getters: [getter],
      elements: [element]
    };

  }

  elseWhen(getter,element){
    this[chain].getters.push(getter);
    this[chain].elements.push(element);
    return this;
  }

  else(element){
    return this.elseWhen(true,element);
  }

};

WhenComponent.prototype.controller = function(nite,ctx){
  nite.render(
    nite.transform(ctx[chain].getters,transform,ctx[chain])
  );
};

function transform(){
  for(var i = 0;i < arguments.length;i++) if(arguments[i]) return this.elements[i];
}

module.exports = function(){
  return new WhenComponent(...arguments);
};
