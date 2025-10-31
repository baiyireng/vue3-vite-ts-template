<template>
    <div class="recharge-benefits">
        <!-- 头部信息 -->
        <header class="header">
            <img class="header_icon" :src="category?.icon" alt="" />
            <!-- 说明 -->
            <div class="title-container">
                <h1>{{ category?.name }}</h1>
                <p>{{ category?.updated_at }}</p>
            </div>
        </header>

        <main class="recharge-benefits-content">
            <!-- 长图展示 -->
            <section v-if="category?.detail_image" class="image-section">
                <img :src="category.detail_image" alt="充值福利及礼物" />
            </section>

            <!-- 注意事项 -->
            <section class="notice-section" v-if="category?.notice">
                <h2>注意事项</h2>
                <div class="notice-content" v-html="category?.notice"></div>
            </section>
        </main>
        <!-- 免责声明 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { categoryAPI } from '@/api/index';

const route = useRoute();
const router = useRouter();
const category = ref<any>(null);

// 从后端获取品类详情
const fetchCategoryDetails = async (categoryId: number) => {
    try {
        const response = await categoryAPI.getById(categoryId);
        if (response.category) {
            category.value = response.category;
        } else {
            console.error('未找到指定品类');
        }
    } catch (error) {
        console.error('获取品类详情失败:', error);
    }
};

onMounted(() => {
    const categoryId = parseInt(route.params.id as string);
    if (categoryId) {
        fetchCategoryDetails(categoryId);
    }
});

const goBack = () => {
    router.go(-1);
};
</script>

<style scoped lang="less">
.recharge-benefits {
    font-family: Arial, sans-serif;
    color: #333;
    max-width: 1296px;
    margin: auto;

    .header {
        // text-align: center;
        padding: 48px 48px 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .header_icon {
            width: 80px;
            height: 80px;
            margin-right: 16px;
            object-fit: cover;
            border-radius: 9px;
        }

        .title-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        h1 {
            max-width: 100%;
            min-width: 400px;
            height: 38px;
            color: rgba(0, 0, 0, 0.85);
            text-overflow: ellipsis;
            word-break: break-word;
            white-space: nowrap;
            padding-top: 6px;
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
            overflow: hidden;
            margin: 0;
        }

        p {
            margin: 0;
            font-size: 14px;
            line-height: 22px;
            text-overflow: ellipsis;
            word-break: break-word;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .recharge-benefits-content {
        padding: 0 48px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    .image-section {
        margin: 20px 0;
        width: 40%;
        img {
            width: 100%;
            display: block;
        }
    }

    .notice-section {
        // padding: 20px;
        // background-color: #fff;
        // border-radius: 10px;
        // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 40%;

        h2 {
            font-size: 20px;
            margin-top: 0;
        }

        ul {
            list-style-type: none;
            padding-left: 0;

            li {
                margin: 10px 0;
            }
        }
    }
}
@media screen {
    @media (max-width: 768px) {
        .recharge-benefits {
            .header {
                padding: 0;
                margin: 20px;
                width: calc(100% - 40px);
                overflow: hidden;
            }
            .recharge-benefits-content {
                padding: 0;
                margin: 20px;
                flex-direction: column;
                align-items: center;
                .image-section {
                    width: 100%;
                }
                .notice-section {
                    width: 100%;
                }
            }
        }
    }
}
</style>