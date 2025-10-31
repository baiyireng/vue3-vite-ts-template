<template>
    <div class="admin-dashboard">
        <h1 style="text-align: center;">阿良电竞价格表管理后台</h1>

        <div class="navigation">
            <router-link
                to="/admin/dashboard"
                class="nav-item"
                :class="{ active: activeTab === 'home' }"
                @click="activeTab = 'home'"
                >首页管理</router-link
            >
            <router-link
                to="/admin/categories"
                class="nav-item"
                :class="{ active: activeTab === 'categories' }"
                @click="activeTab = 'categories'"
                >品类管理</router-link
            >
            <router-link
                to="/admin/account"
                class="nav-item"
                :class="{ active: activeTab === 'account' }"
                @click="activeTab = 'account'"
                >账号管理</router-link
            >
            <router-link
                to="/admin/website"
                class="nav-item"
                :class="{ active: activeTab === 'website' }"
                @click="activeTab = 'website'"
                >网站设置</router-link
            >
            <button @click="handleLogout" class="logout-button">退出登录</button>
        </div>
        <slot></slot>
    </div>
</template>
<script setup>
import { ref, reactive, onBeforeUnmount, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

// 当前激活的标签页
const activeTab = ref('home');

// 编辑器实例，必须用 shallowRef
const editorRef = ref();

const router = useRouter();

// 退出登录
const handleLogout = () => {
    // 清除本地存储的token和用户信息
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    // 跳转到登录页
    router.push('/admin/login');
};
</script>
<style lang="less" scoped>
.admin-dashboard {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.navigation {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;

    .nav-item {
        padding: 10px 20px;
        text-decoration: none;
        color: #666;
        border-bottom: 3px solid transparent;

        &.active {
            color: #409eff;
            border-bottom-color: #409eff;
        }

        &:hover:not(.active) {
            color: #333;
        }
    }

    .logout-button {
        margin-left: auto;
        background: #f56c6c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background: #f78989;
        }
    }
}
</style>