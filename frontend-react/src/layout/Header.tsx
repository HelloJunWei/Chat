import React from 'react'
export type HeaderProps = {
  children: React.ReactNode
}
export default function (props: HeaderProps) {
  return (
    <div className="text-contentText px-4 py-3.5 pr-14">
      <div className="flex space-x-2 items-center">
        { props.children }
      </div>
    </div>
  )
}
