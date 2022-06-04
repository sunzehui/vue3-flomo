<script lang="ts" setup>
import UserTitle from "../components/UserTitle.vue";
import UserStatistical from "../components/UserStatistical.vue";
import {
  Menu,
  Comment,
  TrendCharts,
  ArrowRight,
  DeleteFilled,
  Refresh,
  Search,
} from "@element-plus/icons";
import Tag from "../components/Tag.vue";
import { ElDialog, ElButton, ElMessage } from "element-plus";

import DailyRecord from "../components/DailyRecord.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, reactive } from "@vue/reactivity";
import { onMounted, provide, watch } from "vue";
import { useUserStore } from "@/store/user";
import { useArticleStore } from "@/store/article";
import { useToggle } from "@vueuse/core";
const userStore = useUserStore();
const articleStore = useArticleStore();
const router = useRouter();
const updateQuery = (route) => {
  router.push(route);
};
const page = computed(() => {
  const thisPage = router.currentRoute.value.query.source || "default";
  return router.currentRoute.value.path;
});

onMounted(() => {
  userStore.getStatisticInfo();
  userStore.getUserInfo();
  articleStore.getTagList();
});
const topicTag = computed(() =>
  articleStore.tagList.filter((item) => item.is_topics)
);
const tagList = computed(() =>
  articleStore.tagList.filter((item) => !item.is_topics)
);
const route = useRoute();
watch(
  () => route.query,
  (newVal) => {
    articleStore.getTagList();
  }
);
</script>

<template>
  <div class="left">
    <UserTitle :username="userStore.username" :isPro="true" />
    <UserStatistical
      :memo="userStore.memo_count.memoCount"
      :tag="userStore.memo_count.tagCount"
      :day="userStore.memo_count.day"
    />
    <div class="checking">
      <DailyRecord :grid="userStore.daily_grid" />
    </div>
    <ul class="bar-list">
      <li
        :class="{ active: page === '/memo' }"
        @click="updateQuery({ name: 'memo' })"
      >
        <Menu class="icon" />MEMO
      </li>
      <li
        :class="{ active: page === '/wechat' }"
        @click="updateQuery({ name: 'wechat' })"
      >
        <Comment class="icon" />
        <span>微信输入</span>
      </li>
      <li
        :class="{ active: page === '/review' }"
        @click="updateQuery({ name: 'review' })"
      >
        <TrendCharts class="icon" />
        <span>每日回顾</span>
      </li>
      <li
        :class="{ active: page === '/recycle' }"
        @click="updateQuery({ name: 'recycle' })"
      >
        <DeleteFilled class="icon" />
        <span>回收站</span>
      </li>
    </ul>
    <div v-if="!topicTag.length" class="empty-topic-tag">
      置顶常用标签于此，以便访问。
    </div>
    <div v-if="topicTag.length" class="topic-tag">
      <h4 class="tag-title">置顶标签</h4>
      <ul class="tag-list">
        <li class="relative" v-for="tag in topicTag" :key="tag.id">
          <Tag :link="tag.content" :isTopic="tag.is_topics">{{
            tag.content
          }}</Tag>
        </li>
      </ul>
    </div>

    <div class="normal-tag">
      <h4 class="tag-title">全部标签</h4>
      <ul class="tag-list">
        <li class="relative" v-for="tag in tagList" :key="tag.id">
          <Tag :link="tag.content" :isTopic="tag.is_topics">{{
            tag.content
          }}</Tag>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left {
  @apply h-full;
  width: 240px;

  .checking {
    height: 140px;
    @apply w-full;
  }
  .bar-list {
    // @apply h-56;
    color: #9d9d9d;
    font-size: 14px;
    list-style-type: none;
    -webkit-padding-start: 0;
    padding-inline-start: 0;
    margin: 8px 0 18px;
    li {
      @apply flex cursor-pointer text-sm py-2 pl-2 rounded-md;
      .icon {
        // @apply w-4 h-4 mx-3 mr-1 inline-block;
        width: 1em;
        display: inline-block;
        margin-right: 10px;
      }

      &:hover {
        background: #efefef;
        border-radius: 5px;
        color: #9d9d9d;
      }
      &.active {
        background: #55bb8e;
        color: white;
      }
    }
  }
  .tag-title {
    @apply text-xs my-2 text-left;
    font-size: 12px;
    color: #ded1b7;
    margin: 20px 0 0;
  }

  .empty-topic-tag {
    @apply text-xs my-2 text-left  bg-gray-100 rounded-lg py-2 pl-2;
    font-size: 12px;
    color: #9d9d9d;
    margin: 20px 0 0;
  }
  .tag-list {
    color: #9d9d9d;
    font-size: 14px;
    list-style-type: none;
    -webkit-padding-start: 0;
    padding-inline-start: 0;
    margin: 8px 0 18px;
  }

  .topic-tag {
    @apply mt-4;
  }
  .normal-tag {
    @apply mt-4;
  }
}
i {
  font-style: normal;
}

@media screen and (max-width: 650px) {
  .left {
    display: none;
  }
}
</style>
<style>
/* .el-overlay-dialog {
  z-index: 999;
}
.el-overlay {
  position: fixed;
}
.dialog-container {
  position: relative;
} */
</style>
