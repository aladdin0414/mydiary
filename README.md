# MyDiary - 个人日历日记应用

一个基于 Vue 3, TypeScript, Tailwind CSS, Node.js, Express 和 PostgreSQL 构建的个人日记应用。

## 快速开始

### 环境依赖

- Node.js (v18+)
- PostgreSQL

### 后端配置

1. 进入后端目录：
   ```bash
   cd backend
   ```
2. 根据模板创建 `.env` 文件：
   ```bash
   cp .env.example .env
   ```
3. 修改 `.env` 文件中的数据库配置和其他环境变量：
   - `PORT`: 后端服务端口
   - `DB_HOST`: 数据库地址
   - `DB_PORT`: 数据库端口
   - `DB_USER`: 数据库用户名
   - `DB_PASSWORD`: 数据库密码
   - `DB_NAME`: 数据库名称
   - `JWT_SECRET`: 用于 JWT 认证的密钥

4. 安装依赖并启动：
   ```bash
   npm install
   npm run dev
   ```

### 前端配置

1. 进入前端目录：
   ```bash
   cd frontend
   ```
2. 安装依赖并启动：
   ```bash
   npm install
   npm run dev
   ```

## 项目结构

- `backend/`: Express 后端服务
- `frontend/`: Vue 3 前端应用
- `design/`: 设计稿和原型文件
- `doc/`: 项目文档
- `docker-compose.yml`: Docker 部署配置
