import { AxiosResponse } from "axios";

interface IResponse<T = any> {
  data: T;
  code: number;
}
type Resp<T> = Promise<IResponse<T>>;

interface ILoginInfo {
  username: string;
  password: string;
}
interface ILoginResp {
    token: string;
    expires: string;
}
