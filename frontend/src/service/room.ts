import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  getDocs,
  doc as docRef,
} from 'firebase/firestore'
import { $collRef, createCol, COLLECTION_NAME } from '@/utils/firestore'
import * as RoomAllSchema from '@/utils/schema/RoomAll'
import * as userApi from '@/api/user'
import { updateReadCount as updateStoreReadCount } from '@/store/room'

type FirebaseDoc<T = DocumentData>  = Query<T>
type RoomSnapshotDoc = QueryDocumentSnapshot<RoomAllSchema.RoomAll> | DocumentSnapshot<RoomAllSchema.RoomAll>

export const getRoomLists = (uid: string): FirebaseDoc<RoomAllSchema.RoomAll> => {
  return query($collRef.roomAll,
    where(RoomAllSchema.RoomAllProperty.ROOM_USERS, "array-contains", uid),
    orderBy(RoomAllSchema.RoomAllProperty.LAST_ACTIVE_TIME, "desc"),
  )
}

/**
 * fromRoomGetMessageTotalCount
 * 
 * It creates a collection reference to the collection named "MESSAGE_TOTAL_COUNT" in the document
 * reference passed in.
 * @param {RoomSnapshotDoc} doc - RoomSnapshotDoc
 */

export const fromRoomGetMessageTotalCount = (RoomDoc: RoomSnapshotDoc) => {
  return createCol<RoomAllSchema.RoomAll, RoomAllSchema.MessageTotalCount>(RoomDoc.ref, COLLECTION_NAME.MESSAGE_TOTAL_COUNT)
}

/**
* calcMessageTotalCountCount
* 
* It takes a collection of documents and returns the sum of the Count property of each document
* @param docs - QuerySnapshot<RoomAllSchema.MessageTotalCount>
* @returns The number of messages in the room.
*/
export const calcMessageTotalCountCount = (docs: QuerySnapshot<RoomAllSchema.MessageTotalCount>): number => {
  let RoomAllCount = 0
  docs.forEach((doc) => {
    if (doc) {
      const { Count = 0 } = doc.data()
      RoomAllCount += Count
    }
  })

  return RoomAllCount
}


/**
 * getUserRoomParticipantInfo
 * 
 * It takes a document snapshot of a room participant and returns an object with the following
 * properties:
 * 
 * - ReadCount
 * - isDelete
 * - isHide
 * - deleteRoomTime
 * - deleteLastMsgRef
 * 
 * The function is used in the following function:
 * @param doc - DocumentSnapshot<RoomAllSchema.RoomParticipantAll>
 */
export const getUserRoomParticipantInfo = (doc: DocumentSnapshot<RoomAllSchema.RoomUserData>) => {
  const exists = doc.exists()
  const {
      ReadCount = 0,
  } = exists ? doc.data() : {}

  return {
    ReadCount
  }
}


/**
 * getUserRoomParticipantDocRef
 * 
 * > It returns a document reference to the room participant document of the user with the given userId
 * @param {RoomSnapshotDoc} doc - RoomSnapshotDoc
 * @param {string} userId - The userId of the user.
 * @returns A document reference to the room participant.
 */

const getUserRoomParticipantDocRef = (doc: RoomSnapshotDoc, userId: string) => {
  const col = createCol<RoomAllSchema.RoomAll, RoomAllSchema.RoomUserData>(doc.ref, COLLECTION_NAME.ROOM_USER_DATA)
  return docRef(col, `${userId}`)
}


/**
 * getSnapshotRoomParticipantDoc
 * 
 * It gets the room participant document for the current user
 * @param {RoomSnapshotDoc} doc - RoomSnapshotDoc
 * @returns A snapshot of the room participant document
 */

export const getSnapshotRoomParticipantDoc = async (doc: RoomSnapshotDoc, userId: string) => {
  const roomParticipantQS = await getDoc(getUserRoomParticipantDocRef(doc, userId))
  const data = getUserRoomParticipantInfo(roomParticipantQS)

  return data
}

/**
 * getSnapshotMessageTotalCountDocs
 * 
 * It gets all the documents in the collection, and then returns the sum of the values in the documents
 * @param {RoomSnapshotDoc} doc - RoomSnapshotDoc
 * @returns The number of messages in the room.
 */

export const getSnapshotMessageTotalCountDocs = async (doc: RoomSnapshotDoc): Promise<number> => {
  const docs = await getDocs(fromRoomGetMessageTotalCount(doc))
  const RoomAllCount = calcMessageTotalCountCount(docs)

  return RoomAllCount
}

/**
 * getRoomInfo
 * 
 * @param  {string} roomId
 */

export const getRoomInfo = (roomId: string) => docRef($collRef.roomAll, roomId)

/**
 * updateUserReadCount
 * 
 * @param  {string} roomId
 */
export const updateUserReadCount = async (roomId: string, count: number): Promise<void> => {
  try {
    await userApi.updateUserReadCount(roomId)
    updateStoreReadCount(roomId, count)
  } catch (e) {
    return Promise.reject(e)
  }
}

