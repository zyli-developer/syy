/**
 * 腾讯云即时通讯IM模块
 * 统一导出IM相关接口
 */

// 导入核心功能
import * as core from './core';
// 导入消息相关
import { sendTextMessage, getMessageList, setMessageRead, sendTextAtMessage } from './message';
// 导入会话相关
import {
  getConversationList,
  getConversationProfile,
  deleteConversation,
  getTotalUnreadMessageCount,
  createC2CConversation,
  createGroupConversation,
  markConversationRead
} from './conversation';

// 导出常量
export * from './constants';

// 导出核心功能
export * from './core';

// 导出认证相关
export * from './auth';

// 导出消息相关
export {
  sendTextMessage,
  sendTextAtMessage,
  getMessageList,
  setMessageRead
};

// 导出会话相关
export {
  getConversationList,
  getConversationProfile,
  deleteConversation,
  getTotalUnreadMessageCount,
  createC2CConversation,
  createGroupConversation,
  markConversationRead,
  // 为了兼容性，保留setConversationRead名称
  markConversationRead as setConversationRead
};

// 创建会话的便捷方法
export function createConversation(type, id) {
  if (type === 'C2C') {
    return createC2CConversation(id);
  } else if (type === 'GROUP') {
    return createGroupConversation(id);
  }
  throw new Error(`不支持的会话类型: ${type}`);
}

// 导出群组操作相关函数
export * from './group';

// 默认导出SDK核心功能
export default core; 