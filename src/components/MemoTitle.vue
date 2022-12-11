<script lang="ts" setup>
import { Check, Edit, Refresh, Search } from '@element-plus/icons-vue'
import { useToggle } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'
import { ApiTagUpdate } from '@/api/article'

const route = useRoute()

const tagName = computed(() => route.query.tag as string) || ref('')
const bindTagName = ref('')
watchEffect(() => {
  bindTagName.value = route.query.tag as string
})
const router = useRouter()
const goRouter = (query = void 0) => {
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
</script>

<template>
  <div class="title-wrp">
    <span class="title" @click.prevent="goRouter()"> MEMO </span>
    <div v-if="tagName" style="display: inline">
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
  margin-top: -5px;
  margin-right: 5px;
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
.title-wrp > span.title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #5f5f5f;
  cursor: pointer;
  border-radius: 3px;
  @apply relative;
  svg {
    height: 14px;
    width: 14px;
  }
  &:hover {
    background: rgba(55, 53, 47, 0.08);
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
</style>
