# ---------- 构建阶段 ----------
FROM node:18-alpine AS builder

WORKDIR /app

# 国内镜像加速（原 registry.npm.taobao.org 已下线）
RUN npm config set registry https://registry.npmmirror.com

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- 运行阶段：用 nginx 托管静态产物 ----------
FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
