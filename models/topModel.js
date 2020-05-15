const db = require('../db.js');
const mongoose = require('mongoose'); //引入对象
// 文章列表对象
class TopModel {
  constructor() {
    // title: data.title,
    //   showPaperId: data._id,
    //     createDate: data.updated_at,
    //       upDate: data.updated_at,
    //         image: data.saveImageUrl,
    //           show: true
    var topSchema = new mongoose.Schema({
      topList: {
        type: Array,
        required: true
      },
      // title: {
      //   type: String,
      //   required: true
      // },
      // showPaperId: {
      //   type: String,
      //   required: true
      // },
      // createDate: {
      //   type: String,
      //   required: true
      // },
      // upDate: {
      //   type: String,
      //   required: true
      // },
      // image: {
      //   type: String,
      //   required: true
      // },
      // show: {
      //   type: String,
      //   required: true
      // }
    });

    this.topModel = db.model('topList', topSchema); //将该Schema发布为Model,userList就是集合名称
  }
  // 填加
  instert(data) {
    let topModel = this.topModel(data);
    return topModel.save();
  }
  // 查找
  findOne(data) {
    return this.topModel.findOne(data);
  }
  // 查找
  find() {
    console.log('zou')
    return this.topModel.find();
  }
  // data : {"email":"QQQQ@qq.com"}
  deleteOne(data, callback) {
    return this.topModel.deleteOne(data, callback)
  }
  delete() {
    return this.topModel.delete()
  }
  findByIdAndUpdate(id,doc,options,callback){
    return this.topModel.findByIdAndUpdate(id,doc)
  }

}

module.exports = new TopModel();
