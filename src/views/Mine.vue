<template>
  <div class="wrapper">
    <div class="left">
      <div class="user">
        <span class="username">
          <span>sunzehui</span>

          <span class="pro active">PRO</span>
        </span>
        <div class="flex items-center">
          <div class="notify mr-2">
            <svg
              data-v-356cff01=""
              width="18"
              height="18"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                data-v-356cff01=""
                width="48"
                height="48"
                fill="white"
                fill-opacity="0.01"
              ></rect>
              <path
                data-v-356cff01=""
                d="M24 4C16.268 4 10 10.268 10 18V38H38V18C38 10.268 31.732 4 24 4Z"
                fill="none"
              ></path>
              <path
                data-v-356cff01=""
                d="M10 38V18C10 10.268 16.268 4 24 4C31.732 4 38 10.268 38 18V38M4 38H44"
                stroke="#808080"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                data-v-356cff01=""
                d="M24 44C26.7614 44 29 41.7614 29 39V38H19V39C19 41.7614 21.2386 44 24 44Z"
                fill="none"
                stroke="#808080"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
          <div class="setting">
            <svg
              data-v-356cff01=""
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                data-v-356cff01=""
                width="48"
                height="48"
                fill="white"
                fill-opacity="0.01"
              ></rect>
              <path
                data-v-356cff01=""
                d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z"
                fill="none"
                stroke="#808080"
                stroke-width="3"
                stroke-linejoin="round"
              ></path>
              <path
                data-v-356cff01=""
                d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                fill="none"
                stroke="#808080"
                stroke-width="3"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="statistical">
        <div class="memo-num num-jar">
          <div class="num">5</div>
          <span>MEMO</span>
        </div>
        <div class="tag-num num-jar">
          <div class="num">3</div>
          <span>TAG</span>
        </div>
        <div class="day-num num-jar">
          <div class="num">4</div>
          <span>DAY</span>
        </div>
      </div>
      <div class="checking">这里展示图表</div>
      <ul class="bar-list">
        <li class="active">
          <div class="icon">
            <Menu />
          </div>
          <span>MEMO</span>
        </li>
        <li>
          <div class="icon">
            <Comment style="width: 1em; height: 1em" />
          </div>
          <span>微信输入</span>
        </li>
        <li>
          <div class="icon">
            <TrendCharts style="width: 1em; height: 1em" />
          </div>
          <span>每日回顾</span>
        </li>
        <li>
          <div class="icon">
            <DeleteFilled style="width: 1em; height: 1em" />
          </div>
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
      <Memo v-show="thisPage === 'default'" />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply h-screen mx-auto flex justify-center space-x-8;
  .left {
    @apply h-full;
    width: 240px;
    .user {
      @apply flex py-3;
      .username {
        flex: 1;
        cursor: pointer;
        font-weight: bold;
        font-size: 18px;
        color: #5f5f5f;
        .pro {
          color: white;
          background: #9d9d9d;
          font-size: 12px;
          padding: 2px 4px;
          border-radius: 4px;

          display: inline-block;
          position: relative;
          bottom: 2px;
          cursor: pointer;
          @apply mx-1;
          &.active {
            background: #212f4b;
          }
        }
      }
      .notify,
      .setting {
        cursor: pointer;
      }
    }
    .statistical {
      @apply w-full flex justify-between;
      .num-jar {
        .num {
          font-weight: bold;
          font-size: 24px;
          line-height: 1;
          color: #9d9d9d;
        }
        span {
          font-size: 10px;
          color: #9d9d9d;
          line-height: 2;
        }
      }
    }
    .checking {
      height: 230px;
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
        @apply flex cursor-pointer text-sm py-2 rounded-md;
        .icon {
          @apply w-4 h-4 mx-3 mr-1 inline-block;
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

<script setup>
import {
  Menu,
  Comment,
  TrendCharts,
  ArrowRight,
  DeleteFilled,
} from "@element-plus/icons";
import Memo from "./Memo.vue";

import { useRouter } from "vue-router";
const route = useRouter();
const thisPage = route.currentRoute.value.query.source || "default";
</script>
