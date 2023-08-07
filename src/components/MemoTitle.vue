<script lang="ts" setup>
import { Check, Edit, Refresh, Search } from '@element-plus/icons-vue'
import { useMediaQuery, useToggle } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'
import { useLayoutStore } from '@/store/layout'

const route = useRoute()

const tagName = computed(() => route.query.tag as string) || ref('')
const bindTagName = ref('')
watchEffect(() => {
  bindTagName.value = route.query.tag as string
})

const { setLeftMenuOpen } = useLayoutStore()
const router = useRouter()
const goRouter = (query?) => {
  router.push({
    name: 'memo',
    query,
  })
}
const [isTagEdit, toggeEdit] = useToggle(false)
const rename = () => {
  const articleStore = useArticleStore()
  articleStore.tagRename(tagName.value, bindTagName.value).then((res) => {
    isTagEdit.value = false
    ElMessage.success('修改成功')
    goRouter({
      tag: bindTagName.value,
    })
  })
}
const isPC = useMediaQuery('(min-width: 650px)')
</script>

<template>
  <div class="title-wrp">
    <span v-show="!isPC" class="showLeftPanelBtn" @click.stop="setLeftMenuOpen(true)">三</span>
    <span class="title" @click.prevent="goRouter()"> MEMO </span>
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
    <Refresh class="icon" @click.prevent="goRouter()" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-style: normal;
  height: 14px;
  width: 14px;
  display: inline-block;
  opacity: 0.8;
  cursor: pointer;
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
  @apply rounded-md duration-300 transition-colors;

  &:hover {
    background: rgba(55, 53, 47, 0.08);
  }
 }

  svg {
    height: 14px;
    width: 14px;
    @apply mx-1 mr-2;
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
