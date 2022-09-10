import ChatClass from './chatClass'

let init = false
let chat: ChatClass | null = null
if (!init) {
  chat = new ChatClass({
    css: ''
  })
  init = true
}
const open = () => {
  chat?.updateUserToken('FAKE_NEIL_TOKEN')
  chat?.triggerOpen(true)
}

function App() {

  return (
    <div className="m-5">
      hello world <br />
      <button className="bg-blue-600 text-white" onClick={() => open()}>
        open
      </button>
    </div>
  )
}

export default App
