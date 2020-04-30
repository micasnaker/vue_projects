//重载vue.config.js 配置
module.exports = config => {
  Object.assign(config.devServer, {
    proxy: {
      "/api": {
        target: process.env.API_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  });
  return config;
};
