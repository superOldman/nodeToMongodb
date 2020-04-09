const db = require('../db.js');
const mongoose = require('mongoose'); //引入对象
// 文章列表对象
class HtmlModel {
  constructor() {
    var htmlSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      info: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      markdown: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      updated_at: {
        type: Date,
        default: Date.now
      }
    });

    this.htmlModel = db.model('paperList', htmlSchema); //将该Schema发布为Model,userList就是集合名称
  }
  // 填加文章
  instert(data) {
    let html = this.htmlModel(data);
    return html.save();
  }
  // 查找
  findOne(data) {
    return this.htmlModel.findOne(data);
  }
  // 查找
  find(data) {
    return this.htmlModel.find(data);
  }
  // data : {"email":"QQQQ@qq.com"}
  deleteOne(data,callback){
    return this.htmlModel.deleteOne(data, callback)
  }
  findByIdAndUpdate(id,doc,options,callback){
    return this.htmlModel.findByIdAndUpdate(id,doc)
  }
  async singup(req, res, next) {
    res.header('Access-Control-Allow-Headers');

    res.set('Content-Type');
  }
}

module.exports = new HtmlModel();
