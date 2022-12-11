<script lang="ts" setup>
import { toRefs } from 'vue'
import { useUserStore } from '@/store/user'
const { memo_count } = toRefs(useUserStore())
console.log(memo_count)

// memo: number;
// tag: number;
// day: number;
const { memo, tag, day } = memo_count
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
    .num {
      font-weight: bold;
      font-size: 24px;
      line-height: 1;
      color: #9d9d9d;
    }
    span {
      font-size: 10px;
      color: #9d9d9d;
      line-height: 2;
    }
  }
}
</style>
