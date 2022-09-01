import AppLayout from "./AppLayout.vue"
import MainContent from "./MainContent"
import MainHeaderWrap from "./MainHeaderWrap.vue"

export default {
  components: {
    AppLayout,
    MainContent,
    MainHeaderWrap,
  },
  data: {
    wrapClass: 'flex bg-bgDark text-contentText flex-grow'
  }
}
