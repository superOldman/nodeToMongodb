const mongoose = require('../db.js');
// 文章列表对象
class VisitModel {
  constructor() {

    var visitSchema = new mongoose.Schema({
      visit: {
        type: Number,
        default: 0,
      },
      ip: {
        type: Array,
        default: [],
      },
      updated_at: {
        type: Date,
        default: myGetTime(),
      }
    });

    this.visitModel = mongoose.model('visit', visitSchema, 'visit'); //将该Schema发布为Model,userList就是集合名称
  }
  // 填加
  instert(data) {
    return this.visitModel(data).save();
  }
  // 查找
  findOne(data) {
    return this.visitModel.findOne(data);
  }
  // 查找
  find(findData, projection, options) {
    return this.visitModel.find(findData, projection, options);
  }
  deleteOne(data, callback) {
    return this.visitModel.deleteOne(data, callback)
  }
  delete() {
    return this.visitModel.delete()
  }
  findOneAndUpdate(conditions, doc, options, callback) {
    return this.visitModel.findOneAndUpdate(conditions, doc, options)
  }
  findByIdAndUpdate(id, doc, options, callback) {
    return this.visitModel.findByIdAndUpdate(id, doc, options)
  }
  findByIdAndDelete(id, callback) {
    return this.visitModel.findByIdAndDelete(id, callback)
  }

}


function myGetTime(time) {
  let myTime = new Date();
  if (time) {
    myTime = new Date(time);
  }
  return `${myTime.getFullYear()}-${addZero(myTime.getMonth() + 1)}-${addZero(myTime.getDate())}`
}
function addZero(num) {
  return num >= 10 ? num : `0${num}`
}
module.exports = new VisitModel();
