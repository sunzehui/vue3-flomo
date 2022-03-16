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
    </main>
  </div>
</template>

<style lang="scss" scoped>
svg {
  display: inline;
}

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
  Refresh,
  Search,
} from "@element-plus/icons";
</script>
