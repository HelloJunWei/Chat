import React from 'react'
export type UserDatProps = {
  userId: string,
  children: React.ReactNode
}

export default function(props: UserDatProps) {
  const url = React.useMemo(() => {
    return 'https://gravatar.com/avatar/7837d615a61fb0c4e4d62d308b4336f5?s=400&d=robohash&r=x'
  }, [props.userId])

  const wrap = React.Children.map(props.children, (Child) => {
    if (React.isValidElement(Child)) {
        return React.cloneElement(Child, { url: url })
      }
    return Child
    })
  return (
    <React.Fragment>
      { wrap }
    </React.Fragment>
  )
}
