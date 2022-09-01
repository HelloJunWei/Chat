import { h } from 'vue'
import type { IconType, fontType } from '@/types/fontIcon'
import classNames from 'classnames'

const fontTypeGroup = {
  default: 'material-icons',
  outlined: 'material-icons-outlined'
}

const FontIcon = (props: { name: IconType, type?: fontType }) => {
  const fontClass2 = classNames([
    fontTypeGroup[props.type || 'default'],
    'font-icon-ani'
  ])

  return h(
    <span class={fontClass2}>{ props.name }</span>
  )
}
export default FontIcon
