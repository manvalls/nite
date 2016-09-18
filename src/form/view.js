module.exports = ({ title, name, titles }, { forEach }) =>

<div>
  <form onsubmit={e => e.preventDefault()}>

    { forEach(titles, title =>
      <label>
        <input type="radio" name="user_title" value={title} /> {title}
      </label>
    ) }

    <br/><br/>
    <input type="text" name="user_name" placeholder="Name" />

    {{
      user_name: {value: name},
      user_title: {value: title}
    }}

  </form>
  <h3>
    Hi {title} {name}!
  </h3>
</div>
