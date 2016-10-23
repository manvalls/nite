module.exports = ({ query, request }, { when }) =>

<div style={{textAlign: 'center'}}>
  <input placeholder="Search in imgur" value={query}/>
  <hr/>
  <div>

    { request.to(request =>

      when(request, () =>
        when(request.success,
          when(request.result, <img src={request.result} style={{maxWidth: '180px'}}/>)
          .else('Sorry, no results!')
        )
        .elseWhen(request.failure, 'There was an error!')
        .else('Loading...')
      ).else('Type something!')

    ) }

  </div>
</div>
