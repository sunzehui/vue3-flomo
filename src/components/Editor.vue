<!-- sc -->
<script lang="ts" setup>
import { nextTick, PropType, ref, watch } from "vue";
import { isEmpty } from "lodash";
import { useSuggestion } from "@/composable/useSuggestion";
import { useArticleStore } from "@/store/article";
import { useRoute } from "vue-router";

const handleSave = ($event?: Event) => {
  if ($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  loading.value = true;

  saveArticle();
};

const suggestionRef = ref(null);

// 监听onkeydown
const textareaRef = ref(null);

const {
  textareaContent,
  shouldSuggestionShow,
  handleIconClick,
  itemClicked,
  suggestionList,
} = useSuggestion(suggestionRef, textareaRef, handleSave);

const route = useRoute();

const saveArticle = () => {
  const tags = extractTags(textareaContent.value);
  const ArticleVO = {
    tags,
    content: textareaContent.value,
  };
  const articleStore = useArticleStore();
  articleStore.save(ArticleVO).then((result) => {
    loading.value = false;
    console.log(result);
    textareaContent.value = "";
    const tag = route.query.tag as string;
    // 如果当前是标签页，则获取当前标签文章
    if (tag) {
      articleStore.getArticleList({ tag });
    }
  });
};

watch(textareaContent, () => {
  // console.log("textareaContent:", textareaContent.value);
});
/**
 *
 *  提交后，提取文章出现的现有标签
 * 大概是 # 开头 结束条件：空格 换行 或 下一个#之前
 * ，做成标签列表,展示 日后过滤
 */
const extractTags = (content: string) => {
  // 提取出并消掉开头#
  const tags = Array.from(content.match(/#[^\s(?<!#)]+/g) || []).map((tag) =>
    tag.slice(1)
  );
  return tags;
};
const loading = ref(false);
watch(shouldSuggestionShow, (shouldSuggestionShow) => {
  console.log("shouldSuggestionShow:", shouldSuggestionShow);
});
</script>

<template>
  <div class="editor">
    <textarea
      v-model="textareaContent"
      name="text-input"
      ref="textareaRef"
    ></textarea>
    <div
      class="suggestion"
      ref="suggestionRef"
      v-show="shouldSuggestionShow"
      @click="itemClicked($event)"
    >
      <template v-for="item of suggestionList">
        <span :class="{ active: item.active }">{{ item.content }}</span>
      </template>
    </div>
    <div class="bar">
      <span class="tag-icon" @click="handleIconClick($event)"> # </span>
      <button
        class="save"
        @click.prevent="handleSave($event)"
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
.editor {
  border: 2px solid #e8e8e8;
  border-radius: 8px;

  padding-top: 20px;
  position: relative;
  background: #fff;
  margin: 10px 0;
}
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
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent !important;
  }
  min-height: 1rem;
  &:focus {
    outline: 0;
    box-shadow: none;
  }
}
.suggestion {
  position: absolute;
  background-color: black;
  max-width: 350px;
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
    white-space: nowrap;
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
  border-radius: 8px;
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

.loading {
  position: relative;
  .loading-box {
    visibility: visible;
  }
}
</style>
