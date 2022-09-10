<script lang="ts" setup>
import { Refresh, Search } from "@element-plus/icons-vue";
import {computed, ref, unref, watchEffect} from "vue";
import Editor from "../components/Editor.vue";
import MemoCard from "../components/MemoCard.vue";
import MemoTitle from "@/components/MemoTitle.vue";
import { useArticleStore } from "@/store/article";
import { storeToRefs } from "pinia";
import DetailPanel from "@/components/DetailPanel.vue";
import ShareCard from "@/components/ShareCard.vue";
import { reactive } from "vue";
import {sortBy} from "lodash-es";

const articleStore = useArticleStore();
const { articleList } = storeToRefs(articleStore);
const sortedList = computed(()=>{
  return sortBy(unref(articleList),(obj)=>{
    if(obj.is_topic) return Number.MIN_SAFE_INTEGER;
    return obj.id;
  })
})
const props = defineProps<{ tag?: string }>();

watchEffect(() => {
  const tag = props.tag;
  articleStore.getArticleList({ tag });
});
const panelShow = ref(false);
const panelContent = ref("");
const handleOpenPanel = (val) => {
  panelContent.value = val;
  panelShow.value = true;
};

const shareState = reactive({
  show: false,
  memo: null,
});
const handleOpenShare = (val) => {
  shareState.memo = val;
  shareState.show = true;
};
</script>

<template>
  <div class="memo-view">
    <nav>
      <MemoTitle />
      <div class="input-wrapper">
        <input type="text" />
        <i><Search /></i>
      </div>
    </nav>
    <div class="input-container">
      <Editor />
    </div>
    <ul class="card-container">
      <template v-for="(memo, index) of sortedList" :key="memo.id">
        <MemoCard
          :article="memo"
          @openPanel="handleOpenPanel"
          @openShare="handleOpenShare"
          :isLast="articleList.length - 1 === index"
        />
      </template>
    </ul>
    <DetailPanel v-model:show="panelShow" :content="panelContent" />
    <ShareCard
      v-if="shareState.show"
      v-model:show="shareState.show"
      :content="shareState.memo"
    ></ShareCard>
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
  padding: 10px 0 10px 0;
  line-height: 40px;
  justify-content: space-between;
  .input-wrapper {
    position: relative;
    font-size: 14px;
    box-sizing: border-box;
    i {
      @apply absolute top-0 left-[5px];

      height: 40px;
      width: 25px;
      text-align: center;
      transition: all 0.3s;
      line-height: 40px;
      svg {
        height: 14px;
        width: 14px;
      }
    }
  }
  input {
    height: 40px;
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
