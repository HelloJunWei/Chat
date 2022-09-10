import AppLayout from '../layout/AppLayout'
import Header from '../layout/Header'
import UserData from '../data/UserData'
import Avatar from '../components/Avatar'
const WrapAvatar = UserData({ userId: '213' })(Avatar)

function TalkGroup ()  {

  return (
    <AppLayout
      header={
        <Header>
        <WrapAvatar />
          <div>
            <p className="text-sm text-left font-medium">Neil</p>
          </div>
        </Header>
      }
    >
      <div className="flex bg-bgDark text-contentText flex-grow h-full w-full">
        asd
      </div>
    </AppLayout>
  )
}

export default TalkGroup
