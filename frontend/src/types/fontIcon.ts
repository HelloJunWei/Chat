const tuple = <T extends string[]>(...args: T) => args

const IconTypes = tuple('chevron_left', 'send')
export type IconType = typeof IconTypes[number]
const FontType = tuple('default', 'outlined')
export type fontType = typeof FontType[number]
