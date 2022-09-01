import type { User } from '../model/user'

const dummyData: Map<string, User> = new Map([
  ['FAKE_NEIL_TOKEN', {
    userId: 'user1',
    displayName: 'Neil',
    photoUrl: 'https://robohash.org/adf218e18578fbf0b8fee05152eb0331?set=set4&bgset=&size=400x400'
  }],
  ['FAKE_KEN_TOKEN', {
    userId: 'user2',
    displayName: 'Ken',
    photoUrl: 'https://robohash.org/3882ca76ab89185ff6f63aafcc2a8b3a?set=set4&bgset=&size=400x400'
  }]
])

export const findUser = async(token: string) => {
  const result = dummyData.get(token)
  if (!result) {
    throw new Error('not this user')
  }
  return result
}
export const findUsersById = async(userIds: string[]) => {
  const result:User[] = []
  dummyData.forEach((value: User) => {
    if (userIds.includes(value.userId)) {
      result.push(value)
    }
  })
  return result
}
