import { mockUserInfo } from "./api/sinon";
import { createApp } from 'vue'
import Playground from './Playground.vue'
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  var exports = {}
}

mockUserInfo()
createApp(Playground).mount('#app')
