import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
// 确保路径正确，使用相对路径或别名
import PriceTable from '@/views/PriceTable.vue';
import RechargeBenefits from '@/views/RechargeBenefits.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminDashboard from '@/views/admin/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'PriceTable',
    component: PriceTable,
  },
  {
    path: '/recharge-benefits',
    name: 'RechargeBenefits',
    component: RechargeBenefits,
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(''), // 修改：将 process.env.BASE_URL 替换为空字符串
  routes,
});

export default router;