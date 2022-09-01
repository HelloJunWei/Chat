<template>
  <AppLayout>
    <!-- Slot: Header -->
    <template #header>
      <div class="text-contentText px-4 py-3.5 pl-2 pr-14 border-b border-mainBodColor bg-bgDark min-h-[3.5em]">
        <div class="flex items-center">
          <UserData :userId="candidateId || ''" v-slot="{ info }">
          <!-- Back button -->
          <div class="flex">
            <button class="focus:outline-none flex" @click="back">
              <FontIcon class="text-3xl leading-6" name="chevron_left" />
            </button>
          </div>
          <!-- Avatar -->
          <div class="ml-1 flex justify-center">
            <avatar :url="info.photoUrl"/>
          </div>
          <!-- Display name -->
          <div class="displayname ml-2">
            <p class="text-sm text-left font-medium">
              {{ info.displayName }}
            </p>
          </div>
          </UserData>
        </div>
      </div>
    </template>
    <!-- Slot: Footer -->
    <template #footer>
      <MessageSendList
        :roomId="nowRoomId"
        @send-message="sendMessage"
      />
    </template>
    <MainContent :wrapClass="wrapClass" class="relative" id="chat-talkingRoom">
      <div class="relative flex flex-col friend-lists flex-grow text-white bg-bgDark">
        <div v-if="isLoadData" class="absolute top-0 w-full text-center py-1 text-xs bg-bgLight text-bgDark z-[1] opacity-80">讀取中...</div>
        <ItemScrollWrap
          ref="scrollIWrap"
          :loadPosation="'top'"
          class="flex p-3"
        >
          <div v-for="groupMessage, key in groupMessages" :key="key" class="flex flex-col">
            <!-- intersectionObserve -->
            <div class="h-[1px] " v-sticky="stickyOberver" :data-stickyId="getTimestamp(groupMessage[0].CreatedTime)"></div>
              <div
                class="top-0 text-center mt-3 text-sm sticky z-75 my-transition"
                v-if="groupMessage.length > 0"
              >
              <span class="rounded-md text-center inline-block relative timestamp py-[2px] px-[10px]">
                  {{ getTimestamp(groupMessage[0].CreatedTime) }}
                </span>
            </div>
            <MessageBubble
              v-for="message, key2 in groupMessage"
              :key="`${key2}-${message.id}`"
              :class="[key2 === 0  ? 'mt-3' : '']"
              :messageId="message.id"
              :isMe="message.isMe(userId)"
              :time="message.createTime"
              :nextIsMe="hasNextMessage(groupMessage, message.SenderID, key2 + 1)"
              :avatarUrl="userMap.get(message?.SenderID)?.photoUrl || ''"
              >
                <template #messages>
                  <MainContent wrapClass="whitespace-pre-wrap leading-5 max-w-[11em]">
                    {{ message.Text }}
                  </MainContent>
                </template>
              </MessageBubble>
          </div>
        </ItemScrollWrap>
      </div>
  </MainContent>
</AppLayout>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { getDocs, query, limit, onSnapshot, Unsubscribe, startAfter } from 'firebase/firestore'
import ViewsExtend from '@/layouts'
import FontIcon from '@/components/FontIcon'
import UserData from '@/components/data/User'
import Avatar from '@/components/Avatar'
import MessageSendList from '@/components/MessageSendList.vue'
import ItemScrollWrap from '@/components/ItemScrollWrap.vue'
import * as MessageType from '@/types/message'
import useTalkingRoom from '@/composition/talkingRoom'
import * as messageService from '@/service/message'
import MessageBubble from '@/components/MessageBubble.vue'
import { uuid4 } from '@/utils/utils'
import { watchDebounced, useDebounceFn } from '@vueuse/core'
import { createCol, COLLECTION_NAME } from '@/utils/firestore'
import * as RoomAllSchema from '@/utils/schema/RoomAll'
import * as roomService from '@/service/room'

export default defineComponent({
  name: 'TalkingRoom',
  components: {
    ...ViewsExtend.components,
    FontIcon,
    UserData,
    Avatar,
    MessageSendList,
    ItemScrollWrap,
    MessageBubble
  },
  directives: {
    sticky: {
      mounted(e, binding) {
        const stickyOberver = binding.value
        stickyOberver.observe(e)
      }
    }
  },
  data: () => ({
    ...ViewsExtend.data
  }),
  setup() {
    const stickyOberver = new IntersectionObserver((entries) => {
      entries.forEach(i => {
        const stickyId = i.target.getAttribute('data-stickyId') as string
        let nextElement = i.target.nextElementSibling as Element
        if(i.intersectionRatio > .9) {
          stickyElements.delete(stickyId)
          nextElement.classList.add('isFix')
        } else {
          stickyElements.set(stickyId, nextElement)
          nextElement.classList.remove('isFix')
        }
      });
    }, { threshold: [0, 1] })

    const {
      userId,
      nowRoomId,
      candidateId,
      userMap,
      isScroll,
      firstInit,
      isLoadData,
      stickyElements,
      lastVisible,
      messages,
      groupMessages,
      getTimestamp,
      createMessage,
      hasNextMessage,
      getTalkingRoomScrollWrapElement,
      back,
      findAndUpdateMessage
    } = useTalkingRoom()
    
    let unsubscribeRoomMessage: null | Unsubscribe = null
    let unsubscribeRoomInfo: null | Unsubscribe = null
    const scrollIWrap = ref<InstanceType<typeof ItemScrollWrap> | null>(null)

    const loadHistoryMsg = async () => {
      isLoadData.value = true
      const limitCount = 15
      if (lastVisible.value !== null) {
        try {
          const qs = await getDocs(query(messageService.getMessageAll(nowRoomId.value, userId),
            startAfter(lastVisible.value),
            limit(limitCount)
          ))

          if (!qs.empty) {
            if (qs.size >= limitCount) {
              lastVisible.value = qs.docs[qs.docs.length - 1]
            } else {
              lastVisible.value = null
            }

            const msgItems: MessageType.MsgAllType[] = []
            qs.docChanges().forEach(async(change) => {
              if (change.type === 'added') {
                const doc = change.doc
                const data = await createMessage(doc)
                msgItems.unshift(data)
              }
            })
            await nextTick()
            Object.assign(messages, Object.freeze(msgItems.concat(messages as MessageType.MsgAllType[])))
          } else {
            lastVisible.value = null 
          }
        } catch (e) {
          console.error(e)
        }
      }
      isLoadData.value = false
    }

    const handleLoadHistory = async () => {
      if (isLoadData.value) return
      try {
        await loadHistoryMsg()
        if (lastVisible.value !== null && lastVisible.value !== undefined) {
          scrollIWrap.value?.goToTop(130)
        }
      } catch (e) {
        console.error(e)
      }
    }
    const unWatchScrollIWrap = watch(scrollIWrap, async () => {
      if (scrollIWrap.value) {
        scrollIWrap.value?.emitter.on(scrollIWrap.value?.eventMap.NEED_LOAD_DATA, handleLoadHistory)
        unWatchScrollIWrap()
      }
    })

    // snapshot
    const genMessageSnapshot = () => {
      return onSnapshot(messageService.getMessageAll(nowRoomId.value, userId), (async (qs) => {
        const messageArray = qs.docChanges()
        for (let i = 0; i < messageArray.length; i++) {
          if (firstInit.value) return 
          const change = messageArray[i]
          let msg: MessageType.MsgAllType = await createMessage(change.doc)

          if (change.type === 'modified') {
            const itemIdx = messages.findIndex((item) => item.id === msg.id)
            if (itemIdx >= 0) {
              Object.assign(messages[itemIdx], msg, {})
            }
          } else if (change.type === 'added') {
            if (msg.SenderID !== userId) {
              messages.push(msg)
            }
            await nextTick()
            scrollIWrap.value?.scrollToBottom()
          }
        }
      }))
    }

    const messageInit = async(limitCount: number) => {
      const qs = await getDocs(query(
        messageService.getMessageAll(nowRoomId.value, userId),
        limit(limitCount)
      ))

      if (qs.size >= limitCount) {
        if (firstInit.value) lastVisible.value = qs.docs[qs.docs.length - 1]
      }
      const messageArray = qs.docChanges()
      for (let i = 0; i < messageArray.length; i++) {
        const change = messageArray[i]
        const data = await createMessage(change.doc)
        messages.unshift(data)
      }
      await nextTick()
      scrollIWrap.value?.scrollToBottom()
      firstInit.value = false
    }


    const sendMessage = async (sendObj: { roomId: string, message: string }) => {
      const fakeID = uuid4()
      try {
        messages.push(new MessageType.Text({
          id: fakeID,
          AllowRead: [],
          SenderID: userId,
          Text: sendObj.message || '',
          CreatedTime: new Date().getTime(),
        }))
        await nextTick()
        scrollIWrap.value?.scrollToBottom()
        const messageId = await messageService.sendMessage(sendObj.roomId, sendObj.message)
        findAndUpdateMessage(fakeID, { id: messageId })
      } catch (e) {
        console.error(e)
      }
    }
    const unwatchIsScroll = watchDebounced(isScroll, (value) => {
      if (value) {
        // do something when scroll
        stickyElements.forEach((e) => {
          if (!e.classList.contains('isFix')) {
            e.classList.add('isMoving')
          }
        })
      }
    }, { debounce: 350 })

    const debounceFN = useDebounceFn(() => {
      isScroll.value = false
      stickyElements.forEach((e) => {
        if (!e.classList.contains('isFix')) {
          e.classList.remove('isMoving')
        }
      })
    }, 300)

    const scrollFn = () => {
      isScroll.value = true
      debounceFN()
    }

    onMounted(() => {
      const col = createCol<RoomAllSchema.RoomAll, RoomAllSchema.MessageTotalCount>(roomService.getRoomInfo(nowRoomId.value), COLLECTION_NAME.MESSAGE_TOTAL_COUNT)
      unsubscribeRoomInfo = onSnapshot(col, ((qs) => {
        try {
          qs.docChanges().forEach(async(change) => {
            const doc = change.doc.data()
            roomService.updateUserReadCount(nowRoomId.value, doc.Count)
          })
        } catch (e) {
          console.error(e)
        }
      }))
      unsubscribeRoomMessage = genMessageSnapshot()
      messageInit(30)
      getTalkingRoomScrollWrapElement('chat-talkingRoom')?.addEventListener('scroll', scrollFn)
    })

    onBeforeUnmount(() => {
      if (stickyOberver) {
        stickyOberver.disconnect()
      }
      if (unsubscribeRoomMessage) {
        unsubscribeRoomMessage()
        unsubscribeRoomMessage = null
      }
      scrollIWrap.value = null
      messages.splice(0)
      if (unsubscribeRoomInfo) {
        unsubscribeRoomInfo()
        unsubscribeRoomInfo = null
      }
      unwatchIsScroll()
    })

    return {
      candidateId,
      isLoadData,
      nowRoomId,
      scrollIWrap,
      groupMessages,
      stickyOberver,
      userMap,
      userId,
      hasNextMessage,
      sendMessage,
      back,
      getTimestamp,
    }
  }
})
</script>

<style lang="scss" scoped>
@include wrap_main_id {
  .sticky {
    opacity: 0;
  }
  .sticky.isFix {
    opacity: 1;
  }
  .sticky.my-transition {
    transition: opacity .1s ease-out;
  }
  .sticky.isMoving {
    opacity: 1;
  }
  .timestamp{
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
}
</style>

