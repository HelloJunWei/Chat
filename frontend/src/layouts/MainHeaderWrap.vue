<template>
  <div class="text-contentText px-4 py-3.5 pr-14">
    <div class="flex space-x-2 items-center">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainHeaderWrap',
})
</script>
