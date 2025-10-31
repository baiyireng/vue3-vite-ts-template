<template>
  <div class="account-management">
    <el-card class="account-card">
      <template #header>
        <div class="card-header">
          <span>账号管理</span>
        </div>
      </template>
      
      <el-alert
        title="注意：修改账号信息后立即生效，无需重启服务"
        type="success"
        show-icon
        class="warning-alert"
      />
      
      <el-form 
        :model="accountForm" 
        :rules="rules" 
        ref="accountFormRef" 
        label-width="120px"
        class="account-form"
      >
        <el-form-item label="当前用户名" prop="currentUsername">
          <el-input v-model="accountForm.currentUsername" disabled />
        </el-form-item>
        
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input 
            v-model="accountForm.currentPassword" 
            type="password" 
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        
        <el-divider>修改账号信息</el-divider>
        
        <el-form-item label="新用户名" prop="newUsername">
          <el-input 
            v-model="accountForm.newUsername" 
            placeholder="请输入新用户名"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="accountForm.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码"
          />
          <div class="password-requirements">
            <p>密码要求：</p>
            <ul>
              <li :class="{ valid: hasLowerCase }">至少一个小写字母</li>
              <li :class="{ valid: hasUpperCase }">至少一个大写字母</li>
              <li :class="{ valid: hasNumber }">至少一个数字</li>
              <li :class="{ valid: hasSpecialChar }">至少一个特殊字符</li>
              <li :class="{ valid: isLongEnough }">至少8个字符</li>
            </ul>
          </div>
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="accountForm.confirmPassword" 
            type="password" 
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :loading="loading"
          >
            更新账号信息
          </el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="danger" @click="resetUsers">重置用户表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-dialog
      v-model="showSuccessDialog"
      title="操作成功"
      width="30%"
    >
      <span>账号信息已更新。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="showSuccessDialog = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

interface AccountForm {
  currentUsername: string
  currentPassword: string
  newUsername: string
  newPassword: string
  confirmPassword: string
}

const router = useRouter()
const accountFormRef = ref<FormInstance>()
const loading = ref(false)
const showSuccessDialog = ref(false)

const accountForm = reactive<AccountForm>({
  currentUsername: '',
  currentPassword: '',
  newUsername: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码强度检查
const hasLowerCase = computed(() => /[a-z]/.test(accountForm.newPassword));
const hasUpperCase = computed(() => /[A-Z]/.test(accountForm.newPassword));
const hasNumber = computed(() => /\d/.test(accountForm.newPassword));
const hasSpecialChar = computed(() => /[@$!%*?&]/.test(accountForm.newPassword));
const isLongEnough = computed(() => accountForm.newPassword.length >= 8);

// 当密码输入时显示密码要求
watch(
  () => accountForm.newPassword,
  (newPassword) => {
    // 仅在输入新密码时触发
  }
);

// 表单验证规则
const rules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newUsername: [
    { required: true, message: '请输入新用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3到20个字符之间', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码至少8个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== accountForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 获取当前用户名
const loadCurrentUser = () => {
  const user = localStorage.getItem('adminUser')
  if (user) {
    const userData = JSON.parse(user)
    accountForm.currentUsername = userData.username
    accountForm.newUsername = userData.username
  }
}

loadCurrentUser()

// 提交表单
const handleSubmit = async () => {
  if (!accountFormRef.value) return
  
  await accountFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 检查密码强度
      if (!hasLowerCase.value || !hasUpperCase.value || !hasNumber.value || 
          !hasSpecialChar.value || !isLongEnough.value) {
        ElMessage.error('新密码不符合强度要求')
        return
      }
      
      loading.value = true
      
      try {
        // 调用后端更新接口
        const response = await fetch('http://localhost:3000/api/auth/update-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentUsername: accountForm.currentUsername,
            currentPassword: accountForm.currentPassword,
            newUsername: accountForm.newUsername,
            newPassword: accountForm.newPassword
          })
        })
        
        const data = await response.json()
        
        if (data.success) {
          // 显示成功对话框
          showSuccessDialog.value = true
          
          // 更新本地存储的用户信息
          const userStr = localStorage.getItem('adminUser');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.username = accountForm.newUsername;
            user.name = '管理员';
            localStorage.setItem('adminUser', JSON.stringify(user));
          }
        } else {
          ElMessage.error(data.message || '更新失败')
        }
      } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
        console.error('Account update error:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  accountForm.newUsername = accountForm.currentUsername
  accountForm.newPassword = ''
  accountForm.confirmPassword = ''
  accountForm.currentPassword = ''
}

// 重置用户表
const resetUsers = () => {
  ElMessageBox.confirm(
    '确定要重置用户表吗？这将删除所有用户数据，下次登录时将使用环境变量中的默认账号。',
    '重置用户表',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    try {
      // 调用后端重置接口
      const response = await fetch('http://localhost:3000/api/auth/reset-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        ElMessage.success('用户表已重置')
        
        // 清除本地存储并跳转到登录页
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
      } else {
        ElMessage.error(data.message || '重置失败')
      }
    } catch (error) {
      ElMessage.error('重置失败，请稍后重试')
      console.error('User reset error:', error)
    }
  })
  .catch(() => {
    // 用户取消操作
  })
}

// 登出并跳转到登录页
const handleLogout = () => {
  showSuccessDialog.value = false
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  router.push('/admin/login')
}
</script>

<style scoped lang="less">
.account-management {
  padding: 20px;
  
  .warning-alert {
    margin-bottom: 20px;
  }
  
  .account-card {
    max-width: 600px;
    margin: 0 auto;
    
    .card-header {
      font-size: 18px;
      font-weight: bold;
    }
    
    .account-form {
      margin-top: 20px;
    }
    
    .password-requirements {
      margin-top: 10px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      font-size: 12px;
      
      p {
        margin: 0 0 5px 0;
        font-weight: bold;
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          color: #6c757d;
          
          &.valid {
            color: #28a745;
            
            &:before {
              content: "✓ ";
            }
          }
          
          &:before {
            content: "✗ ";
            color: #dc3545;
          }
        }
      }
    }
  }
  
  :deep(.el-divider__text) {
    font-size: 14px;
    font-weight: normal;
  }
}
</style>