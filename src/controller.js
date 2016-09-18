module.exports = class{

  constructor(nite,{view}){

    nite.vars({
      scrollTop: 0
    },this);

    this.samples = [
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
