import type { MaybeRef } from '@vueuse/core'
import { unref } from 'vue'
import { px2number } from '@/utils/Tool'

export const computeSelectPos = (inputRef: MaybeRef<HTMLTextAreaElement>) => {
  const input = unref(inputRef)
  // 初始位置
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
    selectionEnd: selectionPoint,
  } = input

  // 生成看不见的div+sapn
  const _div = document.createElement('div')
  const copyStyle = window.getComputedStyle(input)

  let containerWidth = '0px'
  let containerHeight = '0px'
  for (const item of Array.from(copyStyle)) {
    const itemProperty = copyStyle.getPropertyValue(item)
    if (item === 'width')
      containerWidth = itemProperty
    if (item === 'height')
      containerHeight = itemProperty
    _div.style.setProperty(item, itemProperty)
  }

  _div.style.position = 'fixed'
  _div.style.visibility = 'hidden'
  _div.style.whiteSpace = 'pre-wrap'

  _div.innerHTML = input.value.slice(0, selectionPoint)
  const _span = document.createElement('span')
  _span.innerHTML = input.value.slice(selectionPoint)
  _div.appendChild(_span)
  document.body.appendChild(_div)

  // 获取span位置
  const spanX = _span.offsetLeft
  const spanY = _span.offsetTop
  document.body.removeChild(_div)
  // 最终位置=初始位置+span位置
  return {
    x: inputX + spanX,
    y: inputY + spanY,
    containerWidth: px2number(containerWidth),
    containerHeight: px2number(containerHeight),
  }
}
/**
 *
 *  提取文章出现的现有标签
 *  大概是 # 开头 结束条件：空格 换行 或 下一个#之前
 *  做成标签列表,展示 日后过滤
 */
export const extractTags = (content: string) => {
  // 提取出并消掉开头#
  return Array.from(content.match(/#[^\s(?<!#)]+/g) || []).map(tag =>
    tag.slice(1),
  )
}
