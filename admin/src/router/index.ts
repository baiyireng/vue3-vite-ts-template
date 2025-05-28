import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
// import Home from '../views/Home.vue'; // 后续需要创建的首页组件
// import About from '../views/About.vue'; // 示例关于页组件

const routes: RouteRecordRaw[] = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: Home,
    // },
    // {
    //     path: '/about',
    //     name: 'About',
    //     component: About,
    // },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
