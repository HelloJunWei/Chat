<template>
  <div ref="scrollRef" class="scroll-wrap lists flex-grow flex-col text-left h-px overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
    <div ref="topEle" class="flex h-[1px] w-full invisible relative" :style="observeEleMovePx"></div>
    <slot name="header" />
    <slot
      :firstInit="firstInit"
      :scrollToEle="scrollToEle"
      :event="emitter"
    />
    <div ref="bottomEle" class="flex h-[1px] w-full invisible relative" :style="observeEleMovePx"></div>
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeUnmount, toRefs, PropType, onMounted } from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'
import mitt from 'mitt'

type loadPosationType = 'top' | 'bomttom'

export default defineComponent({
  name: 'ItemScrollWrap',
  props : {
    loadPosation: {
      type: String as PropType<loadPosationType>,
      default: () => 'bottom'
    },
    needLoadData: {
      type: Boolean,
      default: () => false
    },
    loadDataDistancePx: {
      type: Number,
      default: () => 0
    }
  },
  setup(props) {
    const { loadDataDistancePx, loadPosation } =  toRefs(props)
    const scrollRef = ref<HTMLElement | null>(null)
    const firstInit = ref(false)
    const emitter = mitt();
    const bottomEle = ref<HTMLElement>()
    const topEle = ref<HTMLElement>()
    const observer = ref<IntersectionObserver | null>(null)
    const eventMap = {
      NEED_LOAD_DATA: 'needLoadData'
    }
    const options = {
      root: unrefElement(scrollRef),
      rootMargin: '0px 0px 150px 0px',
      threshold: 0
    }

    const observeCallback = (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry && entry.isIntersecting) {
          emitter.emit(eventMap.NEED_LOAD_DATA)
        }
      })
    }

    const observeEle = computed(() => loadPosation.value === 'top' ? topEle : bottomEle)
    const observeEleMovePx = computed(() => ({
      [loadPosation.value]: `${loadDataDistancePx.value}px`
    }))

    onBeforeUnmount(() => {
      emitter.all.clear()
      observer.value?.disconnect()
    })

    const scrollHandler = (e: Event) => {
      e.stopPropagation()
    }

    const goToTop = (topN: number) => {
      unrefElement(scrollRef)?.scrollTo({
        top: topN
      })
    }

    const scrollToBottom = () => {
      unrefElement(bottomEle)?.scrollIntoView()
    }
    const scrollToEle = (ele: HTMLElement) => {
      unrefElement(ele)?.scrollIntoView({
        block: 'center',
        behavior:'smooth',
      })
    }

    
    useEventListener(scrollRef, 'scroll', scrollHandler)

    onMounted(() => {
      observer.value = new IntersectionObserver(observeCallback, options)
      // @ts-ignore
      observer.value.observe(unrefElement(observeEle.value))
    })

    return {
      observeEleMovePx,
      bottomEle,
      topEle,
      emitter,
      goToTop,
      eventMap,
      scrollToBottom,
      firstInit,
      scrollRef,
      scrollToEle
    }
  }
})
</script>

<style lang="scss" scoped>
.scroll-wrap {
  content-visibility: auto;
}
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 0.5;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 0.5;
  background-color: #191b22;
  background-color: rgba(25, 27, 34, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}

// dark mode
.dark {
  .scrollbar-track-blue-lighter::-webkit-scrollbar-track {
    --bg-opacity: 0.5;
    background-color: #191b22;
    background-color: rgba(25, 27, 34, var(--bg-opacity));
  }

  .scrollbar-thumb-blue::-webkit-scrollbar-thumb {
    --bg-opacity: 0.5;
    background-color: #edf2f7;
    background-color: rgba(237, 242, 247, var(--bg-opacity));
  }
}
</style>

