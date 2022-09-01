export type Message = {
  AllowRead: string[],
  CreatedTime: Date,
  SenderID: string,
  Text: string
}

export const createMessage = (payload: Message):Message => {
  return payload
}
