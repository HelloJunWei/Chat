import { Timestamp, DocumentReference } from 'firebase/firestore'


export enum RoomAllProperty {
  ID = 'id',
  CREATED = 'CreatedTime',
  LAST_ACTIVE_TIME = 'LastActiveTime',
  LAST_MESSAGE = 'LastMessage',
  ROOM_USERS = 'RoomUsers'
}

export type RoomAll = {
  [RoomAllProperty.ID]: string
  [RoomAllProperty.CREATED]: Timestamp
  [RoomAllProperty.LAST_ACTIVE_TIME]?: Timestamp
  [RoomAllProperty.LAST_MESSAGE]?: DocumentReference<unknown> | null
  [RoomAllProperty.ROOM_USERS]: string[]
}

export enum MessageAllProperty {
  ID = 'id',
  ALLOW_READ = 'AllowRead',
  CREATED = 'CreatedTime',
  SENDER_ID = 'SenderID',
  TEXT = 'Text'
}

export type MessageAll = {
  [MessageAllProperty.ID]: string
  [MessageAllProperty.ALLOW_READ]: string[]
  [MessageAllProperty.CREATED]: Timestamp
  [MessageAllProperty.SENDER_ID]: string
  [MessageAllProperty.TEXT]: string
}

export type RoomUserData = {
  id: string
  UserID: string
  RoomID: string
  ReadCount: number
}

export type MessageTotalCount = {
  id: '0'
  Count: number
}
