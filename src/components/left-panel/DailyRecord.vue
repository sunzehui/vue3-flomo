<script lang="ts" setup>
import { ElPopper, ElTooltip } from 'element-plus'
import { computed, toRefs } from 'vue'
import { useGraph } from '@/composable/useGraph'
import { useUserStore } from '@/store/user'

const { colorSwitch, monthArray, stateGrid } = useGraph()

defineExpose({
  ElPopper,
})
</script>

<template>
  <div class="record-wrapper">
    <div v-for="(week, i) of stateGrid" :key="i" class="grid week">
      <ElTooltip
        v-for="(day, j) in week"
        :key="j"
        :content="`${day.memo_count} memo on ${day.date}`"
      >
        <span class="day" :class="{ [colorSwitch(day.memo_count)]: true }" />
      </ElTooltip>
    </div>
  </div>
  <div class="grid month-title">
    <template v-for="tag in monthArray" :key="tag">
      <span class="tag">{{ tag ? `${tag}月` : "" }}</span>
    </template>
    <span class="tag" />
  </div>
</template>

<style lang="scss" scoped>
.record-wrapper {
  margin-top: 10px;
  //   padding: 0 16px;
  height: 120px;
  width: 218px;
  display: flex;
  justify-content: space-between;
}

.grid {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.week {
  .day {
    height: 14px;
    width: 14px;

    color: #d3ecdd;
    border: 1px solid transparent;
    border-radius: 2px;
    margin-bottom: 4px;
    cursor: pointer;
  }
}

.month-title {
  flex-direction: row;

  .tag {
    color: #9d9d9d;
    font-size: 12px;
  }
}

.day {
  background: #efefef;

  &.today {
    background: #55bb8e;
  }

  &.lightGreen {
    background: #d3ecdd;
  }

  &.green {
    background: #8ddeb5;
  }

  &.darkGreen {
    background: #55bb8e;
  }
}
</style>
