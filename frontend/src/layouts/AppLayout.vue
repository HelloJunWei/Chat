<template>
  <component :is="layout">
    <!-- header -->
    <template #header-block>
      <slot name="header"></slot>
    </template>
    <!-- main -->
    <slot />
    <!-- footer -->
    <template #footer-block>
      <slot name="footer"></slot>
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, ref, markRaw } from 'vue'
import DefaultLayout from './DefaultLayout.vue'


export default defineComponent({
  name: "AppLayout",
  data: () => ({}),
  setup() {
    const layout = ref(markRaw(DefaultLayout))
    return {
      layout
    }
  }
})
</script>
