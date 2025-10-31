# 游戏管理后台（Admin）

## 项目简介
基于 Vue3 + TypeScript + Element Plus 开发的游戏管理后台，支持游戏信息管理、编辑、发布等核心功能。集成代码规范（ESLint + Prettier）、路由管理（Vue Router）等企业级开发配置，适合快速迭代开发。

---

## 技术栈
| 技术/工具          | 版本       | 说明                  |
|--------------------|------------|-----------------------|
| Vue.js             | ^3.5.13    | 前端框架              |
| Vue Router         | ^4.2.4     | 路由管理              |
| TypeScript         | ~5.8.3     | 类型系统              |
| Element Plus       | ^2.9.11    | 组件库                |
| Vite               | ^6.3.5     | 构建工具              |
| ESLint             | ^9.27.0    | 代码检查              |
| Prettier           | ^3.5.3     | 代码格式化            |

---

## 快速开始

### 环境要求
- Node.js ≥ 16.0.0（推荐使用 LTS 版本）
- Yarn ≥ 1.22.0（包管理工具）

### 安装与运行
```bash
# 克隆项目（若从 Git 仓库获取）
git clone <仓库地址>

# 进入项目目录
cd d:\my_project\GameManagementBackend\admin

# 安装依赖
yarn install

# 启动开发服务器（默认端口 5173）
yarn dev

# 构建生产环境包
yarn build
```

## 项目结构
```bash
admin/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/
│   │   └── index.ts
│   ├── assets/
│   │   ├── css/
│   │   │   └── index.css
│   │   └── images/
│   │       └── logo.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Dialog.vue
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.vue
│   │   │   ├── Sidebar.vue
│   │   │   └──...
│   │   └──...
│   ├── router/
│   │   └── index.ts
│   ├── store/
│   │   └── index.ts
│   ├── types/
│   │   └── index.d.ts
│   ├── views/
│   │   ├── GameList.vue
│   │   ├── GameEdit.vue
│   │   ├── GamePublish.vue
│   │   └──...
│   ├── App.vue
│   ├── main.ts
│   └──...
├── .eslintrc.js
├── .prettierrc.js
├──package.json
├──tsconfig.json
├──vite.config.ts
└──...
```

