<script lang="ts" setup>
import { Refresh, Search } from "@element-plus/icons";
import { onMounted, reactive } from "vue";
import Editer from "../components/Editer.vue";
import MemoCard from "../components/MemoCard.vue";
import MemoTitle from "@/components/MemoTitle.vue";
import { useArticleStore } from "@/store/article";
import { storeToRefs } from "pinia";

const articleStore = useArticleStore();
onMounted(() => {
  articleStore.getArticleList();
});

const { articleList: memoList } = storeToRefs(articleStore);
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
    <Editer :tags="[]" />
    <ul class="card-container">
      <template v-for="(memo, index) of memoList" :key="memo.id">
        <MemoCard :article="memo" />
        <MemoCard
          v-if="index === memoList.length - 1"
          :article="memo"
          :isLast="true"
        />
      </template>
    </ul>
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
.memo-view {
  height: 100%;
}
.card-container {
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 300px;
  //谷歌适用
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
