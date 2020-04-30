console.log("000");
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
console.log("1112");
Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
