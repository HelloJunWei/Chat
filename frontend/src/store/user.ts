import { readonly, ref, reactive, watch, computed } from 'vue'
import { watchThrottled } from '@vueuse/core'
import * as userService from '@/service/user'
import type { UserInterface } from '@/types/user'


// ====================
// State
// ====================
const _userToken = ref('')
const _loginedUserState = reactive<UserInterface>({
  userId: '',
  displayName: '',
  photoUrl: '',
})
const _users = reactive<UserInterface[]>([])

export const userToken = readonly(_userToken)
export const loginedUserState = readonly(_loginedUserState)
export const userMap = computed(() => new Map(_users.map(user => ([user.userId, user]))))
export const getUserInfo = computed(() => (userId: string) => userMap.value.get(userId))
export const needGetInfoUsers = ref<string[]>([])


// ====================
// watch
// ====================
export const watchUserToken = watch(_userToken, async (newToken) => {
  try {
    if (!newToken) return
    const userData = await userService.login(newToken)
    _users.push({
      userId: userData.userId,
      displayName: userData.displayName,
      photoUrl: userData.photoUrl
    })
    updateUserState({
      userId: userData.userId,
      displayName: userData.displayName,
      photoUrl: userData.photoUrl
    })
    await userService.firebaseLogin(userData.firebaseToken)
  } catch (e) {
    console.error(e)
  }
})



// ====================
// Mutations
// ====================

export const updateUserToken = (value: string) => {
  if (!value) return
  _userToken.value = value
}

export const updateUserState = (paylod :UserInterface) => {
  _loginedUserState.userId = paylod.userId
  _loginedUserState.photoUrl = paylod.photoUrl
  _loginedUserState.displayName = paylod.displayName
}

export const clearNeedGetInfoUsers = (): void => {
  needGetInfoUsers.value.splice(0)
}

// ====================
// Action
// ====================
export const watchThrottleNeedGet = watchThrottled(needGetInfoUsers.value, (users) => {
  const u_list = [...users.filter(id => !userMap.value.has(id))]
  if (u_list.length !== 0) {
    userService.getUserInfo(u_list).then((val) => {
      val.map((val) => _users.push(val))
    })
    clearNeedGetInfoUsers()
  }
}, { throttle: 10, trailing: true, leading: false })

