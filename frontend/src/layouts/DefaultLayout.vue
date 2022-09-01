<template>
  <div class="flex flex-col flex-grow">
    <slot name="header-block"></slot>
    <slot></slot>
    <slot name="footer-block"></slot>
  </div>
</template>

<script lang="ts">

export default {
  name: 'DefaultLayout',
}
</script>
