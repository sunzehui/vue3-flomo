import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return { token: "" };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setToken(token) {
      this.token = token;
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.token !== "";
    },
  },
});
