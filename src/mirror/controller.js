module.exports = function( nite, { view } ){

  this.text = nite.var();
  
  this.mirror = function(text){
    return text.split('').reverse().join('');
  };

  nite.render( view(this) );

};
