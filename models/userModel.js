const mongoose = require('../db.js');

class UserModel {
  constructor() {
    var userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      updated_at: {
        type: Date,
        default: new Date()
      },     
      photo: {
        type: String,
        required: false
      },
      
      lastLogin: {
        type: Array,
        default: []
      }
    });

    this.userModel = mongoose.model('userList', userSchema, 'userList'); //将该Schema发布为Model,userList就是集合名称
  }

  // 注册用户
  instert(data) {
    console.log(data);
    let user = this.userModel(data);
    return user.save();
  }
  // 查找
  findOne(data, options) {
    return this.userModel.findOne(data, options);
  }

  findOneAndUpdate(conditions, doc, options, callback) {
    return this.userModel.findOneAndUpdate(conditions, doc, options)
  }
  
  findOneAndDelete(conditions, options) {
    return this.userModel.findOneAndDelete(conditions, options)
  }
  async singup(req, res, next) {
    res.header('Access-Control-Allow-Headers');

    res.set('Content-Type');
  }
}




module.exports = new UserModel();
