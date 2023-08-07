import type { EventBusKey } from '@vueuse/core'

export const MEMO_CARD: EventBusKey<{ action: string }> = Symbol('memo-card')
