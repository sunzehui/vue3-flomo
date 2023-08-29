import type { PropType } from 'vue'
import { computed, defineComponent, provide, unref } from 'vue'

import MemoCard from '@/components/ui/memo-card/index.vue'
import { CardType, EditorType } from '@/types/card-type'
import type { Article as Memo } from '@/types/article'
import MemoEditor from '@/components/ui/editor/index.vue'

type PropMemo = Memo & { type: CardType; isLast: boolean }

export default defineComponent({
  props: {
    memo: Object as PropType<PropMemo>,
  },
  setup(props) {
    const isEditor = computed(() => props.memo.type === CardType.editor)
    const memo = computed(() => props.memo)
    provide('memo', memo)

    const component = computed(() => {
      if (!unref(memo))
        return null
      if (unref(isEditor)) {
        return <MemoEditor memo={unref(memo)} type={EditorType.edit} />
      }
      else {
        return (
          <MemoCard
            memo={unref(memo)}
          />
        )
      }
    })
    return () => unref(component)
  },
})
