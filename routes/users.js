var express = require('express');
var router = express.Router();

// 引入jwt token工具
const JwtUtil = require('../jwt');

// 模型对象
const userModel = require('../models/userModel');
const htmlModel = require('../models/htmlModel');
const imageModel = require('../models/imageModel');
const capacityModel = require('../models/capacityModel');

// 加密
let bcrypt = require('bcryptjs');

// 图片
const formidable = require('formidable');

// utils
const { beforeIp, kbOrmb } = require('../utils/utils');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 判断登陆
router.get('/islogin', async function (req, res, next) {
  console.log('islogin head',req.headers['k-token'])
  // if (req.session.username) {
  const result = await userModel.findOne({ temporaryToken: req.headers['k-token'] }, { password: 0 });
  if(result){
  
  const len = result.lastLogin.length;
  const lastLogin = len === 1 ? result.lastLogin[0] : result.lastLogin[len - 2];

  res.send({
    code: 200,
    message: '已经登陆！',
    username: result.username,
    userMessage: {
      title: '管理员',
      userName: result.username,
      lastLogin: lastLogin,
      photo: result.photo || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      motto: result.motto,
      level: result.level
    }
  });
  } else {
    res.send({code: 403, message: '登录过期'})
  }

});


// 登录接口
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const result = await userModel.findOneAndUpdate({ username }, { $push: { lastLogin: new Date() } });

  bcrypt.compare(password, result.password, async function (err, passwordisTure) {
    if (err) {
      console.log('err', err);
    }

    let dataJson = {};
    if (passwordisTure) {
      const len = result.lastLogin.length;
      const lastLogin = len === 1 ? result.lastLogin[0] : result.lastLogin[len - 2];
      if (len >= 10) {
        await userModel.findOneAndUpdate({ username }, { $pop: { lastLogin: -1 } });
      }

      // 登陆成功，添加token验证
      const _id = result._id.toString();
      // 将用户id传入并生成token
      const jwt = new JwtUtil(_id);
      const token = jwt.generateToken();

      await userModel.findOneAndUpdate({ username }, { temporaryToken: token });

      dataJson.code = 200;
      dataJson.message = '登录成功';
      dataJson.data = token
      dataJson.lastLogin = lastLogin;

    } else {
      dataJson.code = 1;
      dataJson.message = '登录失败,密码错误！';
    }
    res.send(dataJson);
  });
});

router.post('/getUserInfo', async function (req, res) {
  htmlModel.find({ username: req.body.username }, { hasFolder: 1 }).then((data) => {
    res.send(data);
  });
});



// 注册
router.post('/register', function (req, res, next) {

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      userModel.instert({
        username: req.body.username,
        email: req.body.email,
        password: hash
      }).then(function (data) {
        req.session.name = req.body.username;
        res.send({
          code: 200,
          message: '注册成功'
        });
      });
    });
  });
});

// 退出登录
// req.body.last

router.get('/logout', function (req, res) {
  req.session.username = null;
  res.status(401).send({
    code: 1,
    message: '请重新登录！'
  });
});

// 更新
router.post('/userUpdate', async function (req, res) {
  console.log('req.session.username', req.session.username);
  console.log('req.body', req.body.username);


  let { username, photo, userMessage } = req.body;
  if (req.session.username === username) {

    if (photo) {
      await userModel.findOneAndUpdate({ username: req.session.username }, { photo });

    }
    console.log('userUpdate.req', req.body);
    console.log('before:userMessage', userMessage);
    if (userMessage) {

      console.log('userMessage', userMessage);
      const result = await userModel.findOne({ username: req.session.username }, { password: 1 });
      console.log('result', result);

      // 验证
      bcrypt.compare(userMessage.oldPass, result.password, function (err, passwordisTure) {
        if (err) {
          console.log('err', err);
        }

        console.log('passwordisTure', passwordisTure);
        if (passwordisTure) {

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.userMessage.newPass, salt, function (err, hash) {
              userModel.findOneAndUpdate({ username: req.session.username }, { password: hash }).then((data) => {
                if (data) {
                  console.log('data', data);
                  // res.status(401).send({
                  req.session.username = null;
                  res.send({
                    code: 200,
                    message: '修改成功，请重新登陆！'
                  });
                } else {
                  res.send(data);
                }

              });

            });
          });

        } else {
          res.send({
            code: 1,
            message: '旧密码不正确！'
          });
        }
      });



    } else {
      res.send({
        code: 200,
        message: '修改成功！'
      });
    }
  } else {
    // req.session.username = null;
    // res.status(401).send({
    //   code: 1,
    //   message: '请重新登录！'
    // });
    res.send({
      code: 1,
      message: '用户名错误',
      data: req.body
    });
  }


});


// 上传头像
router.post('/uploadUserPhoto', function (req, res) {

  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: './public/images'
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log('err', err);
      }
      if (files) {
        const { pictureDetail } = await capacityModel.findOne({ capacity: 1 }, { pictureDetail: 1 });
        capacityModel.findOneAndUpdate({ capacity: 1 }, { pictureDetail: { count: pictureDetail.count + 1, size: pictureDetail.size + files.file.size } }).then();

        await imageModel.findOneAndUpdate({ connection: [`${req.session.username}头像`] }, { connection: [] });
        await imageModel.instert({ url: beforeIp + files.file.path, size: kbOrmb(files.file.size), connection: [`${req.session.username}头像`] });
        await userModel.findOneAndUpdate({ username: req.session.username }, { photo: beforeIp + files.file.path }, { upsert: true });

        res.send({
          success: 1, // 0 表示上传失败，1 表示上传成功
          message: '上传成功。',
          ...files // 文件信息
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

});

// 上传签名
router.post('/uploadUserMotto', async function (req, res) {
  try {
    const username = req.session.username;
    const { motto } = req.body;
    if (motto) {
      await userModel.findOneAndUpdate({ username }, { motto }, { upsert: true });
      res.send({
        code: 200,
        message: '更新签名成功'
      });

    } else {
      res.send({
        code: 1,
        message: '更新签名失败'
      });
    }
  } catch (error) {
    console.log(error);
  }

});


// 注销账号
router.post('/writeOff', async function (req, res) {
  if (req.session.username === req.body.username) {
    const result = await userModel.findOneAndDelete({ username: req.body.username });


    req.session.username = null;
    res.status(401).send({
      code: 200,
      message: '注销成功！',
      result
    });

  } else {
    res.send({
      code: 1,
      message: '出错了！'
    });

  }
});






module.exports = router;


// 密码解析式例

// 加密 npm网址 https://www.npmjs.com/package/bcryptjs
// var salt = bcrypt.genSaltSync(10);
// var hash = bcrypt.hashSync("az6967668", salt);

/**
 * hash生成
 * @param   {Number}  password  密码
 *
 * salt 解析头
 * hash 组成的hash密码
 *
 * let password = 'az6967668'
 * bcrypt.genSalt(10, (err, salt) => {
 *   bcrypt.hash(password, salt, (err, hash) => {
 *      console.log(hash)
 *   })
 * })
 */

/**
 * 密码hash对比
 * @param   {Number}  password  密码
 * @param   {Number}  myhash  库里面的hash密码
 *
 * res 返回值 ture/false
 *
 * let myhash = '$2a$10$O7ZSDdJP2gyHeUm2OVhRJudHq9aDsvwfUkha1tc79VL7SYmw.qkz6'
 * bcrypt.compare( password, myhash, function(err, res) {
 *    console.log(res)
 * });
 *
 */