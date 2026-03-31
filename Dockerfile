# 1. 编译前端 Vite (Vue3) 项目
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# 先复用 npm 依赖层
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
# 编译并生成 dist 目录
RUN npm run build

# 2. 构造后端服务及合并成品
FROM node:20-alpine
WORKDIR /app

# 安装后端依赖
WORKDIR /app/backend
COPY backend/package*.json ./
# 安装全量依赖以确保包含 tsx 启动器（也可以按需仅装 prod 并在构建时跑 tsc）
RUN npm install
COPY backend .

# 将阶段 1 的前端产物移交到后端平级目录下的 frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# 环境及运行设定
ENV NODE_ENV=production
EXPOSE 3000

# 直接在 backend 目录启动应用服务器
CMD ["npx", "tsx", "src/index.ts"]
