var Highlights = require('highlights');
var highlighter = new Highlights();
var path = require('path');
var fs = require('fs');
var folders = ['form'];
var folder,files,file;

highlighter.requireGrammarsSync({
  modulePath: require.resolve('language-babel/package.json')
});

for(folder of folders){
  files = fs.readdirSync(path.resolve(__dirname,'src',folder));
  for(file of files) if(file.match(/\.js$/)){
    fs.writeFileSync(path.resolve(__dirname,'src',folder,file).replace(/\..*?$/,'.html'),
      highlighter.highlightSync({
        filePath: path.resolve(__dirname,'src',folder,file) + '.jsx',
        fileContents: fs.readFileSync(path.resolve(__dirname,'src',folder,file),'utf8'),
        scopeName: file + '.jsx'
      })
    );
  }
}
