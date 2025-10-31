// API配置文件
const API_BASE_URL = 'http://localhost:3000/api';

// 首页相关API
export const homeAPI = {
  // 获取首页图片
  getImages: async () => {
    const response = await fetch(`${API_BASE_URL}/home/images`);
    return response.json();
  },

  // 更新图片URL
  updateImage: async (name: string, url: string) => {
    const response = await fetch(`${API_BASE_URL}/home/images`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, url }),
    });
    return response.json();
  },

  // 获取标题
  getTitles: async () => {
    const response = await fetch(`${API_BASE_URL}/home/titles`);
    return response.json();
  },

  // 更新标题
  updateTitle: async (section: string, title: string) => {
    const response = await fetch(`${API_BASE_URL}/home/titles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ section, title }),
    });
    return response.json();
  },

  // 获取下单须知
  getOrderNotice: async () => {
    const response = await fetch(`${API_BASE_URL}/home/order-notice`);
    return response.json();
  },

  // 更新下单须知
  updateOrderNotice: async (notice: string) => {
    const response = await fetch(`${API_BASE_URL}/home/order-notice`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notice }),
    });
    return response.json();
  },
};

// 网站设置相关API
export const websiteAPI = {
  // 获取网站设置
  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/website`);
    return response.json();
  },

  // 更新网站设置
  updateSettings: async (settings: { title: string; favicon: string }) => {
    const response = await fetch(`${API_BASE_URL}/website`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    return response.json();
  },
};

// 品类相关API
export const categoryAPI = {
  // 获取所有品类
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  // 根据ID获取品类详情
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    return response.json();
  },

  // 创建新品类
  create: async (category: any) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    return response.json();
  },

  // 更新品类
  update: async (id: number, category: any) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    return response.json();
  },

  // 删除品类
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // 更新品类排序
  updateSortOrder: async (id: number, sort_order: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}/sort-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sort_order }),
    });
    return response.json();
  },
};