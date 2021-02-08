const express = require('express')
const router = express.Router()
// html对象
const htmlModel = require('../models/htmlModel')
const folderModel = require('../models/folderModel')
const tagModel = require('../models/tagModel')
const topModel = require('../models/topModel')
const userModel = require('../models/userModel')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})



router.get('/version', function(req, res) {
  res.send({
    code: 200,
    data: {
      version: '2021-2-8 11:25'
    }
  })
})


// 查寻列表
router.get('/list', function (req, res, next) {
  // console.log(req)
  let findData = {}
  let projection = { markdown: 0, content: 0 }
  let options = { sort: { updated_at: -1 } }

  if (req.query.author) {
    findData.author = req.query.author
  }
  if (req.query.unclassified) {
    findData.hasFolder = ''
  }

  if (req.query.page && req.query.pageSize) {
    // .limit(pageSize) 限制数量
    // .skip(Count) 跳过几个
    options.limit = req.query.pageSize * 1
    options.skip = (req.query.page - 1) * req.query.pageSize
    Promise.all([
      htmlModel.schema().collection.stats(),
      htmlModel.find(findData, projection, options)
    ]).then(data => {
      res.send({
        code: 200,
        data: {
          list: data[1],
          sum: data[0].count
        }
      })
    })
  } else {
    htmlModel
      .find(findData, projection, options)
      .exec(function (err, doc, count) {

        res.send({
          code: 200,
          data: doc
        })
      })
  }

})


// 查寻 文件夹或标签列表内容
router.get('/folderOrTagList', function (req, res, next) {

  // { participant: { $elemMatch: { $eq: 1 } } }
  let findData
  if (req.query.hasTags) {
    findData = { hasTags: { $elemMatch: { $eq: req.query.hasTags } } }
  } else {
    findData = req.query
  }

  let projection = { markdown: 0, content: 0 }
  let options = { sort: { updated_at: -1 } }

  htmlModel.find(findData, projection, options)
    .exec(function (err, doc, count) {
      res.send({
        code: 200,
        data: doc
      })
    })
})


// 置顶列表
router.get('/topList', function (req, res, next) {
  topModel.find({}, null, { limit: 2 }).exec(function (err, doc) {
    res.send({
      code: 200,
      data: doc
    })
  })
})

// 文件夹和标签列表
router.get('/folderAndTagList', function (req, res, next) {
  // , tagModel.find(),
  // , folderModel.find()
  Promise.all([folderModel.find().lean(), tagModel.find().lean()]).then((data) => {
    res.send({
      code: 200,
      data: {
        folderList: data[0],
        tagList: data[1]
      }
    })
  })

})


// 按照id查找文章
router.get('/searchById', function (req, res, next) {
  htmlModel.findOne({ _id: req.query.id })
    .exec(function (err, data) {
      if (err) {
        console.log(err)
      } else {
        res.send({
          code: 200,
          list: data
        })
      }
    })
})







module.exports = router
