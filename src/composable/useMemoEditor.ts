import { ElMessage } from 'element-plus'
import { nextTick, ref, toRaw, toRefs, unref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { Memo } from '@/types/memo'
import { extractTags, trimTag } from '@/utils/editor'
import { EditorType } from '@/types/card-type'
import { useMemoStore } from '@/store/memo'

export const useMemoEditor = () => {
  let editorRef = null
  let toolbarRef = null
  const loading = ref(false)
  const articleStore = useMemoStore()
  const { tagList } = toRefs(useMemoStore())
  const imageList = ref([])
  const memo = ref({
    content: '',
  })

  let editorType = EditorType.create

  const registerComponentRef = (_editorRef, _toolbarRef) => {
    editorRef = _editorRef
    toolbarRef = _toolbarRef
  }
  const setEditorConfig = (_editorConfig) => {
    if (_editorConfig.memo)
      memo.value = toRaw(_editorConfig.memo)
    editorType = _editorConfig.type
  }

  const handleEditorChange = (content: string) => {
    memo.value.content = content
  }
  const handleFileChange = (fileList: string[]) => {
    imageList.value = fileList
  }

  const handleAddTag = () => {
    editorRef.value.insertContent('#')
  }
  const handleAddEmoji = (emoji) => {
    editorRef.value.insertContent(emoji.i)
  }
  const buildArticle = () => {
    const tags = extractTags(memo.value.content)
    const article: Partial<Memo> = {
      tags,
      content: trimTag(unref(memo).content),
      images: unref(imageList),
    }
    return article
  }

  const updateArticle = () => {
    const article = buildArticle()
    const _memo = unref(memo) as Memo

    if (!_memo.id) {
      ElMessage.error('数据异常，请刷新')
      throw new Error('can \'t find article id!')
    }
    loading.value = true
    return articleStore.update(_memo.id, article).finally(() => {
      loading.value = false
    })
  }
  const saveArticle = () => {
    const article = buildArticle()
    loading.value = true
    return articleStore.save(article).then(() => {
      editorRef.value?.clear()
      toolbarRef.value?.clearImages()
    }).finally(() => {
      loading.value = false
    })
  }
  const handleEditorSave = async () => {
    memo.value.content = editorRef.value.getContent()
    const editorType = editorRef.value.getType()
    if (editorType === EditorType.create)
      await saveArticle()
    else if (editorType === EditorType.edit)
      await updateArticle()
    editorRef.value?.blur()
    editorRef.value?.clear()
  }

  // 页面选中某一标签时，自动插入标签
  const route = useRoute()
  watchEffect(() => {
    const tag = route.query.tag
    if (!editorRef?.value)
      return

    const editorInstance = editorRef.value
    if (tag) {
      nextTick(() => {
        editorInstance?.clear()
        editorInstance?.insertContent(`#${tag} `)
      })
    }
    else {
      nextTick(() => {
        editorInstance?.clear()
      })
    }
  })

  return {
    handler: {
      handleEditorChange,
      handleEditorSave,
      handleAddEmoji,
      handleAddTag,
      handleFileChange,
    },
    editorRef,
    tagList,
    imageList,
    loading,
    registerComponentRef,
    setEditorConfig,
    memo,
    editorType,
  }
}
