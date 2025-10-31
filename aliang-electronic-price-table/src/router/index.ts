import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
// 确保路径正确，使用相对路径或别名
import PriceTable from '@/views/PriceTable.vue';
import RechargeBenefits from '@/views/RechargeBenefits.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminDashboard from '@/views/admin/Dashboard.vue';
import CategoryManagement from '@/views/admin/CategoryManagement.vue';
import CategoryDetails from '@/views/CategoryDetails.vue';

// 检查用户是否已登录（基于本地存储）
const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

// 验证token有效性
const verifyToken = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return false;
  }

  try {
    // 验证token有效性
    const response = await fetch('http://localhost:3000/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

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
    path: '/admin',
    name: 'Admin',
    redirect: () => {
      // 如果已登录，重定向到仪表盘，否则重定向到登录页
      return isAuthenticated() ? '/admin/dashboard' : '/admin/login';
    }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/categories',
    name: 'CategoryManagement',
    component: CategoryManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/category/:id',
    name: 'CategoryDetails',
    component: CategoryDetails,
  },
];

const router = createRouter({
  history: createWebHistory(''), // 修改：将 process.env.BASE_URL 替换为空字符串
  routes,
});

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    if (isAuthenticated()) {
      // 验证token有效性
      const tokenValid = await verifyToken();
      if (tokenValid) {
        // Token有效，允许访问
        next();
      } else {
        // Token无效，清除本地存储并重定向到登录页
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        next('/admin/login');
      }
    } else {
      // 未登录，重定向到登录页
      next('/admin/login');
    }
  } else {
    // 不需要认证的路由，直接访问
    next();
  }
});

export default router;