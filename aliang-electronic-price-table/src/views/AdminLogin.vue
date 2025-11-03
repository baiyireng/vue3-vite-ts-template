<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>管理员登录</h1>
        <p>阿良电竞价格表管理系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username" 
            v-model="loginForm.username" 
            type="text" 
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password" 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            required
          />
          <div class="password-requirements" v-if="showPasswordRequirements">
            <p>密码要求：</p>
            <ul>
              <li :class="{ valid: hasLowerCase }">至少一个小写字母</li>
              <li :class="{ valid: hasUpperCase }">至少一个大写字母</li>
              <li :class="{ valid: hasNumber }">至少一个数字</li>
              <li :class="{ valid: hasSpecialChar }">至少一个特殊字符</li>
              <li :class="{ valid: isLongEnough }">至少8个字符</li>
            </ul>
          </div>
        </div>
        
        <div class="form-group">
          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { userChangeAPI } from '../api/index';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const showPasswordRequirements = ref(false);

const loginForm = reactive({
  username: '',
  password: ''
});

// 密码强度检查
const hasLowerCase = computed(() => /[a-z]/.test(loginForm.password));
const hasUpperCase = computed(() => /[A-Z]/.test(loginForm.password));
const hasNumber = computed(() => /\d/.test(loginForm.password));
const hasSpecialChar = computed(() => /[@$!%*?&]/.test(loginForm.password));
const isLongEnough = computed(() => loginForm.password.length >= 8);

// 当密码输入时显示密码要求
watch(
  () => loginForm.password,
  (newPassword) => {
    showPasswordRequirements.value = newPassword.length > 0;
  }
);

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  // 基本的密码强度检查（仅用于提示，实际验证在后端进行）
  if (!isLongEnough.value) {
    error.value = '密码至少需要8个字符';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // 调用后端登录接口
    const data = await userChangeAPI.authLogin({
        username: loginForm.username,
        password: loginForm.password
    });
    
    if (data.success) {
      // 登录成功，保存token到localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      // 跳转到管理后台首页
      router.push('/admin/dashboard');
    } else {
      error.value = data.message || '登录失败';
    }
  } catch (err) {
    error.value = '登录失败，请检查网络连接';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: #333;
    margin-bottom: 10px;
    font-size: 24px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
}

.login-form {
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.3s;
      
      &:focus {
        outline: none;
        border-color: #667eea;
      }
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
    
    .login-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: opacity 0.3s;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &:not(:disabled):hover {
        opacity: 0.9;
      }
    }
  }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }
}
</style>