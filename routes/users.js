var express = require('express');
var router = express.Router();

// user对象
let userModel = require('../userModel');

// 加密
let bcrypt = require('bcryptjs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//登陆接口
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
        dataJson.message = '登陆成功';
      }else{
        dataJson.code = 1;
        dataJson.message = '登陆失败';
      }
      res.send(dataJson)

    });
  })
});

// 注册
router.post('/register',function(req,res,next){
  bcrypt.genSalt(10,function(err, salt){
    bcrypt.hash(req.body.password,salt,function(err,hash){

      userModel.instert({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        updated_at: new Date
      }).then(function(data){
        console.log('-----')
        console.log(data)
        console.log('-----')
        res.send('注册成功')

      })    
    })
  })
})

module.exports = router;
