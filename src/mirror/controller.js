module.exports = function( nite, { view } ){

  nite.vars({
    text: ''
  },this);

  nite.render( view(this) );

};
