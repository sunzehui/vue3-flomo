import {watch} from "vue";

export function whenWatch(source, cb, options?) {
    return watch(
        source,
        (v, ov, onInvalidate) => {
            if (v)
                cb(v, ov, onInvalidate)
        },
        options,
    )
}
