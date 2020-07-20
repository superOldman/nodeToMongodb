// 数据库
require('./db');

// 基础依赖
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//业务模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var editorRouter = require('./routes/editor');
var searchRouter = require('./routes/search');
var folderRouter = require('./routes/folder');
var statsHomeRouter = require('./routes/statsHome');

//实例化
var app = express();

// 设置 视图为 .html 文件
var ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置图片返回路径
app.get('/public/images/*', function (req, res) {
  res.sendFile(__dirname + '/' + req.url);
  console.log('Request for ' + req.url + ' received.');
});
// app.get('*', function (req, res) {
//   res.sendFile( __dirname + "/" + req.url );
//   console.log("Request for " + req.url + " received.");
// })

/**
 *  express-session 配置
 */
const session = require('express-session');
app.use(
  session({
    secret: 'skmtest',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 12 }
  })
);

// 跨域配置
app.all('*', function (req, res, next) {
  var orginList = [
    'http://www.sicilymarmot.top',
    'http://www.sicilymarmot.top:80',
    'http://www.sicilymarmot.top/dist',
    'http://www.sicilymarmot.top:80/dist',
    'http://sicilymarmot.top',
    'http://sicilymarmot.top:80',
    'http://sicilymarmot.top/dist',
    'http://sicilymarmot.top:80/dist',
    'http://localhost:9000',
    'http://localhost:4000',
    'http://localhost:5503',
    'http://127.0.0.1:5503',
    'http://47.96.2.170:80'
  ];


  console.log('拦截跨域');
  console.log(req.headers.origin)
  if (orginList.includes(req.headers.origin.toLowerCase())) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  // 允许所有跨域
  // res.header('Access-Control-Allow-Origin', '*');

  //允许的header类型
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  //客户端携带证书方式（带cookie跨域 必须）
  res.header('Access-Control-Allow-Credentials', 'true');
  //跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options') res.send(200);
  //让options尝试请求快速结束
  else next();
});

/**
 *  session 拦截
 */
app.all('*', function (req, res, next) {

  // 需拦截
  const InterFace = [
    'users',
    'editor',
    'folder',
    'statsHome',
  ]
  let url = req.originalUrl;
  let interFaceFirst = url.replace(/(^\s*)|(\s*$)/g, "").split('/');

  if (InterFace.includes(interFaceFirst[1]) && interFaceFirst[2] !== 'login') {
    let username = req.session.username;
    console.log('拦截登录：', username)
    if (username) {
      next();
    } else {
      res.status(403).send({
        code: 1,
        message: '请登录！'
      });
    }
  } else {
    next();
  }
});

// 通用接口
app.use('/', indexRouter);
// 用户（登录）接口
app.use('/users', usersRouter);
// 后台编辑器接口
app.use('/editor', editorRouter);


app.use('/search', searchRouter);
app.use('/folder', folderRouter);
app.use('/statsHome', statsHomeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Passport Config
// const passport = require('passport');
// require('./config/passport');

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());





// var fs = require('fs');
// var path = require('path');

// let fileSize = 0;
// function countFileSize(src) {
//   //转换为绝对路径
//   const param = path.resolve(src);
//   fs.stat(param, function (err, stats) {
//     //如果是目录的话，遍历目录下的文件信息
//     if (stats.isDirectory()) {
//       fs.readdir(param, function (err, file) {
//         file.forEach((e) => {
//           //遍历之后递归调用查看文件函数
//           //遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
//           var absolutePath = path.resolve(path.join(param, e));
//           return countFileSize(absolutePath)
//         })
//       })
//     } else {
//       //如果不是目录，打印文件信息
//        fileSize += stats.size / 1024 / 1024;
//        console.log(fileSize)
//     }
//   })
// }

// console.log(fileSize)

// console.log(countFileSize('public/images'))

// console.log(fs)



// function myGetTime(time) {
//   let myTime = new Date();
//   if (time) {
//     myTime = new Date(time);
//   }

//   return `${myTime.getFullYear()}-${addZero(myTime.getMonth() + 1)}-${addZero(myTime.getDate())}`
//   //  `${addZero(myTime.getHours())}:${addZero(myTime.getMinutes())}:${addZero(myTime.getSeconds())}`
// }
// function addZero(num) {
//   return num >= 10 ? num : `0${num}`
// }




// console.log('test_time')
// console.log(myGetTime())


let testMod = require('./models/testMod.js');
const { EWOULDBLOCK } = require('constants');

// console.log(testMod.testModel)

// testMod.getMod({
//   name: 'qqq',
//   arr: [
//     { id: 1, content: '11111' },
//     { id: 2, content: '22222' },
//   ]
// }).save().then(data =>{
//   console.log(data)
// })
// {
//   arr: [{ id: 1, content: '11111' }, { id: 2, content: '22222' }],
//     updated_at: 2020 - 06 - 01T08: 58: 00.120Z,
//       _id: 5ed4c318f7a4e6b8b0e99082,
//         name: 'qqq',
//           __v: 0
// }
// testMod.getMod().findByIdAndUpdate('5ed4b1c07bf5e7d0ac922626', { $set: { name: 'zy2' } }, { new: true }).then(data => {
//   console.log(data)
// })
// testMod.getMod().findByIdAndUpdate('5ed4c318f7a4e6b8b0e99082', { $pull: { arr: {id:1} } }, { new: true }).then(data => {
//   console.log(data)
// })
module.exports = app;
