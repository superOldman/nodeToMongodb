var express = require('express');
var router = express.Router();


let htmlModel = require('../models/htmlModel');//引入模型


router.get('/search', function(req, res, next) {
    TodoModel.
    find().
    sort('updated_at').
    exec(function(err, aa, count) {
      console.log(typeof aa);
      let arr = [];
      aa.forEach(element => {
        arr.push({'name':element.name});
      });
      arr = JSON.stringify(arr);
  
      console.log(arr)
      res.send(arr);
    });
  });

router.post('/getTitleList',function(req,res){
  let search = {};
  if(req.body.length){
    search.title = req.body.title;
  }
  console.log('search')
  console.log(search)
  htmlModel.find(search).then(function(result,reject){

    let arr = [];
    result.forEach((item)=>{
      arr.push({value:item.title,id: item._id})
    })
    console.log(arr)
    res.send(arr)
  })
})


router.get('/searcByIdpackageTopModel', function (req, res, next) {
  htmlModel
    .findOne({ _id: req.query.id })
    // sort('updated_at').
    .exec(function (err, data, count) {
      if (err) {
        console.log(err)
      } else {
        let list = {
          title: data.title,
          showPaperId: data._id,
          createDate: data.updated_at,
          upDate: data.updated_at,
          image: data.saveImageUrl,
          show: true
        }
        res.send({
          code: 0,
          list
        })
      }
    });
});

module.exports = router;