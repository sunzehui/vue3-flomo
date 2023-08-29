import { ElMessage } from 'element-plus'
import { nextTick, ref, toRefs, unref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { Article as Memo } from '@/types/article'
import { extractTags } from '@/utils/editor'
import { EditorType } from '@/types/card-type'
import { useArticleStore } from '@/store/article'

let editorRef = null
let toolbarRef = null
const memo = ref({
  content: '',
})
export const useMemoEditor = () => {
  const loading = ref(false)
  const articleStore = useArticleStore()
  const { tagList } = toRefs(useArticleStore())
  const imageList = ref([])

  let editorType = EditorType.create

  const registerComponentRef = (_editorRef, _toolbarRef) => {
    editorRef = _editorRef
    toolbarRef = _toolbarRef
  }
  const setEditorConfig = (_editorConfig) => {
    if (_editorConfig.memo)
      memo.value = _editorConfig.memo

    editorType = _editorConfig.type
  }

  const handleEditorChange = (content: string) => {
    unref(memo).content = content
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
      content: memo.value.content,
      images: unref(imageList),
    }
    return article
  }

  const updateArticle = () => {
    const article = buildArticle()

    if (!memo.value.id) {
      ElMessage.error('数据异常，请刷新')
      throw new Error('can \'t find article id!')
    }
    loading.value = true
    articleStore.update(memo.value.id, article).finally(() => {
      loading.value = false
    })
  }
  const saveArticle = () => {
    const article = buildArticle()
    loading.value = true
    articleStore.save(article).then(() => {
      editorRef.value?.clear()
      toolbarRef.value?.clearImages()
    }).finally(() => {
      loading.value = false
    })
  }
  const handleEditorSave = () => {
    memo.value.content = editorRef.value.getContent()
    const editorType = editorRef.value.getType()
    if (editorType === EditorType.create)
      saveArticle()
    else if (editorType === EditorType.edit)
      updateArticle()
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
