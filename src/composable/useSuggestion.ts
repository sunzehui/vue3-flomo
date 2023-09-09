import type { MaybeRef, Ref } from 'vue'
import { computed, nextTick, ref, unref, watchEffect } from 'vue'

import { unrefElement, useElementBounding, useElementSize, useEventListener } from '@vueuse/core'
import { autoUpdate, useFloating } from '@floating-ui/vue'
import { useEditor } from './useEditor'
import type { tagType } from '@/types/memo'
import { getCursorPos } from '@/utils/editor'
import type SuggestionList from '@/components/ui/editor/suggestion-list.vue'
import { px2number } from '@/utils/Tool'

interface SuggestionParams {
  suggestionRef: Ref<InstanceType<typeof SuggestionList>>
  editorRef: Ref<HTMLTextAreaElement>
  suggestionList?: MaybeRef<tagType[]>
}
export function useSuggestion({
  suggestionRef = ref(null),
  editorRef = ref(null),
  suggestionList = ref([]),
}: SuggestionParams) {
  const partialPatternRef = ref('')
  const isSuggestionShow = ref(false)
  const filteredList = computed(() => {
    const partialValue = unref(partialPatternRef).replace('#', '')
    const list = unref(suggestionList)

    const matched = partialValue
      ? list.filter((tag) => {
        if (!partialValue)
          return true
        return tag.content.startsWith(partialValue)
      })
      : list

    return matched
  })

  const editorHook = useEditor(editorRef)
  const cursorRef = ref({
    x: 0,
    y: 0,
    height: 0,
    containerWidth: 0,
  })
  // 隐藏/显示联想框
  const setSuggestionShow = async (show = true) => {
    isSuggestionShow.value = show
    return false
  }

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
    const key = event.key

    if (['ArrowUp', 'Enter', 'ArrowDown'].includes(key)) {
      // 仅当联想菜单展示时
      if (!isSuggestionShow.value)
        return

      event.stopPropagation()
      event.preventDefault()
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
      else if (activeTagIdx !== null && (key === 'Enter')) {
        const activeItem = unref(filteredList)[activeTagIdx]
        if (activeItem) {
          const { value: partial } = partialPatternRef
          const leftContent = `${activeItem.content.slice(partial.length - 1)} `
          editorHook.insertContent(leftContent)
          // partialPatternRef.value = ''
          nextTick(() => {
            // suggestionControl()
            setSuggestionShow(false)
          })
        }
        else {
          setSuggestionShow(false)
        }
        return false
      }
    }
    else {
      suggestionControl()
    }
  }

  function visibleControl() {
    if (!unref(editorRef))
      return false
    const { selectionEnd } = unref(editorRef)
    const isFocus = selectionEnd !== null

    const isActive = unref(editorRef) === document.activeElement
    if (!isFocus || !isActive)
      return setSuggestionShow(false)
    const { value: inputValue } = unref(editorRef)
    for (let i = selectionEnd - 1; i >= 0; --i) {
      const char = inputValue[i]
      if (char === '#') {
        setSuggestionShow(true)
        partialPatternRef.value = `#${inputValue.slice(i + 1, selectionEnd)}`
        return false
      }
    }

    setSuggestionShow(false)
  }
  watchEffect(() => {
    if (!unref(filteredList).length)
      setSuggestionShow(false)
  })
  function syncPosisiton() {
    if (editorRef.value == null || suggestionRef.value == null)
      return
    const cursor = unref(cursorRef)

    let left = `${cursor.x}px`
    const top = `${cursor.y + cursor.height}px`
    const listWidth = suggestionRef.value.getWidth()

    if (cursor.containerWidth - cursor.x < listWidth)
      left = `${cursor.x - listWidth}px`

    suggestionRef.value.syncPostion({
      left, top,
    })
  }
  function suggestionControl() {
    setTimeout(() => {
      cursorRef.value = getCursorPos(editorRef)
      visibleControl()
      nextTick(syncPosisiton)
    }, 0)
  }

  useEventListener(editorRef, 'keydown', onKeyDownEvent)
  useEventListener(editorRef, 'focus', suggestionControl)
  useEventListener(editorRef, 'blur', () => {
    setSuggestionShow(false)
  })
  useEventListener(editorRef, 'mousedown', suggestionControl)
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
    isSuggestionShow,
    handleItemClick,
    suggestionList: filteredList,
    editor: editorHook,
  }
}
