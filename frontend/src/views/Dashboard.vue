<template>
  <div id="chat-app-dashboard" class="dashboard-ele md:rounded-[20px] overflow-hidden flex flex-col min-w-full max-w-none bg-primary shadow-xl md:min-w-[22rem] md:max-w-[22rem] text-white">
    <Suspense>
    <template #default>
      <!-- main block -->
      <component class="flex justify-center" :is="routerName"></component>
    </template>
    <template #fallback>
      <!-- Loading -->
      <div>Loading......</div>
    </template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import TalkGroups from './TalkGroups.vue'
import TalkingRoom from './TalkingRoom.vue'
import { routerName } from '@/store/router'

export default defineComponent({
  name: 'DashboardWrap',
  components: {
    TalkGroups,
    TalkingRoom
  },
  setup() {
    return {
      routerName
    }
  }
})
</script>

<style lang="scss" scoped>
  @include wrap_main_id {
    .dashboard-ele {
      min-height: 100%;
      // height: -webkit-fill-available;
    }

    @supports (-webkit-touch-callout: none) {
      .dashboard-ele {
        min-height: 100%;
        // min-height: -webkit-fill-available;
      }
    }

    @screen md {
      .dashboard-ele {
        min-height: 20rem;
        height: 90vh;
        max-height: 39rem;
      }
    }
  }
</style>

