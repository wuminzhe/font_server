var sys = require('sys')
var express = require('express');
var app = express();
var fs = require('fs')

function run(cmd, cb) {
  var exec = require('child_process').exec;
  exec(cmd, cb);
}

var fonts = [
  {path: './fonts/kaiti.ttf', name: '楷体'},
  {path: './fonts/simhei.ttf', name: '黑体'},
  {path: './fonts/zhangh.ttf', name: '张顥硬笔'}
]

function readResultImage(filename, cb) {
  fs.readFile('./'+filename, function(err, data) {
    if (err) {
      readResultImage(cb);
    } else {
      cb(data);
    }
  });

}

String.prototype.startsWith = function (substring) {
  var reg = new RegExp("^" + substring);
  return reg.test(this);
};

rnd.today=new Date();
rnd.seed=rnd.today.getTime();

function rnd() {
  rnd.seed = (rnd.seed*9301+49297) % 233280;
  return rnd.seed/(233280.0);
};

function rand(number) {
  return Math.ceil(rnd()*number);
};

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public')); //注意顺序，为了能够用到404，要把这个提前。
  app.use(app.router);
});

app.get('/text', function(req, res){
  var text = req.query.text;
  var family = req.query.family || 0;
  var color = req.query.color || 'black';
  var size = req.query.size || '36';
  var style = req.query.style || ''

  if( text==undefined ) {
    res.send(444, 'Text param needed!');
  } else {
    if(color.startsWith('0x')) {
      color = color.replace('0x', '#');
    }
    var font = fonts[family] ? fonts[family] : fonts[0];

    var filename = rnd()+".png";
    var cmd = "convert -background transparent -fill '"+color+"' -font "+font.path+" -pointsize "+size+" label:'"+text+"' "+filename;
    run(cmd, function(error, stdout, stderr){
      if(error) {
        res.send(400, 'There is something wrong with the params. '+error.toString());
      } else {
        readResultImage(filename, function(data){
          res.writeHead(200, {'Content-Type': 'image/png'});
          res.end(data); // Send the file data to the browser.
          fs.unlinkSync('./'+filename);
        });
      }
      
    });
  }

});

app.get('/font_families', function(req, res){
  res.setHeader('content-type','application/json; charset=UTF-8');
  result = [];
  for(var i=0;i<fonts.length;i++){
    result.push({id: i, name: fonts[i].name});
  }
  res.end(JSON.stringify(result));
});

app.listen(3002);
console.log('Listening on port 3002');