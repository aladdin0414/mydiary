import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import diaryRoutes from './routes/diaries';
import uploadRoutes from './routes/upload';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload directory static hosting
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// =============================================
// 生产打包环境：让后端接管前端 Vue3 构建的页面
// =============================================
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  // 放行后端自身所有核心 API 与 uploads 的静态拉取 
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return next();
  }
  // 其余任意页面（包括刷新），强制定向到 Vue 客户端软路由
  res.sendFile(path.join(frontendDist, 'index.html'));
});

export default app;
