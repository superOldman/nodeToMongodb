// ecosystem.config.js
module.exports = {
  apps: [
    {
      // 生产环境
      name: 'production',
      // 项目启动入口文件
      script: './bin/www',
      // 项目环境变量
      env: {
        NODE_ENV: 'production',
        // PORT: 3555
      }
    }
  ]
};
