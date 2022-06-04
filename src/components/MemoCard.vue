<script lang="ts" setup>
import {
  computed,
  PropType,
  reactive,
  toRef,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { Article } from "../types/article";
import { ElPopover } from "element-plus";

import { useArticleStore } from "@/store/article";
import { useRouter } from "vue-router";
import moment from "moment";

const props = defineProps({
  article: {
    type: Object as PropType<Article>,
    default: {},
  },
  isLast: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});
type acType = "delete" | "edit" | "detail" | "set-top" | "get-link";
const articleStore = useArticleStore();
const reducerActicon = (event: Event) => {
  const type = (event.target as HTMLLIElement).dataset.type as acType;
  switch (type) {
    case "delete":
      articleStore.deleteArticle(+props.article.id);
      break;
    default:
      break;
  }
};
const router = useRouter();
const tagClick = (tag) => {
  router.push({
    name: "memo",
    query: {
      tag,
    },
  });
};
let { article } = toRefs(props);
const updateTime = computed(() => {
  moment.locale(navigator.language);

  const momentTime = moment.utc(article.value.updateTime).local();

  if (momentTime.diff(moment(), "day") < 0) {
    return momentTime.format("YYYY-MM-DD HH:mm:ss");
  }

  return momentTime.fromNow();
});
</script>

<template>
  <li class="card">
    <div class="header">
      <span class="time-text">{{ updateTime }}</span>
      <div class="more">
        <el-popover
          :placement="props.isLast ? 'top' : 'bottom'"
          trigger="hover"
        >
          <template #reference>
            <svg
              width="16px"
              height="16px"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
              ></path>
            </svg>
          </template>
          <ul @click="reducerActicon($event)" class="popover-list">
            <li data-type="get-link">复制链接</li>
            <li data-type="set-top">置顶</li>
            <li data-type="detail">查看详情</li>
            <li data-type="edit">编辑</li>
            <li data-type="delete">删除</li>
          </ul>
        </el-popover>
      </div>
    </div>
    <div
      v-html="article.content.replace(/[\r\n]/g, '<br />')"
      class="content"
    ></div>
    <div class="footer">
      <ul class="tag-view">
        <li
          v-for="item of article.tags"
          :key="item.content"
          @click.prevent="tagClick(item.content)"
        >
          #{{ item.content }}
        </li>
      </ul>
    </div>
  </li>
</template>

<style scoped lang="scss">
li.card {
  background: #ffffff;
  border-radius: 6px;
  padding: 15px;
  margin-top: 8px;
  @apply duration-300;
  &:hover {
    box-shadow: 0px 2px 16px #dddddd;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.8em;

    color: #8f9193;
    svg {
      cursor: pointer;
    }
    .time-text {
      display: inline-block;

      font-size: 0.8em;
      text-decoration: none;
    }
    > .more {
      position: relative;
      height: 1.8em;
      padding: 0 20px;
      &:hover ul {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .content {
    color: #323232;
    font-size: 14px;
    overflow: hidden;
  }
  .more ul {
    visibility: hidden;
  }
  .footer {
    margin-top: 10px;
    .tag-view {
      display: flex;
    }
    .tag-view > li {
      @apply mx-1;
      width: fit-content;
      height: 100%;
      color: #5783f7;
      cursor: pointer;
      background-color: #eef3fe;
      padding: 4px;
      font-size: 12px;
      border-radius: 3px;
      &:hover {
        color: #eef3fe;
        background-color: #5783f7;
      }
    }
  }
}
ul.popover-list {
  min-width: 150px;
  border-radius: 4px;
  padding: 0 12px;

  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  // box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  word-break: break-all;
  // transition: all 0.3s ease-in-out;
  width: 200px;

  li {
    color: #7d7d7d;
    display: block;
    margin-left: 0;
    padding: 10px 0 10px 0px;
    font-weight: normal;

    cursor: pointer;
    user-select: none;
    &:hover {
      color: #55bb8e;
    }
  }
}
</style>
