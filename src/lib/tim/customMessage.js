/**
 * 腾讯云即时通讯IM自定义消息模块
 */
import { getTIMInstance } from './core';
import TencentCloudChat from '@tencentcloud/chat';
import { CUSTOM_MESSAGE_TYPE } from './constants';

/**
 * 创建会话开始自定义消息
 * @param {Object} options 消息选项
 * @param {string} options.to 接收方ID
 * @param {string} options.conversationType 会话类型
 * @param {string} options.sessionId 会话ID
 * @param {string} options.quoteContent 引用内容
 * @param {number} options.timestamp 时间戳
 * @returns {Object} 自定义消息对象
 */
export function createSessionStartMessage(options) {
  const { to, conversationType, sessionId, quoteContent, timestamp } = options;
  
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，无法创建自定义消息');
  }
  
  // 构建会话数据
  const sessionData = {
    sessionType: CUSTOM_MESSAGE_TYPE.SESSION_START,
    sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    quoteContent: quoteContent || '',
    timestamp: timestamp || Date.now(),
    creator: tim.getMyProfile()?.userID || 'unknown',
    isPersistent: true, // 标记为持久化会话，支持跨段历史记录
    startVersion: 1
  };
  
  // 创建自定义消息
  return tim.createCustomMessage({
    to,
    conversationType,
    payload: {
      data: JSON.stringify(sessionData),
      description: '引用会话开始',
      extension: 'session_divider'
    },
    // 使用cloudCustomData保存会话信息，确保跨平台可用
    cloudCustomData: JSON.stringify(sessionData),
    // 添加优先级，确保分割线消息优先显示
    priority: TencentCloudChat.TYPES.MSG_PRIORITY_HIGH
  });
}

/**
 * 创建会话结束自定义消息
 * @param {Object} options 消息选项
 * @param {string} options.to 接收方ID
 * @param {string} options.conversationType 会话类型
 * @param {string} options.sessionId 会话ID
 * @param {string} options.quoteContent 引用内容
 * @returns {Object} 自定义消息对象
 */
export function createSessionEndMessage(options) {
  const { to, conversationType, sessionId, quoteContent } = options;
  
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，无法创建自定义消息');
  }
  
  if (!sessionId) {
    throw new Error('会话ID不能为空');
  }
  
  // 构建会话数据
  const sessionData = {
    sessionType: CUSTOM_MESSAGE_TYPE.SESSION_END,
    sessionId: sessionId,
    quoteContent: quoteContent || '',
    timestamp: Date.now(),
    closedBy: tim.getMyProfile()?.userID || 'unknown',
    isPersistent: true, // 标记为持久化会话，支持跨段历史记录
    endVersion: 1
  };
  
  // 创建自定义消息
  return tim.createCustomMessage({
    to,
    conversationType,
    payload: {
      data: JSON.stringify(sessionData),
      description: '引用会话结束',
      extension: 'session_divider'
    },
    // 使用cloudCustomData保存会话信息，确保跨平台可用
    cloudCustomData: JSON.stringify(sessionData),
    // 添加优先级，确保分割线消息优先显示
    priority: TencentCloudChat.TYPES.MSG_PRIORITY_HIGH
  });
}

/**
 * 从消息对象中提取会话数据
 * @param {Object} message 消息对象
 * @returns {Object|null} 会话数据对象或null
 */
export function extractSessionData(message) {
  if (!message) return null;
  
  try {
    // 优先从cloudCustomData中获取
    if (message.cloudCustomData) {
      try {
        const data = JSON.parse(message.cloudCustomData);
        if (data.sessionType) {
          return data;
        }
      } catch (e) {}
    }
    
    // 从payload中获取
    if (message.payload && message.payload.data) {
      try {
        const data = JSON.parse(message.payload.data);
        if (data.sessionType) {
          return data;
        }
      } catch (e) {}
    }
    
    return null;
  } catch (error) {
    console.error('提取会话数据失败', error);
    return null;
  }
}

/**
 * 判断消息是否为会话分割线
 * @param {Object} message 消息对象
 * @returns {boolean} 是否为会话分割线
 */
export function isSessionDivider(message) {
  if (!message) return false;
  
  // 检查消息类型
  if (message.type !== 'TIMCustomElem' && message.type !== TencentCloudChat.TYPES.MSG_CUSTOM) {
    return false;
  }
  
  // 提取会话数据
  const sessionData = extractSessionData(message);
  if (!sessionData) return false;
  
  // 判断是否为会话开始或结束
  return sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START || 
         sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END;
}

/**
 * 判断消息是否为会话开始分割线
 * @param {Object} message 消息对象
 * @returns {boolean} 是否为会话开始分割线
 */
export function isSessionStartDivider(message) {
  const sessionData = extractSessionData(message);
  return sessionData ? sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START : false;
}

/**
 * 判断消息是否为会话结束分割线
 * @param {Object} message 消息对象
 * @returns {boolean} 是否为会话结束分割线
 */
export function isSessionEndDivider(message) {
  const sessionData = extractSessionData(message);
  return sessionData ? sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END : false;
} 