/**
 * API请求工具
 * 封装了基本的API请求方法，支持Protocol Buffers格式
 */

import { getToken } from './authService';
import { encodeMessage, decodeMessage } from '../utils/protobufHelper';

// 检查BASE_URL的配置

// 基础URL，可以根据环境变量配置
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
console.log("rocess.env.REACT_APP_API_BASE_URL",process.env.REACT_APP_API_BASE_URL)
// 是否使用Protocol Buffers格式
// 注意：实际项目中应该根据后端API要求设置
// 这里提供一个开关，方便在开发阶段切换
const USE_PROTOBUF = false;

/**
 * 处理API响应
 * @param {Response} response - fetch API的响应对象
 * @param {string} responseType - 响应消息类型名称
 * @returns {Promise} - 处理后的响应数据
 */
const handleResponse = async (response, responseType) => {
  if (!response.ok) {
    // 如果响应状态码不是2xx，抛出错误
    try {
      if (USE_PROTOBUF) {
        const errorBuffer = await response.text();
        const errorData = decodeMessage('Error', errorBuffer);
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
  }
    } catch (error) {
      throw new Error(`请求失败: ${response.status}`);
    }
  }

  // 根据内容类型处理响应
  if (USE_PROTOBUF) {
    const buffer = await response.text();
    return decodeMessage(responseType, buffer);
  } else {
  // 检查内容类型，如果是JSON则解析为JSON
    const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  }
};

/**
 * 构建请求选项
 * @param {string} method - HTTP方法
 * @param {Object} data - 请求数据
 * @param {string} requestType - 请求消息类型名称
 * @param {Object} options - 额外的请求选项
 * @returns {Object} - 完整的请求选项
 */
const buildRequestOptions = (method, data, requestType, options = {}) => {
  // 获取认证Token
  const token = getToken();
  
  // 构建基本请求选项
  const requestOptions = {
    method,
    headers: {
      ...(USE_PROTOBUF 
        ? { "Content-Type": "application/x-protobuf" }
        : { "Content-Type": "application/json" }),
      // 添加认证头
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  // 添加请求体
  if (data) {
    if (USE_PROTOBUF) {
      // 使用Protocol Buffers格式
      requestOptions.body = encodeMessage(requestType, data);
    } else {
      // 使用JSON格式
      requestOptions.body = JSON.stringify(data);
    }
  }

  return requestOptions;
};

/**
 * API请求方法
 */
const api = {
  /**
   * GET请求
   * @param {string} endpoint - API端点
   * @param {Object} options - 请求选项
   * @param {string} responseType - 响应消息类型名称
   * @returns {Promise} - 响应数据
   */
  get: async (endpoint, options = {}, responseType = '') => {
    // 构建URL查询参数
    let url = `${BASE_URL}${endpoint}`;
    if (options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, value);
          }
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    // 发送请求
    const response = await fetch(url, buildRequestOptions("GET", null, '', options));
    return handleResponse(response, responseType);
  },

  /**
   * POST请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {string} requestType - 请求消息类型名称
   * @param {string} responseType - 响应消息类型名称
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  post: async (endpoint, data, requestType = '', responseType = '', options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, buildRequestOptions("POST", data, requestType, options));
    return handleResponse(response, responseType);
  },

  /**
   * PUT请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {string} requestType - 请求消息类型名称
   * @param {string} responseType - 响应消息类型名称
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  put: async (endpoint, data, requestType = '', responseType = '', options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, buildRequestOptions("PUT", data, requestType, options));
    return handleResponse(response, responseType);
  },

  /**
   * DELETE请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {string} requestType - 请求消息类型名称
   * @param {string} responseType - 响应消息类型名称
   * @param {Object} options - 请求选项
   * @returns {Promise} - 响应数据
   */
  delete: async (endpoint, data = null, requestType = '', responseType = '', options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, buildRequestOptions("DELETE", data, requestType, options));
    return handleResponse(response, responseType);
  },
};

export default api;
