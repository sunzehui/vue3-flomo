import type { Ref } from 'vue'
import { nextTick, ref, watch, watchEffect } from 'vue'
import { useEventListener } from '@vueuse/core'
import { computeSelectPos } from '@/utils/editor'
import { useMemoStore } from '@/store/memo'
import { EditorType } from '@/types/card-type'

interface OptionProp {
  type: EditorType
}

export function useEditor(textareaRef: Ref<HTMLTextAreaElement>, opt: OptionProp = {
  type: EditorType.create,
}) {
  const textareaContent = ref('')
  const cbs = {
    onSave: () => {},
  }

  // 设置候选项active
  watch(textareaContent, () => {
    if (!textareaContent.value)
      return textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  })

  useEventListener(textareaRef, 'input', (e: InputEvent) => {
    textareaContent.value = (e.target as HTMLInputElement).value
  })
  /**
     * 插入内容
     */
  const insertContent = (content: string) => {
    const { selectionEnd } = textareaRef.value
    const currentContent = textareaContent.value
    const placement
            = currentContent.slice(0, selectionEnd)
            + content
            + currentContent.slice(selectionEnd)
    textareaContent.value = placement
    // 插入完成后，设置光标位置
    textareaRef.value.blur()
    nextTick(() => {
      textareaRef.value.selectionEnd = selectionEnd + content.length
      textareaRef.value.focus()
    })
  }
  useEventListener(textareaRef, 'keydown', (event: KeyboardEvent) => {
    if (event.key == 'Enter' && event.ctrlKey) {
      cbs.onSave()
      textareaContent.value = ''
    }
  })
  return {
    textareaContent,
    insertContent,
    computeSelectPos: () => computeSelectPos(textareaRef),
    onSave: (cb: () => void) => {
      cbs.onSave = cb
    },
  }
}
