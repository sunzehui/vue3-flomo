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
import DailyRecord from "../components/DailyRecord.vue";
import Tag from "../components/Tag.vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { provide } from "vue";

const route = useRouter();

const switchRoutes = (e) => {
  console.log(e.target);
};

const page = computed(() => {
  const thisPage = route.currentRoute.value.query.source || "default";

  return route.currentRoute.value.path;
});
console.log(page.value == "/wechat");
const filterArticle = (event) => {
  console.log(event);
};
const updateQuery = () => {};
provide("updateQuery", updateQuery);
defineExpose({
  switchRoutes,
});
</script>

<template>
  <div class="wrapper">
    <div class="left">
      <UserTitle username="sunzehui" :isPro="true" />
      <UserStatistical :memo="3" :tag="2" :day="3" />
      <div class="checking">
        <DailyRecord />
      </div>
      <ul class="bar-list">
        <li :class="{ active: page === '/memo' }" @click="$router.push('memo')">
          <Menu class="icon" />MEMO
        </li>
        <li
          :class="{ active: page === '/wechat' }"
          @click="$router.push('wechat')"
        >
          <Comment class="icon" />
          <span>微信输入</span>
        </li>
        <li
          :class="{ active: page === '/review' }"
          @click="$router.push('review')"
        >
          <TrendCharts class="icon" />
          <span>每日回顾</span>
        </li>
        <li
          :class="{ active: page === '/recycle' }"
          @click="$router.push('recycle')"
        >
          <DeleteFilled class="icon" />
          <span>回收站</span>
        </li>
      </ul>
      <div class="topic-tag">
        <h4 class="tag-title">置顶标签</h4>
        <ul class="tag-list">
          <li>
            <Tag link="">欢迎</Tag>
          </li>
        </ul>
      </div>

      <div class="normal-tag">
        <h4 class="tag-title">全部标签</h4>
        <ul class="tag-list">
          <Tag :link="123">欢迎</Tag>
        </ul>
      </div>
    </div>
    <main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply h-screen mx-auto flex justify-center space-x-8;
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

    .topic-tag {
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
  main {
    width: 640px;
  }
}

@media screen and (max-width: 650px) {
  .left {
    display: none;
  }
  .wrapper main {
    margin-left: 0 !important;
  }
}
</style>
