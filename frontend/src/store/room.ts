import { watch, ref, readonly } from 'vue'
import { Unsubscribe, onSnapshot, QueryDocumentSnapshot, DocumentSnapshot } from 'firebase/firestore'
import { isAuthenticated } from '@/service/user'
import * as userStore from './user'
import * as roomService from '@/service/room'
import * as messageService from '@/service/message'
import * as messageType from '@/types/message'
import * as RoomAllSchema from '@/utils/schema/RoomAll'

export interface RoomType {
  roomId: string
  members: string[]
  LastActiveTime: number
  LastMessage: messageType.FirebaseMessageAll
  RoomAllCount: number
  ReadCount: number
}

export class RoomClass implements RoomType {
  public roomId: string
  public members: string[]
  public LastActiveTime: number
  public LastMessage: messageType.FirebaseMessageAll
  public RoomAllCount: number
  public ReadCount: number

  constructor(payload: RoomType) {
    this.roomId = payload.roomId
    this.members = payload.members.map((val) => val)
    this.LastActiveTime = payload.LastActiveTime
    this.LastMessage = payload.LastMessage
    this.RoomAllCount = payload.RoomAllCount
    this.ReadCount = payload.ReadCount
  }
}
const emptyRoomClass = () => {
  return new RoomClass({
    roomId: 'NULL',
    members: [],
    LastActiveTime: 0,
    LastMessage: messageType.emptyOrNullMessageItem({ isNull: false }),
    RoomAllCount: 0,
    ReadCount: 0,
  })
}

let unsubscribeRoomSnapshot: null | Unsubscribe = null

export const roomsMap = ref(new Map<string, RoomClass>())
const _nowRoomId = ref('')
export const nowRoomId = readonly(_nowRoomId)

const unSubscribleRoom = () => {
  if (unsubscribeRoomSnapshot) unsubscribeRoomSnapshot()
}
export const test = '213'

export const watchUser = watch(isAuthenticated, async (isAuth) => {
  try {
    const userId = userStore.loginedUserState.userId
    // 驗證沒過
    if (!isAuth || !userId) {
      unSubscribleRoom()
      return
    }
    unsubscribeRoomSnapshot = onSnapshot(roomService.getRoomLists(userId), (async (querySnapshot) => {
      querySnapshot.docChanges().forEach(async (change) => {
        const doc = change.doc
        const group = doc.data()

        if (['added', 'modified'].includes(change.type)) {
          await fetchRoomData(doc)
          const {
            newRoom,
            LastMessage,
            RoomAllCount,
            ReadCount
          } = await fetchRoomData(doc)
          
          // new data
          if (change.type === 'added' && !roomsMap.value.has(doc.id)) {
            setRoomMap(doc.id, newRoom)
          }
  
          // modified 
          if (change.type === 'modified')  {
            if (!roomsMap.value.has(doc.id)) {
              setRoomMap(doc.id, newRoom)
            } else {
              updateRoomMap(doc.id, {
                members: group.RoomUsers.filter((userid: string) => userid !== userId),
                LastActiveTime: group.LastActiveTime?.toMillis() || 0,
                LastMessage,
                RoomAllCount,
                ReadCount
              })
            }
          }
        }
      })
    }))

  } catch (e) {
    console.error(e)
  }
})

export const fetchRoomData = async (doc: QueryDocumentSnapshot<RoomAllSchema.RoomAll> | DocumentSnapshot<RoomAllSchema.RoomAll>) => {
  const userId = userStore.loginedUserState.userId || ''
  const group = doc.data()
  if (!group) throw new Error('not has this room data')
  const [
    RoomAllCount,
    { ReadCount },
    LastMessage
  ] = await Promise.all([
    roomService.getSnapshotMessageTotalCountDocs(doc),
    roomService.getSnapshotRoomParticipantDoc(doc, userId),
    messageService.getAndCheckLastMessage({ group, key: 'LastMessage' })
  ])
  const newRoom = new RoomClass(Object.assign({
    roomId: doc.id,
    members: group.RoomUsers.filter((userid: string) => userid !== userId),
    LastActiveTime: group.LastActiveTime?.toMillis() || 0,
  }, {
    LastMessage,
    RoomAllCount,
    ReadCount
  }))

  return {
    RoomAllCount,
    ReadCount,
    LastMessage,
    newRoom
  }
}

export const getRoomMap = (roomId: string): RoomType => {
  const room = roomsMap.value.get(roomId)
  if (room) {
    return room
  }
  return emptyRoomClass()
}


/**
 * setRoomMap
 * 
 * Set the roomMap with the id and value.
 * @param {string} id - The id of the room you want to set.
 * @param {RoomType} value - The value to set the key to.
 */

const setRoomMap = (id: string, value: RoomType) => {
  roomsMap.value.set(id, new RoomClass(value))
}

/**
 * updateRoomMap
 * 
 * It takes an id and a value, and then it updates the roomMap with the new value
 * @param {string} id - The room ID
 * @param value - The value to be set in the map.
 */

const updateRoomMap = (id: string, value: Partial<RoomType>): void => {
  const roomObj = roomsMap.value.get(id)
  if (!roomObj) throw new Error('updateRoomMap: not has this room')
  roomsMap.value.set(id, Object.assign(roomObj, { roomId: id, ...value }))
}

/**
 * updateRoomID
 * 
 * It takes a string as an argument and returns a string
 * @param {string} newRoomId - The new room ID to set the room ID to.
 */
export const updateRoomID = (newRoomId: string): string => _nowRoomId.value = newRoomId



/**
 * updateReadCount
 * @param {string} roomId
 */
 export const updateReadCount = (roomId: string, count: number) => {
  updateRoomMap(roomId, { ReadCount: count })
 }
