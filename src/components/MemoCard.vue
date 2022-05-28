<script lang="ts" setup>
import { PropType, reactive } from "vue";
import { Article } from "../types/article";
import { ElPopover, ElButton } from "element-plus";
import "element-plus/es/components/popover/style/css";

import "element-plus/es/components/button/style/css";
import { useArticleStore } from "@/store/article";

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

const article = reactive(props.article);
</script>

<template>
  <li class="card">
    <div class="header">
      <span class="time-text">{{ article.updateTime }}</span>
      <div class="more">
        <el-popover
          :placement="props.isLast ? 'top' : 'bottom'"
          trigger="hover"
        >
          <template #reference>
            <svg
              data-v-38588c71=""
              width="16px"
              height="16px"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                data-v-38588c71=""
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
    <div class="content">
      {{ article.content }}
    </div>
    <div class="footer">
      <ul class="tag-view">
        <li v-for="item of article.tags" :key="item.id">{{ item.content }}</li>
      </ul>
    </div>
  </li>
</template>

<style scoped lang="scss">
li.card {
  position: relative;
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
    position: relative;
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
