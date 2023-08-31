<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import { Check, Edit, Loading, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessage, ElTooltip } from 'element-plus'
import { computed, ref, toRefs, unref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    <template #right>
      <div class="input-wrapper">
        <input type="text">
        <Search class="input-icon" />
      </div>
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
  </TopBar>
</template>

<style lang="scss" scoped>
.input-wrapper {
    max-width: 200px;
    position: relative;
    box-sizing: border-box;
    input{
      width: 100%;
      font-size: 14px;
    }
    .input-icon {
      @apply absolute top-1/2 -translate-y-1/2 left-[10px];
      height: 40px;
      width: 25px;
      text-align: center;
      transition: all 0.3s;
      line-height: 40px;
      height: 14px;
      width: 14px;
    }
  }

  input {
    // height: 40px;
    height: 100%;
    outline: 0;
    border: none;
    background: #efefef;
    border-radius: 8px;
    padding: 0 30px;

    &:focus,
    &:active {
      outline: 0;
      box-shadow: none;
    }
  }
</style>
