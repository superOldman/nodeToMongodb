var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); //引入对象
var TodoModel = mongoose.model('users');//引入模型


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

module.exports = router;