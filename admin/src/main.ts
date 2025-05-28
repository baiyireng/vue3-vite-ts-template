import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 新增：导入路由实例

createApp(App)
  .use(router) // 新增：使用路由插件
  .mount('#app');
