const mongoose = require('../db.js');

// 文章列表对象
class FolderModel {
  constructor() {

    var folderSchema = new mongoose.Schema({
      cover: {
        type: String,
        required: false
      },
      folderName: {
        type: String,
        required: true
      },
      info: {
        type: String,
        required: true
      },

      folderHasPaper: {
        type: Array,
        default: []
      },
      updated_at: {
        type: Date,
        default: new Date()
      }
    });

    this.folderModel = mongoose.model('folderList', folderSchema, 'folderList');
  }
  // 填加
  instert(data) {
    return this.folderModel(data).save();
  }
  // 查找
  findOne(data) {
    return this.folderModel.findOne(data);
  }
  // 查找
  find(findData, projection, options) {
    return this.folderModel.find(findData, projection, options);
  }
  deleteOne(data, callback) {
    return this.folderModel.deleteOne(data, callback)
  }
  delete() {
    return this.folderModel.delete()
  }
  findOneAndUpdate(conditions, doc, options, callback) {
    return this.folderModel.findOneAndUpdate(conditions, doc, options)
  }
  findByIdAndUpdate(id, doc, options, callback) {
    return this.folderModel.findByIdAndUpdate(id, doc, options)
  }
  findByIdAndDelete(id, callback) {
    return this.folderModel.findByIdAndDelete(id, callback)
  }

}

module.exports = new FolderModel();
