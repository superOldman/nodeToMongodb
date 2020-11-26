const express = require('express');
const router = express.Router();

const htmlModel = require('../models/htmlModel');// 引入模型


router.post('/getTitleList', function (req, res) {
  const search = {};
  if (req.body.length) {
    search.title = req.body.title;
  }
  console.log('search');
  console.log(search);
  htmlModel.find(search).then(function (result, reject) {

    const arr = [];
    result.forEach((item) => {
      arr.push({ value: item.title, id: item._id });
    });
    console.log(arr);
    res.send(arr);
  });
});


router.get('/searcByIdpackageTopModel', function (req, res, next) {
  htmlModel
    .findOne({ _id: req.query.id })
    // sort('updated_at').
    .exec(function (err, data, count) {
      if (err) {
        console.log(err);
      } else {
        let list = {
          title: data.title,
          showPaperId: data._id,
          createDate: data.updated_at,
          upDate: data.updated_at,
          image: data.saveImageUrl,
          show: true
        };
        res.send({
          code: 200,
          list
        });
      }
    });
});

module.exports = router;