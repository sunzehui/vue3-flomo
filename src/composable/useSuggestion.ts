import type { Ref } from 'vue'
import { computed, ref, toRefs, unref, watch } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { isEmpty } from 'lodash-es'
import { useEditor } from './useEditor'
import { useArticleStore } from '@/store/article'
import { px2number } from '@/utils/Tool'
import { whenWatch } from '@/utils/when'

type pxNum = number | string

export function useSuggestion(
  _suggestionRef: Ref<HTMLDivElement>,
  editorRef: Ref<HTMLTextAreaElement>,
  editorCfg: any,
) {
  const suggestionRef = _suggestionRef
  const { tagList: suggestionList } = toRefs(useArticleStore())
  const shouldSuggestionShow = ref(false)
  const partialPatternRef = ref('')
  console.log('🚀 ~ file: useSuggestion.ts:23 ~ suggestionList:', suggestionList)
  const filteredList = computed(() => {
    const { value: partialValue } = partialPatternRef
    const { value: list } = suggestionList
    return list.filter((tag) => {
      if (!partialValue)
        return true
      return tag.content.includes(partialValue)
    })
  })

  const editorHook = useEditor(editorRef, editorCfg)

  // 隐藏/显示联想框
  const setSuggestionShow = (toShow = true) => {
    if (!toShow)
      return

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
  watch(shouldSuggestionShow, setSuggestionShow)
  whenWatch(() => isEmpty(unref(filteredList)), () => shouldSuggestionShow.value = false)
  // 设置候选项active
  let activeTagIdx: number | null = null
  const setItemActive = (isNext = 1) => {
    const list = filteredList.value
    const reset = () => {
      list.forEach((item) => {
        item.active = false
      })
    }
    if (isNext === 1) {
      // 向上
      const currentIndex = list.findIndex(item => item.active)
      reset()
      const target = currentIndex + 1 < list.length ? currentIndex + 1 : 0
      list[target].active = true
      activeTagIdx = target
    }
    else {
      // 向下
      const currentIndex = list.findIndex(item => item.active)
      reset()
      const target = currentIndex - 1 > 0 ? currentIndex - 1 : 0
      list[target].active = true
      activeTagIdx = target
    }
  }
  const onKeyDownEvent = (event: KeyboardEvent) => {
    const key = event.key

    // 仅当联想菜单展示时
    if (shouldSuggestionShow.value) {
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
        setItemActive(1)
        return false
      }
      // 敲回车选中
      if (activeTagIdx !== null && (key === 'Enter' || key === ' ')) {
        const activeItem = unref(filteredList)[activeTagIdx]
        const { value: partial } = partialPatternRef
        const leftContent = `${activeItem.content.slice(partial.length)} `
        editorHook.insertContent(leftContent)
        shouldSuggestionShow.value = false
      }
      syncPartialPattern()
    }
  }

  // 计算#后面的内容
  function syncPartialPattern() {
    setTimeout(() => {
      const { value: inputValue } = unref(editorRef)
      const { selectionEnd } = unref(editorRef)
      for (let i = selectionEnd - 1; i >= 0; --i) {
        const char = inputValue[i]
        if (char === '#') {
          partialPatternRef.value = inputValue.slice(i + 1, selectionEnd)
          if (isEmpty(unref(filteredList)))
            return
          shouldSuggestionShow.value = true
          return
        }
      }
      shouldSuggestionShow.value = false
    }, 0)
  }

  useEventListener(editorRef, 'keydown', onKeyDownEvent)
  useEventListener(editorRef, 'focus', () => syncPartialPattern())
  useEventListener(editorRef, 'input', syncPartialPattern)

  onClickOutside(editorRef, () => shouldSuggestionShow.value = false)

  const handleItemClick = ($event: Event) => {
    const target = ($event.target as HTMLSpanElement)
    if (target instanceof HTMLSpanElement) {
      const targetValue = target.innerText
      // 将联想框中的内容添加到textarea中
      const { value: partial } = partialPatternRef
      const leftContent = `${targetValue.slice(partial.length)} `
      editorHook.insertContent(leftContent)
      shouldSuggestionShow.value = false
    }
  }

  const handleIconClick = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()

    editorHook.insertContent('#')
    if (filteredList.value.length === 0)
      return false

    shouldSuggestionShow.value = true
  }

  return {
    shouldSuggestionShow,
    handleItemClick,
    suggestionList: filteredList,
    handleIconClick,
    editor: editorHook,
  }
}
