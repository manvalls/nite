module.exports = class{

  constructor(nite,{view}){

    nite.vars({
      title: 'Mx.',
      name: ''
    },this);

    this.titles = ['Mx.','Mr.','Ms.'];
    nite.render(view,[this,nite.std]);

  }

};
