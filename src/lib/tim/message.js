/**
 * 腾讯云即时通讯IM消息模块
 */
import { getTIMInstance } from './core';
import { CONVERSATION_TYPE, MESSAGE_TYPE, CUSTOM_MESSAGE_TYPE } from './constants';
import TencentCloudChat from '@tencentcloud/chat';
import { createSessionStartMessage, createSessionEndMessage, extractSessionData as extractSessionDataUtil } from './customMessage';

// 消息发送防重复缓存 - SDK层面
const messageDeduplicationCache = new Map();

/**
 * 发送文本消息
 * @param {string} text 文本内容
 * @param {string} to 接收方ID
 * @param {boolean} isGroup 是否群聊
 * @returns {Promise<Object>} 消息对象
 */
export async function sendTextMessage(text, to, isGroup = false) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法发送消息');
    throw new Error('TIM SDK未初始化');
  }

  const conversationType = isGroup ? CONVERSATION_TYPE.GROUP : CONVERSATION_TYPE.C2C;
  
  // 生成消息唯一键
  const messageKey = `${to}_${conversationType}_${text}_${Date.now().toString().substring(0, 10)}`;
  
  // 检查是否有重复发送（3秒内相同内容到相同接收方）
  if (messageDeduplicationCache.has(messageKey)) {
    console.warn('SDK层检测到重复消息，已阻止发送', { to, text });
    // 返回缓存的消息，避免重复发送
    return messageDeduplicationCache.get(messageKey);
  }
  
  try {
    console.log('开始创建文本消息', { to, isGroup });
    
    // 使用TencentCloudChat.TYPES而不是tim.TYPES
    const convType = isGroup ? TencentCloudChat.TYPES.CONV_GROUP : TencentCloudChat.TYPES.CONV_C2C;
    
    // 创建文本消息
    const message = tim.createTextMessage({
      to,
      conversationType: convType,
      payload: {
        text
      }
    });

    console.log('文本消息创建成功，开始发送');
    
    // 发送消息
    const imResponse = await tim.sendMessage(message);
    console.log('发送文本消息成功', imResponse.data.message);
    
    // 将消息存入缓存
    messageDeduplicationCache.set(messageKey, imResponse.data.message);
    
    // 3秒后清除缓存
    setTimeout(() => {
      messageDeduplicationCache.delete(messageKey);
    }, 3000);
    
    return imResponse.data.message;
  } catch (error) {
    console.error('发送文本消息失败', error);
    throw error;
  }
}

/**
 * 发送自定义Session开始消息
 * @param {string} quoteContent 引用的内容
 * @param {string} to 接收方ID
 * @param {boolean} isGroup 是否群聊
 * @param {string} sessionId 自定义的会话ID，如果不传则自动生成
 * @param {number} timestamp 时间戳，如果不传则使用当前时间
 * @returns {Promise<Object>} 消息对象
 */
export async function sendSessionStartMessage(quoteContent, to, isGroup = false, sessionId = null, timestamp = null) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法发送消息');
    throw new Error('TIM SDK未初始化');
  }

  try {
    // 使用TencentCloudChat.TYPES而不是tim.TYPES
    const convType = isGroup ? TencentCloudChat.TYPES.CONV_GROUP : TencentCloudChat.TYPES.CONV_C2C;
    
    // 使用customMessage模块创建会话开始消息
    const message = createSessionStartMessage({
      to,
      conversationType: convType,
      sessionId,
      quoteContent,
      timestamp
    });
    
    // 打印日志
    const actualSessionId = sessionId || (message.payload?.data ? JSON.parse(message.payload.data).sessionId : `session_${Date.now()}`);
    const actualTimestamp = timestamp || Date.now();
    
    console.log(`创建会话开始消息: ID=${actualSessionId}, 时间=${new Date(actualTimestamp).toLocaleString()}, 引用内容=${quoteContent?.substring(0, 50)}...`);
    console.log('创建Session开始消息成功，开始发送');
    
    // 发送消息
    const imResponse = await tim.sendMessage(message);
    console.log('发送Session开始消息成功', imResponse.data.message);
    
    return imResponse.data.message;
  } catch (error) {
    console.error('发送Session开始消息失败', error);
    throw error;
  }
}

/**
 * 发送自定义Session结束消息
 * @param {string} sessionId 会话ID
 * @param {string} quoteContent 引用内容 
 * @param {string} to 接收方ID
 * @param {boolean} isGroup 是否群聊
 * @returns {Promise<Object>} 消息对象
 */
export async function sendSessionEndMessage(sessionId, quoteContent, to, isGroup = false) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法发送消息');
    throw new Error('TIM SDK未初始化');
  }

  try {
    // 使用TencentCloudChat.TYPES而不是tim.TYPES
    const convType = isGroup ? TencentCloudChat.TYPES.CONV_GROUP : TencentCloudChat.TYPES.CONV_C2C;
    
    // 使用customMessage模块创建会话结束消息
    const message = createSessionEndMessage({
      to,
      conversationType: convType,
      sessionId,
      quoteContent
    });
    
    const endTimestamp = Date.now();
    console.log(`创建会话结束消息: ID=${sessionId}, 时间=${new Date(endTimestamp).toLocaleString()}`);
    console.log('创建Session结束消息成功，开始发送');
    
    // 发送消息
    const imResponse = await tim.sendMessage(message);
    console.log('发送Session结束消息成功', imResponse.data.message);
    
    return imResponse.data.message;
  } catch (error) {
    console.error('发送Session结束消息失败', error);
    throw error;
  }
}

/**
 * 获取消息列表
 * @param {Object} params 参数
 * @returns {Promise<Array>} 消息列表
 */
export async function getMessageList(params) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法获取消息列表');
    throw new Error('TIM SDK未初始化');
  }

  const { conversationID, count = 15, nextReqMessageID } = params;
  console.log('getMessageList调用参数:', { conversationID, count, nextReqMessageID });
  
  try {
    // 调用SDK的getMessageList接口获取消息列表
    console.log('开始调用SDK的getMessageList接口');
    const imResponse = await tim.getMessageList({
      conversationID,
      count,
      ...(nextReqMessageID ? { nextReqMessageID } : {})
    });
    
    // 详细打印结果
    console.log(`获取消息列表成功，会话ID: ${conversationID}，响应:`, {
      messageList: imResponse.data.messageList.length,
      isCompleted: imResponse.data.isCompleted,
      nextReqMessageID: imResponse.data.nextReqMessageID
    });
    
    // 打印第一条消息的详情(如果有)
    if (imResponse.data.messageList.length > 0) {
      const firstMsg = imResponse.data.messageList[0];
      console.log('第一条消息示例:', {
        ID: firstMsg.ID,
        type: firstMsg.type,
        from: firstMsg.from,
        to: firstMsg.to,
        flow: firstMsg.flow,
        time: new Date(firstMsg.time * 1000).toLocaleString(),
        payload: firstMsg.payload,
        elements: firstMsg.elements
      });
    }
    
    return imResponse.data.messageList;
  } catch (error) {
    console.error('获取消息列表失败', error);
    throw error;
  }
}

/**
 * 设置消息已读
 * @param {string} conversationID 会话ID
 * @returns {Promise<Object>} 结果
 */
export async function setMessageRead(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法设置消息已读');
    throw new Error('TIM SDK未初始化');
  }

  try {
    console.log(`设置会话消息已读: ${conversationID}`);
    const imResponse = await tim.setMessageRead({ conversationID });
    return imResponse.data;
  } catch (error) {
    console.error('设置消息已读失败', error);
    throw error;
  }
}

/**
 * 从自定义消息中提取Session数据
 * @param {Object} message 消息对象
 * @returns {Object|null} Session数据或null
 */
export function extractSessionData(message) {
  return extractSessionDataUtil(message);
}

/**
 * 发送@文本消息 (仅群聊)
 * @param {string} text 文本内容
 * @param {string} to 群ID（纯ID，不含GROUP前缀）
 * @param {Array<{userID:string,nick?:string}>} atList 被@的用户
 * @returns {Promise<Object>} 消息对象
 */
export async function sendTextAtMessage(text, to, atList = []) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法发送@消息');
    throw new Error('TIM SDK未初始化');
  }

  if (!Array.isArray(atList) || atList.length === 0) {
    // 如果没有@对象则退回普通文本发送
    return sendTextMessage(text, to, true);
  }

  // 仅取userID数组
  const atUserIDList = atList.map(u => (typeof u === 'string' ? u : u.userID));

  try {
    const message = tim.createTextAtMessage({
      to,
      conversationType: TencentCloudChat.TYPES.CONV_GROUP,
      payload: {
        text,
        atUserList: atUserIDList
      }
    });
    console.log('创建@文本消息成功，开始发送', { to, atUserIDList });
    const imResponse = await tim.sendMessage(message);
    console.log('发送@文本消息成功', imResponse.data.message);
    return imResponse.data.message;
  } catch (error) {
    console.error('发送@文本消息失败', error);
    throw error;
  }
}