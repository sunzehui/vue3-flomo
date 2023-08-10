import type { MaybeRef, Ref } from 'vue'
import { computed, ref, unref, watchEffect } from 'vue'

import { onClickOutside, useEventListener } from '@vueuse/core'
import { isEmpty } from 'lodash-es'
import { useEditor } from './useEditor'
import type { tagType } from '@/types/article'
import { px2number } from '@/utils/Tool'
import { whenWatch } from '@/utils/when'

type pxNum = number | string

interface SuggestionParams {
  suggestionRef: Ref<HTMLDivElement>
  editorRef: Ref<HTMLTextAreaElement>
  suggestionList?: MaybeRef<tagType[]>
  editorCfg: any
}
export function useSuggestion({
  suggestionRef = ref(null),
  editorRef = ref(null),
  editorCfg = {},
  suggestionList = ref([]),
}: SuggestionParams) {
  const partialPatternRef = ref('')
  const filteredList = computed(() => {
    const partialValue = unref(partialPatternRef).replace('#', '')
    const list = unref(suggestionList)
    return partialValue ? list.filter(tag => tag.content.includes(partialValue)) : list
  })

  const editorHook = useEditor(editorRef, editorCfg)

  // 隐藏/显示联想框
  const setSuggestionShow = () => {
    const { x, y, containerWidth, containerHeight } = editorHook.computeSelectPos()
    const offsetX = 15
    const offsetY = 22
    // 防止挡字，加点偏移
    let offsetLeft: pxNum = `${x + offsetX}px`
    let offsetTop: pxNum = `${y + offsetY}px`
    // 右边如果放不下联想框则放到左边

    if (containerWidth - px2number(offsetLeft) < 150)
      offsetLeft = `calc( ${offsetLeft} + -50% )`

    if (px2number(offsetTop) > containerHeight)
      offsetTop = `${containerHeight + offsetY}px`

    suggestionRef.value.style.top = `${offsetTop}`
    suggestionRef.value.style.left = `${offsetLeft}`
    return false
  }

  // 只有当tag有且设置show为true时才显示

  const shouldSuggestionShow = computed(() => !isEmpty(unref(filteredList)) && unref(partialPatternRef).length)
  whenWatch(shouldSuggestionShow, setSuggestionShow)
  watchEffect(() => {
    console.log('partialPatternRef', partialPatternRef.value)

    console.log('canshow', shouldSuggestionShow.value)
  })
  // 设置候选项active
  let activeTagIdx: number | null = null

  const setItemActive = (isNext = 1) => {
    const list = unref(filteredList)
    const currentIndex = list.findIndex(item => item.active)
    const target = (currentIndex + isNext + list.length) % list.length
    list.forEach(item => item.active = false)
    list[target].active = true
    activeTagIdx = target
  }

  const onKeyDownEvent = (event: KeyboardEvent) => {
    // 仅当联想菜单展示时
    if (!shouldSuggestionShow.value)
      return

    const key = event.key
    if (['ArrowUp', 'Enter', ' ', 'ArrowDown'].includes(key)) {
      event.stopPropagation()
      event.preventDefault()
    }

    // 当输入“上，下“方向键时切换active标签
    if (key === 'ArrowUp') {
      setItemActive(-1)
      return false
    }
    else if (key === 'ArrowDown') {
      setItemActive(+1)
      return false
    }
    // 敲回车选中
    if (activeTagIdx !== null && (key === 'Enter' || key === ' ')) {
      const activeItem = unref(filteredList)[activeTagIdx]
      const { value: partial } = partialPatternRef
      console.log('🚀 敲回车', partial)
      const leftContent = `${activeItem.content.slice(partial.length - 1)} `
      editorHook.insertContent(leftContent)
      partialPatternRef.value = ''
      // shouldSuggestionShow.value = false
    }
    syncPartialPattern()
  }

  // 计算#后面的内容
  function syncPartialPattern() {
    setTimeout(() => {
      const { value: inputValue } = unref(editorRef)
      const { selectionEnd } = unref(editorRef)
      for (let i = selectionEnd - 1; i >= 0; --i) {
        const char = inputValue[i]
        if (char === '#') {
          partialPatternRef.value = `#${inputValue.slice(i + 1, selectionEnd)}`
          return
        }
      }
    }, 0)
  }

  useEventListener(editorRef, 'keydown', onKeyDownEvent)
  useEventListener(editorRef, 'focus', () => syncPartialPattern())
  useEventListener(editorRef, 'input', syncPartialPattern)

  // onClickOutside(editorRef, () => partialPatternRef.value = '')

  const handleItemClick = ($event: Event) => {
    const target = ($event.target as HTMLSpanElement)
    if (target instanceof HTMLSpanElement) {
      const targetValue = target.innerText
      // 将联想框中的内容添加到textarea中
      const { value: partial } = partialPatternRef
      const leftContent = `${targetValue.slice(partial.length - 1)} `
      editorHook.insertContent(leftContent)
      partialPatternRef.value = ''
    }
  }

  return {
    shouldSuggestionShow,
    handleItemClick,
    suggestionList: filteredList,
    editor: editorHook,
  }
}
