import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

import jwtDecode from "jwt-decode";
import { ILoginResp } from "@/types/api";
import { ApiUserInfo, ApiUserStatistic } from "@/api/user";
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
        memo_count: {} as IMemoCount,
        daily_grid: {},
        username: "浮墨用户",
      }),
      a: 7,
    };
  },
  actions: {
    setToken(_token: ILoginResp["token"]) {
      const token = _token.token;
      const expires = jwtDecode(_token.token).exp * 1000;
      this.token = {
        token,
        expires,
      };
    },
    getUserInfo() {
      ApiUserInfo().then((res) => {
        const { username } = res.data;
        this.userInfo.username = username;
      });
    },
    getStatisticInfo() {
      ApiUserStatistic().then((res) => {
        const { memo_count, daily_grid } = res.data;
        this.userInfo.memo_count = memo_count;
        this.userInfo.daily_grid = daily_grid;
      });
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.token.token !== "" && state.token.expires > Date.now();
    },
    username: (state) => {
      return state.userInfo.username;
    },
    memo_count: (state) => {
      return state.userInfo.memo_count;
    },
    daily_grid: (state) => {
      return state.userInfo.daily_grid;
    },
  },
});
