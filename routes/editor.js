var express = require('express');
var router = express.Router();
// 文件上传
var multiparty = require('multiparty');


var URL = require('url'); //引入URL中间件，获取req中的参数需要
// html对象
let htmlModel = require('../models/htmlModel');


/* GET editor listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//定义接口
router.post('/saveHtml', function(req, res) {
  htmlModel
    .instert({
      title: req.body.title,
      info: req.body.info,
      content: req.body.content,
      markdown: req.body.markdown,
      author: req.body.author,
      updated_at: Date.now()
    })
    .then(function(data) {
      //保存数据
      res.send({
        code: 1,
        message: '保存成功'
      });
    });
});

router.post('/saveEditorHtml', function(req, res){
  let seachId = '';
  let editDoc = {};
  for(let item in req.body){
    if(item === 'id'){
      seachId = req.body[item]
    }else{
      editDoc[item] = req.body[item];
    }
  }
  htmlModel
  .findByIdAndUpdate(seachId, editDoc).then(function(data){
    res.send({
      code: 1,
      message: '修改成功'
    })
  })
})


// 上传图片
router.post('/uploadImg', function(req, res) {
  var form = new multiparty.Form();
  form.uploadDir = './public/images'; //这里可以设置图片上传的路径，默认为当前用户下的temp文件夹
  form.parse(req, function(err, fields, files) {
    //files即为上传图片的信息
    if (err) {
      console.log('err', err);
    }
    if (files) {
      res.send({
        success: 1, // 0 表示上传失败，1 表示上传成功
        message: '上传成功。',
        ...files // 文件信息
      });
    }
  });
});

//删除
router.get('/destroy', function(req, res) {
  // console.log(URL.parse(req.url, true)); // 废弃
  // var params = new URL(req.url);

  console.log(req.query.id);
  // 根据待办事项的id 来删除它
  htmlModel.deleteOne({ _id: req.query.id}, function (err, doc) {
    if(err)
    {
        console.log(err)
        return
    }
    // console.log(doc) // { n: 1, ok: 1, deletedCount: 1 }
    htmlModel.find().exec(function(err,data){
      if(err)
      {
          console.log(err)
          return
      }
      res.send({code: 0,article: data})
    })
    
  })
});

//修改
// router.get('/edit', function(req, res) {
//   var params = URL.parse(req.url, true).query;
//   //res.send(params);
//   TodoModel.findById(params.id, function(err, todo) {
//     // res.redirect('edit'); //返回首页
//     res.send(todo);
//   });
// });

module.exports = router;