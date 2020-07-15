const express = require('express');
const router = express.Router();
// 文件上传
const multiparty = require('multiparty');
const formidable = require('formidable');

const beforeIp = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000/' : 'http://localhost:3000/';

// html对象
const htmlModel = require('../models/htmlModel');
const folderModel = require('../models/folderModel');
const tagModel = require('../models/tagModel');
const topModel = require('../models/topModel');


/* GET editor listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//保存文章
router.post('/saveHtml', function (req, res) {
  const { title, info, content, markdown, author, saveImageUrl, hasTags, hasFolder } = req.body;

  htmlModel.instert({
    title, info, content, markdown, author,
    saveImageUrl: saveImageUrl.startsWith('http') ? saveImageUrl : beforeIp + saveImageUrl,
    hasTags,
    hasFolder
  }).then(function (data) {
    // 添加到文件夹列表
    if (data.hasFolder) {
      //* folderHasPaper：[{
      //*    _id: 文章id,
      //*    title: 文章标题
      //*  }]
      folderModel.findOneAndUpdate({ folderName: data.hasFolder }, { $push: { folderHasPaper: { _id: data._id, title: data.title } } }).then()
    }

    if (data.hasTags.length) {
      data.hasTags.forEach((item) => {
        tagModel.update({ name: item }, { name: item }, { upsert: true, setDefaultsOnInsert: true }).then()
      })
    }
  })
    .then(() => {
      //保存数据
      res.send({
        code: 0,
        message: '保存成功'
      });
    })
});


//保存编辑过的文章
router.post('/saveEditorHtml', async function (req, res) {

  const { _id, ...editDoc } = req.body;
  const { hasFolder, hasTags } = await htmlModel.findById(_id, { hasTags: 1, hasFolder: 1 })

  // 查看是否修改了标签
  let clearup = {};
  editDoc.hasTags.forEach(item => {
    for (let i = 0; i < hasTags.length; i++) {
      if (item === hasTags[i]) {
        delete clearup[item]
        break
      }
      clearup[item] = true;
    }
  })

  const clearupArr = Object.keys(clearup);
  if (clearupArr.length) {
    clearupArr.forEach(item => {
      tagModel.update({ name: item }, { name: item }, { upsert: true, setDefaultsOnInsert: true }).then()
    })
  }

  // 查看是否修改了文件夹

  if (hasFolder !== editDoc.hasFolder) {
    folderModel.findOneAndUpdate({ folderName: hasFolder }, { $pull: { folderHasPaper: { _id } } }).then();
    folderModel.findOneAndUpdate({ folderName: editDoc.hasFolder }, { $push: { folderHasPaper: { _id, title: editDoc.title } } }).then();
  }

  await htmlModel.findByIdAndUpdate(_id, editDoc)
  res.send({ code: 0, message: '修改成功' })

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

//删除文章
router.post('/destroy', async function (req, res) { // 接收 _id
  // 删除 模型数组里某一项
  // { $pull: { resumeList: { mallId: mallId } } }

  // 查询数组某一项
  // { participant: { $elemMatch: { $eq: 1 } } }

  try {
    // 尝试删除top列表 
    await topModel.findByIdAndDelete(req.body._id);

    await folderModel.findOneAndUpdate({ folderHasPaper: { $elemMatch: { _id: req.body._id } } }, { $pull: { folderHasPaper: { _id: req.body._id } } });
    // 根据待办事项的id 来删除它
    const result = await htmlModel.findByIdAndDelete(req.body._id);
    res.send({
      code: 0,
      data: result
    })
  } catch (err) {
    console.log(err)
  }

});


// 置顶
router.post('/setTop', async function (req, res) {

  const { _id, stick } = req.body;
  console.log(stick)

  if (stick) {
    const result = await topModel.find().lean();
    console.log('setTopresult',result)
    if (result.length < 2) {
      const { _id: id, title, info, saveImageUrl }  = await htmlModel.findByIdAndUpdate(_id, { stick }, { new: true }).lean().select('_id title info saveImageUrl');
      const update = {
        _id: id, title, info, cover: saveImageUrl
      }
      const doc = await topModel.findByIdAndUpdate(_id, update, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();

      res.send({
        code: 0,
        success: doc,
      })

    } else {
      res.send({
        code: 1,
        message: '置顶数量已达到上限'
      })
    }
  } else {
    await htmlModel.findByIdAndUpdate(_id, { stick }, { new: true }).lean().select('title');
    const data = await topModel.findByIdAndDelete(_id);
    res.send({
      code: 0,
      success: data,
    })
  }




})


module.exports = router;

