module.exports = class{

  constructor(nite,{view}){

    nite.vars({
      scrollTop: 0
    },this);

    this.samples = [
      {
        result: {
          controller: require('./mirror/controller'),
          view: require('./mirror/view')
        },
        code: {
          selected: nite.var('view.js'),
          files: {
            'view.js': require('fs').readFileSync(__dirname + '/mirror/view.html','utf8'),
            'controller.js': require('fs').readFileSync(__dirname + '/mirror/controller.html','utf8'),
            'index.js': require('fs').readFileSync(__dirname + '/mirror/index.html','utf8')
          }
        }
      },
      {
        result: {
          controller: require('./imgur/controller'),
          view: require('./imgur/view'),
          clientID: 'e067354667a0505'
        },
        code: {
          selected: nite.var('view.js'),
          files: {
            'view.js': require('fs').readFileSync(__dirname + '/imgur/view.html','utf8'),
            'controller.js': require('fs').readFileSync(__dirname + '/imgur/controller.html','utf8'),
            'index.js': require('fs').readFileSync(__dirname + '/imgur/index.html','utf8')
          }
        }
      },
      {
        result: {
          controller: require('./form/controller'),
          view: require('./form/view')
        },
        code: {
          selected: nite.var('view.js'),
          files: {
            'view.js': require('fs').readFileSync(__dirname + '/form/view.html','utf8'),
            'controller.js': require('fs').readFileSync(__dirname + '/form/controller.html','utf8'),
            'index.js': require('fs').readFileSync(__dirname + '/form/index.html','utf8')
          }
        }
      }
    ];

    nite.render(view,[this,nite.std]);

  }

};
