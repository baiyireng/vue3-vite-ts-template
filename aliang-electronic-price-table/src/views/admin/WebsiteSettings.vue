<template>
  <div class="website-settings">
    <h2>网站设置</h2>
    
    <div class="form-group">
      <label for="websiteTitle">网站标题</label>
      <input 
        id="websiteTitle" 
        v-model="form.title" 
        type="text" 
        class="title-input"
        placeholder="请输入网站标题"
      />
    </div>
    
    <div class="form-group">
      <label>网站图标 (Favicon)</label>
      <div class="image-preview" @click="selectFavicon">
        <img :src="form.favicon" alt="网站图标" v-if="form.favicon" />
        <div class="no-image" v-else>点击上传图标</div>
      </div>
      <input 
        type="file" 
        ref="faviconInputRef"
        @change="handleFaviconUpload"
        accept="image/*"
        style="display: none"
      />
    </div>
    
    <div class="form-actions">
      <button @click="saveSettings" class="save-button" :disabled="loading">
        {{ loading ? '保存中...' : '保存设置' }}
      </button>
    </div>
    
    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { websiteAPI } from '@/api/index'

const form = reactive({
  title: '',
  favicon: ''
})

const faviconInputRef = ref<HTMLInputElement | null>(null)
const message = ref('')
const isError = ref(false)
const loading = ref(false)

// 选择网站图标（触发文件选择）
const selectFavicon = () => {
  if (faviconInputRef.value) {
    faviconInputRef.value.click()
  }
}

// 处理网站图标上传
const handleFaviconUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 在实际项目中，这里应该上传到服务器
    // 这里我们使用本地预览
    const reader = new FileReader()
    reader.onload = (e) => {
      form.favicon = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // 清空input值，以便下次选择同一文件也能触发change事件
    target.value = ''
  }
}

// 加载网站设置
const loadSettings = async () => {
  try {
    const response = await websiteAPI.getSettings()
    if (response.title) {
      form.title = response.title
    }
    if (response.favicon) {
      form.favicon = response.favicon
    }
  } catch (error) {
    console.error('加载网站设置失败:', error)
    ElMessage.error('加载网站设置失败')
  }
}

// 保存网站设置
const saveSettings = async () => {
  loading.value = true
  try {
    await websiteAPI.updateSettings({
      title: form.title,
      favicon: form.favicon
    })
    ElMessage.success('网站设置保存成功！')
  } catch (error) {
    console.error('保存网站设置失败:', error)
    ElMessage.error('保存网站设置失败，请重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped lang="less">
.website-settings {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-top: 0;
}

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

.image-preview {
  border: 1px dashed #ccc;
  border-radius: 4px;
  height: 150px;
  width: 150px;
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
</style>