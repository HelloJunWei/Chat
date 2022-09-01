<template>
  <div class="playground">
    <p class="title">
      Chose user and login:
    </p>
    <div>
      <div>
        <input type="radio" id="neil" v-model="user" value="FAKE_NEIL_TOKEN">
        <label for="neil">Neil</label>
      </div>
      <div>
        <input type="radio" id="ken" v-model="user" value="FAKE_KEN_TOKEN">
        <label for="ken">Ken</label>
      </div>
    </div>
    <div class="button-side" v-if="!afterLogin">
      <button
        class="login-btn"
        @click="toggleChat"
      >
        login
      </button>
    </div>
    <div class="button-side" v-if="afterLogin">
      <button
        class="login-btn"
        @click="open"
      >
        open
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Chat from './chat'

const chat = new Chat({
  css: ''
})

export default defineComponent({
  name:"PlaygroundPlay",
  setup () {
    const user = ref('')
    const afterLogin = ref(false)
    const toggleChat = () => {
      if (!user.value) {
        alert('please chose the user')
        return
      }
      chat.updateUserToken(user.value)
      chat.triggerOpen(true)
      afterLogin.value = true
    }

    const open = () => {
      chat.triggerOpen(true)
    }

    return {
      toggleChat,
      user,
      afterLogin,
      open
    }
  }
})
</script>

<style scoped lang="scss">
  .playground{
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title {
      font-size: 22px;
      margin-bottom: 20px;
    }
    .login-btn {
      background: #409eff;
      border-radius: 5px;
      width: 100px;
      color: white;
    }
    .button-side {
      margin-top: 20px;
    }
  }
</style>
