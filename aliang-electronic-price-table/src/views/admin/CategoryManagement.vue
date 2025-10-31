<template>
  <div class="category-management">
    <!-- <h1>阿良电竞价格表管理后台</h1>
    
    <div class="navigation">
      <router-link to="/admin/dashboard" class="nav-item">首页管理</router-link>
      <router-link to="/admin/categories" class="nav-item active">品类管理</router-link>
      <button @click="handleLogout" class="logout-button">退出登录</button>
    </div> -->
    
    <div class="management-section">
      <h2>品类列表</h2>
      <div class="category-list">
        <div 
          class="category-item" 
          v-for="(category, index) in categories" 
          :key="category.id"
        >
          <div class="category-info">
            <img :src="category.icon" :alt="category.name" class="category-icon" />
            <div class="category-details">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description || '暂无描述' }}</p>
            </div>
          </div>
          
          <div class="category-actions">
            <button @click="editCategory(category)" class="edit-button">编辑</button>
            <button @click="deleteCategory(category.id)" class="delete-button">删除</button>
          </div>
        </div>
        
        <div class="add-category">
          <button @click="addCategory" class="add-button">+ 添加新品类</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑品类模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingCategory.id ? '编辑品类' : '添加新品类' }}</h2>
        
        <form @submit.prevent="saveCategory" class="category-form">
          <div class="form-group">
            <label for="categoryName">品类名称</label>
            <input 
              id="categoryName" 
              v-model="editingCategory.name" 
              type="text" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="categoryDescription">品类描述</label>
            <textarea 
              id="categoryDescription" 
              v-model="editingCategory.description" 
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>品类图标</label>
            <div class="image-preview" @click="selectIcon">
              <img 
                :src="editingCategory.icon" 
                :alt="editingCategory.name" 
                v-if="editingCategory.icon" 
                class="preview-icon"
              />
              <div class="no-image" v-else>点击上传图标</div>
            </div>
            <input 
              type="file" 
              ref="iconInput"
              @change="handleIconUpload"
              accept="image/*"
              style="display: none"
            />
          </div>
          
          <div class="form-group">
            <label>详情长图（可选）</label>
            <div class="image-preview" @click="selectDetailImage">
              <img 
                :src="editingCategory.detail_image" 
                alt="详情长图" 
                v-if="editingCategory.detail_image" 
                class="preview-icon"
              />
              <div class="no-image" v-else>点击上传详情长图</div>
            </div>
            <input 
              type="file" 
              ref="detailImageInput"
              @change="handleDetailImageUpload"
              accept="image/*"
              style="display: none"
            />
          </div>
          
          <!-- <div class="form-group">
            <label for="categoryDetails">详情内容（富文本）</label>
            <div style="border: 1px solid #ccc; margin-top: 10px;">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="detailsEditorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 200px; overflow-y: hidden;"
                v-model="editingCategory.details"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleDetailsCreated"
              />
            </div>
          </div> -->
          
          <div class="form-group">
            <label for="categoryNotice">注意事项（富文本）</label>
            <div style="border: 1px solid #ccc; margin-top: 10px;">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="noticeEditorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 200px; overflow-y: hidden;"
                v-model="editingCategory.notice"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleNoticeCreated"
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeEditModal" class="cancel-button">取消</button>
            <button type="submit" class="save-button">保存</button>
          </div>
        </form>
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
import { categoryAPI } from '@/api/index'
import { useRouter } from 'vue-router'

// 编辑器实例
const editorRef = ref()
const noticeEditorRef = ref()
const detailsEditorRef = ref()

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

// 品类数据
const categories = ref([])

// 编辑中的品类
const editingCategory = reactive({
  id: 0,
  name: '',
  icon: '',
  description: '',
  detail_image: '', // 添加详情长图字段
  details: '', // 添加详情内容字段
  notice: '', // 添加注意事项字段
  sort_order: 0
})

// 模态框显示状态
const showEditModal = ref(false)

// 图标上传输入框引用
const iconInput = ref<HTMLInputElement | null>(null)
const detailImageInput = ref<HTMLInputElement | null>(null) // 添加详情长图输入框引用

// 消息提示
const message = ref('')
const isError = ref(false)

// 路由
const router = useRouter()

// 添加新品类
const addCategory = () => {
  // 重置编辑中的品类
  Object.assign(editingCategory, {
    id: 0,
    name: '',
    icon: '',
    description: '',
    detail_image: '',
    details: '',
    notice: '',
    sort_order: 0
  })
  showEditModal.value = true
}

// 编辑品类
const editCategory = (category: any) => {
  Object.assign(editingCategory, { ...category })
  showEditModal.value = true
}

// 保存品类
const saveCategory = async () => {
  if (!editingCategory.name) {
    showMessage('请输入品类名称', true)
    return
  }
  
  try {
    if (editingCategory.id) {
      // 更新现有品类
      await categoryAPI.update(editingCategory.id, editingCategory)
    } else {
      // 添加新品类
      await categoryAPI.create(editingCategory)
    }
    
    closeEditModal()
    showMessage('保存成功')
    fetchCategories() // 重新获取品类列表
  } catch (error) {
    console.error('保存失败:', error)
    showMessage('保存失败', true)
  }
}

// 删除品类
const deleteCategory = async (id: number) => {
  if (confirm('确定要删除这个品类吗？')) {
    try {
      await categoryAPI.delete(id)
      showMessage('删除成功')
      fetchCategories() // 重新获取品类列表
    } catch (error) {
      console.error('删除失败:', error)
      showMessage('删除失败', true)
    }
  }
}

// 上移品类
const moveCategoryUp = async (index: number) => {
  if (index > 0) {
    try {
      const currentCategory = categories.value[index]
      const prevCategory = categories.value[index - 1]
      
      // 交换排序
      await categoryAPI.updateSortOrder(currentCategory.id, prevCategory.sort_order)
      await categoryAPI.updateSortOrder(prevCategory.id, currentCategory.sort_order)
      
      fetchCategories() // 重新获取品类列表
    } catch (error) {
      console.error('移动失败:', error)
      showMessage('移动失败', true)
    }
  }
}

// 下移品类
const moveCategoryDown = async (index: number) => {
  if (index < categories.value.length - 1) {
    try {
      const currentCategory = categories.value[index]
      const nextCategory = categories.value[index + 1]
      
      // 交换排序
      await categoryAPI.updateSortOrder(currentCategory.id, nextCategory.sort_order)
      await categoryAPI.updateSortOrder(nextCategory.id, currentCategory.sort_order)
      
      fetchCategories() // 重新获取品类列表
    } catch (error) {
      console.error('移动失败:', error)
      showMessage('移动失败', true)
    }
  }
}

// 选择图标（触发文件选择）
const selectIcon = () => {
  if (iconInput.value) {
    iconInput.value.click()
  }
}

// 处理图标上传
const handleIconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      editingCategory.icon = imageUrl
    }
    reader.readAsDataURL(file)
    
    target.value = ''
  }
}

// 选择详情长图（触发文件选择）
const selectDetailImage = () => {
  if (detailImageInput.value) {
    detailImageInput.value.click()
  }
}

// 处理详情长图上传
const handleDetailImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      editingCategory.detail_image = imageUrl
    }
    reader.readAsDataURL(file)
    
    target.value = ''
  }
}

// 关闭编辑模态框
const closeEditModal = () => {
  showEditModal.value = false
}

// 显示消息
const showMessage = (msg: string, error: boolean = false) => {
  message.value = msg
  isError.value = error
  
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 从后端获取品类列表
const fetchCategories = async () => {
  try {
    const response = await categoryAPI.getAll()
    if (response.categories) {
      categories.value = response.categories
    }
  } catch (error) {
    console.error('获取品类列表失败:', error)
    showMessage('获取品类列表失败', true)
  }
}

// 退出登录
const handleLogout = () => {
  // 清除本地存储的token和用户信息
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  
  // 跳转到登录页
  router.push('/admin/login');
};

// 编辑器创建回调
const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// 详情内容编辑器创建回调
const handleDetailsCreated = (editor: any) => {
  detailsEditorRef.value = editor
}

// 注意事项编辑器创建回调
const handleNoticeCreated = (editor: any) => {
  noticeEditorRef.value = editor
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCategories()
})

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
  
  const noticeEditor = noticeEditorRef.value
  if (noticeEditor == null) return
  noticeEditor.destroy()
  
  const detailsEditor = detailsEditorRef.value
  if (detailsEditor == null) return
  detailsEditor.destroy()
})
</script>

<style scoped lang="less">
.category-management {
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

.category-list {
  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .category-info {
      display: flex;
      align-items: center;
      flex: 1;
      
      .category-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 20px;
        object-fit: cover;
      }
      
      .category-details {
        h3 {
          margin: 0 0 5px 0;
          color: #333;
        }
        
        p {
          margin: 0;
          color: #999;
          font-size: 14px;
        }
      }
    }
    
    .category-actions {
      button {
        margin-left: 10px;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &.edit-button {
          background: #409eff;
          color: white;
          
          &:hover {
            background: #66b1ff;
          }
        }
        
        &.move-up-button, &.move-down-button {
          background: #67c23a;
          color: white;
          
          &:disabled {
            background: #dcdfe6;
            cursor: not-allowed;
          }
          
          &:hover:not(:disabled) {
            background: #85ce61;
          }
        }
        
        &.delete-button {
          background: #f56c6c;
          color: white;
          
          &:hover {
            background: #f78989;
          }
        }
      }
    }
  }
  
  .add-category {
    text-align: center;
    padding: 20px;
    
    .add-button {
      background: #67c23a;
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background: #85ce61;
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  
  h2 {
    margin-top: 0;
    color: #333;
  }
  
  .category-form {
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
      }
      
      input, textarea {
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
      
      textarea {
        resize: vertical;
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
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
      
      button {
        padding: 12px 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        
        &.cancel-button {
          background: #909399;
          color: white;
          
          &:hover {
            background: #a6a9ad;
          }
        }
        
        &.save-button {
          background: #409eff;
          color: white;
          
          &:hover {
            background: #66b1ff;
          }
        }
      }
    }
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
  .category-item {
    flex-direction: column;
    align-items: flex-start;
    
    .category-info {
      margin-bottom: 15px;
    }
    
    .category-actions {
      align-self: stretch;
      display: flex;
      justify-content: space-between;
      
      button {
        margin: 0;
        flex: 1;
        
        &:not(:last-child) {
          margin-right: 5px;
        }
      }
    }
  }
  
  .modal-content {
    width: 95%;
    padding: 20px;
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