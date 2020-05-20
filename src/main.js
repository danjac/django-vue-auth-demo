import axios from "axios";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/main.css";

Vue.config.productionTip = false;

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// check if user logged in
// also for production: user data (and any other useful stuff)
// could be serialized into the template as a JSON snippet
// and we can check this on page load.

// this is spaghetti but basically: check if init data in index.html,
// if not load from API.
(function() {
  const dataTag = document.getElementById("init-data");
  if (dataTag) {
    const initData = JSON.parse(dataTag.textContent);
    if (initData.current_user.is_authenticated) {
      store.dispatch("authenticate", initData.current_user);
    } else {
      store.dispatch("logout");
    }
    if (initData.messages) {
      store.dispatch("addMessages", initData.messages);
    }
  }

  return new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
})();
