/**
 * 用户认证工具函数
 */

// 从本地存储获取当前用户
export const getCurrentUser = () => {
  try {
    // 尝试从localStorage获取用户信息
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      return JSON.parse(userString);
    }

    // 如果没有保存用户信息，返回模拟的默认用户
    // 这主要用于开发环境
    return {
      id: "1",
      name: "Jackson",
      email: "Jackson@yahoo.com",
      avatar: null,
      workspace: "default",
      vip: false,
      phone: "13800138000",
      role: "user",
      preferences: {},
      last_login: { seconds: "1714377600" },
      created_at: { seconds: "1704067200" },
      updated_at: { seconds: "1714377600" }
    };
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    return null;
  }
};

// 设置当前用户到本地存储
export const setCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    return true;
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return false;
  }
};

// 检查用户是否已登录
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user;
};

// 用户登出
export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  // 其他需要清理的存储项...
};

// 获取认证token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// 设置认证token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}; 