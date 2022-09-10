import React from 'react'
export type AppLayoutProps = {
  header?: React.ReactNode,
  children: React.ReactNode,
  footer?: React.ReactNode

}
export default function (props: AppLayoutProps) {
  return (
    <div className="flex flex-col flex-grow">
      {
        props.header ? props.header :  <div></div>
      }
        { props.children }
      {
        props.footer ? props.footer :  <div></div>
      }
    </div>
  )
}
