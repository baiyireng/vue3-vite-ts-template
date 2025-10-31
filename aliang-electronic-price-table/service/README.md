# 阿良电竞价格表后端服务

## 技术栈

- Node.js
- Express
- SQLite3
- Docker & Docker Compose
- PM2 (生产环境进程管理)

## 项目结构

```
service/
├── src/
│   ├── config/          # 数据库配置
│   ├── controllers/     # 控制器
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   └── index.js         # 应用入口
├── data/                # SQLite数据库文件
├── Dockerfile           # Docker配置
├── docker-compose.yml   # Docker Compose配置
├── ecosystem.config.js  # PM2配置
└── package.json         # 项目依赖
```

## API接口

### 首页管理

#### 获取所有首页图片
```
GET /api/home/images
```

#### 更新首页图片
```
PUT /api/home/images
Body: { name: '图片名称', url: '图片URL' }
```

#### 获取所有标题
```
GET /api/home/titles
```

#### 更新标题
```
PUT /api/home/titles
Body: { section: '板块名称', title: '标题内容' }
```

#### 获取下单须知文本
```
GET /api/home/order-notice
```

#### 更新下单须知文本
```
PUT /api/home/order-notice
Body: { notice: '富文本内容' }
```

### 品类管理

#### 获取所有品类
```
GET /api/categories
```

#### 创建新品类
```
POST /api/categories
Body: {
  name: '品类名称',
  description: '品类描述',
  icon: '图标URL',
  detail_image: '详情长图URL',
  details: '详情富文本',
  notice: '注意事项富文本',
  sort_order: 排序数字
}
```

#### 获取品类详情
```
GET /api/categories/:id
```

#### 更新品类
```
PUT /api/categories/:id
Body: {
  name: '品类名称',
  description: '品类描述',
  icon: '图标URL',
  detail_image: '详情长图URL',
  details: '详情富文本',
  notice: '注意事项富文本',
  sort_order: 排序数字
}
```

#### 删除品类
```
DELETE /api/categories/:id
```

#### 更新品类排序
```
PUT /api/categories/:id/sort
Body: { sort_order: 排序数字 }
```

## 部署方式

### 使用Docker部署（推荐）

```bash
# 构建并启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

### 使用PM2部署

```bash
# 安装依赖
npm install

# 启动服务
npm run pm2:start

# 查看服务状态
npm run pm2:status

# 停止服务
npm run pm2:stop
```

### 直接运行

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

## 数据库

项目使用SQLite作为数据库，数据文件存储在 `data/database.sqlite` 中。