<script lang="ts">
import './assets/global.scss'
import './assets/skeleton.scss'
import { ref, onBeforeUnmount, onMounted, defineComponent, WatchStopHandle, watch } from 'vue'
import { useToggle } from '@vueuse/core'
import { TransitionRoot, TransitionChild } from '@headlessui/vue'
import Dashboard from './views/Dashboard.vue'
import PUBLIC_EVENT, { PUBLIC_EVENT_MAP } from '@/utils/publicEvent'
import { disableScroll, enableScroll } from '@/utils/utils'
import * as roomStore from './store/room'
import { startRouter, resetRouter } from '@/store/router'
import { useBreakpoints, breakpointsTailwind, useMouseInElement } from '@vueuse/core'

export default defineComponent({
  name: 'ChatApp',
  components: {
    TransitionRoot,
    TransitionChild,
    Dashboard
  },
  setup () {
    roomStore.test
    const [isOpen, toggleIsOpen] = useToggle(false)

    const target = ref(null)
    const { isOutside }  = useMouseInElement(target)
    let watchIsOutSide: WatchStopHandle
    const isSmallerMd = useBreakpoints(breakpointsTailwind).smaller('md')

    const getInnerHeight = () => {
      let vh = window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    const triggerOpen = (status?: boolean | undefined) => {
      toggleIsOpen(status === undefined ? !isOpen.value : status)
      if (isOpen.value === true) {
        startRouter()
        if (isSmallerMd.value) {
          disableScroll()
        } else {
          watchIsOutSide = watch(isOutside, (newVal) => {
            if (newVal)  enableScroll()
            else disableScroll()
          })
        }
      } else {
      const timer = setTimeout(() => {
        resetRouter()
        clearTimeout(timer)
      }, 200)
      }
    }
    const emitOpenDialog = (isOpen: boolean) => {
      triggerOpen(isOpen)
      getInnerHeight()
    }


    onMounted(() => {
      window.visualViewport?.addEventListener('resize', getInnerHeight)
      PUBLIC_EVENT.on(PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG, emitOpenDialog)
    })

    onBeforeUnmount(() => {
      window.visualViewport?.removeEventListener('resize', getInnerHeight)
      PUBLIC_EVENT.off(PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG)
      if (watchIsOutSide) watchIsOutSide()
    })

    return {
      target,
      isOpen,
      triggerOpen
    }


  }
})

</script>
  
  <template>
    <div id="chat-wrap" class="flex">
      <slot name="button-area"></slot>
      <TransitionRoot :show="isOpen" as="template">
          <div id="chat-app-main" class="main-wrap fixed top-0 bottom-0 right-0 left-0 z-1000 md:top-auto md:left-auto">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 -bottom-44"
            enter-to="opacity-100 -bottom-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 -bottom-0"
            leave-to="opacity-0 -bottom-44">
            <div
              class="flex relative chat-app-router main-wrap transition-all transform justify-center  items-center md:mr-6 md:mb-3">
              <button  class="absolute opacity-40 rounded-md text-xs p-1 top-4 right-4 text-white bg-gray-600 cursor-pointer z-100" @click="triggerOpen(false)">
                <!-- <svg-icon /> -->
                <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </button>
              <Dashboard ref="target" />
            </div>
          </TransitionChild>
          </div>
      </TransitionRoot>
    </div>
  </template>
  
  <style lang="scss" scoped>
    @include wrap_main_id {
      .main-wrap {
        min-height: 100%;
        // height: -webkit-fill-available;
        
        // samsung browser
        min-height: -webkit-fill-available;
        height: -webkit-fill-available;
  
        // ios safari
        height: var(--vh);
      }
  
      @supports (-webkit-touch-callout: none) {
          .main-wrap {
            min-height: 100%;
            // min-height: -webkit-fill-available;
          }
      }
  
      @screen md {
        .main-wrap {
          min-height: 20em;
          height: auto;
        }
      }
    }
  </style>
  
  