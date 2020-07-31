const mongoose = require('../db.js');

// 文章列表对象
class TestModel {
  constructor() {

    var testSchema = new mongoose.Schema({
      // cid: {
      //   type: mongoose.Types.ObjectId
      // },
      name: {
        type: String,
        required: false
      },
      arr: {
        type: Array,
        default: []
      },
      updated_at: {
        type: Date,
        default: new Date()
      }
    });

    this.testModel = mongoose.model('testList', testSchema, 'testList'); // 将该Schema发布为Model,userList就是集合名称
  }

  getMod(data) {
    if(data) return this.testModel(data);

    return this.testModel;
  }


}

module.exports = new TestModel();
