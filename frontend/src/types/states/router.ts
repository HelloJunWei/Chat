import type { DefaultContext } from 'xstate'

type UserRouterName =
  'TalkGroups'
| 'TalkingRoom'


export type RouterName = UserRouterName

export type RouterFunction  = 
  'TalkingRoom'
| 'TalkGroups'
| 'reset'

export type RouterEvent = { type: RouterFunction, target: RouterName }
export type UserTypestate = 
  {
  value: RouterName,
  context: DefaultContext
}

export const routerMachine = {

  id: 'TalkRouter',
  initial: 'TalkGroups',
  states: {
    TalkGroups: {
      on: {
        TalkingRoom: { target: 'TalkingRoom' },
      },
    },
    TalkingRoom: {
      on: {
        TalkGroups: { target: 'TalkGroups' },
        reset: { target: 'TalkGroups' }
      }
    }
  }
}
