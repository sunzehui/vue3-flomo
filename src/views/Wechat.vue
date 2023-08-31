<script lang="ts" setup>
import TopBar from '@/components/ui/topbar/index.vue'
import PageBody from '@/layouts/page-body.vue'
</script>

<template>
  <div class="memo-view">
    <TopBar title="微信" />
    <PageBody>
      微信暂未绑定
    </PageBody>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  @apply px-5;
}

.memo-view {
  height: 100%;

  nav {
    display: flex;
    padding: 0 10px;
    @apply py-3 px-5;

    justify-content: space-between;

    height: 60px;

    .input-wrapper {
      max-width: 200px;
      position: relative;
      box-sizing: border-box;

      input {
        width: 100%;
        font-size: 14px;
      }

      .input-icon {
        @apply absolute top-1/2 -translate-y-1/2 left-[10px];
        height: 40px;
        width: 25px;
        text-align: center;
        transition: all 0.3s;
        line-height: 40px;
        height: 14px;
        width: 14px;
      }
    }

    input {
      // height: 40px;
      height: 100%;
      outline: 0;
      border: none;
      background: #efefef;
      border-radius: 8px;
      padding: 0 30px;

      &:focus,
      &:active {
        outline: 0;
        box-shadow: none;
      }
    }
  }
}
</style>
