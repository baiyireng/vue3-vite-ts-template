<template>
  <div class="admin-dashboard">
    <el-main>
          <!-- 首页管理 -->
          <div v-if="activeMenu === '1'">
            <div class="management-section">
              <h3>图片资源管理</h3>
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
              <h3>标题文本管理</h3>
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
              <h3>下单须知文本管理</h3>
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
              <el-button 
                type="primary" 
                @click="saveChanges"
                :loading="loading"
              >
                {{ loading ? '保存中...' : '保存更改' }}
              </el-button>
            </div>
            
            <div v-if="message" class="message" :class="{ error: isError }">
              {{ message }}
            </div>
          </div>
          
          <!-- 品类管理 -->
          <div v-else-if="activeMenu === '2'">
            <CategoryManagement />
          </div>
          
          <!-- 网站设置 -->
          <div v-else-if="activeMenu === '3'">
            <WebsiteSettings />
          </div>
          
          <!-- 账号管理 -->
          <div v-else-if="activeMenu === '4'">
            <AccountManagement />
          </div>
        </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, onMounted, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { homeAPI } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
import { House, Grid, User, Setting } from '@element-plus/icons-vue'
import { ElContainer, ElAside, ElMain, ElHeader, ElMenu, ElMenuItem, ElIcon, ElButton, ElMessage } from 'element-plus'
import CategoryManagement from './CategoryManagement.vue'
import WebsiteSettings from './WebsiteSettings.vue'
import AccountManagement from './AccountManagement.vue'

// 菜单标题映射
const menuTitles: Record<string, string> = {
  '1': '首页管理',
  '2': '品类管理',
  '3': '网站设置',
  '4': '账号管理'
}

// 计算属性：当前页面标题
const pageTitle = computed(() => menuTitles[activeMenu.value])

// 编辑器实例，必须用 shallowRef
const editorRef = ref()

// 获取当前用户信息
const userStr = localStorage.getItem('adminUser')
const user = userStr ? JSON.parse(userStr) : null
const username = user?.username || '管理员'

// 当前路由
const route = useRoute()
const router = useRouter()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  const path = route.path
  if (path.includes('categories')) return '2'
  if (path.includes('account')) return '4'
  if (path.includes('website')) return '3'
  return '1'
})

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
const handleImageUpload = async (event: Event, name: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    try {
      // 创建FormData对象用于上传文件
      const formData = new FormData()
      formData.append('image', file)
      
      // 上传图片到服务器
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.url) {
        // 更新图片URL
        const image = images.find(img => img.name === name)
        if (image) {
          image.url = result.url
        }
        ElMessage.success('图片上传成功')
      } else {
        ElMessage.error('图片上传失败')
      }
    } catch (error) {
      console.error('上传失败:', error)
      ElMessage.error('上传失败: ' + (error as Error).message)
    }
    
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

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  switch (index) {
    case '1':
      router.push('/admin/dashboard');
      break;
    case '2':
      router.push('/admin/categories');
      break;
    case '3':
      router.push('/admin/website');
      break;
    case '4':
      router.push('/admin/account');
      break;
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

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="less">
.admin-dashboard {
  height: 100vh;
  
  .logo {
    color: white;
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #444;
  }
  
  .el-header {
    background-color: #fff;
  }
  
  .page-header h2 {
    margin: 0;
    color: #333;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
}

.management-section {
  margin-bottom: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.image-management {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  
  .image-item {
    display: flex;
    flex-direction: column;
    
    label {
      margin-bottom: 10px;
      font-weight: 500;
      color: #333;
    }
    
    .image-preview {
      width: 100%;
      height: 150px;
      border: 2px dashed #d9d9d9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      
      &:hover {
        border-color: #409eff;
      }
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
      
      .no-image {
        color: #999;
        font-size: 14px;
      }
    }
  }
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

.form-actions {
  text-align: center;
  margin-top: 30px;
  
  .save-button {
    padding: 12px 30px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover:not(:disabled) {
      background-color: #66b1ff;
    }
    
    &:disabled {
      background-color: #a0cfff;
      cursor: not-allowed;
    }
  }
}

.message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 4px;
  text-align: center;
  
  &.error {
    background-color: #fef0f0;
    color: #f56c6c;
    border: 1px solid #fde2e2;
  }
  
  &:not(.error) {
    background-color: #f0f9eb;
    color: #67c23a;
    border: 1px solid #e1f3d8;
  }
}
</style>