var Mirror = require('./mirror/component'),
    Imgur = require('./imgur/component'),
    Form = require('./form/component'),
    Nite = require('nite');

class Main extends Nite.Component{

  init({view}){

    this.vars({
      scrollTop: 0
    });

    this.samples = [
      {
        result: <Mirror/>,
        code: {
          selected: this.var('component.js'),
          files: {
            'component.js': require('fs').readFileSync(__dirname + '/mirror/component.html','utf8'),
            'index.js': require('fs').readFileSync(__dirname + '/mirror/index.html','utf8')
          }
        }
      },
      {
        result: <Form/>,
        code: {
          selected: this.var('component.js'),
          files: {
            'component.js': require('fs').readFileSync(__dirname + '/form/component.html','utf8'),
            'index.js': require('fs').readFileSync(__dirname + '/form/index.html','utf8')
          }
        }
      },
      {
        result: <Imgur clientID="e067354667a0505"/>,
        code: {
          selected: this.var('component.js'),
          files: {
            'component.js': require('fs').readFileSync(__dirname + '/imgur/component.html','utf8'),
            'index.js': require('fs').readFileSync(__dirname + '/imgur/index.html','utf8')
          }
        }
      }
    ];

    this.render( view(this,this.std) );

  }

}

module.exports = Main;
