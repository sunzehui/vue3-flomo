<script lang="ts" setup>
import { computed, toRefs, unref, watchEffect } from 'vue'
import { useUserStore } from '@/store/user'

const { userRecord } = toRefs(useUserStore())

const memo = computed(() => unref(userRecord)?.memoCount || 0)
const tag = computed(() => unref(userRecord)?.tagCount || 0)
const day = computed(() => unref(userRecord)?.day || 0)
</script>

<template>
  <div class="statistical">
    <div class="memo-num num-jar">
      <div class="num">
        {{ memo }}
      </div>
      <span>MEMO</span>
    </div>
    <div class="tag-num num-jar">
      <div class="num">
        {{ tag }}
      </div>
      <span>TAG</span>
    </div>
    <div class="day-num num-jar">
      <div class="num">
        {{ day }}
      </div>
      <span>DAY</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.statistical {
  @apply w-full flex justify-between;
  .num-jar {
    @apply text-regular-text;
    .num {
      font-weight: bold;
      font-size: 24px;
      line-height: 1;
    }
    span {
      font-size: 10px;
      line-height: 2;
    }
  }
}
</style>
