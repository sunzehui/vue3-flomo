import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { Resp } from "@/types/api";
import Axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import { router } from "../routes";
const baseURL = import.meta.env.VITE_BASE_URL as string | undefined;

const axios = Axios.create({
  baseURL,
  timeout: 20000, // 请求超时 20s
});
// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config) => {
    const UserStore = useUserStore();

    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
    config.headers["Authorization"] = `Bearer ${UserStore.token.token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default async function <T = any>(config: AxiosRequestConfig): Resp<T> {
  try {
    const { data } = await axios.request<Resp<T>>(config);

    return data;
  } catch (error) {
    const code = error.response.status;
    const msg = error.response.data.message;
    console.error(`[Axios Error]`, error);
    if (code === 401) {
      ElMessage.error(`Code: ${code}, Message: 未登录或验证已过期请去登录！`);

      router.push({
        path: "/login",
      });
      return;
    }
    ElMessage.error(`Code: ${code}, Message: ${msg}`);

    return null;
  }
}
