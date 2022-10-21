<script lang="ts" setup>
import {computed} from "vue";
import {useRoute} from "vue-router";

const props = defineProps<{
  to: string,
}>()
const route = useRoute()
const itemActive = computed(() => route.path === props.to ? 'active' : '')
</script>

<template>
  <RouterLink :to="props.to">
    <div class="item" :class="itemActive">
      <i class="icon">
        <slot name="icon"></slot>
      </i>
      <slot>MEMO</slot>
    </div>
  </RouterLink>
</template>


<style scoped lang="scss">
.item {
  @apply flex items-center cursor-pointer text-sm py-2 pl-2 rounded-md;
  .icon {
    @apply mr-2 inline-block;
    width: 1em;
  }

  &:hover {
    background: #efefef;
    border-radius: 5px;
    color: #9d9d9d;
  }

  &.active {
    background: #55bb8e;
    color: white;
  }
}
</style>