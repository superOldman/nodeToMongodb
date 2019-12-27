var express = require('express');
var router = express.Router();
let bcrypt = require('bcryptjs');


var mongoose = require('mongoose'); //引入对象
var TodoModel = mongoose.model('list');//引入模型

let UsersFunction = require('../constrillers/usersFunction')
// 设置用户
let testSchma = mongoose.Schema({ name:String,email:String,password:String });

testSchma.methods.getName = function (){
   let myname = this.name ? 'my name is ' + this.name : 'i do not have name';
   console.log(myname)
 }

 let testModel = mongoose.model('test',testSchma);

//  let skm = new testModel({
//   name:'skmUser',
//   password:'az6967668'
// })
// // console.log(skm.name)
// // skm.getName()

// skm.save((err,skm)=>{
//   if(err){
//     console.error(err)
//   }
//   console.log('注册成功！')
// }) 

// for(let i=0;i<100;i++){
//   new testModel({ name : 'skm'+i }).save(function(err,data){
//     console.log('succeed ！')
//   })
// }
 

// testModel.find({'name':/1$/},function(err,data){
//   console.log(data)
// })

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



// //注册
// router.post('/register',function(req,res,next){
//   bcrypt.genSalt(10,function(err, salt){
//     bcrypt.hash(req.body.password,salt,function(err,hash){
//       let skm = new testModel({
//         name: req.body.name,
//         password: hash
//       }).save(function(err,data){
//         console.log('-----')
//         console.log(data)
//         console.log('-----')

//       })    
//     })
//   })
// })








/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.get('/login', function(req, res, next) {
//   res.render('login');
// });


//登陆接口
router.post('/login',function(req,res){
  let username = req.body.username;
  let password = req.body.password;
  testModel.findOne({name:username})
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

// router.post('/signup', function(req,res,next){
//   // console.log('zou')

// });
router.post('/register',function(req,res,next){
  bcrypt.genSalt(10,function(err, salt){
    bcrypt.hash(req.body.password,salt,function(err,hash){
      let skm = new testModel({
        name: req.body.username,
        email: req.body.email,
        password: hash
      }).save(function(err,data){
        console.log('-----')
        console.log(data)
        console.log('-----')
        res.send('注册成功')

      })    
    })
  })
})

router.get('/islogin',function(req,res,next){
   if(!req.session.username){
      res.send({
        code: 1,
        message: '请登录！'
      })
   }else{
    res.send({
      code: 0,
      message: '已经登陆！'
    })
   }
})



// //定义接口
// router.post('/create', function(req, res) {
//   new TodoModel({ //实例化对象，新建数据
//       title: req.body.title, //定义一个属性title，类型为String
//       content: req.body.content, //定义一个属性content，类型为String
//       updated_at: Date.now()
//   }).save(function(err, todo, count) { //保存数据
//       console.log('内容', todo, '数量', count); //打印保存的数据
//       res.redirect('/'); //返回首页
//   });
// });


router.get('/search', function(req, res, next) {

  console.log('search接口',req.session)
  testModel.
  find().
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
