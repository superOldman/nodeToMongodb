const db = require('./db.js');

class UserModel {

    constructor(){
        var userSchema = new mongoose.Schema({
            user_id: String, //定义一个属性user_id，类型为String
            name: String, //定义一个属性tittle，类型为String
            passwd: String, //定义一个属性content，类型为String
            updated_at: Date //定义一个属性updated_at，类型为Date
        });
        
        this.userModel = db.model('userList', userSchema); //将该Schema发布为Model,userList就是集合名称
    }
    instert(data){
        let user = this.userModel(data);
        return user.save()
    }
    select(data){
        return this.userModel.findOne({
            userName: data.userName 
        })
    }

    async singup(req,res,next){
        res.header("Access-Control-Allow-Headers", );

        res.set("Content-Type",)
    }
}

module.exports = new UserModel()