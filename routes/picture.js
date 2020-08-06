const express = require('express');
const router = express.Router();
const fs = require('fs');

const imageModel = require('../models/imageModel');
const capacityModel = require('../models/capacityModel');



// utils
const { beforeIp, delFile } = require('../utils/utils');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



router.get('/imageList', async function (req, res) {

  let findData = {};
  let projection = {};
  let options = { sort: { updated_at: -1 } };

  const { page, pageSize, unclassified } = req.query;
  if (unclassified) {
    findData.connection = [];
  }

  if (page && pageSize) {

    options.limit = pageSize * 1;
    options.skip = (page - 1) * pageSize;


    const schema = await imageModel.schema().collection.stats();
    const list = await imageModel.find(findData, projection, options);
    res.send({
      code: 0,
      data: { list, sum: schema.count }
    });
  } else {
    imageModel
      .find(findData, projection, options)
      .exec(function (err, doc, count) {

        res.send({
          code: 0,
          data: doc
        });
      });
  }

  // try {
  //     const result = await imageModel.find({});
  //     if (result) {
  //         res.send({ code: 0, result });
  //     }
  // } catch (error) {
  //     console.log(error)
  // }

});

router.post('/deleteImage', async function (req, res) {
  try {
    const result = await imageModel.findByIdAndDelete(req.body._id);
    console.log(result);
    if (result) {
      const path = result.url.split(beforeIp)[1];
      const { size } = delFile(path);
      const { pictureDetail } = await capacityModel.findOne({ capacity: 1 }, { pictureDetail: 1 });
      capacityModel.findOneAndUpdate({ capacity: 1 }, { pictureDetail: { count: pictureDetail.count - 1, size: pictureDetail.size - size } }).then();
      res.send({ code: 0, message: '删除成功!' });
    }
  } catch (error) {
    console.log(error);
  }

});



module.exports = router;







