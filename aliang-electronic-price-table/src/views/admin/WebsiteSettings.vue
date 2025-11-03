<template>
  <div class="website-settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>网站设置</span>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        label-width="120px"
        ref="formRef"
        :rules="rules"
      >
        <el-form-item label="网站标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入网站标题" />
        </el-form-item>
        
        <el-form-item label="网站图标" prop="favicon">
          <el-input v-model="form.favicon" placeholder="请输入网站图标URL">
            <template #append>
              <el-button @click="uploadFavicon">上传图标</el-button>
            </template>
          </el-input>
          <div class="image-preview" v-if="form.favicon">
            <img :src="form.favicon" alt="网站图标预览" />
          </div>
        </el-form-item>
        
        <el-form-item label="首页背景图" prop="background">
          <el-input v-model="form.background" placeholder="请输入背景图URL">
            <template #append>
              <el-button @click="uploadBackground">上传背景图</el-button>
            </template>
          </el-input>
          <div class="image-preview" v-if="form.background">
            <img :src="form.background" alt="背景图预览" />
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="saveSettings"
            :loading="saving"
          >
            {{ saving ? '保存中...' : '保存设置' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 图片上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传图片"
      width="500px"
    >
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :headers="{ 'Authorization': 'Bearer ' + token }"
        :show-file-list="true"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        :data="{ field: uploadField }"
        accept="image/*"
        name="image"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png 文件大小不超过 2MB
          </div>
        </template>
      </el-upload>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { websiteAPI } from '@/api/index'

// 表单引用
const formRef = ref()
const saving = ref(false)
const uploadDialogVisible = ref(false)
const uploadField = ref('') // 标记当前上传字段
const token = localStorage.getItem('token') || ''

// 上传URL
const uploadUrl = '/api/upload'

// 表单数据
const form = reactive({
  title: '',
  favicon: '',
  background: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入网站标题', trigger: 'blur' }
  ]
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
    if (response.background) {
      form.background = response.background
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    ElMessage.error('加载设置失败')
  }
}

// 保存网站设置
const saveSettings = async () => {
  try {
    saving.value = true
    await websiteAPI.updateSettings({
      title: form.title,
      favicon: form.favicon,
      background: form.background
    })
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败: ' + (error as Error).message)
  } finally {
    saving.value = false
  }
}

// 上传图标
const uploadFavicon = () => {
  uploadField.value = 'favicon'
  uploadDialogVisible.value = true
}

// 上传背景图
const uploadBackground = () => {
  uploadField.value = 'background'
  uploadDialogVisible.value = true
}

// 上传前检查
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  return isImage && isLt2M
}

// 上传成功处理
const handleUploadSuccess = (response: any, uploadFile: any) => {
  if (response && response.url) {
    // 根据上传字段更新对应表单值
    if (uploadField.value === 'favicon') {
      form.favicon = response.url
    } else if (uploadField.value === 'background') {
      form.background = response.url
    }
    ElMessage.success('图片上传成功')
    uploadDialogVisible.value = false
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 上传失败处理
const handleUploadError = (error: any) => {
  ElMessage.error('图片上传失败: ' + error.message)
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped lang="less">
.website-settings {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .image-preview {
    margin-top: 10px;
    
    img {
      max-width: 100px;
      max-height: 100px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }
  
  .upload-demo {
    text-align: center;
  }
}
</style>