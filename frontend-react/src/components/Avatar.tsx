import classNames from 'classnames'
import React from 'react'
import { FAKE_AVATAR } from '../utils/utils'
export type AvatarProps = {
  url: string
}

export default function (props: AvatarProps) {
  const [loading, setLoading] = React.useState(true)
  const [newUrl, setNewUrl] = React.useState(FAKE_AVATAR)
  React.useEffect(() => {
    if (props.url === '') return
    console.log(props.url)
    const img = new Image()
    img.src = props.url
    img.onerror = function () {
      setNewUrl('https://www.mymyuc.net/images/noavatar_middle.gif')
    }
    img.onload = function () {
      setNewUrl(props.url)
      setLoading(false)
    }
  }, [ props.url ])

  const newBackGround = React.useMemo(() => {
    return { 'backgroundImage': loading ? '' : `url('${newUrl}')` }
  }, [ loading ])
  const avatarClass = classNames({
    'w-9 h-9 inline-block rounded-full bg-center bg-contain bg-secondary cursor-pointer': true,
    'skeleton_loading': loading
    }
  )


  return (
    <div
      className={avatarClass}
      style={newBackGround}
    >
    </div>
  )
} 
