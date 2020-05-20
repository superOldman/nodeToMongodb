var express = require('express');
var router = express.Router();


let folderModel = require('../models/folderModel');//引入模型
let htmlModel = require('../models/htmlModel');//引入模型



// 文件夹列表
router.get('/getFolderList', function (req, res) {
  folderModel.find()
    .then(function (data) {
      res.send({
        code: 0,
        data
      })
    })
})

/**
 * 新增文件夹
 * 
 * req.body = {
 *   "info": "测试简介",
 *   "folderName": "javascript",
 *   "cover": "https://t8.baidu.com/it/"
 * }
 *
 */
router.post('/saveFolder', function (req, res) {
  folderModel.instert(req.body).then(function (data) {
    res.send({
      code: 0,
      message: '保存成功！',
      data
    })
  })
});


/**
 * 修改文件夹
 *
 * req.body = {
 *   "_id": "5ec25fd5f7ff21b2409e6822", *
 *   "info": "测试简介",
 *   "folderName": "javascript",
 *   "cover": "https://t8.baidu.com/it/"
 * }
 *
 */
router.post('/saveEditorFolder', function (req, res) {
  folderModel.findByIdAndUpdate(req.body._id,req.body,{new:true})
  .then((data)=>{
      res.send({
        code: 0,
        message: '保存成功！',
        data
      })
  });
});


/** 
 * 向文件夹添加文章
 * 
 * req.body = {
 *  _id： 文件夹id,
 *  folderHasPaper： [{
 *    _id:   文章id,
 *    title: 文章标题
 *  }]
 * }
 * 
 */ 
router.post('/pushPaper',function(req,res){
  console.log('pushPaper:')
  console.log(req.body)
  folderModel.findByIdAndUpdate(req.body._id, { $push: { folderHasPaper: req.body.folderHasPaper }},{new: true})
  .then((data)=>{
    console.log(data)
    console.log(data.folderHasPaper)
    data.folderHasPaper.forEach((item)=>{
      console.log(data.folderName)
      htmlModel.findByIdAndUpdate(item._id, { hasFolder: data.folderName}).then()
    })
    return data

  }).then((data)=>{
    res.send({
      code: 0,
      data: data.folderHasPaper
    })
  })
})



/**
 * 删除文件夹
 *
 * req.body = {
 *  _id： 文件夹id,
 * }
 *
 */
router.post('/deleteFolder', function (req, res) {
  folderModel.findByIdAndDelete(req.body._id)
    .then((data) => {
      res.send({
        code: 0,
        message: '删除成功！'
      })
    })
})





module.exports = router;