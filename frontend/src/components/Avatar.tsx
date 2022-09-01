import { FAKE_AVATAR } from '@/utils/utils'
import { defineComponent, ref, toRefs, watch, computed, onBeforeUnmount} from 'vue'
import classNames from 'classnames'

export default defineComponent({
  name: 'AvatarSide',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  setup(props, { attrs }) {
    const { url } = toRefs(props)
    const hasWorH = attrs.class ? (attrs?.class as string).split(' ').some((i) => i.match(/^(w|h)-.*/)) : false
    const newUrl = ref(FAKE_AVATAR)
    const isLoading = ref(true)
    const unwatch = watch(url, () => {
      if (url.value === '') return
      isLoading.value = true
      const img = new Image()
      img.src = url.value 
      img.onerror = function () {
        newUrl.value = 'https://www.mymyuc.net/images/noavatar_middle.gif'
      }
      img.onload = function () {
        newUrl.value = url.value
        isLoading.value = false
      }
    }, { immediate: true })
    
    const newBackGround = computed(() => ({
      'backgroundImage': isLoading.value ? '' : `url('${newUrl.value}')`
    }))

    const avatarClass = computed(() => classNames({
      'inline-block rounded-full bg-center bg-contain bg-secondary cursor-pointer': true,
      'w-9 h-9': !hasWorH,
      'skeleton_loading': isLoading.value
    }))

    onBeforeUnmount(() => {
      unwatch()
    })

    return () =>
      <div
        class={avatarClass.value}
        style={newBackGround.value}
      >
      </div>
  },
})

