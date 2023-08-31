<script lang="ts" setup>

</script>

<template>
  <div class="page-body">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.page-body{
  @apply px-5 space-y-5 overflow-scroll;
}
</style>
