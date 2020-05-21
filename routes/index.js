var express = require('express');
var router = express.Router();
var URL = require('url'); //引入URL中间件，获取req中的参数需要
// html对象
let htmlModel = require('../models/htmlModel');
let folderModel = require('../models/folderModel');
let tagModel = require('../models/tagModel');
let topModel = require('../models/topModel');


/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('空')
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
router.get('/list', function (req, res, next) {
  let findData = {};
  let projection = { markdown: 0, content: 0 }
  let options = { sort: { updated_at: -1 } }

  if (req.query.author) {
    findData.author = req.query.author;
  }
  if (req.query.unclassified) {
    findData.hasFolder = '';
  }

  if(req.query.page && req.query.pageSize){
    // .limit(pageSize) 限制数量
    // .skip(Count) 跳过几个
    options.limit = req.query.pageSize * 1;
    options.skip = (req.query.page - 1) * req.query.pageSize;
    Promise.all([ 
      htmlModel.schema().collection.stats(), 
      htmlModel.find(findData, projection, options),
    ]).then(data => {
        res.send({
          code: 0,
          data: {
            list: data[1],
            sum: data[0].count
          }
        });
      })
  }else{
    htmlModel
      .find(findData, projection, options)
      .exec(function (err, doc, count) {

        console.log(doc)
        res.send({
          code: 0,
          data: doc
        });
      });
  }

  
 

});


// 查寻 文件夹或标签列表内容
router.get('/folderOrTagList', function (req, res, next) {

  // { participant: { $elemMatch: { $eq: 1 } } }
  let findData;
  if(req.query.hasTags){
    findData = { hasTags: { $elemMatch: { $eq: req.query.hasTags } } }
  }else{
    findData = req.query;
  }

  let projection = { markdown: 0, content: 0 }
  let options = { sort: { updated_at: -1 } }
  
  htmlModel.find(findData, projection, options)
    .exec(function (err, doc, count) {
      res.send({
        code: 0,
        data: doc
      });
    });
});


//置顶列表
router.get('/topList', function (req, res, next) {
  topModel.find({},null,{ limit: 2}).exec(function(err,doc){
    res.send({
      code: 0,
      data: doc
    })
  })
})

// 文件夹和标签列表
router.get('/folderAndTagList', function (req, res, next) {
// , tagModel.find(), 
// , folderModel.find()
  Promise.all([folderModel.find({}, null, { lean: true }), tagModel.find({}, null, { lean: true })]).then((data)=>{
    console.log(data)
      res.send({
        code: 0,
        data: { 
          folderList: data[0],
          tagList: data[1],
        }
      })
  })
  // topModel.find({}, null, { limit: 2 }).exec(function (err, doc) {
  //   res.send({
  //     code: 0,
  //     data: doc
  //   })
  // })
})
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
  htmlModel.findOne({ _id: req.query.id })
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
