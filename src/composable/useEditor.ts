import {nextTick, ref, Ref, watch, watchEffect} from "vue";
import {useEventListener} from "@vueuse/core";
import {computeSelectPos} from "@/utils/editor";
import {useArticleStore} from "@/store/article";
import {EditorType} from "@/types/card-type";

interface OptionProp {
    onSave: (event?: any) => void
    type: EditorType,
}

export function useEditor(_textareaRef: Ref<HTMLTextAreaElement>, opt: OptionProp = {
    onSave: () => {
    },
    type: EditorType.create
}) {
    const textareaContent = ref("");
    const textareaRef = ref(_textareaRef);

    // 设置候选项active
    watch(textareaContent, () => {
        _textareaRef.value.style.height = "auto";
        _textareaRef.value.style.height = _textareaRef.value.scrollHeight + "px";
    });

    useEventListener(textareaRef, "input", (e: InputEvent) => {
        textareaContent.value = (e.target as HTMLInputElement).value;
    });
    /**
     * 插入内容
     */
    const insertContent = (content: string) => {
        const {selectionEnd} = textareaRef.value;
        const currentContent = textareaContent.value;
        const placement =
            currentContent.slice(0, selectionEnd) +
            content +
            currentContent.slice(selectionEnd);
        textareaContent.value = placement;
        // 插入完成后，设置光标位置
        textareaRef.value.blur();
        nextTick(() => {
            textareaRef.value.selectionEnd = selectionEnd + content.length;
            textareaRef.value.focus();
        });
    };
    useEventListener(textareaRef, "keydown", (event: KeyboardEvent) => {
        if (event.key == "Enter" && event.ctrlKey) {
            opt?.onSave();
        }
    });
    const articleStore = useArticleStore()

    if (opt?.type === EditorType.create) {
        watchEffect(() => {
            const tag = articleStore.activeTag
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
        })
    }

    return {
        textareaContent,
        textareaRef,
        insertContent,
        computeSelectPos: () => computeSelectPos(textareaRef),
    };
}
