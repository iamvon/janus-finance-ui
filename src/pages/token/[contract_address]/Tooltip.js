import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/animations/scale.css'

const Tooltip = ({
  children,
  content,
  className,
  placement = 'top',
  delay = 0,
}) => {
  return (
    <Tippy
      animation="scale"
      placement={placement}
      appendTo={() => document.body}
      maxWidth="20rem"
      interactive
      delay={delay}
      content={
        <div
          className={`bg-white rounded p-2.5 text-xs bg-th-bkg-3 leading-4 shadow-md text-th-fgd-3 outline-none focus:outline-none border border-th-bkg-4 ${className}`}
        >
          {content}
        </div>
      }
    >
      <div className="outline-none focus:outline-none">{children}</div>
    </Tippy>
  )
}

const Content = ({ className = '', children }) => {
  return (
    <div
      className={`inline-block cursor-help border-b border-th-fgd-3 border-dashed border-opacity-20 default-transition hover:border-th-bkg-2 ${className}`}
    >
      {children}
    </div>
  )
}

Tooltip.Content = Content

export default Tooltip
