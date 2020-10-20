import React from 'react'
import { a } from 'react-spring'

export const Card = props => {
  return (
    <a.div
      {...props}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1000,
        top: 0,
        flex: 1,
        fontSize: '0.8em',
        backgroundImage: 'linear-gradient(#6d3d58, #171720)',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 24,
        userSelect: 'none',
        color: '#ffffffc0',
        alignItems: 'center',
        ...props.style,
      }}>
      <div
        style={{
          position: 'absolute',
          width: 50,
          height: 4,
          backgroundColor: 'rgba(220,220,220,0.4)',
          top: 12,
          borderRadius: 4,
          margin: '0 auto',
          left: 0,
          right: 0,
        }}
      />
      {props.children}
    </a.div>
  )
}