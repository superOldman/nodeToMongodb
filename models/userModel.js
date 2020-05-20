const db = require('../db.js');
const mongoose = require('mongoose'); //引入对象

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
      }
    });

    this.userModel = db.model('userList', userSchema); //将该Schema发布为Model,userList就是集合名称
  }

  // 注册用户
  instert(data) {
    console.log(data);
    let user = this.userModel(data);
    return user.save();
  }
  // 查找
  findOne(data) {
    return this.userModel.findOne({
      userName: data.userName
    });
  }

  async singup(req, res, next) {
    res.header('Access-Control-Allow-Headers');

    res.set('Content-Type');
  }
}




module.exports = new UserModel();
