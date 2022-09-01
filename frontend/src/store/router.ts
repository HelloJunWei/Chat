import { computed, readonly, ref, unref } from 'vue'
import { routerMachine } from '@/types/states/router'
import type { RouterEvent, UserTypestate, RouterFunction } from '@/types/states/router'
import { createMachine, interpret } from 'xstate'
import type { DefaultContext, StateFrom, AnyStateMachine, Subscription } from 'xstate'


const machine = createMachine<DefaultContext, RouterEvent, UserTypestate>(routerMachine)


const normalUserService = interpret(machine).start()

const _routerName = ref('TalkGroups')

let subscribe: Subscription | null = null
const getService = computed(() => {
  return normalUserService
})

export const changePageName= (type: RouterFunction) => {
  const change = unref(getService)
  change.send(type)
}

export const setRouterMachine = () => {
  _routerName.value = normalUserService.machine.initial as string
}


export const routerName = readonly(_routerName)

export const resetRouter = () => {
  if (_routerName.value !== 'TalkGroups') {
    changePageName('reset')
  }
  getService.value.stop()
  subscribe?.unsubscribe()
  subscribe = null
}

export const startRouter = () => {
  if (!subscribe) {
    getService.value.start()
    subscribe = getService.value.subscribe(function(nextState: StateFrom<AnyStateMachine>) {
      // has change state
      if (nextState.changed) {
        _routerName.value = nextState.value as string
      }
    })
  }
}

export interface Routers {
  [key: string]: Router
}

export interface Router {
  name:   string;
  layout: string;
}

export const ALL_ROUTERS: Routers = {
  TALK_GROUPS: {
    name: 'TalkGroups',
    layout: ''
  },
  TALKING_ROOM: {
    name: 'TalkingRoom',
    layout: ''
  }
}

export const getLayoutName = (pathName: string): string => {
  let layoutName = ''
  
  for (const key in ALL_ROUTERS) {
    if (ALL_ROUTERS[key].name === pathName) {
      layoutName = ALL_ROUTERS[key].layout
      break
    }
  }
  return layoutName  
}

