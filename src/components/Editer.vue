<!-- sc -->
<script lang="ts" setup>
import { nextTick, PropType, ref, watch } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { isEmpty } from "lodash-es";
import "element-plus/es/components/Select/style/css";
import type { NewAticle, tagType } from "../types/article";
const props = defineProps({
  tags: {
    type: Array as PropType<tagType[]>,
    default: [],
  },
});

const computeSelectPos = (input: HTMLTextAreaElement) => {
  // 初始位置
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
    selectionEnd: selectionPoint,
  } = input;
  // 生成看不见的div+sapn

  const _div = document.createElement("div");
  const copyStyle = window.getComputedStyle(input);

  for (const item of Array.from(copyStyle)) {
    _div.style.setProperty(item, copyStyle.getPropertyValue(item));
  }
  _div.style.position = "fixed";
  _div.style.visibility = "hidden";
  _div.style.whiteSpace = "pre-wrap";

  _div.innerHTML = input.value.slice(0, selectionPoint);
  const _span = document.createElement("span");
  _span.innerHTML = input.value.slice(selectionPoint);
  _div.appendChild(_span);
  document.body.appendChild(_div);

  // 获取span位置
  const spanX = _span.offsetLeft;
  const spanY = _span.offsetTop;
  document.body.removeChild(_div);
  // 最终位置=初始位置+span位置
  return {
    x: inputX + spanX,
    y: inputY + spanY,
  };
};

const suggestionRef = ref(null);
const isSuggestionShow = ref(false);
// 控制联想框展示，不传hidden默认切换
const toggleSuggestionHidden = (hidden = null) => {
  if (hidden === null) {
    suggestionRef.value.classList.toggle("hidden");
    isSuggestionShow.value = !isSuggestionShow.value;
  } else if (hidden === true) {
    suggestionRef.value.classList.add("hidden");
    isSuggestionShow.value = false;
  } else {
    suggestionRef.value.classList.remove("hidden");
    isSuggestionShow.value = true;
  }
};
const handleSuggestionHidden = (hidden = null) => {
  const { x, y } = computeSelectPos(textareaRef.value);
  // 防止挡字，加点偏移
  const offsetLeft = x + 15;
  const offsetTop = y + 22;
  suggestionRef.value.style.top = offsetTop + "px";
  suggestionRef.value.style.left = offsetLeft + "px";

  toggleSuggestionHidden(hidden);
  return false;
};
const handleIconClick = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  insertContent("#");
  if (props.tags.length === 0) {
    return false;
  }
  handleSuggestionHidden(false);
};

const suggestionList = ref<tagType[]>(props.tags);
const textareaContent = ref("");
const textareaRef = ref(null);

// 设置候选项active
const setItemActive = (isNext: number = 1) => {
  const list = suggestionList.value;
  const reset = () => {
    list.forEach((item) => {
      item.active = false;
    });
  };
  if (isNext === 1) {
    // 向上
    const currentIndex = list.findIndex((item) => item.active);
    reset();
    const target = currentIndex + 1 < list.length ? currentIndex + 1 : 0;
    list[target].active = true;
  } else {
    // 向下
    const currentIndex = list.findIndex((item) => item.active);
    reset();
    const target = currentIndex - 1 > 0 ? currentIndex - 1 : 0;
    list[target].active = true;
  }
};

document.onclick = () => {
  toggleSuggestionHidden(true);
};
watch(textareaContent, () => {
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
  // textareaContent.value = textareaRef.value.value;
});
const onKeyDown = (event: KeyboardEvent) => {
  const key = event.key;
  console.log(key);

  // 当输入#时开启联想菜单
  if ((key === "#" || key === "#") && props.tags.length) {
    handleSuggestionHidden(false);
    return false;
  }
  if (event.key == "Enter" && event.ctrlKey) {
    saveArticle();
  }
  // 仅当联想菜单展示时
  if (isSuggestionShow.value) {
    // 删除键
    if (key === "Backspace") {
      toggleSuggestionHidden(true);
      return;
    }
    // 当输入“上，下“方向键时切换active标签
    event.stopPropagation();
    event.preventDefault();

    if (key === "ArrowUp") {
      setItemActive(-1);
    } else if (key === "ArrowDown") {
      setItemActive(1);
    }
    // 敲空格隐藏
    if (key === " ") {
      toggleSuggestionHidden(true);
    }
    // 敲回车选中
    if (key === "Enter") {
      const activeItem = suggestionList.value.find((item) => item.active);
      insertContent(activeItem.name + " ");
      toggleSuggestionHidden(true);
    }
  }
};

/**
 * 插入内容
 *  */

const insertContent = (content: string) => {
  const { selectionEnd: selectionEnd } = textareaRef.value;
  const memoSelectionIndex = selectionEnd;
  const currentContent = textareaContent.value;
  const placement =
    currentContent.slice(0, selectionEnd) +
    content +
    currentContent.slice(selectionEnd);
  textareaContent.value = placement;
  // 插入完成后，设置光标位置
  textareaRef.value.blur();
  nextTick(() => {
    textareaRef.value.selectionEnd = memoSelectionIndex + content.length;
    textareaRef.value.focus();
  });
};

const itemClicked = ($event: Event) => {
  const target = ($event.target as HTMLSpanElement).innerText;
  // 将联想框中的内容添加到textarea中
  insertContent(target + " ");
};
const saveArticle = () => {
  const tags = extractTags(textareaContent.value);
  const ArticleVO = {
    tags,
    content: textareaContent.value,
  };
  const save = (v: typeof ArticleVO) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(v);
      }, 1000);
    });
  };
  save(ArticleVO).then((result) => {
    loading.value = false;
  });
};

const handleSave = ($event: Event) => {
  $event.preventDefault();
  $event.stopPropagation();
  loading.value = true;
  console.log(loading.value);

  saveArticle();
};

/**
 *
 *  提交后，提取文章出现的现有标签
 * 大概是 # 开头 结束条件：空格 换行 或 下一个#之前
 * ，做成标签列表,展示 日后过滤
 */
const extractTags = (content: string) => {
  const tags = Array.from(content.match(/#[^\s#]+/g) || []);
  return tags;
};
const loading = ref(false);
</script>

<template>
  <div class="input-container">
    <textarea
      name="text-input"
      ref="textareaRef"
      v-model="textareaContent"
      @keydown="onKeyDown"
    ></textarea>
    <div
      class="suggestion hidden"
      ref="suggestionRef"
      @click="itemClicked($event)"
    >
      <template v-for="item of suggestionList">
        <span :class="{ active: item.active }">{{ item.name }}</span>
      </template>
    </div>
    <div class="bar">
      <span class="tag-icon" @click="handleIconClick($event)"> # </span>
      <button
        class="save"
        @click="handleSave($event)"
        :disabled="isEmpty(textareaContent)"
      >
        发送
      </button>
    </div>
    <!-- 展示loading将其他隐藏 -->
    <div class="loading-box" v-show="loading">loading...</div>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  overflow: hidden;
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
    padding: 0 10px;
    box-sizing: border-box;
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
    position: absolute;
    background-color: black;
    padding: 5px;
    z-index: 99;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    &.hidden {
      display: none;
    }
    span {
      color: white;
      padding: 3px 20px;
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;

      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
    &.show {
      display: block;
    }
  }
  .loading-box {
    display: flex;
    height: 100%;
    width: 100%;
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
  }
  .bar {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 0 10px;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    span {
      cursor: pointer;
      user-select: none;
    }
    .tag-icon {
      display: inline-block;
      // margin-left: 20px;
      font-size: 0.9em;
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
.loading {
  position: relative;
  .loading-box {
    visibility: visible;
  }
}
</style>
