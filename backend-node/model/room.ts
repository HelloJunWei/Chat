import { Timestamp, DocumentReference, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore'
export type RoomAll = {
  CreatedTime: Timestamp,
  LastActiveTime: Timestamp,
  LastMessage: DocumentReference,
  RoomUsers: string[]
}

export type TotalMessageCount = {
  Count: number
}

export type RoomUserData = {
  ReadCount: number
  RoomID: string
  UserID: string
}

export const RoomAllConverter = {
  toFirestore(data: RoomAll): DocumentData {
    return {
      CreatedTime: data.CreatedTime,
      LastActiveTime: data.LastActiveTime,
      LastMessage: data.LastMessage,
      RoomUsers: data.RoomUsers
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
  ): RoomAll {
    const data = snapshot.data()!
    return {
      CreatedTime: data.CreatedTime,
      LastActiveTime: data.LastActiveTime,
      LastMessage: data.LastMessage,
      RoomUsers: data.RoomUsers
    }
  }
}

export const TotalMessageConverter = {
  toFirestore(data: TotalMessageCount): DocumentData {
    return {
      Count: data.Count
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
  ): TotalMessageCount {
    const data = snapshot.data()!
    return {
      Count: data.Count
    }
  }
}

export const RoomUserDataConverter = {
  toFirestore(data: RoomUserData): DocumentData {
    return {
      ReadCount: data.ReadCount,
      RoomID: data.RoomID,
      UserID: data.UserID
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
  ): RoomUserData {
    const data = snapshot.data()!
    return {
      ReadCount: data.ReadCount,
      RoomID: data.RoomID,
      UserID: data.UserID
    }
  }
}
