/**
 * 认证服务
 * 处理JWT Token的存储和获取
 */

import { workspacesData } from '../mocks/data';
import * as timService from './timService';

// Token存储键名
const TOKEN_KEY = 'syntrust_auth_token';
const USER_KEY = 'syntrust_user';
const AUTH_STATUS = 'syntrust_login_status';

/**
 * 保存认证信息
 * @param {Object} authData - 认证数据，包含token和user
 */
export const saveAuth = (authData) => {
  if (authData.token) {
    localStorage.setItem(TOKEN_KEY, authData.token);
  }
  
  if (authData.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  }
  
  // 设置登录状态
  localStorage.setItem(AUTH_STATUS, 'true');
};

/**
 * 获取认证Token
 * @returns {string|null} - JWT Token或null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 获取当前用户信息
 * @returns {Object|null} - 用户信息或null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('解析用户信息失败:', error);
    return null;
  }
};

/**
 * 检查是否已认证
 * @returns {boolean} - 是否已认证
 */
export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_STATUS) === 'true';
};

/**
 * 清除认证信息
 */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_STATUS);
};

/**
 * 登录
 * @param {Object} credentials - 登录凭证，包含username和password
 * @returns {Promise} - 登录结果
 */
export const login = async (credentials) => {
  return new Promise((resolve, reject) => {
    // 支持admin账号
    if (credentials.username === 'admin@example.com' && credentials.password === 'Admin@123456') {
      const mockResponse = {
        token: 'mock_jwt_token',
        user: {
          id: 'test-123456', // IM userID
          name: '测评员-1',
          email: 'admin@example.com',
          role: 'admin',
          workspace: '' ,
          user_signature: 'eJwtzFELgjAUhuH-sttKzjbPdEIXQRBSF1FGdRltxaFcojPK6L9n6uX3vPB9WLbaBk9bsoSJANi422Ss83Shjr2t-IQLGaIacmVup6IgwxKuACDSWmFf7Kug0raOiKJNvXrK-xaFEoHHYtCKru17Dq6uH*9oY87z5b2JM93IbJFqDrvR4eiOs3UpU*X2KNMp*-4ABiwx2g__'
        },
        sidebar_list: {},
        user_signature: 'eJwtzFELgjAUhuH-sttKzjbPdEIXQRBSF1FGdRltxaFcojPK6L9n6uX3vPB9WLbaBk9bsoSJANi422Ss83Shjr2t-IQLGaIacmVup6IgwxKuACDSWmFf7Kug0raOiKJNvXrK-xaFEoHHYtCKru17Dq6uH*9oY87z5b2JM93IbJFqDrvR4eiOs3UpU*X2KNMp*-4ABiwx2g__',
        workspace: ''
      };
      saveAuth(mockResponse);
      return resolve(mockResponse);
    }
    // 支持 test@explore.com 账号，workspace 用 Baidu
    if (credentials.username === 'test@example.com' && credentials.password === 'Test@123456') {
      const baiduWorkspace = workspacesData.find(ws => ws.name === 'Baidu');
      const mockResponse = {
        token: 'mock_jwt_token',
        user: {
          id: 'test-1411', // IM userID
          name: '测评员-2',
          email: 'test@example.com',
          role: 'user',
          workspace: baiduWorkspace,
          user_signature: 'eJwtzLEOgjAUheF36VolvZVSIGHCQRLBQRfcjC14VRRLAxLju4vAeL4-OR9y2O6dVhsSEu4wshg3Kv2wWODIVjd2CS7AHBt1O9U1KhKCxxiTQeCJqeh3jUYPLoTgQ5rUYvU36fqBy6XvzS9YDt-XNMvjzuyqtLhv2iN9nhMGeU9pX8LqksS*jTNa6vULuoh8f7nnMeU_'
        },
        sidebar_list: {},
        user_signature: 'eJwtzLEOgjAUheF36VolvZVSIGHCQRLBQRfcjC14VRRLAxLju4vAeL4-OR9y2O6dVhsSEu4wshg3Kv2wWODIVjd2CS7AHBt1O9U1KhKCxxiTQeCJqeh3jUYPLoTgQ5rUYvU36fqBy6XvzS9YDt-XNMvjzuyqtLhv2iN9nhMGeU9pX8LqksS*jTNa6vULuoh8f7nnMeU_',
        workspace: baiduWorkspace
      };
      saveAuth(mockResponse);
      return resolve(mockResponse);
    }
    // 登录失败
    reject(new Error('用户名或密码错误'));
  });
};

/**
 * 登出
 */
export const logout = async () => {
  try {
    await timService.logoutTIM(); // 先退出IM
  } catch (e) {
    // 可以忽略IM登出异常
    console.warn('IM登出失败', e);
  }
  clearAuth();
  window.location.href = '/login';
};

/**
 * 刷新Token
 * @returns {Promise} - 刷新结果
 */
export const refreshToken = async () => {
  // 实际项目中应该调用刷新Token的API
  // 这里仅作示例
  return Promise.resolve();
};

export default {
  saveAuth,
  getToken,
  getCurrentUser,
  isAuthenticated,
  clearAuth,
  login,
  logout,
  refreshToken
}; 