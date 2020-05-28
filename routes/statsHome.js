const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('../db.js')
const visitModel = require('../models/visitModel.js');

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



function getIp(req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
}

function myGetTime(time) {
    let myTime = new Date();
    if(time){
        myTime = new Date(time);
    }
    
    return `${myTime.getFullYear()}-${addZero(myTime.getMonth() + 1)}-${addZero(myTime.getDate())}`
    //  `${addZero(myTime.getHours())}:${addZero(myTime.getMinutes())}:${addZero(myTime.getSeconds())}`
}
function addZero(num) {
    return num >= 10 ? num : `0${num}`
}

router.get('/visit', async function (req, res) {
    let thisIp = getIp(req)
    // visitModel.findOneAndUpdate({}, { $push: { ip } }, { new: true, upsert: true, setDefaultsOnInsert: true })
    // .then(data=>{
    //     console.log(data)
    //     res.send(data)

    // })
    let newTime = myGetTime();
    console.log('newTime')
    console.log(newTime)


    let findData = await visitModel.findOne({ updated_at: newTime}).lean();
    console.log('findData')
    console.log(findData)
    let sendData;

    if (findData) {

        let { visit, ip, updated_at, ...lastData } = findData;
        visit++;
        ip.push(thisIp);
        
        // 去重
        // let test = new Set([...ip]);
        // console.log(test)
        // console.log(Array.from(test))


        console.log((updated_at))
        console.log(myGetTime(updated_at))
        console.log(myGetTime())

        console.log(myGetTime(updated_at) !== myGetTime())
        if (myGetTime(updated_at) !== myGetTime()){
            sendData = await visitModel.instert({ visit: 1, ip: [thisIp] });
        }else{
            sendData = await visitModel.findOneAndUpdate({ updated_at }, { visit, ip }, { new: true });

        }

    } else {

        sendData = await visitModel.instert({ visit: 1, ip: [thisIp] });

    }
    res.send(sendData)
})



router.get('/visitList', async function (req, res) {
    let findData = await visitModel.find();
    res.send({
        code: 0,
        data: findData
    })
})

router.get('/picturesStats', async function (req, res) {

    const pictureDetail = await countFileSize('public/images')
    const baseData = await getCollections();
    // console.log(req.connection)
    console.log(getIp(req))
    console.log(req.connection.remoteAddress)


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
            if ((size / 1024 / 1024) > 0) {
                paperDetailSize = size / 1024 + 'kb'
            } else {
                paperDetailSize = size / 1024 / 1024 + 'mb'
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

