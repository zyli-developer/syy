/**
 * 腾讯云即时通讯IM认证模块
 */
import { getTIMInstance } from './core';

// 存储登录时的用户ID
let currentUserID = null;

/**
 * 登录IM系统
 * @param {Object} params 登录参数
 * @returns {Promise} 登录结果
 */
export async function login(params) {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    // 存储用户ID，以便后续使用
    currentUserID = params.userID;
    
    const imResponse = await tim.login(params);
    console.log('登录成功', imResponse.data);
    
    // 处理重复登录情况
    if (imResponse.data.repeatLogin === true) {
      console.warn('账号已登录，本次为重复登录');
    }
    
    return imResponse.data;
  } catch (error) {
    console.error('登录失败', error);
    throw error;
  }
}

/**
 * 登出IM系统
 * @returns {Promise} 登出结果
 */
export async function logout() {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    const imResponse = await tim.logout();
    console.log('登出成功');
    // 清除存储的用户ID
    currentUserID = null;
    return imResponse.data;
  } catch (error) {
    console.error('登出失败', error);
    throw error;
  }
}

/**
 * 获取当前登录用户ID
 * @returns {string|null} 当前登录用户ID
 */
export function getLoginUserID() {
  // 首先尝试使用我们在登录时保存的用户ID
  if (currentUserID) {
    return currentUserID;
  }
  
  // 如果没有保存的用户ID，返回null
  // 腾讯云IM SDK没有提供直接获取当前登录用户ID的方法
  return null;
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLogin() {
  const tim = getTIMInstance();
  if (!tim) {
    return false;
  }

  // 使用本地存储的用户ID判断是否登录
  return !!currentUserID;
}

/**
 * 获取当前SDK是否处于ready状态
 * @returns {boolean} SDK是否ready
 */
export function isSDKReady() {
  const tim = getTIMInstance();
  if (!tim) {
    return false;
  }

  // 检查SDK状态的最佳实践是使用监听器，这里我们只能返回一个近似值
  // 如果用户已登录，我们认为SDK已就绪
  return !!currentUserID;
} 