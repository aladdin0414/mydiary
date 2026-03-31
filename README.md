# MyDiary - 个人日志应用 / Personal Diary Application

[中文](#中文) | [English](#english)

---

## 中文

一个基于 Vue 3, TypeScript, Tailwind CSS, Node.js, Express 和 PostgreSQL 构建的个人日记应用。

### 快速开始

#### 环境依赖

- Node.js (v18+)
- PostgreSQL

#### 后端配置

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

#### 前端配置

1. 进入前端目录：
   ```bash
   cd frontend
   ```
2. 安装依赖并启动：
   ```bash
   npm install
   npm run dev
   ```

### 项目结构

- `backend/`: Express 后端服务
- `frontend/`: Vue 3 前端应用
- `design/`: 设计稿和原型文件
- `doc/`: 项目文档
- `docker-compose.yml`: Docker 部署配置

---

## English

A personal diary application built with Vue 3, TypeScript, Tailwind CSS, Node.js, Express, and PostgreSQL.

### Quick Start

#### Requirements

- Node.js (v18+)
- PostgreSQL

#### Backend Configuration

1. Move to the backend directory:
   ```bash
   cd backend
   ```
2. Create your `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Modify the database settings and other environment variables in `.env`:
   - `PORT`: Backend service port
   - `DB_HOST`: Database host address
   - `DB_PORT`: Database port
   - `DB_USER`: Database username
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: Database name
   - `JWT_SECRET`: Secret key for JWT authentication

4. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```

#### Frontend Configuration

1. Move to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

### Project Structure

- `backend/`: Express backend service
- `frontend/`: Vue 3 frontend application
- `design/`: Design drafts and prototypes
- `doc/`: Project documentation
- `docker-compose.yml`: Docker deployment configuration
