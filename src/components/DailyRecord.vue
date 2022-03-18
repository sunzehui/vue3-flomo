<script lang="ts" setup>
import { ElTooltip } from "element-plus";
import "element-plus/es/components/Tooltip/style/css";
import { onMounted, reactive } from "vue-demi";
// moment 拿日期排列12 * 7次 从本周最后一天开始排
// 排到最后 reverse
// month 提取方法
// 每周弹出最后一天，然后提取全部month后去重，重复填充空字符串，不重复保留

import moment from "moment";
import * as _ from "lodash";
interface WeekRecord {
  date: string;
  memo_count: number;
  color?: "";
}
// 创建初始记录表
const createStateGrid = () => {
  const endOfWeek = moment().endOf("week");

  const stateGrid = [] as WeekRecord[][];
  let lastDay = moment(endOfWeek).add(1, "day").format("YYYY/MM/DD");
  for (let i = 0; i < 12; i++) {
    stateGrid[i] = new Array();
    for (let j = 0; j < 7; j++) {
      stateGrid[i].push({ date: lastDay, memo_count: 0 });
      lastDay = moment(lastDay).subtract(1, "day").format("YYYY/MM/DD");
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

// 从服务端拉取记录，填充到表格
const updateRocordCount = (dataGrid: WeekRecord[][]) => {
  const data = reactive({
    memo_count: 10,
    daily_memo_count: {
      "2022\/03\/17": 1,
      "2022\/03\/16": 1,
      "2022\/03\/13": 3,
      "2022\/03\/08": 5,
    },
  });
  const memoCount = data?.daily_memo_count;
  const memoCountByDate = _.keys(memoCount);

  dataGrid.forEach((week) => {
    week.forEach((record) => {
      const day = record.date;
      if (memoCountByDate.includes(day)) {
        record.memo_count = memoCount[day];
      }
    });
  });
};
onMounted(() => {
  // 页面加载完毕钩子
  updateRocordCount(stateGrid);
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
        <el-button class="day" :class="{ [colorSwitch(day.memo_count)]: true }">
        </el-button>
      </el-tooltip>
    </div>
  </div>
  <div class="month-title grid">
    <span class="tag">1月</span>
    <span class="tag"></span>
    <span class="tag"></span>
    <span class="tag"></span>
    <span class="tag"></span>
    <span class="tag">2月</span>
    <span class="tag"></span>
    <span class="tag"></span>
    <span class="tag"></span>
    <span class="tag">3月</span>
    <span class="tag"></span>
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
