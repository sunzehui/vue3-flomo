<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import { Check, Edit, Loading, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElTooltip } from 'element-plus'
import { computed, ref, toRefs, unref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Search from '@/components/ui/topbar/search.vue'
import { useMemoStore } from '@/store/memo'
import TopBar from '@/components/ui/topbar/index.vue'
import { useLayoutStore } from '@/store/layout'

const route = useRoute()
const tagName = computed(() => route.query.tag as string || '')

const [isTagEdit, toggeEdit] = useToggle(false)
const refreshing = ref(false)
const { loadRemoteData } = useMemoStore()

const router = useRouter()
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
const bindTagName = ref('')
watchEffect(() => {
  bindTagName.value = route.query.tag as string
})

const rename = () => {
  const articleStore = useMemoStore()
  articleStore.tagRename(tagName.value, bindTagName.value).then((res) => {
    isTagEdit.value = false
    ElMessage.success('修改成功')
    handleRefresh({
      tag: bindTagName.value,
    })
  })
}
const isActionShow = ref(false)
const { isPC } = toRefs(useLayoutStore())

watchEffect(() => {
  isActionShow.value = unref(isPC)
})
</script>

<template>
  <TopBar title="MEMO">
    <template #tool>
      <ElTooltip
        v-if="!refreshing"
        effect="dark"
        content="刷新"
        placement="bottom"
      >
        <Refresh class="icon hover-bg" @click.prevent="handleRefresh()" />
      </ElTooltip>
      <Loading v-show="refreshing" />
    </template>
    <template #sub-title>
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
        <div v-if="isActionShow" class="action">
          <Edit
            v-show="!isTagEdit"
            class="icon"
            @click.prevent="isTagEdit = true"
          />
          <Check v-show="isTagEdit" class="icon" @click.prevent="rename" />
        </div>
      </div>
    </template>
    <!-- 搜索 -->
    <template #right>
      <Search />
    </template>
  </TopBar>
</template>

<style lang="scss" scoped>
.icon {
  @apply p-2 box-content h-4 w-4 block cursor-pointer opacity-80;
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
  @apply mx-1 text-dark-fill-1 ;
}

.tagEdit {
  display: inline-block;
  width: 120px;
  height: 30px;
  border-radius: 4px;
  margin-right: 5px;
}
.lastTag {
  @apply mx-1 text-secondary-text text-base;
}
</style>
