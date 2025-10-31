<template>
  <div class="admin-dashboard">
    <!-- <h1>阿良电竞价格表管理后台</h1>
    
    <div class="navigation">
      <router-link to="/admin/dashboard" class="nav-item" :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">首页管理</router-link>
      <router-link to="/admin/categories" class="nav-item" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">品类管理</router-link>
      <router-link to="/admin/account" class="nav-item" :class="{ active: activeTab === 'account' }" @click="activeTab = 'account'">账号管理</router-link>
      <router-link to="/admin/website" class="nav-item" :class="{ active: activeTab === 'website' }" @click="activeTab = 'website'">网站设置</router-link>
      <button @click="handleLogout" class="logout-button">退出登录</button>
    </div>
     -->
    <!-- 首页管理 -->
    <div v-if="activeTab === 'home'">
      <div class="management-section">
        <h2>图片资源管理</h2>
        <div class="image-management">
          <div class="image-item" v-for="image in images" :key="image.name">
            <label>{{ image.label }}</label>
            <div class="image-preview" @click="selectImage(image.name)">
              <img :src="image.url" :alt="image.label" v-if="image.url" />
              <div class="no-image" v-else>点击上传图片</div>
            </div>
            <input 
              type="file" 
              :ref="el => setImageInputRef(el, image.name)"
              @change="handleImageUpload($event, image.name)"
              accept="image/*"
              style="display: none"
            />
          </div>
        </div>
      </div>

      <div class="management-section">
        <h2>标题文本管理</h2>
        <div class="title-management">
          <div class="form-group">
            <label for="categorySectionTitle">品类价格表标题</label>
            <input 
              id="categorySectionTitle" 
              v-model="titles.categorySection" 
              type="text" 
              class="title-input"
              placeholder="请输入品类价格表标题"
            />
          </div>
          
          <div class="form-group">
            <label for="orderSectionTitle">下单说明标题</label>
            <input 
              id="orderSectionTitle" 
              v-model="titles.orderSection" 
              type="text" 
              class="title-input"
              placeholder="请输入下单说明标题"
            />
          </div>
        </div>
      </div>

      <div class="management-section">
        <h2>下单须知文本管理</h2>
        <div style="border: 1px solid #ccc; margin-top: 20px;">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 300px; overflow-y: hidden;"
            v-model="orderNoticeText"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>
      </div>

      <div class="form-actions">
        <button @click="saveChanges" class="save-button" :disabled="loading">
          {{ loading ? '保存中...' : '保存更改' }}
        </button>
      </div>
    </div>
    
    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { homeAPI } from '@/api/index'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 当前激活的标签页
const activeTab = ref('home')

// 编辑器实例，必须用 shallowRef
const editorRef = ref()

// 内容 HTML
const orderNoticeText = ref('<p>尊敬的贵宾，欢迎来到阿良电竞端游价格表！</p><p>如需专属陪玩服务，请到公众号【阿良电竞】【我要下单】选择【我要下单】，联系客服微信为您量身定制！</p><p>如有售后问题请直接添加下方微信号，专属售后24h为您服务～</p><p>争做一个有高度，有温度，有态度的电竞俱乐部！</p><p>阿良电竞愿您生活美满，事业步步高升，游戏场场凯旋！</p>')

const mode = ref('default')

// 工具栏配置
const toolbarConfig = {}

// 编辑器配置
const editorConfig = { 
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
    }
  }
}

// 标题文本
const titles = reactive({
  categorySection: '阿良电竞各品类价格表（点击图标查看）',
  orderSection: '阿良电竞 | 下单价格'
})

// 图片数据（仅保留首页相关图片）
const images = reactive([
  { name: 'banner', label: '首页横幅图片', url: '' },
  { name: 'orderNotice', label: '下单须知图片', url: '' },
  { name: 'contactInfo', label: '联系方式图片', url: '' },
])

// 图片上传输入框引用
const imageInputRefs = ref<{[key: string]: HTMLInputElement}>({})

// 消息提示
const message = ref('')
const isError = ref(false)
const loading = ref(false)

// 路由
const router = useRouter()

// 设置图片输入框引用
const setImageInputRef = (el: HTMLInputElement | null, name: string) => {
  if (el) {
    imageInputRefs.value[name] = el
  }
}

// 选择图片（触发文件选择）
const selectImage = (name: string) => {
  const input = imageInputRefs.value[name]
  if (input) {
    input.click()
  }
}

// 处理图片上传
const handleImageUpload = (event: Event, name: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 在实际项目中，这里应该上传到服务器
    // 这里我们使用本地预览
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      const image = images.find(img => img.name === name)
      if (image) {
        image.url = imageUrl
      }
    }
    reader.readAsDataURL(file)
    
    // 清空input值，以便下次选择同一文件也能触发change事件
    target.value = ''
  }
}

// 编辑器创建回调
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 从后端获取数据
const fetchData = async () => {
  try {
    // 获取首页图片
    const imagesResponse = await homeAPI.getImages();
    if (imagesResponse.images) {
      imagesResponse.images.forEach((image: any) => {
        const img = images.find(i => i.name === image.name);
        if (img) {
          img.url = image.url;
        }
      });
    }

    // 获取标题
    const titlesResponse = await homeAPI.getTitles();
    if (titlesResponse.titles) {
      Object.assign(titles, titlesResponse.titles);
    }

    // 获取下单须知
    const noticeResponse = await homeAPI.getOrderNotice();
    if (noticeResponse.notice) {
      orderNoticeText.value = noticeResponse.notice;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('获取数据失败');
  }
};

// 保存更改
const saveChanges = async () => {
  loading.value = true;
  try {
    // 保存图片
    for (const image of images) {
      await homeAPI.updateImage(image.name, image.url);
    }

    // 保存标题
    await homeAPI.updateTitle('categorySection', titles.categorySection);
    await homeAPI.updateTitle('orderSection', titles.orderSection);

    // 保存下单须知
    await homeAPI.updateOrderNotice(orderNoticeText.value);

    ElMessage.success('保存成功！');
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 退出登录
const handleLogout = () => {
  // 清除本地存储的token和用户信息
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  
  // 跳转到登录页
  router.push('/admin/login');
};

// 组件挂载时获取数据
onMounted(() => {
  fetchData();
});

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped lang="less">
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

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.management-section {
  margin-bottom: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title-management {
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .title-input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.3s;
      
      &:focus {
        outline: none;
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
      
      &::placeholder {
        color: #c0c4cc;
      }
    }
  }
}

.image-management {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  .image-preview {
    border: 1px dashed #ccc;
    border-radius: 4px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    
    .no-image {
      color: #999;
    }
  }
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.save-button {
  background: #409eff;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    background: #a0cfff;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background: #66b1ff;
  }
}

.message {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  color: #67c23a;
  background-color: #f0f9ec;
  
  &.error {
    color: #f56c6c;
    background-color: #fef0f0;
  }
}

@media (max-width: 768px) {
  .image-management {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .navigation {
    flex-wrap: wrap;
    
    .logout-button {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}
</style>