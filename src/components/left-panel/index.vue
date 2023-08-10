<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import UserTitle from '../UserTitle.vue'
import UserStatistical from '../UserStatistical.vue'
import Tag from '../Tag.vue'
import SideBar from './SideBar.vue'
import HeatMap from './heat-map.vue'
import { useUserStore } from '@/store/user'
import { useArticleStore } from '@/store/article'

const userStore = useUserStore()
const articleStore = useArticleStore()

const topicTag = computed(() =>
  articleStore.tagList.filter(item => item.is_topics),
)
const tagList = computed(() =>
  articleStore.tagList.filter(item => !item.is_topics),
)
</script>

<template>
  <div class="left">
    <UserTitle :nickname="userStore.nickname" :is-pro="true" />
    <UserStatistical />
    <HeatMap />
    <SideBar />
    <div v-if="!topicTag.length" class="empty-topic-tag">
      置顶常用标签于此，以便访问。
    </div>
    <div v-if="topicTag.length" class="topic-tag">
      <h4 class="tag-title">
        置顶标签
      </h4>
      <ul class="tag-list">
        <li v-for="tag in topicTag" :key="tag.id" class="relative">
          <Tag :link="tag.content" :is-topic="tag.is_topics">
            {{
              tag.content
            }}
          </Tag>
        </li>
      </ul>
    </div>

    <div class="normal-tag">
      <h4 class="tag-title">
        全部标签
      </h4>
      <ul class="tag-list">
        <li v-for="tag in tagList" :key="tag.id" class="relative">
          <Tag :link="tag.content" :is-topic="tag.is_topics">
            {{
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
  min-width: 218px;

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
</style>
