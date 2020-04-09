var express = require('express');
var router = express.Router();

// user对象
let userModel = require('../models/userModel');

// 加密
let bcrypt = require('bcryptjs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录接口
router.post('/login',function(req,res){
  let username = req.body.username;
  let password = req.body.password;

  userModel.findOne({username})
  .exec(function(err, data){
    bcrypt.compare( password, data.password, function(err, passwordisTure) {
      let dataJson = {}
      if(passwordisTure){
        req.session.username = username;
        dataJson.code = 0;
        dataJson.message = '登录成功';
        // dataJson.userMessage = {
        //   title:'管理员',
        //   userName:req.session.username,
        //   imgUrl:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        // }
      }else{
        dataJson.code = 1;
        dataJson.message = '登录失败';
      }
      res.send(dataJson)

    });
  })
});

// 注册
router.post('/register',function(req,res,next){
  console.log('zhuce', req.body)
  console.log('zhuce', req.query)
  bcrypt.genSalt(10,function(err, salt){
    bcrypt.hash(req.body.password,salt,function(err,hash){
      userModel.instert({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        updated_at: new Date()
      }).then(function(data){
        res.send({
          code: 1,
          message: '注册成功'
        })
      })    
    })
  })
})

// 推出登录
router.get('/logout',function(req,res){
  req.session.username = null;
  res.send({
    code: 0,
    message: '退出登录'
  })
})

module.exports = router;


// 密码解析式例

// 加密 npm网址 https://www.npmjs.com/package/bcryptjs
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