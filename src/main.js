// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// 导入element-ui
import 'element-ui/lib/theme-default/index.css'
import elementUI from 'element-ui'
Vue.use(elementUI)

// 导入vue-resource
import vueResource from 'vue-resource'
Vue.use(vueResource)

import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
