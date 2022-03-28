<!-- sc -->
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElSelect, ElOption, ElButton } from "element-plus";
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

// 控制联想框展示，不传hidden默认切换
const toggleSuggestionShow = (x: number, y: number, hidden = null) => {
  suggestionRef.value.style.top = y + "px";
  suggestionRef.value.style.left = x + "px";
  console.log(hidden);

  if (hidden === null) {
    suggestionRef.value.classList.toggle("hidden");
  } else if (hidden === true) {
    suggestionRef.value.classList.add("hidden");
  } else {
    suggestionRef.value.classList.remove("hidden");
  }
};
const handleSuggestionHidden = (hidden = null) => {
  const { x, y } = computeSelectPos(textareaRef.value);
  // 防止挡字，加点偏移
  const offsetLeft = x + 15;
  const offsetTop = y + 22;
  toggleSuggestionShow(offsetLeft, offsetTop, hidden);
};
const textareaRef = ref();
const fetchTag = () => {
  // 拉取tag填入suggestion
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
};
const onKeyDown = (event: KeyboardEvent) => {
  const key = event.key;
  // 输入 # 开启联想
  console.log(key);

  if (key === "#") {
    handleSuggestionHidden(false);
  }
};
</script>
<template>
  <div class="input-container">
    <textarea
      name="text-input"
      ref="textareaRef"
      @input="onTextInput"
      @keydown="onKeyDown"
    ></textarea>
    <div class="suggestion" ref="suggestionRef">
      <span class="active">haha</span>
      <span>nihao</span>
    </div>
    <div class="bar">
      <span class="tag-icon">
        <!-- <div style="display: inline-block; margin-left: 20px">哈哈</div> -->

        <button class="save" disabled>发送</button>
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
    // display: none;
    position: absolute;
    background-color: black;
    padding: 5px;
    z-index: 99;
    border-radius: 5px;
    // absolute cursor pointer 失效 hover失效
    span {
      color: white;
      padding: 3px 20px;
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
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
