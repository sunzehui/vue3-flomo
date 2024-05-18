<script lang="ts" setup>
import { ElPopper, ElTooltip } from 'element-plus'
import { computed, ref, toRefs, unref } from 'vue'
import type { DayRecord } from '@/composable/useGraph'
import { useGraph } from '@/composable/useGraph'

const { colorSwitch, monthArray, stateGrid } = useGraph()

const hoveredDay = ref<DayRecord>(null)
const boxRef = ref(null)
const hoveredDayMsg = computed(() => {
  const day = unref(hoveredDay)
  if (!day)
    return ''
  return `${day?.memo_count} memo on ${day?.date}`
})

const showTooltip = (e, i, j) => {
  hoveredDay.value = stateGrid[i][j]
  boxRef.value = e.currentTarget
}

const hideTooltip = (i, j) => {
  hoveredDay.value = null
}

defineExpose({
  ElPopper,
})
</script>

<template>
  <div class="record-wrapper">
    <ElTooltip
      :content="hoveredDayMsg"
      :visible="hoveredDay !== null"
      :popper-options="{
        modifiers: [
          {
            name: 'computeStyles',
            options: {
              adaptive: false,
              enabled: false,
            },
          },
        ],
      }"
      :virtual-ref="boxRef"
      virtual-triggering
      popper-class="singleton-tooltip"
    >
      <template #content>
        <span> {{ hoveredDayMsg }} </span>
      </template>
    </ElTooltip>
    <div v-for="(week, i) of stateGrid" :key="i" class="grid week activity-color">
      <span
        v-for="(day, j) in week"
        :key="j"
        class="day"
        :class="{ [colorSwitch(day.memo_count)]: true }"
        @mouseleave="hideTooltip(i, j)"
        @mouseenter="showTooltip($event, i, j)"
      />
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
.checking {
    @apply w-full;
  }
.record-wrapper {
  margin-top: 10px;
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: space-between;

    height: 140px;
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

.activity-color .day {
  @apply bg-dark-fill-2;

  &.today {
    @apply bg-primary ;
  }

  &.lightGreen {
    @apply bg-primary-light-1 ;
  }

  &.green {
    @apply bg-primary-light-2
  }

  &.darkGreen {
    @apply bg-primary ;
  }
}
</style>

