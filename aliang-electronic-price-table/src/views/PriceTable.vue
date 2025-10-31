<template>
  <div class="price-table">
    <!-- 头部 -->
    <header class="header">
      <!-- 使用 import.meta.url 动态导入 banner 图片 -->
      <div class="cardContentWrapper image-wrapper">
        <img :src="bannerImg" alt="阿良电竞价格表" @click="handleClick(bannerImg)" />
      </div>
    </header>

    <!-- 主体 -->
    <main class="main">
      <section class="category-section cardBorder">
        <h2 class="widget-header">阿良电竞各品类价格表（点击图标查看）</h2>
        <ul class="category-list">
          <li
            v-for="(item, index) in categories"
            :key="index"
            @click="navigateToCategory(item)"
          >
            <img :src="item.icon" :alt="item.name" />
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </section>

      <!-- 下单须知 -->
      <section class="order-notice image-wrapper">
        <img :src="orderNoticeImg" alt="下单须知" @click="handleClick(orderNoticeImg)" />
      </section>

      <!-- 下单价格 -->
      <section class="order-price cardBorder">
        <h3 class="widget-header">阿良电竞 | 下单价格</h3>
        <div class="order-price-wrapper">
          <p>尊敬的贵宾，欢迎来到阿良电竞端游价格表！</p>
          <p>
            如需专属陪玩服务，请到公众号【阿良电竞】【我要下单】选择【我要下单】，联系客服微信为您量身定制！
          </p>
          <p>如有售后问题请直接添加下方微信号，专属售后24h为您服务～</p>
          <p>争做一个有高度，有温度，有态度的电竞俱乐部！</p>
          <p>阿良电竞愿您生活美满，事业步步高升，游戏场场凯旋！</p>
        </div>
      </section>

      <!-- 店长微信和客服微信 -->
      <section class="contact-info image-wrapper">
        <img :src="contactInfoImg" alt="店长微信和客服微信" @click="handleClick(contactInfoImg)" />
      </section>

      <!-- 免责声明 -->
      <Footer />
    </main>
    
    <!-- 模态框组件 -->
    <RechargeBenefitsModal 
      :visible="isModalVisible" 
      @close="isModalVisible = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { previewImages } from 'hevue-img-preview/v3';
import Footer from '@/components/Footer.vue';
import RechargeBenefitsModal from '@/components/RechargeBenefitsModal.vue';

const router = useRouter();
const isModalVisible = ref(false);

// 使用 import.meta.url 动态导入图片资源
const bannerImg = new URL('@/assets/images/banner.png', import.meta.url).href;
const orderNoticeImg = new URL('@/assets/images/order_notice.png', import.meta.url).href;
const contactInfoImg = new URL('@/assets/images/contact_info.png', import.meta.url).href;

// 图标资源导入
const icon1 = new URL('@/assets/images/icon1.png', import.meta.url).href;
const icon2 = new URL('@/assets/images/icon2.png', import.meta.url).href;
const icon3 = new URL('@/assets/images/icon3.png', import.meta.url).href;
const icon4 = new URL('@/assets/images/icon4.png', import.meta.url).href;
const icon5 = new URL('@/assets/images/icon5.png', import.meta.url).href;
const icon6 = new URL('@/assets/images/icon6.png', import.meta.url).href;
const icon7 = new URL('@/assets/images/icon7.png', import.meta.url).href;

// 分类数据
const categories = ref([
  { icon: icon1, name: '预存须知' },
  { icon: icon2, name: '三角洲行动...' },
  { icon: icon3, name: '三角洲护航...' },
  { icon: icon4, name: '三角洲炸单...' },
  { icon: icon5, name: '永劫无间' },
  { icon: icon6, name: '无畏契约' },
  { icon: icon7, name: '其他游戏' },
]);

// 检测是否为移动设备
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const handleClick = (img) => {
  if (!img) return;
  previewImages(img);
};

// 导航方法
const navigateToCategory = (category: any) => {
  if (category.name === '预存须知') {
    // 检测设备类型，如果是移动设备则跳转页面，否则显示模态框
    if (isMobile()) {
      router.push({ name: 'RechargeBenefits' }); // 移动端跳转页面
    } else {
      isModalVisible.value = true; // PC端显示模态框
    }
  } else {
    console.log(`Navigating to ${category.name}`);
    // 实现其他分类的导航逻辑
  }
};
</script>
<style lang="less">
body{
    background-color: #fff;
}
</style>
<style scoped lang='less'>
#app {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Apple Color Emoji', Segoe UI, Roboto, Ubuntu,
        Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei UI,
        Microsoft YaHei, Source Han Sans CN, sans-serif;
    font-variant: tabular-nums;
    line-height: 1.5715;
    background-color: #f9f9f9;
    font-feature-settings: 'tnum';
    &:after {
        content: '';
        width: 180px;
        height: 30px;
        background: rgba(254, 254, 254, 0.6);
        box-shadow: 0px 0 3px rgba(0, 0, 0, 0.1);
        transform: rotate(-5deg);
        position: absolute;
        left: 50%;
        top: -15px;
    }
}
.image-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    transition: border-radius 0.2s;
    border-radius: 0;
    img {
        object-fit: cover;
        width: 100%;
    }
}
.widget-header {
    background-image: url(@/assets/images/188757877.png);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 8px;
    font-weight: 500;
    overflow: hidden;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    margin: 0;
    h2,
    h3 {
        margin: 0;
    }
}
.price-table {
    font-family: Arial, sans-serif;
    color: #333;
    // margin: 20px;
    max-width: 1296px;
    margin: auto;
}

.header {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    padding: 48px;
    .cardContentWrapper {
        // width: calc(100% - 40px);
        margin: 20px;
    }
    img {
        object-fit: cover;
        width: 100%;
        height: 120px;
        margin: 40px 0 20px;
    }
    @media screen {
        @media (min-width: 768px) {
            img {
                object-fit: cover;
                width: 100%;
                height: 400px;
                margin: 40px 0 20px;
            }
        }
    }
}

.main {
    // background: white;
    border-radius: 10px;
    padding: 48px 48px 0;
    // padding: 20px;
    // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.cardBorder {
    position: relative;
    &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-shadow: inset 0px 0px 0px 1px #c9372e;
        position: absolute;
        z-index: 1;
        top: 0;
        pointer-events: none;
    }
}

.category-section {
    box-shadow: 0 20px 40px #00000014;
    .category-list {
        list-style: none;
        padding: 20px;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        background-color: #e9eaec;
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
            transition: transform 0.2s;
            img {
                width: 140px;
                height: 140px;
                border-radius: 50%;
                margin-bottom: 10px;
                background: #000;
                border: 3px solid #fff;
            }
            p {
                opacity: 1;
                color: #333;
                text-align: center;
                text-overflow: ellipsis;
                word-break: break-word;
                white-space: nowrap;
                flex: 0 0 20px;
                padding-top: 6px;
                font-size: 14px;
                line-height: 20px;
                overflow: hidden;
                margin: 0;
            }
            &:hover {
                transform: scale(1.05);
            }
        }
    }
}

.order-notice {
    margin-top: 96px;
    img {
        height: 180px;
    }
    @media screen {
        @media (min-width: 768px) {
            img {
                height: 600px;
            }
        }
    }
}
.contact-info {
    margin-top: 96px;
    img {
        height: 160px;
    }
    @media screen {
        @media (min-width: 768px) {
            img {
                height: 500px;
            }
        }
    }
}

.order-price {
    background: #fff;
    border-radius: 10px;
    margin: 96px 0 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    .order-price-wrapper {
        padding: 20px;
    }
}
.disclaimer_section {
    margin-top: 48px;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    justify-content: center;
    padding: 32px;
    font-size: 12px;
    display: flex;
    .weaken {
    }
    #huoban-link {
        color: rgba(0, 0, 0, 0.65);
        margin: 0 4px;
        text-decoration: none;
        list-style: none;
    }
}
@media screen {
    @media (max-width: 768px) {
        .header {
            padding: 0;
            margin: 20px;
            .cardContentWrapper {
                width: 100%;
                margin: 0;
            }
            img {
                margin: 40px 0 0px;
            }
        }
        .main {
            padding: 0;
            margin: 20px;
            .category-section {
                .category-list {
                }
            }
        }
        .contact-info {
            margin-top: 40px;
        }
        .order-price {
            margin: 48px 0 0;
        }
    }
}
</style>