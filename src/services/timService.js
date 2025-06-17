/**
 * 腾讯云即时通讯IM服务封装
 */
import * as TIM from '../lib/tim';
import { formatDate } from '../utils/dateUtils';
// 导入群组操作相关函数
import { createGroup as timCreateGroup } from '../lib/tim/group';

// IM配置
const TIM_CONFIG = {
  SDKAppID: 1600079965, // 实际的应用ID
  logLevel: TIM.LOG_LEVEL.INFO
};

// 密钥信息（实际生产环境中应由服务端生成userSig）
const SECRET_KEY = 'ebcf82816948352f178ab661fc1a6ae4165615843afb5b41f58df74a92847cb4';

// 当前登录用户信息
let currentUserInfo = {
  userID: 'test-123456',
  userSig: 'eJwtzFELgjAUhuH-sttKzjbPdEIXQRBSF1FGdRltxaFcojPK6L9n6uX3vPB9WLbaBk9bsoSJANi422Ss83Shjr2t-IQLGaIacmVup6IgwxKuACDSWmFf7Kug0raOiKJNvXrK-xaFEoHHYtCKru17Dq6uH*9oY87z5b2JM93IbJFqDrvR4eiOs3UpU*X2KNMp*-4ABiwx2g__'
};

// 消息去重缓存
const sentMessageCache = new Set();

/**
 * 获取当前登录用户信息
 * @returns {Object} 用户信息
 */
export function getCurrentUserInfo() {
  return { ...currentUserInfo };
}

/**
 * 初始化TIM
 * @returns {Promise} 初始化结果
 */
export async function initTIM() {
  try {
    await TIM.initTIMSDK(TIM_CONFIG);
    console.log('TIM SDK初始化成功');
    return true;
  } catch (error) {
    console.error('TIM SDK初始化失败', error);
    return false;
  }
}

/**
 * 登录TIM
 * @param {string} userID 用户ID
 * @param {string} userSig 用户签名
 * @returns {Promise} 登录结果
 */
export async function loginTIM(userID = currentUserInfo.userID, userSig = currentUserInfo.userSig) {
  try {
    // 先检查是否已经登录
    if (TIM.isLogin()) {
      // 如果当前用户已登录，避免重复登录
      console.log('用户已登录，无需重复登录', { userID });
      return { userID, repeatLogin: true };
    }
    
    // 登录新用户
    const result = await TIM.login({ userID, userSig });
    console.log('TIM登录成功', result);
    return result;
  } catch (error) {
    console.error('TIM登录失败', error);
    throw error;
  }
}

/**
 * 登出TIM
 * @returns {Promise} 登出结果
 */
export async function logoutTIM() {
  try {
    const result = await TIM.logout();
    console.log('TIM登出成功');
    return result;
  } catch (error) {
    console.error('TIM登出失败', error);
    throw error;
  }
}

/**
 * 获取聊天用户列表
 * @returns {Promise<Array>} 用户列表
 */
export async function getChatUsers() {
  try {
    // 获取会话列表
    const conversationList = await TIM.getConversationList();
    
    console.log('获取到会话列表', { count: conversationList?.length || 0 });
    
    // 如果conversationList为空或不是数组，返回空数组
    if (!conversationList || !Array.isArray(conversationList) || conversationList.length === 0) {
      console.log('会话列表为空');
      return [];
    }
    
    // 转换为ChatContext需要的格式
    const users = conversationList.map(conversation => {
      // 确保conversation对象有效
      if (!conversation) {
        console.warn('发现无效的会话对象');
        return null;
      }
      
      const isGroup = conversation.type === 'GROUP';
      const profile = isGroup ? conversation.groupProfile : conversation.userProfile;
      
      // 从conversationID中提取纯ID
      let id = isGroup ? conversation.groupID : conversation.userID;
      
      // 如果id不存在但conversationID存在，尝试从conversationID提取
      if (!id && conversation.conversationID) {
        const prefix = conversation.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
        id = conversation.conversationID.substring(prefix.length);
        console.log(`从conversationID(${conversation.conversationID})提取ID: ${id}`);
      }
      
      // 确保我们有一个有效的ID
      if (!id) {
        console.warn('无法获取有效的用户/群组ID，跳过此会话');
        return null;
      }
      
      // 安全地访问profile属性
      const name = isGroup 
        ? (profile?.name || `群聊 ${id}`)
        : (profile?.nick || profile?.userID || id);
      
      return {
        id: id, // 纯ID
        name: name,
        avatar: profile?.avatar || null,
        status: profile?.statusType === 'Online' ? 'active' : 'offline',
        conversationID: conversation.conversationID, // 保留原始会话ID
        unreadCount: conversation.unreadCount || 0,
        lastMessage: conversation.lastMessage?.messageForShow || '',
        type: isGroup ? 'group' : 'user'
      };
    }).filter(user => user !== null); // 过滤掉无效的用户
    
    console.log('转换后的用户列表', { count: users.length });
    
    return users;
  } catch (error) {
    console.error('获取聊天用户列表失败', error);
    // 出错时返回空数组而不是抛出异常，避免中断UI流程
    return [];
  }
}

/**
 * 获取与指定用户的聊天消息
 * @param {string|number} userId 用户ID
 * @returns {Promise<Array>} 消息列表
 */
export async function getChatMessages(userId) {
  if (!userId) {
    console.error('获取消息失败: userId不能为空');
    return [];
  }
  
  console.log(`开始获取聊天消息，userId: ${userId}`, { userId, type: typeof userId });
  
  try {
    // 根据userId构建会话ID
    // 检查是否是群组ID - 除了以GROUP开头，也要检查是否包含@TGS#这种格式的群组ID
    const isGroup = typeof userId === 'string' && (
      userId.startsWith('GROUP') || 
      userId.includes('@TGS#') ||
      userId.startsWith('@TGS#')
    );
    
    // 对包含@TGS#的群组ID进行特殊处理
    let pureId;
    if (typeof userId === 'string' && userId.includes('@TGS#')) {
      // 如果包含@TGS#，确保移除任何前缀，只保留@TGS#开始的部分
      const tgsIndex = userId.indexOf('@TGS#');
      pureId = userId.substring(tgsIndex);
      console.log(`检测到TGS格式群组ID: ${pureId}`);
    } else {
      // 其他情况正常移除前缀
      pureId = String(userId).replace(/^(GROUP|C2C)/, '');
    }
    
    // 构建正确的会话ID
    const conversationID = isGroup ? `GROUP${pureId}` : `C2C${pureId}`;
    
    console.log(`构建会话ID: ${conversationID}`, { isGroup, pureId });
    
    // 获取会话资料（如果不存在会创建）
    try {
      await TIM.getConversationProfile(conversationID);
      console.log(`获取会话资料成功: ${conversationID}`);
    } catch (convError) {
      console.warn(`获取会话资料失败: ${conversationID}`, convError);
      // 即使获取会话失败也继续尝试获取消息
    }
    
    // 使用 SDK 的 getMessageList 获取消息列表
    console.log(`开始获取消息列表: ${conversationID}`);
    const messageList = await TIM.getMessageList({
      conversationID,
      count: 50 // 增加获取消息数量，确保能获取到所有会话相关消息
    });
    
    // 确保messageList是数组
    if (!Array.isArray(messageList)) {
      console.warn(`获取到的消息列表格式不正确: ${typeof messageList}`, messageList);
      return [];
    }
    
    console.log(`获取消息列表成功，消息数: ${messageList.length}`);
    
    // 标记消息已读
    try {
      // 使用正确的函数标记会话消息已读
      await TIM.markConversationRead(conversationID);
      console.log(`标记会话已读成功: ${conversationID}`);
    } catch (readError) {
      console.warn(`设置消息已读失败: ${conversationID}`, readError);
      // 设置已读失败不影响消息获取
    }
    
    // 转换为ChatContext需要的格式
    const formattedMessages = messageList.map(message => {
      // 尝试获取消息ID
      const messageId = message.ID || message.id || `temp-${Date.now()}-${Math.random()}`;
      
      // 确定消息发送方向
      const isIncoming = message.flow === 'in';
      
      // 获取时间戳
      const timestamp = message.time 
        ? formatDate(new Date(message.time * 1000)) 
        : message.timestamp || formatDate(new Date());
      
      // 获取消息基本信息
      const baseMessage = {
        id: messageId,
        sender: isIncoming ? 'other' : 'user',
        timestamp: timestamp,
        time: message.time || Math.floor(Date.now() / 1000),
        flow: message.flow
      };
      
      // 处理自定义消息
      if (message.type === 'TIMCustomElem' || message.type === 'TIM.TYPES.MSG_CUSTOM') {
        try {
          // 处理会话分割线等自定义消息
          let customData = null;
          
          // 尝试从不同位置提取自定义数据
          if (message.payload && message.payload.data) {
            customData = JSON.parse(message.payload.data);
          } else if (message.cloudCustomData) {
            customData = JSON.parse(message.cloudCustomData);
          }
          
          if (customData) {
            console.log('解析到自定义消息数据:', customData);
            
            // 检查是否是会话相关的消息
            if (customData.sessionType) {
              return {
                ...baseMessage,
                type: 'custom',
                sessionData: customData,
                sessionId: customData.sessionId,
                text: customData.sessionType === 'session_start' 
                  ? `引用会话开始: ${customData.quoteContent || ''}`
                  : '引用会话结束',
                cloudCustomData: message.cloudCustomData,
                // 保留原始消息的所有关键属性
                payload: message.payload || {
                  data: JSON.stringify(customData),
                  description: customData.sessionType === 'session_start' ? '引用会话开始' : '引用会话结束'
                }
              };
            }
          }
          
          // 其他类型的自定义消息
          return {
            ...baseMessage,
            type: 'custom',
            text: message.payload?.description || '自定义消息',
            payload: message.payload,
            cloudCustomData: message.cloudCustomData
          };
        } catch (e) {
          console.error('解析自定义消息失败', e);
          return {
            ...baseMessage,
            type: 'custom',
            text: message.payload?.description || '自定义消息(解析失败)'
          };
        }
      }
      
      // 处理文本消息
      let textContent = '';
      if (message.payload && message.payload.text) {
        textContent = message.payload.text;
      } else if (message.elements && message.elements.length > 0 && message.elements[0].content && message.elements[0].content.text) {
        textContent = message.elements[0].content.text;
      } else if (typeof message.text === 'string') {
        textContent = message.text;
      }
      
      // 返回普通文本消息
      return {
        ...baseMessage,
        text: textContent
      };
    });
    
    // 保留所有消息，包括自定义消息
    console.log(`消息格式转换完成，转换后消息数: ${formattedMessages.length}`);
    
    // 打印分析会话消息
    const sessionMessages = formattedMessages.filter(msg => msg.type === 'custom' && msg.sessionData);
    if (sessionMessages.length > 0) {
      console.log(`发现会话相关消息: ${sessionMessages.length}条`, sessionMessages.map(msg => ({
        id: msg.id,
        sessionId: msg.sessionId,
        type: msg.sessionData.sessionType,
        timestamp: msg.timestamp
      })));
    } else {
      console.log('未发现任何会话相关消息');
    }
    
    return formattedMessages;
  } catch (error) {
    console.error('获取聊天消息失败', error);
    return []; // 出错时返回空数组
  }
}

/**
 * 发送聊天消息
 * @param {string|number} userId 用户ID
 * @param {string} text 消息内容
 * @param {Object} options 选项
 * @returns {Promise} 发送结果
 */
export async function sendMessage(userId, text, options = {}) {
  if (!userId) {
    console.error('发送消息失败: userId不能为空');
    throw new Error('发送消息失败: userId不能为空');
  }
  
  if (!text || text.trim() === '') {
    console.error('发送消息失败: 消息内容不能为空');
    throw new Error('发送消息失败: 消息内容不能为空');
  }
  
  console.log(`开始发送消息 userId: ${userId}, text: ${text}`);
  
  try {
    // 生成消息唯一标识（用户ID + 消息内容 + 精确到秒的时间戳）
    const messageKey = `${userId}_${text}_${Math.floor(Date.now() / 1000)}`;
    
    // 检查是否已发送过该消息（5秒内相同内容）
    if (sentMessageCache.has(messageKey)) {
      console.warn('消息发送重复，已忽略', { userId, text });
      throw new Error('消息重复发送');
    }
    
    // 添加到缓存中
    sentMessageCache.add(messageKey);
    console.log('添加消息到缓存', messageKey);
    
    // 5秒后从缓存中移除
    setTimeout(() => {
      sentMessageCache.delete(messageKey);
      console.log('从缓存中移除消息', messageKey);
    }, 5000);
    
    // 根据userId构建会话ID和类型
    // 检查是否是群组ID - 除了以GROUP开头，也要检查是否包含@TGS#这种格式的群组ID
    const isGroup = typeof userId === 'string' && (
      userId.startsWith('GROUP') || 
      userId.includes('@TGS#') ||
      userId.startsWith('@TGS#')
    );
    
    // 对包含@TGS#的群组ID进行特殊处理
    let pureId;
    if (typeof userId === 'string' && userId.includes('@TGS#')) {
      // 如果包含@TGS#，确保移除任何前缀，只保留@TGS#开始的部分
      const tgsIndex = userId.indexOf('@TGS#');
      pureId = userId.substring(tgsIndex);
      console.log(`检测到TGS格式群组ID: ${pureId}`);
    } else {
      // 其他情况正常移除前缀
      pureId = String(userId).replace(/^(GROUP|C2C)/, '');
    }
    
    console.log(`准备发送消息, 目标ID: ${pureId}, 是否群聊: ${isGroup}`);
    
    // 发送前检查TIM是否已初始化
    if (!TIM.getTIMInstance()) {
      console.error('TIM SDK未初始化，发送消息失败');
      throw new Error('TIM SDK未初始化，请刷新页面重试');
    }
    
    // 发送文本消息
    let message;
    const mentions = Array.isArray(options.mentions) ? options.mentions : [];
    if (isGroup && mentions.length > 0) {
      // 发送@文本消息
      message = await TIM.sendTextAtMessage(text, pureId, mentions);
    } else {
      // 普通文本消息
      message = await TIM.sendTextMessage(text, pureId, isGroup);
    }
    
    console.log('消息发送成功', message);
    
    // 转换为ChatContext需要的格式
    return {
      id: message.ID || `sent-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: formatDate(new Date())
    };
  } catch (error) {
    console.error('发送消息失败', error);
    throw error;
  }
}

/**
 * 创建新会话
 * @param {string} type 会话类型，'C2C'或'GROUP'
 * @param {Object} params 参数
 * @returns {Promise} 创建结果
 */
export async function createNewChat(type, params) {
  try {
    let conversation;
    
    if (type === 'C2C') {
      conversation = await TIM.createC2CConversation(params.userID);
    } else if (type === 'GROUP') {
      // 判断是创建群聊还是加入群聊
      if (params.isJoin && params.groupID) {
        conversation = await TIM.createGroupConversation(params.groupID);
      } else if (params.name) {
        // 创建新群组并自动添加默认成员
        const result = await TIM.createGroupWithDefaultMembers({
          name: params.name,
          addDefaultMembers: true // 自动添加默认机器人成员
        });
        
        // 确保result.group存在并有效
        if (!result || !result.group) {
          throw new Error("创建群组失败，未返回有效的群组信息");
        }
        
        // 获取群组会话
        conversation = await TIM.createGroupConversation(result.group.groupID);
        
        // 添加一个标志表示群成员已添加
        conversation.defaultMembersAdded = true;
      } else {
        throw new Error("群组参数不正确");
      }
    } else {
      throw new Error(`不支持的会话类型: ${type}`);
    }
    
    // 确保conversation对象有效
    if (!conversation) {
      throw new Error("会话创建失败，返回了空的会话对象");
    }
    
    // 转换为ChatContext需要的格式
    const isGroup = type === 'GROUP';
    
    // 安全获取profile
    const profile = isGroup ? conversation.groupProfile : conversation.userProfile;
    
    // 安全获取ID
    const id = isGroup ? (conversation.groupID || '') : (conversation.userID || '');
    if (!id) {
      console.warn('无法获取有效的会话ID，使用备用ID');
    }
    
    // 备用会话ID，从conversationID提取
    let backupId = '';
    if (conversation.conversationID) {
      const prefix = conversation.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
      backupId = conversation.conversationID.substring(prefix.length);
    }
    
    // 使用id或备用id
    const finalId = id || backupId;
    
    // 安全组装返回对象
    return {
      id: finalId,
      name: isGroup 
        ? (profile?.name || `群聊 ${finalId}`) 
        : (profile?.nick || profile?.userID || finalId),
      avatar: profile?.avatar || null,
      status: 'active',
      conversationID: conversation.conversationID,
      type: isGroup ? 'group' : 'user',
      // 传递群成员添加状态
      defaultMembersAdded: conversation.defaultMembersAdded || false
    };
  } catch (error) {
    console.error('创建新会话失败', error);
    throw error;
  }
}

/**
 * 添加事件监听
 * @param {string} eventName 事件名称
 * @param {Function} callback 回调函数
 */
export function addEventListener(eventName, callback) {
  try {
    // 使用TIM模块的addEventListener函数
    TIM.addEventListener(eventName, callback);
    console.log(`已添加事件监听: ${eventName}`);
  } catch (error) {
    console.error(`添加事件监听失败: ${eventName}`, error);
  }
}

/**
 * 移除事件监听
 * @param {string} eventName 事件名称
 * @param {Function} callback 回调函数
 */
export function removeEventListener(eventName, callback) {
  try {
    // 使用TIM模块的removeEventListener函数
    TIM.removeEventListener(eventName, callback);
    console.log(`已移除事件监听: ${eventName}`);
  } catch (error) {
    console.error(`移除事件监听失败: ${eventName}`, error);
  }
}

/**
 * 获取群组成员列表
 * @param {string} groupID 群组ID (纯ID或@TGS#格式)
 * @param {number} count 获取数量，默认100
 * @returns {Promise<Array>} 群成员列表
 */
export async function getGroupMembers(groupID, count = 100) {
  try {
    if (!groupID) throw new Error('groupID不能为空');

    // 处理@TGS#前缀
    let pureGroupID = groupID;
    if (groupID.startsWith('GROUP')) {
      pureGroupID = groupID.replace(/^GROUP/, '');
    }
    const tim = TIM.getTIMInstance();
    if (!tim) throw new Error('TIM SDK未初始化');

    const imResponse = await tim.getGroupMemberList({
      groupID: pureGroupID,
      count,
      offset: 0
    });
    // 返回成员数组
    return imResponse.data.memberList || [];
  } catch (error) {
    console.error('获取群成员列表失败', error);
    return [];
  }
} 