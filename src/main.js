// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Api from '@/api'
import '@/icons' // icon
import '@/permission'
import store from './store'
import $ from 'jquery'
// import VueQuillEditor from 'vue-quill-editor'  //富文本编辑器
// Vue.use(VueQuillEditor)

// Vue.use(Croppa)
Vue.use(ElementUI);
// register globally
Vue.prototype.$http = Api;
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
