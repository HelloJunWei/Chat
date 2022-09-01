import { createApp, h } from 'vue'
import App from '@/App.vue'
import * as userStore from '@/store/user'
import PUBLIC_EVENT, { PUBLIC_EVENT_MAP } from '@/utils/publicEvent'


type ChatConfig = {
  // css file or path
  css: string
}

export default class Chat {
  private config: ChatConfig
  constructor (option: ChatConfig) {
    this.config = option
    this.init()
  }

  init () {
    //  init css
    const cssLink = document.createElement('link')
    const file = this.config.css
    cssLink.setAttribute('rel', 'stylesheet')
    cssLink.setAttribute('href', file)

    const chatDom = document.createElement('div')
    chatDom.id = 'chat-instance'
    document.body.append(chatDom)
    const root = chatDom
    // inside shadow dom
    root.appendChild(cssLink.cloneNode())
    const el = document.createElement('div')
    root.append(el)
    const mockApp = {
      name: 'MockApp',
      render () {
        return h(App)
      }
    }
    const instance = createApp(mockApp)
    instance.mount(el)
  }

  triggerOpen(value: boolean) {
    PUBLIC_EVENT.emit(PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG, value)
  }

  updateUserToken(value: string) {
    if (!value) return
    userStore.updateUserToken(value)
  }
}
