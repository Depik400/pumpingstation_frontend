import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axios'
import store from './store'
import vueAxios from 'vue-axios'

Vue.use(vueAxios,axios);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
