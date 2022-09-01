import { defineComponent, toRefs, ref, watch, computed } from 'vue'
import { tryOnMounted } from '@vueuse/core'
import { userMap, getUserInfo, needGetInfoUsers } from '@/store/user'


export default defineComponent({
  name: 'getUser',
  props: {
    userId: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  setup(props, { slots }) {
    const { userId = ref('') } = toRefs(props)
    const isLoading = getUserInfo.value(userId.value) === undefined
    const onChanged = async (userid: string) => {
      if (userid !== '') {
        const userInMap = userMap.value.has(userid)
        
        if (!userInMap) {
          needGetInfoUsers.value.push(userid)
        }
      }
    }

    watch(userId, onChanged)
    tryOnMounted(() => onChanged(userId.value))

    const data = computed(() => ({
      info: getUserInfo.value(userId.value) || {},
      isLoading
    }))
    return () => {
      if (slots.default)
        return slots.default(data.value)
    }
  },
})

