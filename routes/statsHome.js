const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('../db.js');
const visitModel = require('../models/visitModel.js');
const htmlModel = require('../models/htmlModel.js');
const imageModel = require('../models/imageModel.js');
const capacityModel = require('../models/capacityModel.js');

const { beforeIp, kbOrmb, backslashReplace } = require('../utils/utils');
// 图片格式
// bmp, jpg, png, tif, gif, pcx, tga, exif, fpx, svg, psd, cdr, pcd, dxf, ufo, eps, ai, raw, WMF, webp
const imgFormat = ['jpg', 'jpeg', 'svg', 'webp', 'png', 'gif'];


// 统计文件函数


function countFileSize(src) {
  return new Promise(function (result, reject) {
    fs.readdir(src, function (err, file) {
      let n = 0;
      console.log('文件', file);
      console.log('路径', src);
      file.forEach(async (e, index) => {
        // 遍历之后递归调用查看文件函数
        // 遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
        let absolutePath = backslashReplace(path.resolve(path.join(src, e)));
        const stats = fs.statSync(absolutePath);

        // 如果是图片加到图片表里去、
        if (imgFormat.includes(e.split('.')[1])) {
          const url = `${beforeIp}${src}/${e}`;
          const result = await imageModel.findOne({ url });
          if (!result) {
            imageModel.instert({ url, size: kbOrmb(stats.size), updated_at: stats.mtime }).then();
          }
        }

        n += stats.size;
        if (index === file.length - 1) {
          result({ count: file.length, size: n });
        }
      });
    });
  });
}

// 查总表
function getCollections() {
  let collections = [];
  for (let key in mongoose.connection.collections) {
    collections.push(mongoose.connection.collection(key).stats());
  }
  return Promise.all(collections);
}
/**
 * 该地址格式：mongodb://username:password@host:port/database[?options]
 * 默认port为27017
 */
// var MongoClient = require('mongodb').MongoClient,
//     test = require('assert');
// MongoClient.connect('mongodb://skm:6967668@localhost:27017/editor', function (err, db) {
//     console.log(err)
//     console.log(db)
//     db.stats().then(function (stats) {
//         test.ok(stats != null);
//         console.log(stats)
//         db.close();
//     })
// });



function getIp(req) {
  var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
}

function myGetTime(time) {
  let myTime = new Date();
  if (time) {
    myTime = new Date(time);
  }

  return `${myTime.getFullYear()}-${addZero(myTime.getMonth() + 1)}-${addZero(myTime.getDate())}`;
  //  `${addZero(myTime.getHours())}:${addZero(myTime.getMinutes())}:${addZero(myTime.getSeconds())}`
}
function addZero(num) {
  return num >= 10 ? num : `0${num}`;
}

// function kbOrmb(size) {
//     if ((size / 1024 / 1024) > 0) {
//         return (size / 1024).toFixed(2) + 'kb'
//     } else {
//         return (size / 1024 / 1024).toFixed(2) + 'mb'
//     }
// }

// 访问统计接口
router.get('/visit', async function (req, res) {
  let thisIp = getIp(req);
  // visitModel.findOneAndUpdate({}, { $push: { ip } }, { new: true, upsert: true, setDefaultsOnInsert: true })
  // .then(data=>{
  //     console.log(data)
  //     res.send(data)

  // })
  let newTime = myGetTime();
  console.log('newTime');
  console.log(newTime);


  let findData = await visitModel.findOne({ updated_at: newTime }).lean();
  console.log('findData');
  console.log(findData);
  let sendData;

  if (findData) {

    let { visit, ip, updated_at, ...lastData } = findData;
    visit++;
    ip.push(thisIp);

    // 去重
    // let test = new Set([...ip]);
    // console.log(test)
    // console.log(Array.from(test))


    console.log((updated_at));
    console.log(myGetTime(updated_at));
    console.log(myGetTime());

    console.log(myGetTime(updated_at) !== myGetTime());
    if (myGetTime(updated_at) !== myGetTime()) {
      sendData = await visitModel.instert({ visit: 1, ip: [thisIp] });
    } else {
      sendData = await visitModel.findOneAndUpdate({ updated_at }, { visit, ip }, { new: true });

    }

  } else {

    sendData = await visitModel.instert({ visit: 1, ip: [thisIp] });

  }
  res.send(sendData);
});


//  访问统计列表
router.get('/visitList', async function (req, res) {
  let findData = await visitModel.find().sort({ updated_at: 1 });
  res.send({
    code: 0,
    data: findData
  });
});


// 网站统计 显示在后台
router.get('/resourceStats', async function (req, res) {

  const result = await capacityModel.findOne({ capacity: 1 });
  // res.send(...result);countDocuments
  // query.collection(MyModel.collection);
  // const result = await capacityModel.schema().countDocuments();
  // const a = await mongoose.connection.collection('paperList').stats();
  // console.log(a);
  res.send({ data: result });
});

// 统计文章
router.get('/lastYearPushPaperCount', async function (req, res) {
  const result = await htmlModel.find({}, { updated_at: 1 }).sort({ updated_at: 1 });
  let pushPaperDate = [];
  let _index = 0;
  let lastData;
  result.forEach((item, index) => {
    if (lastData === myGetTime(item.updated_at)) {

      pushPaperDate[_index][1]++;
    } else {
      index !== 0 ? _index++ : null;
      lastData = myGetTime(item.updated_at);
      pushPaperDate[_index] = [lastData, 1];
    }
  });
  res.send({
    code: 0,
    data: pushPaperDate
  });
});

// 专用统计资源  暂定不对外跑
router.get('/statistical', async function (req, res) {
  const pictureDetail = await countFileSize('public/images');
  const baseData = await getCollections();

  let tj = 0; // 统计数据库大小
  let paperDetail = {
    count: 0,
    size: 0
  };
  baseData.forEach(item => {
    let size = item.size;
    tj += size;
    if (item.ns.endsWith('paperList')) {

      paperDetail.count = item.count;
      // paperDetail.size = kbOrmb(size);
      paperDetail.size = size;
    }
  });



  // 跑新数据 重新存 capacity: 2 等.. 用作对比
  await capacityModel.findOneAndUpdate({ capacity: 1 }, {
    pictureDetail,
    baseDataSize: tj,
    paperDetail
  }, { upsert: true, setDefaultsOnInsert: true });



  res.send({
    pictureDetail,
    baseDataSize: tj,
    paperDetail
  });


});

router.get('/qqq', async function (req, res) {
  const result = await capacityModel.findOne({ capacity: 1 }, { pictureDetail: 1 });
  res.send(result);
});



module.exports = router;

