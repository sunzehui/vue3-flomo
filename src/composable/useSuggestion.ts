import { px2number } from "@/utils/Tool";
import { useArticleStore } from "./../store/article";
import { storeToRefs } from "pinia";
import { ref, Ref, unref, watch } from "vue";
import { useEditor } from "./useEditor";
import { useEventListener } from "@vueuse/core";
type pxNum = number | string;

export function useSuggestion(
  _suggestionRef: Ref<HTMLDivElement>,
  _textareaRef: Ref<HTMLTextAreaElement>
) {
  const suggestionRef = _suggestionRef;
  const articleStore = useArticleStore();
  const { tagList } = storeToRefs(articleStore);
  const shouldArticleSave = ref(false);
  const { textareaContent, insertContent, computeSelectPos } =
    useEditor(_textareaRef);
  const shouldSuggestionShow = ref(false);

  // 隐藏/显示联想框
  const setSuggestionShow = (toShow = true) => {
    if (!toShow) {
      return;
    }
    const { x, y, containerWidth, containerHeight } = computeSelectPos();
    let offsetX = 15;
    let offsetY = 22;
    // 防止挡字，加点偏移
    let offsetLeft: pxNum = x + offsetX + "px";
    let offsetTop: pxNum = y + offsetY + "px";
    // 右边如果放不下联想框则放到左边
    console.log({ after: px2number(offsetTop) });

    if (containerWidth - px2number(offsetLeft) < 150) {
      offsetLeft = `calc( ${offsetLeft} + -50% )`;
    }
    if (px2number(offsetTop) > containerHeight) {
      offsetTop = containerHeight + offsetY + "px";
    }
    console.log(offsetLeft, offsetTop);
    suggestionRef.value.style.top = "" + offsetTop;
    suggestionRef.value.style.left = "" + offsetLeft;
    return false;
  };
  watch(shouldSuggestionShow, setSuggestionShow);

  const suggestionList = tagList;

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

  const onKeyDownEvent = (event: KeyboardEvent) => {
    const key = event.key;
    // 当输入#时开启联想菜单
    // console.log("key:", event);
    // console.log("code:", key.charCodeAt(0));

    if (key === "#" && unref(tagList).length) {
      shouldSuggestionShow.value = true;
      return false;
    }

    if (event.key == "Enter" && event.ctrlKey) {
      shouldArticleSave.value = true;
    }
    // 仅当联想菜单展示时
    if (shouldSuggestionShow.value) {
      // 删除键
      if (key === "Backspace") {
        shouldSuggestionShow.value = false;
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

      // 敲回车选中
      if (key === "Enter" || key === " ") {
        const activeItem = suggestionList.value.find((item) => item.active);
        insertContent(activeItem.content + " ");

        shouldSuggestionShow.value = false;
      }
    }
  };
  useEventListener(_textareaRef, "keydown", onKeyDownEvent);
  useEventListener(_textareaRef, "input", () => {
    const lastIsSharp =
      textareaContent.value.charAt(textareaContent.value.length - 1) === "#";
    if (lastIsSharp) {
      shouldSuggestionShow.value = true;
    }
  });

  const itemClicked = ($event: Event) => {
    const target = ($event.target as HTMLSpanElement).innerText;
    // 将联想框中的内容添加到textarea中
    insertContent(target + " ");
  };

  const handleIconClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    insertContent("#");
    if (tagList.value.length === 0) {
      return false;
    }
    shouldSuggestionShow.value = true;
  };
  document.onclick = () => {
    shouldSuggestionShow.value = false;
  };
  return {
    textareaContent,
    shouldSuggestionShow,
    itemClicked,
    suggestionList,
    handleIconClick,
  };
}
