<!-- sc -->
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { isEmpty } from "lodash-es";
import "element-plus/es/components/Select/style/css";
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
const toggleSuggestionShow = (x: number, y: number, hidden = null) => {
  suggestionRef.value.style.top = y + "px";
  suggestionRef.value.style.left = x + "px";
  console.log(hidden);

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
  toggleSuggestionShow(offsetLeft, offsetTop, hidden);
};
type suggestionType = {
  name: string;
  id: string;
  active?: boolean;
};
const suggestionList = ref<suggestionType[] | null>(null);
const textareaContent = ref("");
const textareaRef = ref(null);

const fetchTag = () => {
  // 拉取tag填入suggestion
  suggestionList.value = [
    {
      name: "tag1",
      id: "tag1",
      active: true,
    },
    {
      name: "tag2",
      id: "tag2",
    },
    {
      name: "tag3",
      id: "tag3",
    },
  ];
};

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
onMounted(() => {
  fetchTag();
});
document.onclick = () => {
  handleSuggestionHidden(true);
};
const onTextInput = () => {
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
  textareaContent.value = textareaRef.value.value;
};
const onKeyDown = (event: KeyboardEvent) => {
  const key = event.key;
  console.log(key);

  // 当输入#时开启联想菜单
  if (key === "#" || key === "#") {
    handleSuggestionHidden(false);
    return false;
  }
  if (event.key == "Enter" && event.ctrlKey) {
    saveArticle(123);
  }
  // 仅当联想菜单展示时
  if (isSuggestionShow.value) {
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
      handleSuggestionHidden(true);
    }
    // 敲回车选中
    if (key === "Enter") {
      const activeItem = suggestionList.value.find((item) => item.active);
      insertContent(activeItem.name);
      handleSuggestionHidden(true);
    }
  }
};

/**
 * 插入内容
 * bug：插入之后应当回到原来光标位置
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
  textareaRef.value.selectionEnd = memoSelectionIndex + content.length;
};

const itemClicked = ($event: Event) => {
  const target = ($event.target as HTMLSpanElement).innerText;
  // 将联想框中的内容添加到textarea中
  insertContent(target);
};
const saveArticle = () => {
  console.log("save");
  console.log(textareaContent.value);
};
const handleSave = ($event: Event) => {
  $event.preventDefault();
  $event.stopPropagation();

  saveArticle();
};

/**
 *
 * @TODO 提交后，提取文章出现的现有标签
 * 大概是 # 开头 结束条件：空格 换行 或 下一个#之前
 * ，做成标签列表,展示 日后过滤
 */
</script>

<template>
  <div class="input-container">
    <textarea
      name="text-input"
      ref="textareaRef"
      v-model="textareaContent"
      @input="onTextInput"
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
      <span class="tag-icon">
        <!-- <div style="display: inline-block; margin-left: 20px">哈哈</div> -->

        <button
          class="save"
          @click="handleSave($event)"
          :disabled="isEmpty(textareaContent)"
        >
          发送
        </button>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
</style>
