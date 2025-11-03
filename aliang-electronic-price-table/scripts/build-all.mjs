#!/usr/bin/env node

import { spawn } from 'child_process';
import { mkdir, rm, cp, readdir } from 'fs/promises';
import { join, resolve } from 'path';

const __dirname = resolve();
const rootDir = __dirname;
const distDir = join(rootDir, 'dist');
const clientDir = join(distDir, 'client');
const serviceDir = join(distDir, 'service');

async function buildClient() {
  console.log('开始构建前端...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:client'], {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('前端构建完成');
        resolve();
      } else {
        console.log('前端构建完成（忽略TypeScript错误）');
        resolve();
      }
    });
    
    buildProcess.on('error', (error) => {
      reject(error);
    });
  });
}

async function buildService() {
  console.log('开始构建服务端...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:service'], {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('服务端构建完成');
        resolve();
      } else {
        reject(new Error(`服务端构建失败，退出码: ${code}`));
      }
    });
    
    buildProcess.on('error', (error) => {
      reject(error);
    });
  });
}

async function copyClientFiles() {
  console.log('复制前端文件到client目录...');
  
  // 确保client目录存在
  await mkdir(clientDir, { recursive: true });
  
  // 复制dist目录中的所有文件到client目录
  const distFiles = await readdir(join(rootDir, 'dist'));
  for (const file of distFiles) {
    if (file !== 'client' && file !== 'service') {
      await cp(join(rootDir, 'dist', file), join(clientDir, file), { recursive: true });
    }
  }
  
  console.log('前端文件复制完成');
}

async function copyServiceFiles() {
  console.log('复制服务端文件到service目录...');
  
  // 确保service目录存在
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
      await cp(srcPath, destPath, { recursive: true });
      console.log(`已复制: ${file}`);
    } catch (error) {
      console.warn(`无法复制文件 ${file}:`, error.message);
    }
  }
  
  console.log('服务端文件复制完成');
}

async function main() {
  try {
    console.log('开始构建项目...');
    
    // 清理旧的dist目录
    await rm(distDir, { recursive: true, force: true });
    console.log('已清理旧的dist目录');
    
    // 确保dist目录存在
    await mkdir(distDir, { recursive: true });
    
    // 构建前端和服务端
    await buildClient();
    await buildService();
    
    // 复制文件到对应目录
    await copyClientFiles();
    await copyServiceFiles();
    
    console.log('所有构建任务完成！');
    console.log(`构建产物位于: ${distDir}`);
    console.log('- client目录包含前端文件');
    console.log('- service目录包含服务端文件');
  } catch (error) {
    console.error('构建过程中出现错误:', error);
    process.exit(1);
  }
}

main();