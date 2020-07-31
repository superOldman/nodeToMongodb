const beforeIp = process.env.NODE_ENV === 'production' ? 'http://47.96.2.170:3000/' : 'http://localhost:3000/';


function kbOrmb(size) {
  if ((size / 1024 / 1024) > 1) {
    return (size / 1024 / 1024).toFixed(2) + 'mb';
  } else {
    return (size / 1024).toFixed(2) + 'kb';
  }
}


/**
 *
 * @param {*} path 必传参数可以是文件夹可以是文件
 * @param {*} reservePath 保存path目录 path值与reservePath值一样就保存
 */

const fs = require('fs');

function delFile(path, reservePath) {
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      let files = fs.readdirSync(path);
      files.forEach((file, index) => {
        let currentPath = path + '/' + file;
        if (fs.statSync(currentPath).isDirectory()) {
          delFile(currentPath, reservePath);
        } else {
          fs.unlinkSync(currentPath);
        }
      });
      if (path != reservePath) {
        fs.rmdirSync(path);
      }
    } else {
      fs.unlinkSync(path);
    }
  }
}

// 反斜杠替换斜杠
function backslashReplace (str) {
  return str.replace(/\\/g, '/');
}


module.exports =  {
  beforeIp, kbOrmb, delFile, backslashReplace
};