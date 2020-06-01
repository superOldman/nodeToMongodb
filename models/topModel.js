const mongoose = require('../db.js');

// 置顶列表对象
class TopModel {
  constructor() {

    var topSchema = new mongoose.Schema({
      cover: {
        type: String,
        required: false
      },
      title: {
        type: String,
        required: true
      },
      info: {
        type: String,
        required: true
      },
      updated_at: {
        type: Date,
        default: new Date()
      }
    });

    this.topModel = mongoose.model('topList', topSchema, 'topList'); 
  }
  // 填加
  instert(data) {
    return this.topModel(data).save();
  }
  // 查找
  findOne(data) {
    return this.topModel.findOne(data);
  }
  // 查找
  find(findData, projection, options) {
    return this.topModel.find(findData, projection, options);
  }
  deleteOne(data, callback) {
    return this.topModel.deleteOne(data, callback)
  }
  delete() {
    return this.topModel.delete()
  }
  findOneAndUpdate(conditions, doc, options, callback) {
    return this.topModel.findOneAndUpdate(conditions, doc, options)
  }
  findByIdAndUpdate(id, doc, options, callback) {
    return this.topModel.findByIdAndUpdate(id, doc, options)
  }
  findByIdAndDelete(id, callback) {
    return this.topModel.findByIdAndDelete(id, callback)
  }

}

module.exports = new TopModel();
