import mitt from 'mitt'

export interface EventMap {
  [key: string]: string | symbol
}

export enum PUBLIC_EVENT_MAP {
  NOT_READ_COUNT_UPDATE = 'update:notReadCount',
  IS_AUTHENTICATED = 'update:Authenticated',
  OPEN_CHAT_DIALOG = 'open:CHAT:Dialog',
}

export type PublicEvents = {
  [PUBLIC_EVENT_MAP.NOT_READ_COUNT_UPDATE]: number
  [PUBLIC_EVENT_MAP.IS_AUTHENTICATED]: boolean
  [PUBLIC_EVENT_MAP.OPEN_CHAT_DIALOG]: boolean
};
const PUBLIC_EVENT = mitt<PublicEvents>()

export default PUBLIC_EVENT
export const clearAll = (): void => PUBLIC_EVENT.all.clear()

