import { px2number } from "@/utils/Tool";
import { useArticleStore } from "@/store/article";
import { storeToRefs } from "pinia";
import {onMounted, ref, Ref, unref, watch} from "vue";
import { useEditor } from "./useEditor";
import { useEventListener } from "@vueuse/core";
type pxNum = number | string;

export function useSuggestion(
  _suggestionRef: Ref<HTMLDivElement>,
 editor,
) {
  const suggestionRef = _suggestionRef;
  const articleStore = useArticleStore();
  const { tagList } = storeToRefs(articleStore);
  const {
    insertContent,textareaContent,computeSelectPos,textareaRef
  } = editor;


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

    if (containerWidth - px2number(offsetLeft) < 150) {
      offsetLeft = `calc( ${offsetLeft} + -50% )`;
    }
    if (px2number(offsetTop) > containerHeight) {
      offsetTop = containerHeight + offsetY + "px";
    }
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
  let lastKeyEmit = false;
  const onKeyDownEvent = (event: KeyboardEvent) => {
    const key = event.key;
    // 当输入#时开启联想菜单
    // console.log("key:", event);
    // console.log("code:", key.charCodeAt(0));

    if (key === "#") {
      if (unref(tagList).length === 0) {
        return false;
      }
      lastKeyEmit = true;
      shouldSuggestionShow.value = true;
      return false;
    }


    // 仅当联想菜单展示时
    if (shouldSuggestionShow.value) {
      // 删除键
      // if (key === "Backspace") {
      //   shouldSuggestionShow.value = false;
      //   return;
      // }

      if (["ArrowUp", "Enter", " ","ArrowDown"].includes(key)) {
        event.stopPropagation();
        event.preventDefault();
      }
      // 当输入“上，下“方向键时切换active标签
      if (key === "ArrowUp") {
        setItemActive(-1);
        return false;
      } else if (key === "ArrowDown") {
        setItemActive(1);
        return false
      }

      // 敲回车选中
      if (key === "Enter" || key === " ") {
        const activeItem = suggestionList.value.find((item) => item.active);
        insertContent(activeItem.content + " ");

        shouldSuggestionShow.value = false;
      }
      // 如果上次按键成功唤起tag列表，并且键入普通字符则隐藏列表
      if(lastKeyEmit){
        shouldSuggestionShow.value = false
        lastKeyEmit = false;
        return false;
      }
    }
  };
  useEventListener(textareaRef, "keydown", onKeyDownEvent);
  useEventListener(document, "click", (evt)=>{
    if (evt.target !== textareaRef.value) {
      shouldSuggestionShow.value = false;
    }
  });


  useEventListener(textareaRef, "input", (e) => {
    const lastIsSharp =
      textareaContent.value.charAt(textareaContent.value.length - 1) === "#";
    if (lastIsSharp && unref(tagList).length) {
      shouldSuggestionShow.value = true;
    }
  });

  const handleItemClick = ($event: Event) => {
    const target = ($event.target as HTMLSpanElement);
    if(target instanceof HTMLSpanElement){
      const targetValue = target.innerText;
      // 将联想框中的内容添加到textarea中
      insertContent(targetValue + " ");
      shouldSuggestionShow.value = false
    }
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


  return {
    textareaContent,
    shouldSuggestionShow,
    handleItemClick,
    suggestionList,
    handleIconClick,
  };
}
