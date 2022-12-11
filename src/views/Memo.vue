<script lang="ts" setup>
import { Refresh, Search } from '@element-plus/icons-vue'
import { computed, provide, reactive, ref, toRefs, unref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import Editor from '../components/Editor.vue'
import MemoCard from '@/components/MemoCard.vue'
import MemoCardOrEditor from '@/components/MemoCardOrEditor'
import MemoTitle from '@/components/MemoTitle.vue'
import { useArticleStore } from '@/store/article'
import DetailPanel from '@/components/DetailPanel.vue'
import ShareCard from '@/components/ShareCard.vue'

import { EditorType } from '@/types/card-type'

const props = defineProps<{ tag?: string }>()
const { articleList, articleListEnhance } = storeToRefs(useArticleStore())
const { setActiveTag, getArticleList } = (useArticleStore())
provide('tag', props.tag)

watchEffect(() => {
  const tag = props.tag
  setActiveTag(tag)
  getArticleList({ tag })
})
const panelShow = ref(false)
const panelContent = ref('')
const handleOpenPanel = (val) => {
  panelContent.value = val
  panelShow.value = true
}

const shareState = reactive({
  show: false,
  memo: null,
})
const handleOpenShare = (val) => {
  shareState.memo = val
  shareState.show = true
}
</script>

<template>
  <div class="memo-view">
    <nav>
      <MemoTitle />
      <div class="input-wrapper">
        <input type="text">
        <Search class="input-icon" />
      </div>
    </nav>
    <div class="input-container">
      <Editor :type="EditorType.create" />
    </div>
    <ul class="card-container">
      <template v-for="memo of articleListEnhance" :key="memo.id">
        <MemoCardOrEditor
          :memo="memo"
          @openPanel="handleOpenPanel"
          @openShare="handleOpenShare"
        />
      </template>
    </ul>
    <DetailPanel v-model:show="panelShow" :content="panelContent" />
    <ShareCard
      v-if="shareState.show"
      v-model:show="shareState.show"
      :content="shareState.memo"
    />
  </div>
</template>

<style lang="scss" scoped>
i {
  font-style: normal;
}

svg {
  display: inline;
}

nav {
  display: flex;
  padding: 0 10px;
  @apply py-3;
    // line-height: 40px;
  justify-content: space-between;

  height: 60px;
  .input-wrapper {
    width: 73%  ;
    position: relative;
    box-sizing: border-box;
    // margin: 10px;
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

      svg {
      }
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
}

.input-container {
  @apply px-5;
}

.memo-view {
  height: 100%;

  nav {
    @apply px-5;
  }
}

.card-container {
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 300px;
  @apply px-5;
  //谷歌适用
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
