<template>
  <div class="category-management">
    <h1>阿良电竞价格表管理后台</h1>
    
    <div class="navigation">
      <router-link to="/admin/dashboard" class="nav-item">首页管理</router-link>
      <router-link to="/admin/categories" class="nav-item active">品类管理</router-link>
    </div>
    
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
            <button @click="moveCategoryUp(index)" :disabled="index === 0" class="move-up-button">上移</button>
            <button @click="moveCategoryDown(index)" :disabled="index === categories.length - 1" class="move-down-button">下移</button>
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
                :src="editingCategory.detailImage" 
                alt="详情长图" 
                v-if="editingCategory.detailImage" 
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
import { ref, reactive, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

// 编辑器实例
const editorRef = ref()
const noticeEditorRef = ref()

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
const categories = ref([
  { 
    id: '1', 
    name: '预存须知', 
    icon: new URL('@/assets/images/icon1.png', import.meta.url).href,
    description: '预存须知相关说明',
    detailImage: '', // 添加详情长图字段
    notice: '<ul><li>个存只可消费固定陪</li><li>店存可转为个存超过520r，赠送陪陪微信*1</li><li>个存转店存需要扣除20%手续费</li><li>陪陪个存清空自愿保留绑板微信</li><li>备注：存单志择退款，退款需扣除20%服务费</li></ul>' // 添加注意事项字段
  },
  { 
    id: '2', 
    name: '三角洲行动...', 
    icon: new URL('@/assets/images/icon2.png', import.meta.url).href,
    description: '三角洲行动相关服务',
    detailImage: '',
    notice: ''
  },
  { 
    id: '3', 
    name: '三角洲护航...', 
    icon: new URL('@/assets/images/icon3.png', import.meta.url).href,
    description: '三角洲护航相关服务',
    detailImage: '',
    notice: ''
  },
  { 
    id: '4', 
    name: '三角洲炸单...', 
    icon: new URL('@/assets/images/icon4.png', import.meta.url).href,
    description: '三角洲炸单相关服务',
    detailImage: '',
    notice: ''
  },
  { 
    id: '5', 
    name: '永劫无间', 
    icon: new URL('@/assets/images/icon5.png', import.meta.url).href,
    description: '永劫无间相关服务',
    detailImage: '',
    notice: ''
  },
  { 
    id: '6', 
    name: '无畏契约', 
    icon: new URL('@/assets/images/icon6.png', import.meta.url).href,
    description: '无畏契约相关服务',
    detailImage: '',
    notice: ''
  },
  { 
    id: '7', 
    name: '其他游戏', 
    icon: new URL('@/assets/images/icon7.png', import.meta.url).href,
    description: '其他游戏相关服务',
    detailImage: '',
    notice: ''
  },
])

// 编辑中的品类
const editingCategory = reactive({
  id: '',
  name: '',
  icon: '',
  description: '',
  detailImage: '', // 添加详情长图字段
  notice: '' // 添加注意事项字段
})

// 模态框显示状态
const showEditModal = ref(false)

// 图标上传输入框引用
const iconInput = ref<HTMLInputElement | null>(null)
const detailImageInput = ref<HTMLInputElement | null>(null) // 添加详情长图输入框引用

// 消息提示
const message = ref('')
const isError = ref(false)

// 添加新品类
const addCategory = () => {
  // 重置编辑中的品类
  Object.assign(editingCategory, {
    id: '',
    name: '',
    icon: '',
    description: '',
    detailImage: '',
    notice: ''
  })
  showEditModal.value = true
}

// 编辑品类
const editCategory = (category: any) => {
  Object.assign(editingCategory, { ...category })
  showEditModal.value = true
}

// 保存品类
const saveCategory = () => {
  if (!editingCategory.name) {
    showMessage('请输入品类名称', true)
    return
  }
  
  if (editingCategory.id) {
    // 更新现有品类
    const index = categories.value.findIndex(c => c.id === editingCategory.id)
    if (index !== -1) {
      categories.value[index] = { ...editingCategory }
    }
  } else {
    // 添加新品类
    const newCategory = {
      ...editingCategory,
      id: Date.now().toString()
    }
    categories.value.push(newCategory)
  }
  
  closeEditModal()
  showMessage('保存成功')
}

// 删除品类
const deleteCategory = (id: string) => {
  if (confirm('确定要删除这个品类吗？')) {
    categories.value = categories.value.filter(c => c.id !== id)
    showMessage('删除成功')
  }
}

// 上移品类
const moveCategoryUp = (index: number) => {
  if (index > 0) {
    const temp = categories.value[index]
    categories.value[index] = categories.value[index - 1]
    categories.value[index - 1] = temp
  }
}

// 下移品类
const moveCategoryDown = (index: number) => {
  if (index < categories.value.length - 1) {
    const temp = categories.value[index]
    categories.value[index] = categories.value[index + 1]
    categories.value[index + 1] = temp
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
      editingCategory.detailImage = imageUrl
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

// 编辑器创建回调
const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// 注意事项编辑器创建回调
const handleNoticeCreated = (editor: any) => {
  noticeEditorRef.value = editor
}

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
  
  const noticeEditor = noticeEditorRef.value
  if (noticeEditor == null) return
  noticeEditor.destroy()
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
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 15px;
    
    .category-info {
      display: flex;
      align-items: center;
      flex: 1;
      
      .category-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 15px;
        object-fit: cover;
      }
      
      .category-details {
        h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
        }
        
        p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      }
    }
    
    .category-actions {
      display: flex;
      gap: 10px;
      
      button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .edit-button {
        background: #409eff;
        color: white;
        
        &:hover {
          background: #66b1ff;
        }
      }
      
      .move-up-button,
      .move-down-button {
        background: #e6a23c;
        color: white;
        
        &:hover:not(:disabled) {
          background: #ebb563;
        }
        
        &:disabled {
          background: #f5f5f5;
          color: #ccc;
          cursor: not-allowed;
        }
      }
      
      .delete-button {
        background: #f56c6c;
        color: white;
        
        &:hover {
          background: #f78989;
        }
      }
    }
  }
  
  .add-category {
    text-align: center;
    margin-top: 20px;
    
    .add-button {
      background: #67c23a;
      color: white;
      border: none;
      padding: 10px 20px;
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  
  h2 {
    margin-top: 0;
    text-align: center;
  }
  
  .category-form {
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      input,
      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
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
        
        .preview-icon {
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
      justify-content: center;
      gap: 20px;
      margin-top: 30px;
      
      button {
        padding: 10px 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }
      
      .cancel-button {
        background: #909399;
        color: white;
        
        &:hover {
          background: #a6a9ad;
        }
      }
      
      .save-button {
        background: #409eff;
        color: white;
        
        &:hover {
          background: #66b1ff;
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
</style>