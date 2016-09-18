module.exports = class{

  constructor( nite, { view } ){

    nite.vars({
      text: ''
    },this);

    nite.render( view(this) );

  }

};
