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
    },
    build: {
        outDir: 'dist/client', // 指定输出目录
        assetsDir: 'assets', // 指定静态资源目录
        rollupOptions: {
            output: {
                // 分包
                manualChunks: {
                    'vue-vendor': ['vue', 'vue-router'],
                    'element-plus-vendor': ['element-plus'],
                    'editor-vendor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
                }
            }
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        }
    }
});