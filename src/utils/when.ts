import type { WatchCallback, WatchOptions, WatchSource } from 'vue'
import { watch } from 'vue'

/**
 * Shorthand for watching value to be truthy
 *
 * @see https://vueuse.org/whenever
 */
export function whenWatch<T>(source: WatchSource<T | false | null | undefined>, cb: WatchCallback<T>, options?: WatchOptions) {
  return watch(
    source,
    (v, ov, onInvalidate) => {
      if (v)
        cb(v, ov, onInvalidate)
    },
    options,
  )
}
