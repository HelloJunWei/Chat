<template>
  <textarea
    ref="textarea"
    v-bind="attr"
    :style="computedTextareaStyle"
    @input="handleInput"
    @keydown.enter="handleKeydown"
    @paste="handlePaste" 
  >
  </textarea>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted, watch, computed, shallowRef } from 'vue'
import { calcTextareaHeight, TextAreaHeight } from '@/utils/utils'
export default defineComponent({
  name: 'MyTextarea',
  props: {
    minRows: {
      type: Number,
      default: 1
    },
    maxRows: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: String,
      default: ''
    },
  },
  emits: ['update:modelValue', 'keydown', 'paste'],
  setup (props, { emit, expose }) {
    const isExpand = ref<boolean>(false)
    const textarea = ref<HTMLTextAreaElement | null>(null)
    const DEFAULT_EXCLUDE_KEYS = ['class', 'style']
    const _calcStyle = shallowRef<TextAreaHeight>({ height: '21px'})
    const computedTextareaStyle = computed<any>(() => {
      return [
        { '-webkit-overflow-scrolling': 'touch' },
        _calcStyle.value
      ]
    })

    const instance = getCurrentInstance()

    const attr = computed(() => {
      return Object.fromEntries(
        // @ts-ignore
        Object.entries(instance.proxy.$attrs).filter(
          ([key]) => !DEFAULT_EXCLUDE_KEYS.includes(key)
        ))
    })

    const nativeInputValue = computed(() => {
      return String(props.modelValue)
    }
    )

    const setNativeInputValue = () => {
      const input = textarea.value
      if (input !== null) {
        if (input.value === nativeInputValue.value) return
        input.value = nativeInputValue.value
      }
    }


    const handleInput = (event: Event) => {
      // @ts-ignore
      const { value } = event.target
      emit('update:modelValue', value)
    }


    const handleKeydown = (event: Event) => {
      emit('keydown', event)
    }

    const handlePaste = (e: ClipboardEvent) => {
      emit('paste', e)
    }

    const resizeTextarea = () => {
      _calcStyle.value = textarea?.value ? calcTextareaHeight(textarea?.value, props.minRows, props.maxRows) : { height: '21px'}
      isExpand.value = parseInt(_calcStyle.value.height) > 21 ? true : false
    }

    onMounted(() => {
      setNativeInputValue()
      resizeTextarea()
    })

    watch(nativeInputValue, () => {
      setNativeInputValue()
      resizeTextarea()
    }, { flush: 'post' })

    expose({
      isExpand
    })

    return {
      textarea,
      attr,
      handleInput,
      handlePaste,
      handleKeydown,
      computedTextareaStyle
    }
  }
})
</script>

<style scoped>

</style>

