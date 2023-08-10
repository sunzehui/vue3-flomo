import type { PropType } from 'vue'
import { computed, defineComponent, unref } from 'vue'
import MemoCard from '@/components/ui/memo-card/index.vue'
import { CardType, EditorType } from '@/types/card-type'
import type { Article as Memo } from '@/types/article'
import MemoEditor from '@/components/MemoEditor.vue'

type PropMemo = Memo & { type: CardType; isLast: boolean }

export default defineComponent({
  props: {
    memo: Object as PropType<PropMemo>,
  },
  setup(props) {
    const isEditor = computed(() => props.memo.type === CardType.editor)
    const memo = computed(() => props.memo)
    const isLast = computed(() => props.memo.isLast)

    const component = computed(() => {
      if (!unref(memo))
        return null
      if (unref(isEditor)) {
        return <MemoEditor memo={unref(memo)} type={EditorType.edit}/>
      }
      else {
        return (
            <MemoCard
                article={unref(memo)}
                isLast={unref(isLast)}
            />
        )
      }
    })
    return () => unref(component)
  },
})
