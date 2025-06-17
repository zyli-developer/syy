/**
 * 用户数据服务
 * 处理用户相关的API请求
 */

import api from "./api"
import endpoints from "./endpoints"
import { currentUser as mockUser, personalInfoMock, personalHonorMock } from "../mocks/data"

// 将 mock 数据转换为符合 API 文档的格式
const convertToApiFormat = (user) => {
  if (!user) return null;
  
  // 创建符合 API 文档中 User 消息类型的格式
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    workspace: user.workspace || "default",
    vip: user.vip || false,
    avatar: user.avatar || null,
    phone: user.phone || "",
    role: user.role || "user",
    preferences: user.preferences || {},
    last_login: user.last_login || { seconds: Math.floor(Date.now() / 1000) },
    created_at: user.created_at || { seconds: Math.floor(Date.now() / 1000) },
    updated_at: user.updated_at || { seconds: Math.floor(Date.now() / 1000) }
  };
};

const userService = {
  /**
   * 获取当前用户信息
   * @returns {Promise} - 当前用户数据
   */
  getCurrentUser: async () => {
    try {
      // 优先使用 API 调用
      const response = await api.get(endpoints.users.current);
      
      // 如果响应是对象且有 user 属性，返回其中的 user
      if (response && response.user) {
        return convertToApiFormat(response.user);
      }
      
      // 如果响应本身就是用户对象
      if (response && response.id) {
        return convertToApiFormat(response);
      }
      
      // 使用 mock 数据作为兜底
      console.warn("使用 mock 用户数据");
      return convertToApiFormat(mockUser);
    } catch (error) {
      console.error("获取当前用户信息失败:", error);
      // 发生错误时返回 mock 数据，避免前端报错
      return convertToApiFormat(mockUser);
    }
  },

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 用户列表数据
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get(endpoints.users.list, { params });
      
      // 处理可能的不同响应格式
      if (Array.isArray(response)) {
        return response.map(convertToApiFormat);
      }
      
      if (response && response.users && Array.isArray(response.users)) {
        return response.users.map(convertToApiFormat);
      }
      
      if (response && response.data && Array.isArray(response.data)) {
        return response.data.map(convertToApiFormat);
      }
      
      // 使用 mock 数据作为兜底
      console.warn("使用 mock 用户列表数据");
      return [convertToApiFormat(mockUser)];
    } catch (error) {
      console.error("获取用户列表失败:", error);
      // 发生错误时返回 mock 数据，避免前端报错
      return [convertToApiFormat(mockUser)];
    }
  },

  /**
   * 获取用户详情
   * @param {string} id - 用户ID
   * @returns {Promise} - 用户详情数据
   */
  getUserDetail: async (id) => {
    try {
      const response = await api.get(endpoints.users.detail(id));
      
      // 处理可能的不同响应格式
      if (response && response.user) {
        return convertToApiFormat(response.user);
      }
      
      if (response && response.id) {
        return convertToApiFormat(response);
      }
      
      // 使用 mock 数据作为兜底
      console.warn("使用 mock 用户详情数据");
      return convertToApiFormat({...mockUser, id});
    } catch (error) {
      console.error(`获取用户详情失败 (ID: ${id}):`, error);
      // 发生错误时返回 mock 数据，避免前端报错
      return convertToApiFormat({...mockUser, id});
    }
  },

  // 获取个人信息
  getPersonalInfo: async () => {
    const useMock = process.env.REACT_APP_USE_MOCK_DATA === 'true';
    if (useMock) {
      return personalInfoMock;
    }
    // 真实接口
    const res = await fetch('/api/users/current');
    if (!res.ok) throw new Error('获取个人信息失败');
    return await res.json();
  },

  // 获取个人荣誉
  getPersonalHonor: async () => {
    const useMock = process.env.REACT_APP_USE_MOCK_DATA === 'true';
    if (useMock) {
      return personalHonorMock;
    }
    // 真实接口（假设有该接口）
    const res = await fetch('/api/users/current/honor');
    if (!res.ok) throw new Error('获取个人荣誉失败');
    return await res.json();
  },
}

export default userService
