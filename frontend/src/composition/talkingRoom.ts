import { computed, ref,reactive } from 'vue'
import * as MessageType from '@/types/message'
import type { DocumentData } from 'firebase/firestore'
import { createMessageItem } from '@/service/message'
import { updateRoomID, nowRoomId, roomsMap } from '@/store/room'
import { loginedUserState, userMap } from '@/store/user'
import { changePageName } from '@/store/router'
import useTimestamp from '@/composition/Timestamp'

export default function () {
  const {
    getTimestamp,
    getStartOfDay
  } = useTimestamp()

  const isScroll = ref(true)
  const firstInit = ref(true)
  const stickyElements = new Map()
  const isLoadData = ref(false)
  const lastVisible = ref<DocumentData | null>(null)
  const messages = reactive<MessageType.MsgAllType[]>([])

  const userId = loginedUserState.userId as string

  const candidateId = computed(() => {
    const data = roomsMap.value.get(nowRoomId.value)
    if (data) {
      return data.members[0]
    }
    return ''
  })

  const groupMessages = computed(() => {
    const groupByDate = []
    let dateMessage = []
    let checkDate = messages.length > 0 ? getStartOfDay(messages[0].CreatedTime).getTime() : 0
    for (let i = 0; i < messages.length; i ++) {
      const data = messages[i]
      const startOfDay = getStartOfDay(data.CreatedTime).getTime()
      if (startOfDay !== checkDate) {
        checkDate = startOfDay
        groupByDate.push(dateMessage)
        dateMessage = []
      }
      dateMessage.push(data)
    }
    if (dateMessage.length > 0) {
      groupByDate.push(dateMessage)
      dateMessage = []
    }
    return groupByDate
  })

  const createMessage = async (doc: DocumentData): Promise<MessageType.MsgAllType> => {
    return createMessageItem(doc.data(), doc.id)
  }
  const hasNextMessage = (msgs: MessageType.MsgAllType[], thisMsgSender: string, nextMsgKey: number) => {
    return msgs[nextMsgKey]
      ? msgs[nextMsgKey].SenderID === thisMsgSender
      : false
  }

  const getTalkingRoomScrollWrapElement = (talkingRoomID: string): Element | null => {
    return document.getElementById(talkingRoomID)?.getElementsByClassName(`scroll-wrap`)[0] || null
  }

  const back = () => {
    updateRoomID('')
    changePageName('TalkGroups')
  }

  const findAndUpdateMessage = (id: string, { ...value }: Partial<MessageType.MessageInterface>) => {
    const index = messages.findIndex((msg) => msg.id === id)
    Object.assign(messages[index], { ...messages[index], ...value })
  }

  return {
    userMap,
    userId,
    nowRoomId,
    candidateId,
    isScroll,
    firstInit,
    stickyElements,
    isLoadData,
    lastVisible,
    messages,
    groupMessages,
    back,
    createMessage,
    hasNextMessage,
    getTimestamp,
    getTalkingRoomScrollWrapElement,
    findAndUpdateMessage
  }
}
