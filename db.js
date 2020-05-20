// https://cn.mongoosedoc.top/docs/index.html
var mongoose = require('mongoose'); //引入mongoose

/**
 * 数据库账号、密码
 */
var mongoUsername = 'skm';
var mongoPasswd = '6967668';

/**
 * 开发环境 使用变量
 */

var ip = 'localhost';
var port = '27017';
var database = 'editor';


/**
 * 在线环境 使用变量
 */
var ip_ol = '47.96.2.170'; 
var port_ol = '27017';
var database_ol = 'blogEditor'; // 在线使用该库名

/** 
 *  环境变量切换
 *  在线： http://47.96.2.170:3000
 *  开发： http://127.0.0.1:3000
 *  const baseAddress = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000': 'http://127.0.0.1:3000';
 */

 console.log('process.env.NODE_ENV',process.env.NODE_ENV)
if(process.env.NODE_ENV === 'production'){
  ip = ip_ol
  port = port_ol
  database = database_ol
}

/**
 * 该地址格式：mongodb://username:password@host:port/database[?options]
 * 默认port为27017
 */

mongoose.connect('mongodb://' + mongoUsername + ':' + mongoPasswd + '@' + ip + ':' + port + '/' + database); // 连接数据库
// mongoose.connect('mongodb://'+ ip + ':' + port + '/' + database); // 连接数据库


console.log('连接数据库：' + 'mongodb://' + mongoUsername + ':' + mongoPasswd + '@' + ip + ':' + port + '/' + database)


var db = mongoose.connection;

// console.log(db.collection())

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