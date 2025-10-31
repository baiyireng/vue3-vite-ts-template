<template>
    <div class="recharge-benefits">
        <!-- 头部信息 -->
        <header class="header">
            <img class="header_icon" :src="icon1" alt="" />
            <!-- 说明 -->
            <div class="title-container">
                <h1>充值福利及礼物</h1>
                <p>2025-06-14 15:18</p>
            </div>
        </header>

        <main class="recharge-benefits-content">
            <!-- 长图展示 -->
            <section class="image-section">
                <img :src="rechargeBenefitsImg" alt="充值福利及礼物" />
            </section>

            <!-- 注意事项 -->
            <section class="notice-section">
                <h2>注意事项</h2>
                <ul>
                    <li>个存只可消费固定陪</li>
                    <li>店存可转为个存超过520r，赠送陪陪微信*1</li>
                    <li>个存转店存需要扣除20%手续费</li>
                    <li>陪陪个存清空自愿保留绑板微信</li>
                    <li>备注：存单志择退款，退款需扣除20%服务费</li>
                </ul>
            </section>
        </main>
        <!-- 免责声明 -->
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Footer from '@/components/Footer.vue';
const icon1 = new URL('@/assets/images/icon1.png', import.meta.url).href;

// 使用 import.meta.url 动态导入图片资源
const rechargeBenefitsImg = new URL('@/assets/images/recharge_benefits.png', import.meta.url).href;
</script>
<style lang="less">
body{
    // background-color: rgb(59 184 246 / 22%);
}
</style>
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
        .recharge-benefits{
            .recharge-benefits-content{
                flex-direction: column;
                align-items: center;
                .image-section{
                    width: 100%;
                }
                .notice-section{
                    width: 100%;
                }
    
            }
        }
    }
}
</style>