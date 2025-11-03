# 使用官方 Node.js 运行时作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装PM2
RUN npm install -g pm2

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 创建数据和图片目录
RUN mkdir -p data/images

# 暴露端口
EXPOSE 3000

# 使用PM2启动应用
CMD ["pm2-runtime", "ecosystem.config.js"]