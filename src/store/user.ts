import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

import jwtDecode from "jwt-decode";
import { ILoginResp } from "@/types/api";
import { ApiUserInfo, ApiUserStatistic } from "@/api/user";
import { IUserProfile } from "@/types/user";
interface IMemoCount {
  memoCount: number;
  tagCount: number;
  day: number;
}

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: useLocalStorage("token", {
        token: "",
        expires: 0,
      }),
      userInfo: useLocalStorage("userInfo", {
        last_login: "",
        memo_count: {
          memoCount: 0,
          tagCount: 0,
          day: 0,
        } as IMemoCount,
        daily_grid: {},
        username: "浮墨用户",
      }),
      userRecord: null as (null|IUserProfile['userRecord'])
    };
  },
  actions: {
    setToken({token, expires: expiresDuration}: ILoginResp){
      if(!token) return;
      const expires = (jwtDecode(token) as unknown as any).exp * 1000;
      this.token = {
        token,
        expires,
        expiresDuration
      };
    },
    async getUserInfo() {
      const res = await ApiUserInfo();
      const { userInfo,userRecord} = res.data;
      this.userInfo= userInfo;
      this.userRecord = userRecord;
    },
    async getStatisticInfo() {
      const res = await ApiUserStatistic();
      const { memo_count, daily_grid } = res.data;
      this.userInfo.memo_count = memo_count;
      this.userInfo.daily_grid = daily_grid;
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.token.token !== "" && state.token.expires > Date.now();
    },
    username: (state) => {
      return state.userInfo.username;
    },
   dailyGrid: (state) => {
      return state.userRecord?.dailyGrid || {};
    },
    memoCount: (state) => {
      const userRecord = state.userRecord;
      if(!userRecord) return 0;
      return userRecord.memoCount
    },
    tagCount: (state) => {
       const userRecord = state.userRecord;
      if(!userRecord) return 0;
      return userRecord.tagCount
    },
    daysCount: (state) => {
      const userRecord = state.userRecord;
      if(!userRecord) return 0;
      return userRecord.day
    }
  },
});
