import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { computed, nextTick, ref, unref, watchEffect } from 'vue'

import { useEventListener } from '@vueuse/core'
import { useEditor } from './useEditor'
import type { tagType } from '@/types/memo'
import { getCursorPos } from '@/utils/editor'
import type SuggestionList from '@/components/ui/editor/suggestion-list.vue'

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
  const searchText = ref('')
  const isSuggestionShow = ref(false)
  const filteredList = computed(() => {
    const partialValue = unref(searchText)
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
  const listItemActiveIdx = ref(0)

  const editorHook = useEditor(editorRef)
  const cursorRef = ref({
    x: 0,
    y: 0,
    height: 0,
    containerWidth: 0,
  })
  let curkeyIdx = null

  // 隐藏/显示联想框
  const closeMenu = () => {
    isSuggestionShow.value = false
    return false
  }
  const openMenu = (keyIdx) => {
    // updateCaretPosition()
    cursorRef.value = getCursorPos(editorRef)
    isSuggestionShow.value = true
    curkeyIdx = keyIdx
    return false
  }

  // 设置候选项active
  const activeItemRef: ComputedRef<any> = computed(() => {
    const curIdx = suggestionRef.value.getSelectItemIdx()
    return filteredList.value[curIdx]
  })

  const setItemActive = (isNext = 1) => {
    const total = unref(filteredList).length
    const curIdx = suggestionRef.value.getSelectItemIdx()
    listItemActiveIdx.value = (curIdx + isNext + total) % total
  }

  const onKeyDownEvent = (e: KeyboardEvent) => {
    const key = e.key

    if (['ArrowUp', 'Enter', 'ArrowDown'].includes(key)) {
      // 仅当联想菜单展示时
      if (!isSuggestionShow.value)
        return

      e.stopPropagation()
      e.preventDefault()
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
      else if (activeItemRef.value !== null && (key === 'Enter' || key === 'Tab')) {
        applyMetion(listItemActiveIdx.value)
        return false
      }
    }
  }

  function getValue() {
    const { value: inputValue } = unref(editorRef)
    return inputValue
  }
  function getLastKeyBeforeCursor(cursorIndex: number) {
    return getValue().lastIndexOf('#', cursorIndex - 1)
  }
  function getLastSearchText(cursorIndex: number, keyIndex: number) {
    if (keyIndex !== -1) {
      const text = getValue().substring(keyIndex + 1, cursorIndex)
      // If there is a space we close the menu
      if (!/\s/.test(text))
        return text
    }
    return null
  }
  function checkKey() {
    if (!unref(editorRef))
      return false
    const { selectionEnd: cursorIndex } = unref(editorRef)
    const keyIdx = getLastKeyBeforeCursor(cursorIndex)

    const text = getLastSearchText(cursorIndex, keyIdx)
    if (text !== null) {
      openMenu(keyIdx)
      searchText.value = text
      return true
    }

    closeMenu()
    return false
  }
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
  function updateCaretPosition() {
    setTimeout(() => {
      cursorRef.value = getCursorPos(editorRef)
      checkKey()
      nextTick(syncPosisiton)
    }, 0)
  }

  useEventListener(editorRef, 'keydown', onKeyDownEvent)
  useEventListener(editorRef, 'input', updateCaretPosition)
  useEventListener(editorRef, 'blur', () => {
    closeMenu()
  })
  const handleItemClick = (itemIdx: number) => {
    applyMetion(itemIdx)
  }

  function replaceValue(curkeyIdx: number, itemValue: string) {
    return `${getValue().slice(0, curkeyIdx)}${itemValue}${getValue().slice(curkeyIdx + searchText.value.length + 1, getValue().length)}`
  }
  function applyMetion(itemIdx: number) {
    const activeItem = filteredList.value[itemIdx]
    // 将联想框中的内容添加到textarea中
    editorHook.setValue(
      replaceValue(curkeyIdx, `#${activeItem.content} `),
    )
    searchText.value = ''
    closeMenu()
  }

  watchEffect(() => {
    const activeIdx = listItemActiveIdx.value
    suggestionRef.value?.setSelectItemIdx(activeIdx)
  })

  return {
    isSuggestionShow,
    handleItemClick,
    suggestionList: filteredList,
    editor: editorHook,
    clear() {
      searchText.value = ''
    },
  }
}
