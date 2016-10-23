var Nite = require('nite'),
    view = require('./view.js');

class Imgur extends Nite.Component{

  init({clientID}){

    this.vars({
      query: '',
      request: null
    });

    this.clientID = clientID;
    this.query.debounce(300).watch( q => this.search(q) );
    this.render( view(this, this.std) );

  }

  search(query){
    var promise,url;

    if(!query) return this.request.set(null);
    query = encodeURIComponent(query);
    url = `https://api.imgur.com/3/gallery/search/top/0?q=${query}`;

    promise = fetch(url,{
      headers: new Headers({
        Authorization: `Client-ID ${this.clientID}`
      })
    })

    .then(response => response.json())
    .then(data => {
      var result;
      if(!data.success) throw new Error();
      for(result of data.data) if(!result.is_album) return result.link;
    });

    this.request.value = this.promise(promise);
  }

}

module.exports = Imgur;
