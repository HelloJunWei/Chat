import './assets/global.scss'
import { Transition } from '@headlessui/react'
import { useState, useEffect } from 'react'
import ChatCss from './assets/Chat.module.scss'
import classNames from 'classnames'
import Dashboard from './components/Dashboard'
import PUBLIC_EVENT, { PUBLIC_EVENT_MAP } from './utils/publicEvent'
import { useUserSelector, useUserDispatch } from './store/'
import { selector, login } from './store/user'

const getInnerHeight = () => {
  let vh = window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function Chat() {
  const { token } = useUserSelector(selector)
  const dispatch = useUserDispatch()

  const [isOpen, setIsOpen] = useState(false)

  const triggerOpen = (status: boolean | undefined) => {
    if (status === undefined)  status = !isOpen
    getInnerHeight()
    setIsOpen(status)
  }

  const mainCss = classNames(
    ChatCss.mainWrap,
    'fixed top-0 bottom-0 right-0 left-0 z-1000 md:top-auto md:left-auto'
  )

  useEffect(() => {
    PUBLIC_EVENT.on(PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG, triggerOpen)
    return () => {
      PUBLIC_EVENT.off(PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    console.log('change token: ' + token)
    dispatch(login({ token }))
  }, [ token ])

  return (
  <div id={ChatCss.chatWrap} className="flex">
    <Transition show={ isOpen } as="div">
      <div id="chat-app-main" className={mainCss}>
        <Transition.Child
          as="div"
          enter="duration-300 ease-out"
          enterFrom="opacity-0 -bottom-44"
          enterTo="opacity-100 -bottom-0"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 -bottom-0"
          leaveTo="opacity-0 -bottom-44"
        >
          <div className="flex relative chat-app-router main-wrap transition-all transform justify-center  items-center md:mr-6 md:mb-3">
            <button className="absolute opacity-40 rounded-md text-xs p-1 top-4 right-4 text-white bg-gray-600 cursor-pointer z-100" onClick={()=> triggerOpen(!isOpen)}>
              <svg style={{ 'width': '20px', 'height': '20px' }} viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </button>
            <Dashboard />
          </div>
        </Transition.Child>
      </div>
    </Transition>
  </div>
  )
}

export default Chat
