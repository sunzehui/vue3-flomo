<script lang="ts" setup>
import { Refresh, Search } from "@element-plus/icons";
import Editer from "../components/Editer.vue";
</script>
<template>
  <div class="memo-view">
    <nav>
      <span>
        MEMO
        <i>
          <Refresh />
        </i>
      </span>
      <div class="input-wrapper">
        <input type="text" />
        <i><Search /></i>
      </div>
    </nav>
    <Editer />
    <ul class="card-container">
      <li>
        <div class="header">
          <div class="time-text">
            <span>2020-2-21 08:20:00</span>
          </div>
          <div class="more">
            <ul>
              <li>复制链接</li>
              <li>置顶</li>
              <li>查看详情</li>
              <li>编辑</li>
              <li>删除</li>
            </ul>
          </div>
        </div>
        <div class="content">
          何谓 flomo？flomo = flow + memo
          真正好的笔记产品，应该能让你记录得更多。
          因为记录下来的想法才有价值，而记录是为了更好地思考。 更多 flomo
          用法、帮助、隐私等介绍，请点击 → help.flomoapp.com
        </div>
        <div class="footer">
          <ul class="tag-view">
            <li>#欢迎/指南</li>
          </ul>
        </div>
      </li>
      <li>
        <div class="header">
          <div class="time-text">
            <span>2020-2-21 08:20:00</span>
          </div>
          <div class="more">
            <ul>
              <li>复制链接</li>
              <li>置顶</li>
              <li>查看详情</li>
              <li>编辑</li>
              <li>删除</li>
            </ul>
          </div>
        </div>
        <div class="content">
          何谓 flomo？flomo = flow + memo
          真正好的笔记产品，应该能让你记录得更多。
          因为记录下来的想法才有价值，而记录是为了更好地思考。 更多 flomo
          用法、帮助、隐私等介绍，请点击 → help.flomoapp.com
        </div>
        <div class="footer">
          <ul class="tag-view">
            <li>#欢迎/指南</li>
          </ul>
        </div>
      </li>
      <li>
        <div class="header">
          <div class="time-text">
            <span>2020-2-21 08:20:00</span>
          </div>
          <div class="more">
            <ul>
              <li>复制链接</li>
              <li>置顶</li>
              <li>查看详情</li>
              <li>编辑</li>
              <li>删除</li>
            </ul>
          </div>
        </div>
        <div class="content">
          何谓 flomo？flomo = flow + memo
          真正好的笔记产品，应该能让你记录得更多。
          因为记录下来的想法才有价值，而记录是为了更好地思考。 更多 flomo
          用法、帮助、隐私等介绍，请点击 → help.flomoapp.com
        </div>
        <div class="footer">
          <ul class="tag-view">
            <li>#欢迎/指南</li>
          </ul>
        </div>
      </li>
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
  span > label {
    font-size: 18px;
    font-weight: bold;
    color: #5f5f5f;
  }
  span {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    color: #5f5f5f;
    @apply relative;
    svg {
      height: 14px;
      width: 14px;
    }
  }
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

.card-container {
  > li {
    position: relative;
    background: #ffffff;
    border-radius: 6px;
    padding: 15px;
    margin-top: 8px;
    @apply duration-300;
    &:hover {
      box-shadow: 0px 2px 16px #dddddd;
    }
    .time-text {
      display: block;
      font-size: 12px;
      color: #8f9193;
      text-decoration: none;
    }
    .content {
      color: #323232;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    }
    .more ul {
      display: none;
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
}
</style>
