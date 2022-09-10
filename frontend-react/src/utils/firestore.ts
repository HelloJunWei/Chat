import {
  getFirestore,
  collectionGroup,
  collection,
  CollectionReference,
  Firestore,
  DocumentReference,
  DocumentData
} from 'firebase/firestore'
import { FIREBASE_INSTANCE } from '../api/firebase'
import * as RoomAllSchema from '../utils/schema/RoomAll'

export enum COLLECTION_NAME {
  ROOM_ALL = 'RoomAll',
  MESSAGE_TOTAL_COUNT = 'MessageTotalCount',
  ROOM_USER_DATA = 'RoomUserData',
  MESSAGE_ALL = 'MessageAll'
}

type checkStoreOrRef<A> = A extends Firestore ? Firestore : DocumentReference<A>

/**
 * createCol
 * 
 * @param  {checkStoreOrRef<A, T>} refOrStore
 * @param  {string} collectionName
 */

export const createCol = <A = DocumentData, T = DocumentData>(refOrStore: checkStoreOrRef<A>, collectionName: string) => {
  if (refOrStore instanceof Firestore) {
    return collection(refOrStore, collectionName) as CollectionReference<T>
  }
  // @ts-ignore
  return collection(refOrStore, collectionName) as CollectionReference<T>
}



/**
 * createCollectionGroup
 * 
 * @param  {Firestore} store
 * @param  {string} collectionName
 */

export const createCollectionGroup = <T = DocumentData>(store: Firestore, collectionName: string) => {
  return collectionGroup(store, collectionName) as CollectionReference<T>
}

/**
 * createFirestoreCol
 * 
 * @param  {COLLECTION_NAME} name
 */

export const createFirestoreCol = <T = DocumentData>(name: COLLECTION_NAME|string, store: Firestore) => createCol<Firestore, T>(store, name)

export const createFirestoreCollectionGroup = <T = DocumentData>(name: COLLECTION_NAME|string, store: Firestore) => createCollectionGroup<T>(store, name)
const store = getFirestore(FIREBASE_INSTANCE)


// 單獨的變數
export const $collRef = {
  roomAll: createFirestoreCol<RoomAllSchema.RoomAll>(COLLECTION_NAME.ROOM_ALL, store),
}

export const $collectionGroupRef = {
  roomParticipantAll: createFirestoreCollectionGroup<RoomAllSchema.RoomUserData>(COLLECTION_NAME.ROOM_USER_DATA, store)
}

export default store

