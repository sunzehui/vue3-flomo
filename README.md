# vue3-flomo ✍️
持续不断记录，意义自然浮现  —— 浮墨
## Instruction
模仿浮墨页面，尽量还原

使用：Vue3 + Nestjs + Typescript 

> 关联后端：[sunzehui/nestjs-flomo](https://github.com/sunzehui/nestjs-flomo)


支持：
- 发布memo
- 删除memo
- 标签筛选
- 登录/注册
## Preview

![主界面](./doc/main.png)


线上Demo：[预览](http://flomo.hui.zone)

## Install

1. 确保已正确启动后端项目：[sunzehui/nestjs-flomo](https://github.com/sunzehui/nestjs-flomo)

2. 安装依赖
```bash
yarn install
```
3. 配置环境变量
```bash
mv ./env.example ./env
mv ./env.development.example ./env.development
mv ./env.production.example ./env.production
```
4. 开发
```bash
yarn dev
```
5. 打包
```bash
yarn build
```
