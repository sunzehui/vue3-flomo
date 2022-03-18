<script lang="ts" setup>
import { Refresh, Search } from "@element-plus/icons";
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
    <div class="input-container">
      <textarea name="text-input" id="" cols="30" rows="10"> </textarea>
      <ul class="suggestion">
        <li>欢迎</li>
      </ul>
      <div class="bar">
        <span class="tag-icon">
          <svg
            data-v-554cce5b=""
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              data-v-554cce5b=""
              d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"
            ></path>
          </svg>

          <button class="save" disabled>发送</button>
        </span>
      </div>
    </div>
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
.input-container {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding-top: 20px;
  position: relative;
  background: #fff;
  margin: 10px 0;
  textarea {
    border: none;
    outline: 0;
    height: 42px;
    resize: none;
    min-height: 42px;
    max-height: 50vh;
    width: 100%;
    overflow-y: hidden;
    min-height: 1rem;
    &:focus {
      outline: 0;
      box-shadow: none;
    }
  }
  .suggestion {
    display: none;
  }
  .bar {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 0 10px;
    align-items: center;
    position: relative;
    span {
      cursor: pointer;
    }
    button {
      position: absolute;
      right: 6px;
      bottom: 4px;
      border-color: #aaddc6;
      background: #55bb8e;
      color: #fff;
      font-size: 12px;
      display: inline-block;
      line-height: 12px;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: 0.1s;
      font-weight: 500;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      padding: 9px 15px;
      border-radius: 4px;
      &:disabled {
        cursor: not-allowed;
        background-color: #aaddc6;
        color: white;
      }
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
