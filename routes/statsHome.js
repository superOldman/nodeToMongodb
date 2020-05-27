const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('../db.js')

function countFileSize(src) {
    return new Promise(function (result, reject) {
        fs.readdir(src, function (err, file) {
            let n = 0;
            file.forEach((e, index) => {
                //遍历之后递归调用查看文件函数
                //遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
                let absolutePath = path.resolve(path.join(src, e));

                const stats = fs.statSync(absolutePath);
                n += stats.size;

                if (index === file.length - 1) {
                    result({ count: file.length, size: (n / 1024 / 1024).toFixed(2) + 'mb' })
                }
            })
        })
    })
}



let collections = []
for (let key in mongoose.connection.collections) {
    collections.push(mongoose.connection.collection(key).stats())
}
function getCollections() {
    return Promise.all(collections)
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



router.get('/picturesStats', async function (req, res) {

    const pictureDetail = await countFileSize('public/images')
    const baseData = await getCollections();

    let tj = 0;
    let paperDetail = {
        count: 0,
        size: 0
    }
    baseData.forEach(item => { 
        let size = item.size
        tj += size;
        if (item.ns.endsWith('paperlists')) {
            
            paperDetail.count = item.count;
            let paperDetailSize = 0;
            if ((size / 1024 / 1024) > 0 ){
                paperDetailSize = size / 1024 + 'kb'
            }else{
                paperDetailSize = size / 1024 /1024 + 'mb'
            }
            paperDetail.size = paperDetailSize;
        }
    });


    console.log(paperDetail)
    // baseData = {
    //     ns: 'editor.paperlists',
    //     size: 144327,
    //     count: 23,
    //     avgObjSize: 6275,
    //     storageSize: 69632,
    //     capped: false,
    // }
    res.send({
        pictureDetail,
        baseDataSize: (tj / 1024 / 1024).toFixed(2) + 'mb',
        paperDetail,
    })


})


module.exports = router;

