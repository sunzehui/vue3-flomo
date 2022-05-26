import { useUserStore } from "@/store/user";
import { Resp } from "@/types/api";
import Axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
class messageMap {
  401(code, msg) {
    ElMessage.error(`Code: ${code}, Message: ${msg}`);
  }
  400(code, msg) {
    ElMessage.error(`Code: ${code}, Message: ${msg}`);
  }
}
const baseURL = import.meta.env.VITE_APP_URL as string | undefined;

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

// // 后置拦截器（获取到响应时的拦截）
// axios.interceptors.response.use(
//   (response) => {
//     /**
//      * 根据你的项目实际情况来对 response 和 error 做处理
//      * 这里对 response 和 error 不做任何处理，直接返回
//      */
//     return response.data;
//   },
//   (error) => {
//     if (error.response && error.response.data) {
//       const code = error;
//       const msg = error.response.data.message;
//       ElMessage.error(`Code: ${code}, Message: ${msg}`);
//       console.error(`[Axios Error]`, error);
//     } else {
//       ElMessage.error(`${error}`);
//     }
//     return Promise.reject(error);
//   }
// );

export default async function <T = any>(config: AxiosRequestConfig): Resp<T> {
  try {
    const { data } = await axios.request<Resp<T>>(config);
    return data;
  } catch (error) {
    const code = error.response.status;
    const msg = error.response.data.message;
    ElMessage.error(`Code: ${code}, Message: ${msg}`);
    console.error(`[Axios Error]`, error);

    return null;
  }
}
