import { DocumentData, getDoc, DocumentReference, doc, query, where, orderBy } from 'firebase/firestore'
import { COLLECTION_NAME, $collRef, createCol } from '@/utils/firestore'
import * as MessageType from '@/types/message'
import * as RoomAllSchema from '@/utils/schema/RoomAll'
import * as userApi from '@/api/user'

/**
 * getAndCheckLastMessage
 * 
 * @param  {} {group
 * @param  {{group:DocumentData} key}
 * @param  {'LastMessage'}} key
 * @returns Promise
 */
export const getAndCheckLastMessage = async ({group, key}: { group: DocumentData, key: 'LastMessage' }): Promise<MessageType.FirebaseMessageAll> => {
  try  {
    return group[key] ? await getMessageByDoc(group[key]) : MessageType.emptyOrNullMessageItem({ isNull: true })
  } catch (e) {
    return MessageType.emptyOrNullMessageItem({ isNull: true })
  }
}

/**
 * getMessageByDoc
 * 
 * @param  {DocumentData} messageDoc
 * @returns Promise
 */

export const getMessageByDoc = async (messageDoc: DocumentReference): Promise<MessageType.FirebaseMessageAll> => {
  const message = await getDoc(messageDoc)
  const isExists = message.exists()
  if (!isExists) return MessageType.emptyOrNullMessageItem({ isNull: false })
  const data = message.data() as DocumentData
  return createMessageItem(data, message.id)
}

/**
 * createMessageItem
 * 
 * @param  {FirebaseDocData} file
 * @param  {string} docId
 * @returns MessageType
 */

export const createMessageItem = (file: DocumentData, docId: string): MessageType.Text => {
  const messageItem = new MessageType.Text({
    id: docId,
    Text: file.Text.toString(),
    SenderID: file.SenderID,
    AllowRead: file.AllowRead,
    CreatedTime: file.CreatedTime.toMillis(),
  })
  return messageItem
}


/**
 * getCanReadUserMessage
 * 
 * @param  {FirebaseDocRef} docRef
 * @param  {string} userId
 */

export const getCanReadUserMessage = (docRef: DocumentReference<RoomAllSchema.RoomAll>, userId: string) =>{
  return query<RoomAllSchema.MessageAll>(
    createCol<RoomAllSchema.RoomAll, RoomAllSchema.MessageAll>(docRef, COLLECTION_NAME.MESSAGE_ALL),
    where(RoomAllSchema.MessageAllProperty.ALLOW_READ, 'array-contains', userId),
    orderBy(RoomAllSchema.MessageAllProperty.CREATED, 'desc')
  )

} 
/**
 * getMessageAll
 * 
 * @param  {string} roomId
 * @param  {string} userId
 */

export const getMessageAll = (roomId: string, userId: string) => getCanReadUserMessage(doc($collRef.roomAll, roomId), userId)

/**
 * sendMessage
 * 
 * @param  {string} roomId
 * @param  {string} message
 * @return {string} messageId
 */
export const sendMessage = async(roomId: string, message: string):Promise<string> => {
  const data = await userApi.sendMessage(roomId, message)
  return data.messageId
}
