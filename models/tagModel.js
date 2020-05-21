const db = require('../db.js');
const mongoose = require('mongoose'); //引入对象
// 置顶列表对象
class TagModel {
  constructor() {

    var tagSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      updated_at: {
        type: Date,
        default: new Date()
      }
    });

    this.tagModel = db.model('tagList', tagSchema); //将该Schema发布为Model,userList就是集合名称
  }
  // 填加
  instert(data) {
    return this.tagModel(data).save();
  }
  // 批量填加
//   var arr = [{ name: 'Star Wars' }, { name: 'The Empire Strikes Back' }];
// Movies.insertMany(arr, function (error, docs) { });
  insertMany(arr,options) {
    return this.tagModel.insertMany(arr,options);
  }


  
  // 查找
  findOne(data) {
    return this.tagModel.findOne(data);
  }
  // 查找
  find(findData, projection, options) {
    return this.tagModel.find(findData, projection, options);
  }




  update(conditions, data, options) {
    return this.tagModel.update(conditions, data, options)

  }
  updateMany(data, options) {
    return this.tagModel.updateMany(data, options)
  }
  
  deleteOne(data, callback) {
    return this.tagModel.deleteOne(data, callback)
  }
  delete() {
    return this.tagModel.delete()
  } 
  findOneAndUpdate(conditions, doc, options, callback) {
    return this.tagModel.findOneAndUpdate(conditions, doc, options)
  }
  findByIdAndUpdate(id, doc, options, callback) {
    return this.tagModel.findByIdAndUpdate(id, doc, options)
  }
  findByIdAndDelete(id, callback) {
    return this.tagModel.findByIdAndDelete(id, callback)
  }

}

module.exports = new TagModel();
