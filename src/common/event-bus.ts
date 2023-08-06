import type { EventBusKey } from '@vueuse/core'

export const ShareCardKey: EventBusKey<{ action: string }> = Symbol('share-card')
