import React from 'react'
export type UserDatProps = {
  userId: string,
}

export default function (props: UserDatProps) {
  return function <P extends { url?: string, userId?: string, displayName?: string }>(WrapComponent: React.ComponentType<P>) {
    return (props2: Omit<P, 'url' | 'userId' | 'displayName'>) => {
      const url = React.useMemo(() => {
        return 'https://gravatar.com/avatar/7837d615a61fb0c4e4d62d308b4336f5?s=400&d=robohash&r=x'
      }, [props.userId])

      const displayName = React.useMemo(() => {
        return 'Neil'
      }, [props.userId])

      return (
        <React.Fragment>
          <WrapComponent 
            {...props2 as P}
            url={url}
            userId={props.userId}
            displayName={displayName}
          />
        </React.Fragment>
      )
    }
  }
}

