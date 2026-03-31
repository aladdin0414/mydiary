# MyDiary 项目核心上下文

## 1. 项目简介
MyDiary 是一个支持心情记录（Emoji）和文本记录的轻量级日记 web 应用，支持多用户注册登录、Markdown 编辑、图片上传以及日历视图。

## 2. 技术栈核心选型
- **前端**：Vue 3 + TypeScript + Tailwind CSS，配合 Vue Router 与 Pinia。
- **后端**：Node.js + Express + Multer (上传)。
- **数据库**：PostgreSQL (使用 `pg` 库而非 ORM)
- **数据库连接信息**：
  - 地址：`192.168.1.114:45432`
  - 数据库名称：`mydiary`
  - 用户名：`postgres`
  - 密码：`Epoint123!@#`

## 3. 架构约定与规范
- 全部文档、任务计划等使用中文编写。
- 采用原生 SQL 操作数据库（如使用 `pg` 库），不使用 ORM 框架以保证查询的掌控力。
- 采用前后端分离的独立模块结构。目录结构约定如下：
  - `doc/`：需求文档及设计文档 (PRD)
  - `contexts/`：项目核心上下文
  - `frontend/`：前端 Vue 项目应用目录
  - `backend/`：后端 Express 系统目录

## 4. 项目当前状态
- **当前阶段**：需求全面敲定，正处于系统架构详细设计与实施方案（Implementation Plan）的评审阶段。
