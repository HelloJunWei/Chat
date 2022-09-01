<template>
  <AppLayout>
    <template #header>
      <!-- header -->
      <MainHeaderWrap class="relative">
        <UserData :userId="user.userId" v-slot="{ info }">
          <Avatar
            class="inline-block h-9 w-9 rounded-full bg-center bg-contain bg-grey-300 cursor-pointer"
            :url=info.photoUrl
          />
          <div>
            <p class="text-sm text-left font-medium">{{info.displayName}}</p>
          </div>
        </UserData>
      </MainHeaderWrap>
    </template>
    <MainContent :wrapClass="wrapClass">
    <div class="flex flex-col w-full justify-start mt-5">
        <div class="flex justify-center items-center h-full" v-if="rooms.length <= 0">
          <Loading />
        </div>
        <ItemScrollWrap>
          <RoomItem 
            v-for="( item ,index ) in rooms"
            :key="item.roomId"
            :index="index"
            :roomId="item.roomId"
            :uid="userMap.get(item.members[0])?.userId || ''"
            :displayName="userMap.get(item.members[0])?.displayName || ''"
            :time="formatTime(item.LastActiveTime)"
            :members="item.members"
            :avatarUrl="userMap.get(item.members[0])?.photoUrl || ''"
            :recentMsg="item.LastMessage.lastMessage"
            :notReadCount="item.RoomAllCount - item.ReadCount"
            :active="false"
            @click="toRoom(item.roomId)"
          />
        </ItemScrollWrap>
      </div>
    </MainContent>
  </AppLayout>
</template>

<script step lang="ts">
import { defineComponent, computed } from 'vue'
import ViewsExtend from '../layouts'
import * as userStore from '@/store/user'
import * as roomStore from '@/store/room'
import Avatar from '@/components/Avatar'
import UserData from '@/components/data/User'
import ItemScrollWrap  from'@/components/ItemScrollWrap.vue'
import RoomItem from '@/components/RoomItem.vue'
import Loading from '@/components/Loading'
import { timeFormatDistance } from '@/utils/utils'
import { changePageName } from '@/store/router'

export default defineComponent({
  name: 'TalkGroups',
  components: {
    ...ViewsExtend.components,
    Avatar,
    UserData,
    ItemScrollWrap,
    RoomItem,
    Loading
  },
  data: () => ({
    ...ViewsExtend.data
  }),
  setup() {
    const user = userStore.loginedUserState
    const userMap = userStore.userMap

    const rooms = computed(() => {
      /* eslint-disable */
      return Array.from(roomStore.roomsMap.value,
        ([_, value]: [_: string, value: roomStore.RoomClass]) => (value)
      ).sort((a, b) => b.LastActiveTime - a.LastActiveTime)
    })

    const formatTime = (time: number) => timeFormatDistance(time)
    const toRoom = (roomId: string) => {
      roomStore.updateRoomID(roomId)
      changePageName('TalkingRoom')
    }

    return {
      user,
      rooms,
      formatTime,
      userMap,
      toRoom
    }
  }
})
</script>
k
