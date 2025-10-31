<template>
  <div class="category-details">
    <div class="header">
      <button @click="goBack" class="back-button">返回</button>
      <h1>{{ category?.name }}</h1>
    </div>
    
    <div class="content" v-html="category?.details"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 模拟品类数据（实际项目中应从API获取）
const categories = [
  { 
    id: '1', 
    name: '预存须知', 
    icon: new URL('@/assets/images/icon1.png', import.meta.url).href,
    description: '预存须知相关说明',
    details: '<p><strong>预存须知详细内容</strong></p><p>1. 预存款项不可退款</p><p>2. 预存款项有效期为一年</p><p>3. 预存款项可用于所有服务项目</p>'
  },
  { 
    id: '2', 
    name: '三角洲行动...', 
    icon: new URL('@/assets/images/icon2.png', import.meta.url).href,
    description: '三角洲行动相关服务',
    details: '<p><strong>三角洲行动服务详情</strong></p><p>1. 提供专业陪玩服务</p><p>2. 支持多平台游戏</p><p>3. 7x24小时在线服务</p>'
  },
  { 
    id: '3', 
    name: '三角洲护航...', 
    icon: new URL('@/assets/images/icon3.png', import.meta.url).href,
    description: '三角洲护航相关服务',
    details: '<p><strong>三角洲护航服务详情</strong></p><p>1. 全程安全护航</p><p>2. 实时技术支持</p><p>3. 专属客服服务</p>'
  },
  { 
    id: '4', 
    name: '三角洲炸单...', 
    icon: new URL('@/assets/images/icon4.png', import.meta.url).href,
    description: '三角洲炸单相关服务',
    details: '<p><strong>三角洲炸单服务详情</strong></p><p>1. 快速响应服务</p><p>2. 高效完成任务</p><p>3. 质量保证</p>'
  },
  { 
    id: '5', 
    name: '永劫无间', 
    icon: new URL('@/assets/images/icon5.png', import.meta.url).href,
    description: '永劫无间相关服务',
    details: '<p><strong>永劫无间服务详情</strong></p><p>1. 专业段位提升</p><p>2. 技巧教学指导</p><p>3. 团队配合训练</p>'
  },
  { 
    id: '6', 
    name: '无畏契约', 
    icon: new URL('@/assets/images/icon6.png', import.meta.url).href,
    description: '无畏契约相关服务',
    details: '<p><strong>无畏契约服务详情</strong></p><p>1. 竞技对战陪玩</p><p>2. 战术分析指导</p><p>3. 枪法训练提升</p>'
  },
  { 
    id: '7', 
    name: '其他游戏', 
    icon: new URL('@/assets/images/icon7.png', import.meta.url).href,
    description: '其他游戏相关服务',
    details: '<p><strong>其他游戏服务详情</strong></p><p>1. 多种游戏支持</p><p>2. 定制化服务</p><p>3. 灵活时间安排</p>'
  },
];

const route = useRoute();
const router = useRouter();
const category = ref<any>(null);

onMounted(() => {
  const categoryId = route.params.id as string;
  category.value = categories.find(c => c.id === categoryId) || null;
});

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="less">
.category-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    
    .back-button {
      background: #409eff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 20px;
      
      &:hover {
        background: #66b1ff;
      }
    }
    
    h1 {
      margin: 0;
      color: #333;
    }
  }
  
  .content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    
    :deep(h1), :deep(h2), :deep(h3) {
      color: #333;
    }
    
    :deep(p) {
      line-height: 1.6;
      color: #666;
    }
    
    :deep(strong) {
      color: #333;
    }
  }
}
</style>