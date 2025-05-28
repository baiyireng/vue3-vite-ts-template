<script setup lang="ts">
</script>

<template>
    <div>
        <!-- 导航链接 -->
        <nav>
            <router-link to="/">首页</router-link> |
            <router-link to="/about">关于</router-link>
        </nav>

        <!-- 路由视图（关键） -->
        <router-view />
    </div>
</template>

<style scoped>
nav {
    padding: 1rem;
    font-size: 1.2em;
}
</style>