import { ElTooltip, ElPopper } from "element-plus";
import { onMounted, reactive, ref, toRefs, unref, watch } from "vue";
import dayjs from "dayjs";
// moment 拿日期排列12 * 7次 从本周最后一天开始排
// 排到最后 reverse
// month 提取方法
// 每周弹出最后一天，然后提取全部month后去重，重复填充空字符串，不重复保留

import { toInteger, keys } from "lodash-es";
import { MaybeRef } from "@vueuse/core";

interface WeekRecord {
  date: string;
  memo_count: number;
  color?: "";
}
const createMonthArray = (start: string, end: string) => {
  //   const startDate = moment(start);
  //   const endDate = moment(end);
  //   const startDay = Number(startDate.format("DD"));

  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const startDay = Number(startDate.format("DD"));

  let monthArray = [];

  for (let i = startDate.month() + 1; i <= endDate.month() + 1; i++) {
    if (i == startDate.month() + 1) {
      const restDay = startDate.daysInMonth() - startDay;

      const _arr = [startDate.month() + 1];
      _arr.length = toInteger(restDay / 7);
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
export const createStateGrid = () => {
  const endOfWeek = dayjs().endOf("week");

  const stateGrid = [] as WeekRecord[][];
  let lastDay = dayjs(endOfWeek).add(1, "day").format("YYYY-MM-DD");

  for (let i = 0; i < 12; i++) {
    stateGrid[i] = new Array();
    for (let j = 0; j < 7; j++) {
      stateGrid[i].push({ date: lastDay, memo_count: 0 });
      lastDay = dayjs(lastDay).subtract(1, "day").format("YYYY-MM-DD");
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
export function useGraph(memoCount: MaybeRef<{ [key: string]: number }>) {
  // 从服务端拉取记录，填充到表格
  const updateRocordCount = (dataGrid: WeekRecord[][]) => {
    const memoCountByDate = keys(unref(memoCount));

    dataGrid.forEach((week) => {
      week.forEach((record) => {
        const day = record.date;
        if (memoCountByDate.includes(day)) {
          record.memo_count = memoCount.value[day];
        }
      });
    });
  };
  const grid = createStateGrid();
  let stateGrid = ref(grid);
  let monthArray = createMonthArray(grid[0][0].date, grid[11][6].date);

  watch(memoCount, () => {
    // 页面加载完毕钩子
    // 页面加载完毕，获取服务端记录
    // 当服务端记录更新，更新表格
    updateRocordCount(unref(stateGrid));
  });
  return {
    colorSwitch,
    stateGrid,
    monthArray,
  };
}
