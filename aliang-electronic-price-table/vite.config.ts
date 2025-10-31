import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// 新增自动导入插件
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()], // 自动导入 Element Plus 相关函数（如 ElMessage）
        }),
        Components({
            resolvers: [ElementPlusResolver()], // 自动导入 Element Plus 组件
        }),
    ],
    resolve: {
        alias: {
        '@': path.resolve(__dirname, 'src'),
        },
    }
});
