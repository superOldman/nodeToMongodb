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
    cookie: { maxAge: 1000 * 60 * 60 }
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


  console.log('拦截跨域')
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
  if (req.url.includes('/users/logout') || req.url.includes('/editor')) {
    req.session.username = 'superOldMan';
    let username = req.session.username;

    console.log('拦截登录：', username)
    if (username) {
      next();
    } else {
      res.send({
        code: 1,
        message: '用户未登陆！'
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

module.exports = app;
