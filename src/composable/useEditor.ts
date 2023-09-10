import type { Ref } from 'vue'
import { nextTick, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'

export function useEditor(textareaRef: Ref<HTMLTextAreaElement>) {
  const textareaContent = ref('')
  const cbs = {
    onSave: () => {},
  }

  const resize = () => {
    if (!textareaContent.value)
      return textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = 'auto'
    nextTick(() => {
      textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    })
  }

  // 设置候选项active
  watch(textareaContent, resize)

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
    if (event.key === 'Enter' && event.ctrlKey) {
      cbs.onSave()
      textareaContent.value = ''
    }
  })
  return {
    textareaContent,
    insertContent,
    onSave: (cb: () => void) => {
      cbs.onSave = cb
    },
    resize,
    blur: () => {
      textareaRef.value?.blur()
    },
  }
}
