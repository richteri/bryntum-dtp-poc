// Polyfills for Edge <= 18. Remove this line if you don't need support for it.
import 'core-js/stable';

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// this instance handles events
export const eventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app')
