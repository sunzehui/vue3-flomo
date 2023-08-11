<script lang="ts" setup>
import { Check, Edit, Loading, Refresh, Search } from '@element-plus/icons-vue'
import { useToggle } from '@vueuse/core'
import { ElMessage, ElTooltip } from 'element-plus'
import { computed, ref, toRefs, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'
import { useLayoutStore } from '@/store/layout'

const route = useRoute()

const tagName = computed(() => route.query.tag as string || '')
const bindTagName = ref('')
watchEffect(() => {
  bindTagName.value = route.query.tag as string
})

const { setLeftMenuOpen } = useLayoutStore()
const { isPC } = toRefs(useLayoutStore())
const router = useRouter()
const refreshing = ref(false)
const { loadRemoteData } = useArticleStore()
const handleRefresh = (query?) => {
  refreshing.value = true
  router.push({
    name: 'memo',
    query,
  })

  loadRemoteData(query).finally(() => {
    refreshing.value = false
  })
}
const [isTagEdit, toggeEdit] = useToggle(false)
const rename = () => {
  const articleStore = useArticleStore()
  articleStore.tagRename(tagName.value, bindTagName.value).then((res) => {
    isTagEdit.value = false
    ElMessage.success('修改成功')
    handleRefresh({
      tag: bindTagName.value,
    })
  })
}
</script>

<template>
  <div class="title-wrp">
    <span v-show="!isPC" class="showLeftPanelBtn" @click.stop="setLeftMenuOpen(true)">三</span>
    <span class="title hover-bg" @click.prevent="handleRefresh()"> MEMO </span>
    <div v-if="tagName" class="flex items-center">
      <span class="line">/</span>
      <input
        v-show="isTagEdit"
        v-model="bindTagName"
        type="text"
        class="tagEdit"
      >
      <b v-show="!isTagEdit" class="lastTag">
        <span><label>{{ tagName }}</label></span>
      </b>
      <Edit
        v-show="!isTagEdit"
        class="icon"
        @click.prevent="isTagEdit = true"
      />
      <Check v-show="isTagEdit" class="icon" @click.prevent="rename" />
    </div>
    <ElTooltip
      v-if="!refreshing"
      effect="dark"
      content="刷新"
      placement="bottom"
    >
      <Refresh class="icon hover-bg" @click.prevent="handleRefresh()" />
    </ElTooltip>
    <Loading v-show="refreshing" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-style: normal;
  height: 18px;
  width: 18px;
  display: inline-block;
  opacity: 0.8;
  cursor: pointer;
  @apply p-2 box-content;
  &:hover {
    opacity: 1;
  }
}
span > label {
  font-weight: bold;
  color: #5f5f5f;
}
.line {
  opacity: 0.5;
  @apply mx-1;
}
.title-wrp{
  flex-shrink: 0;
  @apply flex items-center;
}
.hover-bg {
  @apply rounded-md duration-300 transition-colors;
  &:hover {
    background: rgba(55, 53, 47, 0.08);
  }
}
.title-wrp{
 > span.title {

  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #5f5f5f;
  cursor: pointer;
  flex-shrink: 0;
  @apply relative;
  @apply px-2;

}

}

.tagEdit {
  display: inline-block;
  width: 120px;
  height: 30px;
  border-radius: 4px;
  margin-right: 5px;
}
.lastTag {
  @apply mx-1 text-gray-500 text-base;
}
.showLeftPanelBtn{
  @apply text-gray-500 text-base mr-2;
  cursor: pointer;
}
</style>
