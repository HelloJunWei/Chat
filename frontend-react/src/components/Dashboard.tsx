import { Suspense } from 'react'
import TalkGroup from '../views/TalkGroup'
import DashboardCss from '../assets/Chat.module.scss'
import classNames from 'classnames'

function Dashboard () {
  const css = classNames(
  DashboardCss.dashboardEle,
  'md:rounded-[20px] overflow-hidden flex flex-col min-w-full max-w-none bg-primary shadow-xl md:min-w-[22rem] md:max-w-[22rem] text-white'
  )
  return (
    <div id="chat-app-dashboard" className={css}>
      <Suspense fallback={ <div> loading </div> }>
        <div className="flex justify-center">
          <TalkGroup />
        </div>
      </Suspense>
    </div>
  )

}
export default Dashboard
