import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './Chat'
import PUBLIC_EVENT, { PUBLIC_EVENT_MAP } from './utils/publicEvent'
import store from './store/index'
import { updateToken } from './store/user'
import { Provider } from 'react-redux'

type ChatConfig = {
  // css file or path
  css: string
}

export default class ChatClass {
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
    el.setAttribute('id', 'mock_chat')
    root.append(el)
    ReactDOM.createRoot(document.getElementById('mock_chat') as HTMLElement).render(
      <Provider store={store}>
        <React.StrictMode>
          <Chat />
        </React.StrictMode>
      </Provider>
    )
  }

  triggerOpen(value: boolean) {
    PUBLIC_EVENT.emit(PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG, value)
  }

  updateUserToken(value: string) {
    if (!value) return
    store.dispatch(updateToken(value))
  }
}

