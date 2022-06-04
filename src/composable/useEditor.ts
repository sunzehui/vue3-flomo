import { nextTick, ref, Ref, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import { px2number } from "@/utils/Tool";
import { useRoute } from "vue-router";
export function useEditor(_textareaRef: Ref<HTMLTextAreaElement>) {
  const textareaContent = ref("");
  const textareaRef = ref(_textareaRef);

  // 设置候选项active
  watch(textareaContent, () => {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
  });

  useEventListener(textareaRef, "input", (e: InputEvent) => {
    textareaContent.value = (e.target as HTMLInputElement).value;
  });
  /**
   * 插入内容
   */
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

  const computeSelectPos = () => {
    const input = textareaRef.value;
    // 初始位置
    const {
      offsetLeft: inputX,
      offsetTop: inputY,
      selectionEnd: selectionPoint,
    } = input;
    // 生成看不见的div+sapn

    const _div = document.createElement("div");
    const copyStyle = window.getComputedStyle(input);

    let containerWidth = "0px",
      containerHeight = "0px";
    for (const item of Array.from(copyStyle)) {
      const itemProperty = copyStyle.getPropertyValue(item);
      if (item === "width") containerWidth = itemProperty;
      if (item === "height") containerHeight = itemProperty;
      _div.style.setProperty(item, itemProperty);
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
      containerWidth: px2number(containerWidth),
      containerHeight: px2number(containerHeight),
    };
  };
  const route = useRoute();
  watch(
    () => route.query,
    () => {
      const { tag } = route.query as { tag: string };
      if (tag) {
        nextTick(() => {
          textareaContent.value = "";
          insertContent(`#${tag} `);
        });
      } else {
        nextTick(() => {
          textareaContent.value = "";
        });
      }
    },
    { immediate: true }
  );
  return {
    textareaContent,
    insertContent,

    computeSelectPos,
  };
}
