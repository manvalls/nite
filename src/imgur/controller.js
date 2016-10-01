module.exports = function( nite, {view, clientID} ){

  nite.vars({
    query: '',
    request: null
  },this);

  this.query.debounce(300).watch(query => {
    var promise,url;

    if(!query) return this.request.set(null);
    query = encodeURIComponent(query);
    url = `https://api.imgur.com/3/gallery/search/top/0?q=${query}`;

    promise = fetch(url,{
      headers: new Headers({
        Authorization: `Client-ID ${clientID}`
      })
    })

    .then(response => response.json())
    .then(data => {
      var result;
      if(!data.success) throw new Error();
      for(result of data.data) if(!result.is_album) return result.link;
    });

    this.request.value = nite.promise(promise);
  });

  nite.render( view(this, nite.std) );

};
