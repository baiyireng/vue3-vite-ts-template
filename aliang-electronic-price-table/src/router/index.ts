import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import PriceTable from '@/views/PriceTable.vue';
import RechargeBenefits from '@/views/RechargeBenefits.vue'; // 引入新组件

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'PriceTable',
        component: PriceTable,
    },
    {
        path: '/recharge-benefits',
        name: 'RechargeBenefits',
        component: RechargeBenefits, // 添加新路由
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;