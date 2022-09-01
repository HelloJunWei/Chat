import { TimeFormatType, timeFormat } from '@/utils/utils'

export type StatusString = 'ok' | 'tb'
type ResponseStatus = 'LOADING' | 'ERROR' | 'OK' | 'ERROR_RESEND'

interface MessageBase {
  id: string,
  SenderID: string,
  AllowRead: string[]
  CreatedTime: number
}

export interface MessageTextBase {
  Text: string,
}


export type MessageInterface = MessageBase & MessageTextBase

export type MsgAllType = Text

export abstract class FirebaseMessageAll implements MessageBase {
  public id: string
  public SenderID: string
  public AllowRead: string[]
  public CreatedTime: number
  abstract get lastMessage(): string

  constructor(payload: MessageBase) {
    this.id = payload.id
    this.SenderID = payload.SenderID
    this.AllowRead = payload.AllowRead
    this.CreatedTime = payload.CreatedTime
  }

  public get createTime(): string {
    return timeFormat(TimeFormatType.HMMAAA, this.CreatedTime)
  }

  public get createDate(): string {
    return `${timeFormat(TimeFormatType.MMDD, this.CreatedTime)} (${timeFormat(TimeFormatType.EEEEE, this.CreatedTime)})`
  }

  public otherUserId (hashId: string): string {
    return this.AllowRead.find(userId => userId !== hashId) || ''
  }

  public isMe(hashId: string): boolean {
    return this.SenderID === hashId
  }

}

export class Text extends FirebaseMessageAll implements MessageTextBase {
  public Text: string

  constructor (payload: MessageInterface) {
    // payload 會是兩個 interface 的結合
    super({
      id: payload.id,
      SenderID: payload.SenderID,
      AllowRead: payload.AllowRead,
      CreatedTime: payload.CreatedTime,
    })
    this.Text = payload.Text
  }

  public get lastMessage(): string {
    return this.Text
  }


  public get isTextType(): boolean {
    return true
  }

}

export const emptyOrNullMessageItem = ({ isNull }: { isNull: boolean }): Text => {
  return  new Text({
    id: '',
    SenderID: '',
    AllowRead: [],
    Text: '',
    CreatedTime: new Date().getTime()
  })
}

