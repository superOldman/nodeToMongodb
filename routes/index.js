var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); //引入对象

// 设置用户
let testSchma = mongoose.Schema({ name:String,email:String,password:String });

testSchma.methods.getName = function (){
   let myname = this.name ? 'my name is ' + this.name : 'i do not have name';
   console.log(myname)
 }

 let testModel = mongoose.model('test',testSchma);


var URL = require('url'); //引入URL中间件，获取req中的参数需要




// https://www.npmjs.com/package/bcryptjs
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("az6967668", salt); 

/**
 * hash生成
 * @param   {Number}  password  密码
 * 
 * salt 解析头
 * hash 组成的hash密码
 * 
 * let password = 'az6967668'
 * bcrypt.genSalt(10, (err, salt) => {
 *   bcrypt.hash(password, salt, (err, hash) => {
 *      console.log(hash)
 *   })
 * })
 */

/**
 * 密码hash对比
 * @param   {Number}  password  密码
 * @param   {Number}  myhash  库里面的hash密码
 * 
 * res 返回值 ture/false
 * 
 * let myhash = '$2a$10$O7ZSDdJP2gyHeUm2OVhRJudHq9aDsvwfUkha1tc79VL7SYmw.qkz6'
 * bcrypt.compare( password, myhash, function(err, res) {
 *    console.log(res)
 * });
 * 
 */









/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.get('/login', function(req, res, next) {
//   res.render('login');
// });




// 判断登陆
router.get('/islogin',function(req,res,next){

  console.log('/islogin   总router' )
   if(!req.session.username){
      res.send({
        code: 1,
        message: '请登录！'
      })
   }else{
    res.send({
      code: 0,
      message: '已经登陆！',
      username: req.session.username
    })
   }
})


// user对象
let htmlModel = require('../htmlModel');

 //定义接口
router.post('/saveHtml', function(req, res) {
  htmlModel.instert({ 
      title: req.body.title, 
      info: req.body.info,
      content: req.body.content,
      author: req.body.author,
      updated_at: Date.now()
  }).then(function(data) { //保存数据
      res.send({
        code: 1,
        message:'保存成功'
      })
  });
});
router.get('/list', function(req, res, next) {
  htmlModel.
  find({ author: req.query.author }).
  sort('updated_at').
  exec(function(err, aa, count) {
    res.send(aa);
  });
});



// router.get('/search', function(req, res, next) {
//   console.log('search接口',req.session)
//   testModel.
//   find().
//   // sort('updated_at').
//   exec(function(err, aa, count) {
//     res.send(aa);
//   });
// });

router.get('/searchById', function(req, res, next) {
  htmlModel.
  findOne({ _id: req.query.id}).
  // sort('updated_at').
  exec(function(err, aa, count) {
    res.send(aa);
  });
});
// //删除
// router.get('/destroy',function(req,res){
//   var params=URL.parse(req.url,true).query;
//   console.log(params);
//     //根据待办事项的id 来删除它
//     TodoModel.findById(params.id, function(err, todo) {
//       todo.remove(function(err, todo) {
//           res.redirect('/');
//       });
//   });
// });

// //修改
// router.get('/edit',function(req,res){
//   var params=URL.parse(req.url,true).query;
//   //res.send(params);
//   TodoModel.findById(params.id,function(err,todo){
//    // res.redirect('edit'); //返回首页
//     res.send(todo);

//   })
// });

// //更新
// router.post('/update',function(req,res){
//   TodoModel.findById(req.body._id,function(err,todo){
//     console.log(todo)
//     todo.name=req.body.name;
//     todo.updated_at=Date.now();
//     todo.save();
//   })
//  res.redirect('/'); //返回首页
// })

module.exports = router;
