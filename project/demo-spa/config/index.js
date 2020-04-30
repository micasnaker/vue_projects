//重载vue.config.js 配置
export default config => {
  Object.assign(config, {
    proxy: {
      "/api": {
        target: process.env.baseurl,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  });
  return config;
};
