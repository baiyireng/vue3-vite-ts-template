import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
// 确保路径正确，使用相对路径或别名
import PriceTable from '@/views/PriceTable.vue';

const routes = [
    {
        path: '/',
        name: 'PriceTable',
        component: PriceTable,
    },
];

const router = createRouter({
    history: createWebHistory(''), // 修改：将 process.env.BASE_URL 替换为空字符串
    routes,
});

export default router;