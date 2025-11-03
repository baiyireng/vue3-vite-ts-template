#!/usr/bin/env node

import { mkdir, cp, readdir, stat, rm } from 'fs/promises';
import { join, resolve } from 'path';

const __dirname = resolve();
const rootDir = __dirname;
const distDir = join(rootDir, 'dist');
const serviceDir = join(distDir, 'service');

async function copyServiceFiles() {
  console.log('开始复制服务端文件...');
  
  // 确保dist和service目录存在
  await mkdir(distDir, { recursive: true });
  await mkdir(serviceDir, { recursive: true });
  
  // 需要复制的service目录中的文件和文件夹
  const serviceFiles = [
    'src',
    // 'data',
    'package.json',
    'package-lock.json',
    'Dockerfile',
    'docker-compose.yml',
    'ecosystem.config.js',
    'README.md'
  ];
  
  for (const file of serviceFiles) {
    const srcPath = join(rootDir, 'service', file);
    const destPath = join(serviceDir, file);
    try {
      // 检查源文件是否存在
      await stat(srcPath);
      await cp(srcPath, destPath, { recursive: true });
      console.log(`已复制: ${file}`);
    } catch (error) {
      console.warn(`无法复制文件 ${file}:`, error.message);
    }
  }
  
  console.log('服务端文件复制完成');
  console.log(`服务端文件位于: ${serviceDir}`);
  console.log('部署时可进入该目录，使用以下任一方式运行:');
  console.log('1. 使用Docker: docker-compose up -d');
  console.log('2. 直接运行: npm install && npm start');
}

async function main() {
  try {
    console.log('开始构建服务端...');
    
    // 复制服务端文件
    await copyServiceFiles();
    
    console.log('服务端构建完成！');
  } catch (error) {
    console.error('构建服务端过程中出现错误:', error);
    process.exit(1);
  }
}

main();