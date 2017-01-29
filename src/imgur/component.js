module.exports = function( {clientID} ){
    var query = this.var(),
        request = this.var(),
        {when} = this.std;

    // Listen for changes at the query model

    query.debounce(300).watch(query => {
      var url;

      if(!query){
        // Ignore previous request
        request.value = null;
        return;
      }

      query = encodeURIComponent(query);
      url = `https://api.imgur.com/3/gallery/search/top/0?q=${query}`;

      // Launch the request
      request.value = fetch(url,{
        headers: new Headers({
          Authorization: `Client-ID ${clientID}`
        })
      }).then(function(response){
        return response.json();
      }).then(function(data){
        var result;

        if(!data.success) throw new Error();

        // Return the first non-album result
        for(result of data.data) if(!result.is_album) return result.link;

      });

    });

    // Render the UI

    return <div style={{textAlign: 'center'}}>
      <input placeholder="Search in imgur" value={query}/>
      <hr/>
      <div>

        { when(request.isNull, 'Type something!')
          .elseWhen(request.done.not, 'Loading...')
          .elseWhen(request.failure, 'There was an error!')
          .elseWhen(request.result,
            <img src={request.result} style={{maxWidth: '180px'}}/>
          ).else('Sorry, no results!') }

      </div>
    </div>;
};
