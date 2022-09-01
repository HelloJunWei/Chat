<template>
  <div class="flex py-3 px-5 space-x-3 items-center cursor-pointer hover-and-active:bg-tertiary">
    <!-- avatar -->
    <div class="flex relative rounded-full bg-grey-300">
      <div
        class="inline-block h-9 w-9 rounded-full bg-center bg-contain"
        :style="{ backgroundImage: `url('${newUrl}')` }"
        ></div>
      <span
        class="point absolute w-1.5 h-1.5 rounded-full -right-1 -top-1"
        :class="{ 'active': active }"
      ></span>
    </div>
    <!-- displayName, message -->
    <div class="flex-grow">
      <p class="text-sm text-left font-medium flex items-center">
        {{ displayName }}
      </p>
      <p class="text-itme-wrap text-sm text-gray-400 text-left font-medium whitespace-pre-line max-h-[3em] break-all" v-text="getRecentMsg"></p>
    </div>
    <!-- time, not read count -->
    <div class="flex flex-col min-w-[4em]">
      <div class="text-xs text-gray-400 text-right">{{ time }}</div>
      <div class="text-right">
        <span
          v-show="notReadCount > 0"
          class="inline-block text-sm leading-normal font-bold rounded-full text-center bg-mainGreen min-w-[1.5em] min-h-[1.5em]"
          :class="[countStyle]"
        >{{ filterNotReadCount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, PropType, toRefs, ref, computed, onBeforeUnmount } from 'vue'
import * as userStore from '@/store/user'
import { FAKE_AVATAR } from '@/utils/utils'
import classNames from 'classnames'

export default defineComponent({
  name: 'RoomItem',
  props: {
    index: {
      type: Number,
    },
    roomId: {
      type: String,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    members: {
      type: Array as PropType<string[]>,
      required: true
    },
    notReadCount: {
      type: Number,
      default: () => 0
    },
    displayName: {
      type: String,
      required: true
    },
    time: {
      type: String
    },
    active: {
      type: Boolean,
      default: () => false
    },
    avatarUrl: {
      type: String,
      required: true
    },
    recentMsg: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { avatarUrl, notReadCount, recentMsg }  = toRefs(props)
    const newUrl = ref(FAKE_AVATAR)
    const owner_user_pan_id = props.members[0] || ''

    if (owner_user_pan_id !== '') {
      userStore.needGetInfoUsers.value.push(owner_user_pan_id)
    }

    const filterNotReadCount = computed(() => notReadCount.value > 99
        ? '99+'
        : notReadCount.value < 0
          ? 0
          : notReadCount.value)

    const getRecentMsg = computed(() => recentMsg.value === ''
      ? ' '
      : recentMsg.value
    )

    const countStyle = computed(() =>
      classNames((notReadCount.value < 10
        ? ['min-w-[1.5em] min-h-[1.5em]'] 
        : ['px-2']
        )
      )
    )

    const unwatch = watch(avatarUrl, () => {
      const img = new Image()
      img.src = avatarUrl.value 
      img.onerror = function () {
        newUrl.value = FAKE_AVATAR
      }
      img.onload = function () {
        newUrl.value = avatarUrl.value
      }
    }, { immediate: true })
    onBeforeUnmount(() => {
      unwatch()
    })

    return {
      newUrl,
      filterNotReadCount,
      getRecentMsg,
      countStyle,
    }
  }
})
</script>

<style lang="scss" scoped>
  @include wrap_main_id {
    .point.active {
      @apply bg-mainGreen
    }

    .text-itme-wrap {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
</style>

