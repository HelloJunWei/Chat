<template>
  <div 
    class="flex text-white text-sm mb-1"
    :class="{ 'justify-end': isMe }"
  >
    <!-- avator -->
    <div v-if="!isMe" class="flex flex-shrink-0 items-start pr-2 w-8 mt-1">
      <div v-if="!nextIsMe" class="flex">
        <avatar class="h-6 w-6" :url="avatarUrl" />
      </div>
    </div>
    <!-- message -->
    <div class="flex flex-col max-w-[20em]">
      <!-- message: ok -->
      <div class="flex items-center" :class="{ 'justify-end': !nextIsMe && isMe }">
        <div
          class="p-2 rounded-t-lg break-words leading-snug overflow-hidden"
          :class="[bubbleClass]">
          <slot name="messages" />
        </div>
      </div>
      <div
        v-if="!nextIsMe"
        class="time text-xs mt-1 text-gray-500"
        :class="[ isMe ? 'text-right' : 'text-left']"
        >
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue'
import Avatar from '@/components/Avatar'
import classNames from 'classnames'

export default defineComponent({
  name: 'MessageText',
  components: {
    Avatar
  },
  props: {
    messageId: {
      type:String,
      required: true
    },
    time: {
      type: String
    },
    avatarUrl: {
      type: String,
      required: true
    },
    nextIsMe: {
      type: Boolean,
      default: () => false
    },
    isMe: {
      type: Boolean,
      default: () => false
    },
    notPadding: {
      type: Boolean,
      default: () => false
    },
  },
  setup(props) {
    const { isMe } = toRefs(props)
    const bubbleClass = computed(() => {
      const meStyle = 'bg-mainGreen text-[#242424] rounded-bl-lg order-last'
      const otherStyle = 'bg-[#51545d] rounded-br-lg'
      return classNames([
        isMe.value ?  meStyle : otherStyle
      ])
    })
    return {
      bubbleClass
    }
  }
})
</script>

<style lang="scss" scoped>
@include wrap_main_id {
  .pressed {
    background-color: #1DDEBD;
  }
  .options-item {
    @apply border;
    @apply border-mainBodColor;
    @apply text-xs;
    padding: 2px 5px;
    color: #989898;
    border-radius: 7px;
    word-break: keep-all;
  }
}
</style>

