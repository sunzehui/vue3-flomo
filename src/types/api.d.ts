export interface IResponse<T = any> {
  data: T;
  code: number;
}
export type Resp<T> = Promise<IResponse<T>>;

export interface ILoginInfo {
  username: string;
  password: string;
}
export interface ILoginResp {
    token: string;
    expires: string;
}
