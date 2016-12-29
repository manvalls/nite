module.exports = function(){
  var titles = ['Mx.','Mr.','Ms.'],
      title = this.var('Mx.'),
      name = this.var(),
      {forEach} = this.std;

  return <div>
    <form onsubmit={e => e.preventDefault()} user_title={{value: title}}>

      { forEach(titles, option =>
        <label>
          <input type="radio" name="user_title" value={option} /> {option}
        </label>
      ) }

      <br/><br/>
      <input type="text" value={name} placeholder="Name" />

    </form>
    <hr/>
    Hi {title} {name}!
  </div>;
};
