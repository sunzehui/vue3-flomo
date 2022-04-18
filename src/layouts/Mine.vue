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
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
const route = useRouter();

const switchRoutes = (e) => {
  console.log(e.target);
};

const page = computed(() => {
  const thisPage = route.currentRoute.value.query.source || "default";

  return route.currentRoute.value.path;
});
console.log(page.value == "/wechat");

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
            <span>
              <i class="sharp-icon">
                <svg
                  data-v-9eff3224=""
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    data-v-9eff3224=""
                    opacity="0.01"
                    width="18"
                    height="18"
                    fill="currentColor"
                  ></rect>
                  <path
                    data-v-9eff3224=""
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.153 7.5L5.838 10.5H3V12H5.6805L5.28675 15.75H6.795L7.18875 12H10.1805L9.78675 15.75H11.295L11.6888 12H15V10.5H11.847L12.162 7.5H15V6H12.3195L12.7133 2.25H11.205L10.8113 6H7.8195L8.21325 2.25H6.705L6.31125 6H3V7.5H6.153ZM10.3387 10.5H7.34625L7.66125 7.5H10.6537L10.3387 10.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </i>
              <label>欢迎</label>
            </span>
            <div class="right-arrow-icon">
              <ArrowRight style="height: 1em; width: 1em" />
            </div>
          </li>
        </ul>
      </div>

      <div class="normal-tag">
        <h4 class="tag-title">全部标签</h4>
        <ul class="tag-list">
          <li>
            <span>
              <i class="sharp-icon">
                <svg
                  data-v-9eff3224=""
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    data-v-9eff3224=""
                    opacity="0.01"
                    width="18"
                    height="18"
                    fill="currentColor"
                  ></rect>
                  <path
                    data-v-9eff3224=""
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.153 7.5L5.838 10.5H3V12H5.6805L5.28675 15.75H6.795L7.18875 12H10.1805L9.78675 15.75H11.295L11.6888 12H15V10.5H11.847L12.162 7.5H15V6H12.3195L12.7133 2.25H11.205L10.8113 6H7.8195L8.21325 2.25H6.705L6.31125 6H3V7.5H6.153ZM10.3387 10.5H7.34625L7.66125 7.5H10.6537L10.3387 10.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </i>
              <label>欢迎</label>
            </span>
            <div class="right-arrow-icon">
              <ArrowRight style="height: 1em; width: 1em" />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <main>
      <router-view></router-view>
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
    .tag-list li {
      line-height: 40px;
      cursor: pointer;
      span .sharp-icon {
        display: inline-block;
        margin-right: 6px;
        position: relative;
        top: -2px;
        padding-right: 0px;
        padding-bottom: 0px;
      }
      svg {
        display: inline-block;
      }
      position: relative;
      .right-arrow-icon {
        position: absolute;
        right: 10px;
        top: 0;
      }
      &:hover {
        background: #efefef;
        border-radius: 5px;
        color: #9d9d9d;
      }
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
    // @apply bg-blue-300 h-full;
    width: 640px;
  }
}
</style>
