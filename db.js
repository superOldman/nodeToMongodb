// https://cn.mongoosedoc.top/docs/index.html
var mongoose = require('mongoose'); //引入mongoose
// mongoose.connect('mongodb://localhost/editor'); //连接到mongoDB的todo数据库
var mongoUsername = 'skm';
var mongoPasswd = '6967668';
var ip = 'localhost:27017';

// const baseAddress =
//   process.env.NODE_ENV === 'production'
//     ? 'http://47.96.2.170:3000'
//     : 'http://127.0.0.1:3000';
// console.log(baseAddress);
// console.log(process.env);
var ip_ol = '47.96.2.170';
var port_ol = '27017';
var database = 'blogEditor'; // 在线使用该库名
mongoose.connect('mongodb://' + mongoUsername + ':' + mongoPasswd + '@' + ip + '/editor'); // 开发数据库
// mongoose.connect('mongodb://'+mongoUsername+':' +mongoPasswd+'@'+ip_ol+':'+port_ol+'/'+database); //在线数据库
//该地址格式：mongodb://username:password@host:port/database[?options]
//默认port为27017

var db = mongoose.connection;
db.on('error', function callback() {
  //监听是否有异常
  console.log('Connection error');
});
db.once('open', function callback() {
  //监听一次打开
  //在这里创建你的模式和模型
  console.log('we are connected!');
});

module.exports = mongoose;
