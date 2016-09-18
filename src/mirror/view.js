module.exports = ({ text }) =>

<div style={{textAlign: 'center'}}>
  <input placeholder="Type something" value={text}/>
  <hr/>
  <div>
    {text} | { text.to( text => text.split('').reverse().join('') ) }
  </div>
</div>
