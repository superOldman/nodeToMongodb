var express = require('express');
var router = express.Router();
var URL = require('url'); //引入URL中间件，获取req中的参数需要
// html对象
let htmlModel = require('../models/htmlModel');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// 判断登陆
router.get('/islogin', function(req, res, next) {
  if (!req.session.username) {
    res.status(403).send({
      code: 1,
      message: '请登录！'
    });
  } else {
    res.send({
      code: 0,
      message: '已经登陆！',
      username: req.session.username,
      userMessage:{
        title:'管理员',
        userName:req.session.username,
        imgUrl:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      }
    });
  }
});


// 查寻列表
router.get('/list', function(req, res, next) {
  let findData = {}
  if(req.query.author){
    findData = { author: req.query.author }
  }
  htmlModel
    .find(findData)
    .sort('updated_at')
    .exec(function(err, aa, count) {
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

// 按照id查找文章
router.get('/searchById', function(req, res, next) {
  htmlModel
    .findOne({ _id: req.query.id })
    // sort('updated_at').
    .exec(function(err, data, count) {
      if(err){
        console.log(err)
      }else{
        res.send({
          code: 0,
          list: data
        })
      }
    });
});





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
