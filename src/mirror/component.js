module.exports = function(){
  var text = this.var();

  function mirror(text){
    return text.split('').reverse().join('');
  }

  return <div style={{textAlign: 'center'}}>
    <input placeholder="Type something" value={text}/>
    <hr/>
    <div>
      {text} | { text.map(mirror) }
    </div>
  </div>;
};
