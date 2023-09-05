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
export const trimTag = (content: string) => {
  // 消掉开头#
  return `<p>${escapeHtml(content).replaceAll(/#[^\s(?<!#)]+/g, '')}</p>`
}
export const unTrim = (content: string) => {
  return `${unescapeHtml(content)}`.replace('<p>', '').replace('</p>', '')
}

export function escapeHtml(text) {
  return text.replace(/[&<"'>]/g, (match) => {
    switch (match) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case '\'':
        return '&apos;'
    }
  })
}
export function unescapeHtml(text) {
  return text.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
}

export function getMemoWordCount(memoContent) {
  if (!memoContent)
    return 0
  // 过滤掉 html 标签
  const memoContentWithoutHtml = memoContent.replace(/<[^>]*>/g, '')

  return memoContentWithoutHtml.length
}
export function mergeRanges(ranges) {
  const mergedRanges = []
  let currentRange = null
  ranges.sort((a, b) => a[0] - b[0]) // Sort ranges by start index
  for (const range of ranges) {
    if (!currentRange) {
      currentRange = [...range]
    }
    else if (range[0] <= currentRange[1]) {
      // Overlapping ranges
      currentRange[1] = Math.max(range[1], currentRange[1])
      // update the text in case the range is expanded
      const text
          = currentRange[2].slice(0, range[0] - currentRange[0])
          + range[2]
          + currentRange[2].slice(range[1] - currentRange[0])
      currentRange[2] = text
    }
    else {
      // Non-overlapping range
      mergedRanges.push(currentRange)
      currentRange = [...range]
    }
  }
  if (currentRange)
    mergedRanges.push(currentRange)

  return mergedRanges
}
export function renderMemoContent(pre_content, highlight_words = null) {
  if (!pre_content)
    return pre_content

  let rendered_content = pre_content.replace(/>([^<]+)</g, (matched) => {
    // 排除 flomoapp.com/mine/?memo_id=xxx，flomoapp.com 链接可点
    matched = matched.replace(/(https?:\/\/([^\s<\/\#)）]+)[^\s<)）]*)/g, (matchedLink, p1, p2) => {
      return `<a href="${p1}" target="_blank" class="blank_memo_link">${p2}</a>`
    })

    return matched
  })

  // rendered_content = rendered_content.replace(/>([^>^<]*)/g, (matched) => {
  //   // 只匹配 html content
  //   matched = matched.replace(/#([^\s<#]+)/g, '<span class="tag">#$1</span>') // 标签可点
  //   return matched
  // })
  const explorer = window.navigator.userAgent.toLowerCase()
  if (!explorer.includes('chrome') && explorer.includes('safari'))
    rendered_content = rendered_content.replace('<p></p>', '<p>&zwnj;</p>')

  if (!highlight_words)
    return (rendered_content)

  const matchRule = />([^>^<]*)/g
  rendered_content = rendered_content.replace(
    matchRule,
    (matched) => {
      return matched.replace(new RegExp(highlight_words, 'ig'), (p) => {
        return `<mark>${p}</mark>`
      })
    },
  )

  return (rendered_content)
}
