<template>
  <div>
    <div class="flex text-contentText py-4 px-2 border-t border-mainBodColor space-x-2.5 bg-bgDark">
      <!-- message input -->
      <div class="flex flex-grow min-w-0 px-2 py-1 pl-4 bg-secondary rounded-md" :class="[computedExpandClass.borderRadius, computedExpandClass.flex]">
        <MyTextarea
          ref="textInputRef"
          class="p-0 flex-grow min-w-0 text-sm focus:text-sm bg-transparent text-white placeholder-white border-0 focus:ring-transparent focus:border-transparent focus:outline-none focus:border-0 resize-none scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded placeholder-opacity-75"
          v-model="messageText"
          :max-rows="3"
          :min-rows="1"
          placeholder="Aa"
          @keydown.enter="checkEnter"
        />
      </div>
      <!-- submit button -->
      <div class="flex" :class="computedExpandClass.flex">
        <button class="focus:outline-none flex" @click="sendMsg">
          <FontIcon name="send" /> 
        </button>  
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, customRef, onBeforeUnmount, toRefs } from 'vue'
import { useDebounceFn, useBreakpoints, breakpointsTailwind, unrefElement } from '@vueuse/core'
import FontIcon from '@/components/FontIcon'
import MyTextarea from '@/components/MyTextarea.vue'
import { isOverTextLength } from '@/utils/utils'

export default defineComponent({
  name: 'messageSendList',
  props: {
    roomId: {
      type: String,
      required: true
    },
  },
  emits: ['sendMessage', 'sendSuccess'],
  components: {
    FontIcon,
    MyTextarea,
  },
  setup (props, { emit }) {
    const { roomId } = toRefs(props)
    const sendTextOrigin = ref('')
    const isMobile = useBreakpoints(breakpointsTailwind).isSmaller('sm')
    const MAX_LENGTH = 1000
    const textRef = () => customRef((track, trigger) => {
      return {
        get() {
          track()
          return sendTextOrigin.value
        }, 
        set(newValue: string) {
          if (!isOverTextLength(newValue, MAX_LENGTH)) {
            sendTextOrigin.value = newValue;
          }
          trigger();
        } 
      }
    })
    const messageText = textRef()
    const textInputRef = ref<HTMLTextAreaElement | null>(null)
    const computedExpandClass = computed(() => {
      let isExpand = false
      if (textInputRef.value) {
        // @ts-ignore
        isExpand = textInputRef.value.isExpand
      }
      return {
        flex: isExpand ? 'items-end' : 'items-center',
        borderRadius: isExpand ? 'rounded-xl' : 'rounded-full'
      }
    })
    const checkEnter = (event: KeyboardEvent) => {
      if (event.isComposing) return
      // cheinese input
      if (event.which === 229) return
      // shift+enter
      if (event.shiftKey || isMobile) return
      event.preventDefault()
      sendMsg()
    }
    const sendMsg = () => {
      if (textInputRef.value !== null) {
        keepElementFocus(textInputRef.value)
      }
      debounceSendMsg()
    }
    const keepElementFocus = (el: HTMLElement) => {
      unrefElement(el)?.focus()
      unrefElement(el)?.scrollIntoView()
    }

    let debounceSendMsg: any = useDebounceFn(() => {
      if (messageText.value === '') return
      emit('sendMessage', {
        roomId: roomId.value,
        message: messageText.value.trim(),
      })
      messageText.value = ''
    }, 150)

    onBeforeUnmount(() => {
      debounceSendMsg = null
    })

    return {
      computedExpandClass,
      textInputRef,
      messageText,
      checkEnter,
      sendMsg
    }
  }
})
</script>
