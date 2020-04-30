// const fs = require("fs");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
// const DEBUG = process.env.NODE_ENV === "production";
const format = require("date-fns/format");
const dotenv = require("dotenv");
const mode = process.VUE_CLI_SERVICE.mode;
const runcmd = process.argv[2];
const project =
  (process.argv[3] == "--mode" ? process.argv[6] : process.argv[4]) || "demo";
const project_dir = path.resolve(`project/${project}`);
const outputDir = `dist/${project}_${mode}`;
const configDir = `${project_dir}/config/`;
const webpackConfig = `${configDir}/webpack.js`;
//覆盖全局环境
[".env", `.env.local`, `.env.${mode}`, `.env.${mode}.local`].forEach(env => {
  Object.assign(
    process.env,
    dotenv.config({ path: `${configDir}/${env}` }).parsed
  );
});
if (runcmd != "lint")
  console.log(
    `${
      runcmd == "serve" ? "运行" : "编译"
    }项目:${project} 环境:${mode} NODE_ENV:${process.env.NODE_ENV} 生成压缩包:${
      process.env.DIST_ZIP
    }`
  );
const Entry = getEntry();
function getEntry() {
  let pages = getpages(`${project_dir}/*.html`);
  if (Object.keys(pages).length == 0) {
    //改为spa
    return {
      pages: {
        index: {
          entry: `project/${project}/main.js`,
          template: `project/${project}/public/index.html`,
          filename: `index.html`,
          minify: false,
          hash: true,
          chunks: ["chunk-vendors", "chunk-common", "index"]
        }
      }
    };
  } else {
    return { pages };
  }
}
function getpages(globPath) {
  let entries = {},
    basename;
  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    let entryjs = basename;
    if (!fs.existsSync(`project/${project}/${entryjs}.js`)) entryjs = "index";
    entries[basename] = {
      entry: `project/${project}/${entryjs}.js`,
      template: `project/${project}/${basename}.html`,
      filename: `${basename}.html`,
      hash: true,
      minify: false,
      chunks: ["chunk-vendors", "chunk-common", entryjs]
    };
  });
  return entries;
}
//默认设置
let config = {
  productionSourceMap: false,
  filenameHashing: false,
  publicPath: "./",
  devServer: {
    open: process.platform === "darwin",
    host: "",
    port: 8080,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  ...Entry,
  outputDir,
  integrity: true,
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
    Entry.pages &&
      Object.keys(Entry.pages).forEach(entryName => {
        config.plugins.delete(`prefetch-${entryName}`);
        config.plugins.delete(`preload-${entryName}`);
      });
    /**
      包含页面
      #include("./inc/top.shtml")
      */
    config.module
      .rule("html")
      .test(/\.(shtml)$/i)
      .use("html-withimg-loader")
      .loader("html-withimg-loader");

    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 100 }));
    config.plugin("copy").use(require("copy-webpack-plugin"), [
      [
        {
          from: `${project_dir}/public`,
          to: ``
        }
      ]
    ]);
    if (process.env.DIST_ZIP == "1") {
      config.plugin("zip").use(require("zip-webpack-plugin"), [
        {
          path: "../",
          filename: `${project}_${mode}【${format(
            new Date(),
            "YYYY-MM-DD hh_mm_ss"
          )}】.zip`
        }
      ]);
    }
  },
  configureWebpack: config => {
    Object.assign(config, {
      resolve: {
        extensions: [".js", ".vue", ".json"],
        /**
      @src/components/ 就是当前项目的组件地址
      避免不必要的../../
      */
        alias: {
          "@": path.resolve("src"),
          components: path.resolve("src/components"),
          assets: path.resolve("src/assets"),
          "@src": project_dir
        }
      },
      optimization: {
        splitChunks: {
          name: true,
          chunks: "async" // initial(初始块)、async(按需加载块)、all(默认，全部块)
        }
      }
    });
  }
};
//覆盖全局webpack设置
if (fs.existsSync(webpackConfig)) {
  config = require(webpackConfig)(config);
}
module.exports = config;
