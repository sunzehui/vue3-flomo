<script lang="ts" setup>
import { PropType, reactive } from "vue";
import { Article } from "../types/article";

const props = defineProps({
  article: {
    type: Object as PropType<Article>,
    default: {},
  },
});
const reducerActicon = (event: Event) => {
  const type = (event.target as HTMLLIElement).dataset.type;
  console.log(type);
};
const article = reactive(props.article);
</script>

<template>
  <li class="card">
    <div class="header">
      <span class="time-text">{{ article.time }}</span>
      <div class="more">
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
        <ul @click="reducerActicon($event)">
          <li data-type="get-link">复制链接</li>
          <li data-type="set-top">置顶</li>
          <li data-type="detail">查看详情</li>
          <li data-type="edit">编辑</li>
          <li data-type="delete">删除</li>
        </ul>
      </div>
    </div>
    <div class="content">
      {{ article.content }}
    </div>
    <div class="footer">
      <ul class="tag-view">
        <li v-for="item of article.tags" :key="item.id">{{ item.name }}</li>
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
      ul {
        position: absolute;
        background: #fff;
        min-width: 150px;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        padding: 12px;
        z-index: 2000;
        color: #606266;
        line-height: 1.4;
        text-align: justify;
        font-size: 14px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        word-break: break-all;
        opacity: 0;
        transition: all 0.3s ease-in-out;

        li {
          color: #7d7d7d;
          display: block;
          margin-left: 0;
          padding: 10px 0 10px 6px;
          font-weight: normal;
          cursor: pointer;
          user-select: none;
          &:hover {
            color: #55bb8e;
          }
        }
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
    .tag-view > li {
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
</style>
