<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MemoCard from '@/components/ui/memo-card/index.vue'
import { ApiUser as ApiUserShare } from '@/api/share'

const memoList = ref([])
const userInfo = ref(null)
const route = useRoute()
onMounted(() => {
  const user_id = route.params.id as string

  ApiUserShare({
    user_id,
  }).then((res) => {
    memoList.value = res.data.usersMemo
    console.log('🚀 ~ file: memo.vue:17 ~ onMounted ~ memoList:', memoList)
    userInfo.value = res.data.userInfo
  })
})
</script>

<template>
  <div class="page-user-memo">
    <p>
      来自
      <span v-if="userInfo" class="highlight-nickname">
        {{ userInfo.nickname }}
      </span>
      的Memo
    </p>
    <div class="memo-container">
      <MemoCard
        v-for="memo in memoList"
        :key="memo.id"
        :memo="memo"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-user-memo{
  height: 100%;

  @apply px-5;
  .highlight-nickname{
    @apply text-primary-light-1;
  }
}
.memo-container {
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 300px;
  //谷歌适用
  &::-webkit-scrollbar {
    display: none;
  }

}
</style>
