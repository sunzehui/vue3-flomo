<script lang="ts" setup>
import { ElTooltip, ElPopper } from "element-plus";
import { onMounted, reactive, toRefs, unref, watch, watchEffect } from "vue";

// moment 拿日期排列12 * 7次 从本周最后一天开始排
// 排到最后 reverse
// month 提取方法
// 每周弹出最后一天，然后提取全部month后去重，重复填充空字符串，不重复保留

import * as _ from "lodash";

import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

interface WeekRecord {
  date: string;
  memo_count: number;
  color?: "";
}
const createMonthArray = (start, end) => {
  const startDate = moment(start);
  const endDate = moment(end);
  const startDay = Number(startDate.format("DD"));
  let monthArray = [];

  for (let i = startDate.month() + 1; i <= endDate.month() + 1; i++) {
    if (i == startDate.month() + 1) {
      const restDay = startDate.daysInMonth() - startDay;

      const _arr = [startDate.month() + 1];
      _arr.length = _.toInteger(restDay / 7);
      monthArray = monthArray.concat(_arr);
    } else if (i == endDate.month() + 1) {
      monthArray = monthArray.concat([endDate.month() + 1, "", "", ""]);
    } else {
      monthArray = monthArray.concat([i, "", "", ""]);
    }
  }

  return reactive(monthArray);
};
// 创建初始记录表
const createStateGrid = () => {
  const endOfWeek = moment().endOf("week");

  const stateGrid = [] as WeekRecord[][];
  let lastDay = moment(endOfWeek).add(1, "day").format("YYYY-MM-DD");

  for (let i = 0; i < 12; i++) {
    stateGrid[i] = new Array();
    for (let j = 0; j < 7; j++) {
      stateGrid[i].push({ date: lastDay, memo_count: 0 });
      lastDay = moment(lastDay).subtract(1, "day").format("YYYY-MM-DD");
    }
  }
  //方便展示，颠倒顺序
  stateGrid.reverse();

  return reactive(
    stateGrid.map((week) => {
      return [...week].reverse();
    })
  );
};

let stateGrid = createStateGrid();
let monthArray = createMonthArray(stateGrid[0][0].date, stateGrid[11][6].date);
// 绿色深度样式：循环时判断daily_memo_count >10 深色，
// 5>x>10 绿色
// >5 亮绿色
const colorSwitch = (count: number): string => {
  if (count > 0 && count < 5) {
    return "lightGreen";
  } else if (count >= 5 && count < 10) {
    return "green";
  } else if (count >= 10) {
    return "darkGreen";
  }
  return "";
};
const props = defineProps<{
  grid: {
    [key: string]: number;
  };
}>();

// 从服务端拉取记录，填充到表格
const updateRocordCount = (dataGrid: WeekRecord[][]) => {
  const memoCountByDate = _.keys(unref(memoCount));

  dataGrid.forEach((week) => {
    week.forEach((record) => {
      const day = record.date;
      if (memoCountByDate.includes(day)) {
        record.memo_count = memoCount.value[day];
      }
    });
  });
};
const { grid: memoCount } = toRefs(props);

watch(
  memoCount,
  () => {
    // 页面加载完毕钩子
    // 页面加载完毕，获取服务端记录
    // 当服务端记录更新，更新表格
    updateRocordCount(stateGrid);
  },
  { immediate: true }
);

defineExpose({
  ElPopper,
});
</script>
<template>
  <div class="record-wrapper">
    <div class="week grid" v-for="(week, i) of stateGrid" :key="i">
      <el-tooltip
        :content="`${day.memo_count} memo on ${day.date}`"
        v-for="(day, j) in week"
        :key="j"
      >
        <span class="day" :class="{ [colorSwitch(day.memo_count)]: true }">
        </span>
      </el-tooltip>
    </div>
  </div>
  <div class="month-title grid">
    <template v-for="tag in monthArray" :key="tag">
      <span class="tag">{{ tag ? tag + "月" : "" }}</span>
    </template>
    <span class="tag"></span>
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
