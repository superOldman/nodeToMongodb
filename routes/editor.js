var express = require('express');
var router = express.Router();
// 文件上传
var multiparty = require('multiparty');
var formidable = require('formidable');

var beforeIp = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000/' : 'http://localhost:3000/';
var URL = require('url'); //引入URL中间件，获取req中的参数需要
// html对象
let htmlModel = require('../models/htmlModel');
let folderModel = require('../models/folderModel');
let tagModel = require('../models/tagModel');
let topModel = require('../models/topModel');


/* GET editor listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//保存文章
router.post('/saveHtml', function (req, res) {

  htmlModel.instert({
    title: req.body.title,
    info: req.body.info,
    content: req.body.content,
    markdown: req.body.markdown,
    author: req.body.author,
    saveImageUrl: req.body.saveImageUrl.startsWith('http') ? req.body.saveImageUrl : beforeIp + req.body.saveImageUrl,
    hasTags: req.body.hasTags,
    hasFolder: req.body.hasFolder
  })
    .then(function (data) {

      if (data.hasFolder) {
        //* folderHasPaper：[{
        //*    _id: 文章id,
        //*    title: 文章标题
        //*  }]
        folderModel.findOneAndUpdate({ folderName: data.hasFolder }, { $push: { folderHasPaper: { _id: data._id, title: data.title } } }).then()
      }

      if (data.hasTags.length) {
        // var insertArr = [];
        data.hasTags.forEach((item) => {
          // insertArr.push({ name: item })
          tagModel.update({ name: item }, { name: item }, { upsert: true, setDefaultsOnInsert: true }).then()
        })

      }
    }).then(() => {
      //保存数据
      res.send({
        code: 1,
        message: '保存成功'
      });
    })
});


//保存编辑过的文章
router.post('/saveEditorHtml', function (req, res) {
  let seachId = '';
  let editDoc = {};
  for (let item in req.body) {
    if (item === '_id') {
      seachId = req.body[item]
    } else {
      editDoc[item] = req.body[item];
    }
  }

  htmlModel
    .findByIdAndUpdate(seachId, editDoc).then(function (data) {
      res.send({
        code: 1,
        message: '修改成功'
      })
    })
})


// 上传图片 利用：multiparty
// router.post('/uploadImg', function (req, res) {
//   var form = new multiparty.Form({ encoding: "utf-8" });
//   console.log(form)

//   form.uploadDir = './public/images'; //这里可以设置图片上传的路径，默认为当前用户下的temp文件夹

//   form.parse(req, function (err, fields, files) {

//     console.log('file')
//     console.log(files)
//     console.log(arguments)
//     //files即为上传图片的信息
//     if (err) {
//       console.log('err', err);
//     }
//     if (files) {
//       res.send({
//         success: 1, // 0 表示上传失败，1 表示上传成功
//         message: '上传成功。',
//         ...files // 文件信息
//       });
//     }
//   });
// });

// 上传图片 利用：formidable 
router.post('/uploadImg', function (req, res) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: './public/images',
  });

  form.parse(req, (err, fields, files) => {
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
router.get('/destroy', function (req, res) {
  // console.log(URL.parse(req.url, true)); // 废弃
  // var params = new URL(req.url);

  // 根据待办事项的id 来删除它
  htmlModel.deleteOne({ _id: req.query.id }, function (err, doc) {
    if (err) {
      console.log('err', err)
      return
    }
    // console.log(doc) // { n: 1, ok: 1, deletedCount: 1 }
    htmlModel.find().exec(function (err, data) {
      if (err) {
        console.log('err', err)
        return
      }
      res.send({ code: 0, article: data })
    })

  })
});


// 置顶
router.post('/setTop', function (req, res) {
  // let obj = {
  //   _id: '12313',
  //   stick: true
  // }
  let { _id, stick} = req.body;

  console.log(_id)
 
  console.log(stick)
  console.log({stick})
  // topModel.findByIdAndUpdate(_id,{stick},{ new: true })
  
  // .then((data,a) => {
  //   console.log(data,a)
  //   res.send({
  //     code: 0,
  //     success: '成功',
  //     data
  //   })
  // }).catch(err=>{
  //   console.log(err)
  // })

    res.send({
      code: 0,
      success: '还没写完',
    })

})


module.exports = router;

