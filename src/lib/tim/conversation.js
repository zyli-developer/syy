/**
 * 腾讯云即时通讯IM会话模块
 */
import { getTIMInstance } from './core';
import TencentCloudChat from '@tencentcloud/chat';

/**
 * 获取会话列表
 * @param {Object} options 可选，获取会话列表的选项
 * @returns {Promise<Array>} 会话列表
 */
export async function getConversationList(options) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法获取会话列表');
    return [];
  }

  try {
    const imResponse = await tim.getConversationList(options);
    
    // 检查响应和数据是否存在
    if (!imResponse || !imResponse.data) {
      console.warn('获取会话列表响应数据为空');
      return [];
    }
    
    // 确保conversationList是数组
    if (!Array.isArray(imResponse.data.conversationList)) {
      console.warn('会话列表不是数组类型:', typeof imResponse.data.conversationList);
      return [];
    }
    
    // 对每个会话进行预处理，确保关键字段存在
    return imResponse.data.conversationList.map(conversation => {
      // 确保会话对象中的关键属性存在
      if (!conversation) return null;
      
      // 确保profile对象存在
      if (conversation.type === 'GROUP' && !conversation.groupProfile) {
        conversation.groupProfile = { name: `群聊 ${conversation.groupID || '未知'}` };
      } else if (conversation.type === 'C2C' && !conversation.userProfile) {
        conversation.userProfile = { userID: conversation.userID || '未知用户' };
      }
      
      return conversation;
    }).filter(Boolean); // 过滤掉null值
  } catch (error) {
    console.error('获取会话列表失败', error);
    return [];
  }
}

/**
 * 获取指定会话的详细资料
 * @param {String} conversationID 会话ID
 * @returns {Promise<Object>} 会话资料
 */
export async function getConversationProfile(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法获取会话资料');
    throw new Error('TIM SDK未初始化');
  }

  try {
    const imResponse = await tim.getConversationProfile(conversationID);
    return imResponse.data.conversation;
  } catch (error) {
    console.error(`获取会话资料失败: ${conversationID}`, error);
    throw error;
  }
}

/**
 * 删除会话
 * @param {String} conversationID 会话ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteConversation(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法删除会话');
    throw new Error('TIM SDK未初始化');
  }

  try {
    const imResponse = await tim.deleteConversation(conversationID);
    return imResponse.data;
  } catch (error) {
    console.error(`删除会话失败: ${conversationID}`, error);
    throw error;
  }
}

/**
 * 获取会话未读消息总数
 * @returns {Promise<number>} 未读消息总数
 */
export async function getTotalUnreadMessageCount() {
  const tim = getTIMInstance();
  if (!tim) {
    throw new Error('TIM SDK未初始化，请先初始化SDK');
  }

  try {
    const imResponse = await tim.getTotalUnreadMessageCount();
    console.log('获取未读消息总数成功', imResponse.data);
    
    // 处理不同版本SDK返回格式的差异
    if (typeof imResponse.data === 'number') {
      return imResponse.data;
    } else if (typeof imResponse.data.count === 'number') {
      return imResponse.data.count;
    }
    
    return 0;
  } catch (error) {
    console.error('获取未读消息总数失败', error);
    // 发生错误时返回0
    return 0;
  }
}

/**
 * 创建C2C(单聊)会话
 * @param {String} userID 对方用户ID
 * @returns {Promise<Object>} 会话信息
 */
export async function createC2CConversation(userID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法创建会话');
    throw new Error('TIM SDK未初始化');
  }

  try {
    // 构建会话ID
    const conversationID = `C2C${userID}`;
    
    // 尝试获取已有会话
    try {
      const conversation = await getConversationProfile(conversationID);
      console.log('会话已存在，直接返回', conversation);
      return conversation;
    } catch (e) {
      console.log('会话不存在，将创建新会话');
    }
    
    // 创建新会话，通过发送一条空消息来触发会话创建
    // 构建一个自定义消息，用于创建会话但不显示给用户
    const hiddenMessage = tim.createCustomMessage({
      to: userID,
      conversationType: TencentCloudChat.TYPES.CONV_C2C,
      payload: {
        data: 'CONVERSATION_INIT', // 自定义标识，表示这是会话初始化消息
        description: '会话创建', 
        extension: ''
      }
    });
    
    // 发送消息以创建会话
    await tim.sendMessage(hiddenMessage);
    
    // 获取创建的会话
    const conversation = await getConversationProfile(conversationID);
    return conversation;
  } catch (error) {
    console.error(`创建C2C会话失败: ${userID}`, error);
    throw error;
  }
}

/**
 * 创建群聊会话
 * @param {String} groupID 群组ID
 * @returns {Promise<Object>} 会话信息
 */
export async function createGroupConversation(groupID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法创建群会话');
    throw new Error('TIM SDK未初始化');
  }

  try {
    // 处理特殊格式的群组ID
    let processedGroupID = groupID;
    
    // 检查是否是@TGS#格式的群组ID
    const hasTGSFormat = typeof groupID === 'string' && groupID.includes('@TGS#');
    
    // 如果是@TGS#格式但有其他前缀，提取纯群组ID
    if (hasTGSFormat && !groupID.startsWith('@TGS#')) {
      const tgsIndex = groupID.indexOf('@TGS#');
      processedGroupID = groupID.substring(tgsIndex);
      console.log(`检测到TGS格式群组ID: ${processedGroupID}，原ID: ${groupID}`);
    }
    
    // 构建会话ID
    const conversationID = `GROUP${processedGroupID}`;
    let conversation;
    
    // 尝试获取已有会话
    try {
      conversation = await getConversationProfile(conversationID);
      console.log('群会话已存在，直接返回', conversation);
    } catch (e) {
      console.log('群会话不存在，将创建新会话');
      // 如果会话不存在，继续执行后续加入群组的逻辑
      conversation = null;
    }
    
    // 无论会话是否存在，都尝试加入群组
    // 这样可以确保用户真正加入了群组，而不只是获取了会话信息
    try {
      const joinGroupResult = await tim.joinGroup({ groupID: processedGroupID });
      console.log('加入群组结果', joinGroupResult);
      
      // 加入群组可能有不同的结果状态
      if (joinGroupResult.data.status === 'JoinedSuccess') {
        console.log('成功加入群组');
      } else if (joinGroupResult.data.status === 'AlreadyInGroup') {
        console.log('已经在群组中');
      }
    } catch (joinError) {
      // 如果加入失败但不是因为已经在群中，则抛出错误
      if (joinError.code !== 10013) { // 10013 是"已经是群成员"的错误码
        throw joinError;
      }
      console.log('已经是群成员，无需重复加入');
    }
    
    // 如果之前找不到会话，在加入后重新获取
    if (!conversation) {
      conversation = await getConversationProfile(conversationID);
    }
    
    return conversation;
  } catch (error) {
    console.error(`创建群会话失败: ${groupID}`, error);
    throw error;
  }
}

/**
 * 设置会话已读
 * @param {String} conversationID 会话ID
 * @returns {Promise<Object>} 设置结果
 */
export async function markConversationRead(conversationID) {
  const tim = getTIMInstance();
  if (!tim) {
    console.error('TIM SDK未初始化，无法设置会话已读');
    throw new Error('TIM SDK未初始化');
  }

  try {
    const imResponse = await tim.setMessageRead({ conversationID });
    return imResponse.data;
  } catch (error) {
    console.error(`设置会话已读失败: ${conversationID}`, error);
    throw error;
  }
} 