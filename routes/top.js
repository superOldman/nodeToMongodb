var express = require('express');
var router = express.Router();


let topModel = require('../models/topModel');//引入模型


router.post('/saveTop', function (req, res) {
  console.log('saveBody:')
  console.log(req.body)
  // req.body.forEach(function(item){
  //   if(item._id){

  //   }else{
  //     topModel.instert(req.body)
  //   }
  // });
  // 还未好： 保存唯一数据
  topModel.instert({topList:req.body}).then(function(err,doc){
    if(err){
      console.log(err)
    }
    res.send({
      code: 0,
      message: '保存成功！'
    })
  })

});

router.get('/getTopList',function(req,res){
  topModel.find().then(function(doc){

    console.log(doc)
    res.send({
      code: 0,
      list: doc[0].topList
    })

  })
})
module.exports = router;