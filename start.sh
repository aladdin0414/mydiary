#!/bin/bash

# 获取脚本所在目录的绝对路径，确保能在任意位置运行
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=================================="
echo "🚀 正在启动 MyDiary 前后端服务..."
echo "=================================="

# 后台启动后端服务
echo "-> 启动 Backend (端口 3000)"
cd "$DIR/backend" && npm run dev &
BACKEND_PID=$!

# 后台启动前端服务
echo "-> 启动 Frontend (端口 5173)"
cd "$DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo "----------------------------------"
echo "✅ 服务已全部挂载并在后台运行中。"
echo "请稍后在浏览器访问: http://localhost:5173"
echo "如果要停止所有服务，请直接在此终端按下 Ctrl+C。"
echo "----------------------------------"

# 捕获退出信号，清理后台进程
function cleanup() {
    echo -e "\n🛑 收到退出信号，正在停止所有服务..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

trap cleanup SIGINT SIGTERM

# 阻断主进程，防止脚本过早退出导致子进程变为孤儿进程
wait
