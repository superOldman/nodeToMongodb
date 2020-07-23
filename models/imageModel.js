const mongoose = require('../db.js');

// 文章列表对象
class ImageModel {
  constructor() {

    var imageSchema = new mongoose.Schema({
      url: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      connection: {
        type: Array,
        default: []
      },
      updated_at: {
        type: Date,
        default: Date.now
      }
    });

    this.imageModel = mongoose.model('imageList', imageSchema, 'imageList');
  }
  schema() {
    return this.imageModel;
  }
  // 填加
  instert(data) {
    return this.imageModel(data).save();
  }
  
  findOne(data) {
    return this.imageModel.findOne(data);
  }
  
  find(findData, projection, options) {
    return this.imageModel.find(findData, projection, options);
  }
  findById(findData, projection, options) {
    return this.imageModel.findById(findData, projection, options);
  }
  deleteOne(data, callback) {
    return this.imageModel.deleteOne(data, callback)
  }
  delete() {
    return this.imageModel.delete()
  }
  findOneAndUpdate(conditions, doc, options, callback) {
    return this.imageModel.findOneAndUpdate(conditions, doc, options)
  }
  findByIdAndUpdate(id, doc, options, callback) {
    return this.imageModel.findByIdAndUpdate(id, doc, options)
  }
  findByIdAndDelete(id, callback) {
    return this.imageModel.findByIdAndDelete(id, callback)
  }

}

module.exports = new ImageModel();
