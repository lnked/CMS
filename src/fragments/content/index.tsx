import * as React from 'react'
import * as css from './styles.scss'

import { classes } from 'helpers'

export interface P {
  className?: string;
  children?: JSX.Element[] | JSX.Element | string;
}

const cx = classes.bind(css)

export function Content ({ children, className = '' }: P) {
  return (
    <div className={cx(css.content, className)}>
      {children}
    </div>
  )
}

export default Content
