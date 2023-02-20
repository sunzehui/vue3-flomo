<script lang="ts" setup>
import UserTitle from "../UserTitle.vue";
import UserStatistical from "../UserStatistical.vue";
import Tag from "../Tag.vue";
import DailyRecord from "../DailyRecord.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, watch, computed} from "vue";
import {useUserStore} from "@/store/user";
import {useArticleStore} from "@/store/article";
import SideBar from './SideBar.vue'

const userStore = useUserStore();
const articleStore = useArticleStore();
const router = useRouter();

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
// watch(
//     () => route.query,
//     (newVal) => {
//       articleStore.getTagList();
//     }
// );
</script>

<template>
  <div class="left">
    <UserTitle :username="userStore.username" :isPro="true"/>
    <UserStatistical
        :memo="userStore.memoCount"
        :tag="userStore.tagCount"
        :day="userStore.daysCount"
    />
    <div class="checking">
      <DailyRecord :grid="userStore.dailyGrid"/>
    </div>
    <SideBar/>
    <div v-if="!topicTag.length" class="empty-topic-tag">
      置顶常用标签于此，以便访问。
    </div>
    <div v-if="topicTag.length" class="topic-tag">
      <h4 class="tag-title">置顶标签</h4>
      <ul class="tag-list">
        <li class="relative" v-for="tag in topicTag" :key="tag.id">
          <Tag :link="tag.content" :isTopic="tag.is_topics">{{
              tag.content
            }}
          </Tag>
        </li>
      </ul>
    </div>

    <div class="normal-tag">
      <h4 class="tag-title">全部标签</h4>
      <ul class="tag-list">
        <li class="relative" v-for="tag in tagList" :key="tag.id">
          <Tag :link="tag.content" :isTopic="tag.is_topics">{{
              tag.content
            }}
          </Tag>
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
