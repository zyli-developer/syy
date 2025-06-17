/**
 * 腾讯云即时通讯IM核心模块
 */
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import { LOG_LEVEL, TIM_EVENT } from './constants';

// 全局单例
let timInstance = null;

/**
 * 初始化腾讯云即时通讯IM SDK
 * @param {Object} config IM配置信息
 * @returns {Promise<Object>} Promise<IM实例>
 */
export async function initTIMSDK(config) {
  if (timInstance) {
    console.warn('TIM SDK已初始化，请勿重复初始化');
    return timInstance;
  }

  // 创建IM实例
  timInstance = TencentCloudChat.create({
    SDKAppID: config.SDKAppID
  });

  // 设置日志级别
  timInstance.setLogLevel(config.logLevel || LOG_LEVEL.INFO);

  // 注册上传插件
  timInstance.registerPlugin({
    'tim-upload-plugin': TIMUploadPlugin
  });
  
  // 返回Promise以确保SDK初始化完成
  return new Promise((resolve) => {
    // 监听SDK_READY事件一次以确保SDK已初始化
    const onSDKReady = () => {
      console.log('SDK初始化完成并已就绪');
      timInstance.off(TencentCloudChat.EVENT.SDK_READY, onSDKReady);
      resolve(timInstance);
    };
    
    // 监听SDK_NOT_READY事件以捕获潜在的初始化问题
    const onSDKNotReady = (event) => {
      console.warn('SDK未就绪', event);
      // 不reject，让流程继续，避免阻塞应用
    };
    
    console.log('SDK 初始化中');

    timInstance.on(TencentCloudChat.EVENT.SDK_READY, onSDKReady);
    timInstance.on(TencentCloudChat.EVENT.SDK_NOT_READY, onSDKNotReady);
    
    // 返回实例作为备选（如果事件没有触发）
    setTimeout(() => {
      if (timInstance) {
        console.warn('SDK初始化超时，返回实例但可能未完全就绪');
        resolve(timInstance);
      }
    }, 5000); // 5秒超时
  });
}

/**
 * 获取IM实例
 * @returns {Object} IM实例
 */
export function getTIMInstance() {
  return timInstance;
}

/**
 * 销毁IM实例
 */
export function destroyTIMSDK() {
  if (!timInstance) {
    console.warn('TIM SDK未初始化，无需销毁');
    return;
  }

  timInstance = null;
}

/**
 * 添加事件监听
 * @param {string} eventName 事件名称
 * @param {Function} callback 回调函数
 */
export function addEventListener(eventName, callback) {
  if (!timInstance) {
    console.error('TIM SDK未初始化，无法添加事件监听');
    return;
  }

  timInstance.on(eventName, callback);
}

/**
 * 移除事件监听
 * @param {string} eventName 事件名称
 * @param {Function} callback 回调函数
 */
export function removeEventListener(eventName, callback) {
  if (!timInstance) {
    console.error('TIM SDK未初始化，无法移除事件监听');
    return;
  }

  timInstance.off(eventName, callback);
}

/**
 * 批量添加事件监听
 * @param {Object} events 事件监听映射
 */
export function addEventListeners(events) {
  if (!timInstance) {
    console.error('TIM SDK未初始化，无法批量添加事件监听');
    return;
  }

  Object.entries(events).forEach(([eventName, callback]) => {
    addEventListener(eventName, callback);
  });
}

/**
 * 批量移除事件监听
 * @param {Object} events 事件监听映射
 */
export function removeEventListeners(events) {
  if (!timInstance) {
    console.error('TIM SDK未初始化，无法批量移除事件监听');
    return;
  }

  Object.entries(events).forEach(([eventName, callback]) => {
    removeEventListener(eventName, callback);
  });
} 