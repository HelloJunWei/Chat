import { getFirebaseApp } from '../utils/firebase'
import { RoomAll, RoomAllConverter, RoomUserDataConverter, TotalMessageConverter, TotalMessageCount } from '../model/room'
import { createMessage } from '../model/message'
import {DocumentReference} from 'firebase-admin/firestore'

export const getRoomInfo = async (roomId: string): Promise<RoomAll| null> => {
  return (await getFirebaseApp()
    .firestore()
    .collection('RoomAll')
    .withConverter(RoomAllConverter)
    .doc(roomId)
    .get())
    .data() || null
}
export const getTotalMessageCount = async (roomId: string): Promise<TotalMessageCount | null> => {
  return (await getFirebaseApp()
    .firestore()
    .collection('RoomAll')
    .doc(roomId)
    .collection('MessageTotalCount')
    .withConverter(TotalMessageConverter)
    .doc('1')
    .get())
    .data() || null
}

export const setMessageDataToFirestore = async (roomId:string, payload: {
  senderId: string,
  otherId: string,
  message: string
}): Promise<DocumentReference> => {
  return await getFirebaseApp()
    .firestore()
    .collection('RoomAll')
    .doc(roomId)
    .collection('MessageAll')
    .add(createMessage({ 
      CreatedTime: new Date(),
      SenderID: payload.senderId,
      AllowRead: [payload.senderId, payload.otherId],
      Text: payload.message
    }))
}


export const updateTotalMessageCount = async (roomId: string, count: number) => {
  await getFirebaseApp()
    .firestore()
    .collection('RoomAll')
    .doc(roomId)
    .collection('MessageTotalCount')
    .doc('1')
    .update({
      Count: count
    })
}

export const updateRoomInfo = async (roomId: string, lastMessageReference: DocumentReference) => {
  await getFirebaseApp()
    .firestore()
    .collection('RoomAll')
    .doc(roomId)
    .update({
      LastMessage: lastMessageReference,
      LastActiveTime: new Date()
    })
}

export const updateUserCount = async(roomId: string, payload: { senderId: string, count: number }) => {
  await getFirebaseApp()
    .firestore()
    .collection('RoomAll')
    .doc(roomId)
    .collection('RoomUserData')
    .withConverter(RoomUserDataConverter)
    .doc(payload.senderId)
    .update({
      ReadCount: payload.count
    })
}
