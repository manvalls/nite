module.exports = ({ text, mirror }) =>

<div style={{textAlign: 'center'}}>
  <input placeholder="Type something" value={text}/>
  <hr/>
  <div>
    {text} | { text.to(mirror) }
  </div>
</div>
