const mongoose = require('../db.js')
const { options } = require('../routes/index.js')

// 容量对象
class CapacityModel {
  constructor() {
    // pictureDetail: {
    //   count: pictureDetail.count,
    //     size: (pictureDetail.size / 1024 / 1024).toFixed(2) + 'mb'
    // },
    // baseDataSize: kbOrmb(tj),
    //   paperDetail,
    //   allSize: pictureDetail.size + tj

    var capacitySchema = new mongoose.Schema({
      capacity: {
        type: Number,
        default: 1
      },
      pictureDetail: {
        type: Object,
        required: true
      },
      baseDataSize: {
        type: Number,
        required: true
      },
      paperDetail: {
        type: Object,
        required: true
      },
      updated_at: {
        type: Date,
        default: Date.now
      }
    })

    this.capacityModel = mongoose.model('capacityList', capacitySchema, 'capacityList')
  }
  schema() {
    return this.capacityModel
  }
  // 填加
  instert(data) {
    return this.capacityModel(data).save()
  }

  findOne(data, projection, options) {
    return this.capacityModel.findOne(data, projection, options)
  }

  find(findData, projection, options) {
    return this.capacityModel.find(findData, projection, options)
  }
  findById(findData, projection, options) {
    return this.capacityModel.findById(findData, projection, options)
  }
  deleteOne(data, callback) {
    return this.capacityModel.deleteOne(data, callback)
  }
  delete() {
    return this.capacityModel.delete()
  }
  findOneAndUpdate(conditions, doc, options, callback) {
    return this.capacityModel.findOneAndUpdate(conditions, doc, options)
  }
  findByIdAndUpdate(id, doc, options, callback) {
    return this.capacityModel.findByIdAndUpdate(id, doc, options)
  }
  findByIdAndDelete(id, callback) {
    return this.capacityModel.findByIdAndDelete(id, callback)
  }

}

module.exports = new CapacityModel()
