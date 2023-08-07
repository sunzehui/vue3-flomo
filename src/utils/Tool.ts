// 字符全角转半角
import { isNil } from 'lodash-es'

function ToCDB(str: string): string {
  let tmp = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) == 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    else if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
    }
    else {
      tmp += String.fromCharCode(str.charCodeAt(i))
    }
  }
  return tmp
}

// 判断字符是否全角
export function isC(char: string): boolean {
  return /[\uFF00-\uFFFF]/g.test(char) // 全角
}

export function px2number(numberLike: string): number {
  return Number(numberLike.replace(/px$/, ''))
}

export function safe2Num(num: unknown) {
  if (isNil(num))
    return null
  if (typeof num === 'number') {
    if (isNaN(num))
      return null
  }

  return num
}
