import { formatWithOptions, formatDistanceStrictWithOptions, startOfDay, startOfYear } from 'date-fns/esm/fp'
import { zhTW } from 'date-fns/locale'


/**
 * CJKUnifiedIdeographs
 * 
 * 中日韓統一表意文字列表 (CJK Unified Ideographs)
 * 包含正體中文、簡體中文與日文、韓文、越南文裡的漢字。
 */
const CJKUnifiedIdeographs = /[\u4E00-\u9FFF]/

export const FAKE_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8ePX2fwAIggOCR8M6ygAAAABJRU5ErkJggg=='

export const TimeFormatType = {
  HMMAAA: 'aaa h:mm',
  MMDDE: 'MM/dd EEEEE',
  MMDD: 'MM/dd',
  YYYMMDD: 'yyyy-MM-dd',
  YYYYMMDD: 'yyyy/MM/dd',
  EEEEE: 'EEEEE',
  HM: 'HH:mm',
  YYYMMDDHM: 'yyyy-MM-dd HH:mm'
}

export const timeFormat = (scheme: string = TimeFormatType.HMMAAA, time: number | string) => {
  return formatWithOptions({ locale: zhTW })(scheme)(new Date(time))
}

export const timeFormatDistance = (time: number | string) => {
  const nowDate = new Date()
  return formatDistanceStrictWithOptions({ locale: zhTW })(nowDate)(new Date(time))
}

const isNumber = (val: unknown): val is number => typeof val === 'number'

let hiddenTextarea: HTMLTextAreaElement | undefined = undefined

const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`

const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
]

type NodeStyle = {
  contextStyle: string
  boxSizing: string
  paddingSize: number
  borderSize: number
}

export type TextAreaHeight = {
  height:string
  minHeight?: string
}

function calculateNodeStyling(targetElement: Element): NodeStyle {
  const style = window.getComputedStyle(targetElement)

  const boxSizing = style.getPropertyValue('box-sizing')

  const paddingSize =
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))

  const borderSize =
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))

  const contextStyle = CONTEXT_STYLE.map(
    (name) => `${name}:${style.getPropertyValue(name)}`
  ).join(';')

  return { contextStyle, paddingSize, borderSize, boxSizing }
}

export function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows = 1,
  maxRows?: number
): TextAreaHeight {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    document.body.appendChild(hiddenTextarea)
  }

  const { paddingSize, borderSize, boxSizing, contextStyle } =
    calculateNodeStyling(targetElement)

  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`)
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || ''

  let height = hiddenTextarea.scrollHeight
  const result = {} as TextAreaHeight

  if (boxSizing === 'border-box') {
    height = height + borderSize
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize
  }

  hiddenTextarea.value = ''
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize

  if (isNumber(minRows)) {
    let minHeight = singleRowHeight * minRows
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize
    }
    height = Math.max(minHeight, height)
    result.minHeight = `${minHeight}px`
  }
  if (isNumber(maxRows)) {
    let maxHeight = singleRowHeight * maxRows
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize
    }
    height = Math.min(maxHeight, height)
  }
  result.height = `${height}px`
  hiddenTextarea.parentNode?.removeChild(hiddenTextarea)
  hiddenTextarea = undefined

  return result
} 


export const isOverTextLength = (text: string, maxLength: number): boolean => {
  const allCount = text.length
  const replaceUniCode = text.replace(new RegExp(CJKUnifiedIdeographs, 'g'), '')
  const notUnicodeCount = replaceUniCode.length
  const totalCount = notUnicodeCount + (allCount - notUnicodeCount) * 2

  return totalCount > maxLength
}

export const getStartOfDay = (time: number | string) => {
  return startOfDay(new Date(time))
}

export const getStartOfYear = (time: number | string) => {
  return startOfYear(new Date(time))
}

export const uuid4 = (): string => {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)

  // Manipulate the 9th byte
  arr[8] &= 0b00111111 // Clear the first two bits
  arr[8] |= 0b10000000 // Set the first two bits to 10

  // Manipulate the 7th byte
  arr[6] &= 0b00001111 // Clear the first four bits
  arr[6] |= 0b01000000 // Set the first four bits to 0100

  const pattern = "$FAKE_XXXXXXXX-XXXX"
  let idx = 0

  return pattern.replace(
    /XX/g,
    () => arr[idx++].toString(16).padStart(2, "0"), // padStart ensures a leading zero, if needed
  )
}

type DEVICE = 'Windows' | 'ios' | 'Android'
export const detectDeviceOs = (userAgent: string, device: DEVICE) => {
  const deviceMap = new Map([
    ['Windows', new RegExp(/Windows/i)],
    ['ios', new RegExp(/iPhone|iPod|iPad/i)],
    ['Android', new RegExp(/Android/i)]
  ])

  return deviceMap.get(device)?.test(userAgent)
}

const IS_DESKTOP = detectDeviceOs(navigator.userAgent, 'Windows') || (!detectDeviceOs(navigator.userAgent, 'ios') &&  !detectDeviceOs(navigator.userAgent, 'Android'))

export const disableScroll = () => {
  if (IS_DESKTOP) {
    const x = window.scrollX
    const y = window.scrollY
    window.onscroll = () => {
      window.scrollTo(x, y)
    }
  } else {
    document.body.style.overflow = 'hidden'
  }
}


export const enableScroll = () => {
  if (IS_DESKTOP){
    window.onscroll = null
  } else {
    document.body.style.overflow = 'auto'
  }
}
