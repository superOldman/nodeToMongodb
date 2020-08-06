const express = require('express');
const router = express.Router();
// 文件上传
const multiparty = require('multiparty');
const formidable = require('formidable');

const mongoose = require('../db.js');

// html对象
const htmlModel = require('../models/htmlModel');
const folderModel = require('../models/folderModel');
const tagModel = require('../models/tagModel');
const topModel = require('../models/topModel');
const imageModel = require('../models/imageModel');
const capacityModel = require('../models/capacityModel');

// utils
const { beforeIp, kbOrmb, backslashReplace } = require('../utils/utils');



/* GET editor listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 保存文章
router.post('/saveHtml', function (req, res) {
  const { title, info, content, markdown, author, saveImageUrl, paperUseImg, hasTags, hasFolder } = req.body;
  let cover = '';
  if (saveImageUrl) {
    cover = saveImageUrl.startsWith('http') ? saveImageUrl : beforeIp + saveImageUrl;
  }
  htmlModel.instert({
    title, info, content, markdown, author, paperUseImg,
    saveImageUrl: cover,
    hasTags,
    hasFolder
  }).then(function (data) {
    // 添加到文件夹列表
    if (data.hasFolder) {
      //* folderHasPaper：[{
      //*    _id: 文章id,
      //*    title: 文章标题
      //*  }]
      folderModel.findOneAndUpdate({ folderName: data.hasFolder }, { $push: { folderHasPaper: { _id: data._id, title: data.title } } }).then();
    }
    // 添加到标签列表
    if (data.hasTags.length) {
      data.hasTags.forEach((item) => {
        tagModel.update({ name: item }, { name: item }, { upsert: true, setDefaultsOnInsert: true }).then();
      });
    }

    // 添加到图片列表
    if (cover) {
      imageModel.findOneAndUpdate({ url: cover }, { $push: { connection: `《${title}》封面` } }, { upsert: true, setDefaultsOnInsert: true }).then();
    }
    if (paperUseImg.length) {
      paperUseImg.forEach((url) => {
        imageModel.findOneAndUpdate({ url }, { $push: { connection: `《${title}》引用` } }, { upsert: true, setDefaultsOnInsert: true }).then();
      });
    }
  })
    .then(async () => {

      // 统计文章size
      const { size, count } = await mongoose.connection.collection('paperList').stats();
      capacityModel.findOneAndUpdate({ capacity: 1 }, { paperDetail: { count, size } }).then();

      // 保存数据
      res.send({
        code: 0,
        message: '保存成功'
      });
    });
});


// 保存编辑过的文章
router.post('/saveEditorHtml', async function (req, res) {

  const { _id, ...editDoc } = req.body;
  const {
    hasFolder, hasTags, paperUseImg, saveImageUrl, title
  } = await htmlModel.findById(_id, { hasTags: 1, hasFolder: 1, paperUseImg: 1, saveImageUrl: 1, title: 1 });

  // 查看是否修改了标签
  let clearup = {};
  editDoc.hasTags.forEach(item => {
    clearup[item] = true;
    for (let i = 0; i < hasTags.length; i++) {
      if (item === hasTags[i]) {
        delete clearup[item];
        break;
      }
    }
  });

  const clearupArr = Object.keys(clearup);
  if (clearupArr.length) {
    clearupArr.forEach(item => {
      tagModel.update({ name: item }, { name: item }, { upsert: true, setDefaultsOnInsert: true }).then();
    });
  }

  // 查看是否修改了文件夹
  if (hasFolder !== editDoc.hasFolder) {
    folderModel.findOneAndUpdate({ folderName: hasFolder }, { $pull: { folderHasPaper: { _id } } }).then();
    folderModel.findOneAndUpdate({ folderName: editDoc.hasFolder }, { $push: { folderHasPaper: { _id, title: editDoc.title } } }).then();
  }

  // 查看是否修改了引用图片
  const newUseImg = editDoc.paperUseImg.filter(item => {
    return !paperUseImg.includes(item);
  });
  if (newUseImg.length) {
    newUseImg.forEach((url) => {
      imageModel.findOneAndUpdate({ url }, { $push: { connection: `《${editDoc.title}》引用` } }).then();
    });
  }

  const oldUseImg = paperUseImg.filter(item => {
    return !editDoc.paperUseImg.includes(item);
  });
  if (oldUseImg.length) {
    oldUseImg.forEach((url) => {
      imageModel.findOneAndUpdate({ url }, { $pull: { connection: `《${title}》引用` } }).then();
    });
  }


  // 封面
  const cover = editDoc.saveImageUrl.startsWith('http') ? editDoc.saveImageUrl : beforeIp + editDoc.saveImageUrl;

  if (cover !== saveImageUrl) {
    imageModel.findOneAndUpdate({ url: cover }, { $push: { connection: `《${editDoc.title}》封面` } }).then();
    imageModel.findOneAndUpdate({ url: saveImageUrl }, { $pull: { connection: `《${title}》封面` } }).then();
  }


  // 统计文章size
  const { size, count } = await mongoose.connection.collection('paperList').stats();
  capacityModel.findOneAndUpdate({ capacity: 1 }, { paperDetail: { count, size } }).then();

  await htmlModel.findByIdAndUpdate(_id, { ...editDoc, saveImageUrl: cover });
  res.send({ code: 0, message: '修改成功' });

});


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
    uploadDir: './public/images'
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log('err', err);
    }
    if (files) {
      const file = Object.keys(files)[0];
      const { pictureDetail } = await capacityModel.findOne({ capacity: 1 }, { pictureDetail: 1 });
      const path = backslashReplace(files[file].path);

      imageModel.instert({ url: beforeIp + path, size: kbOrmb(files[file].size) }).then();
      capacityModel.findOneAndUpdate({ capacity: 1 }, { pictureDetail: { count: pictureDetail.count + 1, size: pictureDetail.size + files[file].size } }).then();

      res.send({
        success: 1, // 0 表示上传失败，1 表示上传成功
        message: '上传成功。',
        // ...files // 文件信息
        file: {
          path
        }
      });
    }
  });
});

// 删除文章
router.post('/destroy', async function (req, res) { // 接收 _id
  // 删除 模型数组里某一项
  // { $pull: { resumeList: { mallId: mallId } } }

  // 查询数组某一项
  // { participant: { $elemMatch: { $eq: 1 } } }

  try {
    // 删除置顶列表
    await topModel.findByIdAndDelete(req.body._id);
    // 删除文件夹列表
    await folderModel.findOneAndUpdate({ folderHasPaper: { $elemMatch: { _id: req.body._id } } }, { $pull: { folderHasPaper: { _id: req.body._id } } });
    // 删除图片保留信息
    const data = await htmlModel.findById(req.body._id, { title: 1, paperUseImg: 1 });
    imageModel.findOneAndUpdate({ connection: { $elemMatch: { $eq: `《${data.title}》封面` } } }, { $pullAll: { connection: [`《${data.title}》封面`]   }  }).then();
    data.paperUseImg.forEach(() => {
      imageModel.findOneAndUpdate({ connection: { $elemMatch: { $eq: `《${data.title}》引用` } } }, { $pullAll: { connection: [`《${data.title}》引用`] }  } ).then();
    });

    // 统计文章size
    const { size, count } = await mongoose.connection.collection('paperList').stats();
    capacityModel.findOneAndUpdate({ capacity: 1 }, { paperDetail: { count, size } }).then();

    // 根据待办事项的id 来删除它
    const result = await htmlModel.findByIdAndDelete(req.body._id);

    res.send({
      code: 0,
      data: result
    });
  } catch (err) {
    console.log(err);
  }

});


// 置顶
router.post('/setTop', async function (req, res) {

  const { _id, stick } = req.body;

  if (stick) {
    const result = await topModel.find().lean();
    if (result.length < 2) {
      const { _id: id, title, info, saveImageUrl } = await htmlModel.findByIdAndUpdate(_id, { stick }, { new: true }).lean().select('_id title info saveImageUrl');
      const update = {
        _id: id, title, info, cover: saveImageUrl
      };
      const doc = await topModel.findByIdAndUpdate(_id, update, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();

      res.send({
        code: 0,
        success: doc
      });

    } else {
      res.send({
        code: 1,
        message: '置顶数量已达到上限'
      });
    }
  } else {
    await htmlModel.findByIdAndUpdate(_id, { stick }, { new: true }).lean().select('title');
    const data = await topModel.findByIdAndDelete(_id);
    res.send({
      code: 0,
      success: data
    });
  }




});


module.exports = router;

