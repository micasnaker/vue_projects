import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
// import About from "./views/About.vue";
// import Intro from "./views/Intro.vue";
Vue.use(Router);
// 不同页面模块的 PAGE_NAME 名称对应各自的模块名称
export default new Router({
  // base: "/" + pageName,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   component: About
    // },
    // {
    //   path: "/intro",
    //   name: "intro",
    //   component: Intro
    // }
  ]
});
