import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "./assets/css/global.css";
import mixins from "./mixins.js";
import store from "./store";
import OtpInput from "@bachdgvn/vue-otp-input";
import VueQRCodeComponent from "vue-qr-generator";
import VueQrcodeReader from "vue-qrcode-reader";
import VueJsonToCsv from "vue-json-to-csv";
// import HighchartsVue from "highcharts-vue";
const FadeAwayMessage = () => import("./components/Alerts/FadeAwayMessage");
Vue.config.productionTip = false;
Vue.mixin(mixins);
Vue.component("qr-code", VueQRCodeComponent);
Vue.use(VueQrcodeReader);
// Vue.use(HighchartsVue);
Vue.component("v-otp-input", OtpInput);
Vue.component("vue-json-to-csv", VueJsonToCsv);
Vue.component("fade-away-message-component", FadeAwayMessage);
new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
