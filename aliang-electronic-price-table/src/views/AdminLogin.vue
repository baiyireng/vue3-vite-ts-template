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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const loginForm = reactive({
  username: '',
  password: ''
});

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    error.value = '请输入用户名和密码';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // 模拟登录请求
    // 实际项目中这里会调用后端API进行验证
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 简单的用户名密码验证（实际项目中应调用后端接口）
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      // 登录成功，跳转到管理后台首页
      router.push('/admin/dashboard');
    } else {
      error.value = '用户名或密码错误';
    }
  } catch (err) {
    error.value = '登录失败，请稍后重试';
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