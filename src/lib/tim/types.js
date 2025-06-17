/**
 * 腾讯云即时通讯IM类型定义
 * 
 * 注意：这个文件在JavaScript中主要作为文档使用，不具备类型检查功能
 */

/**
 * IM基本配置
 * @typedef {Object} TIMConfig
 * @property {number} SDKAppID - 应用ID
 * @property {string} [userID] - 用户ID
 * @property {string} [userSig] - 用户签名
 * @property {number} [logLevel] - 日志级别
 */

/**
 * 登录参数
 * @typedef {Object} TIMLoginParams
 * @property {string} userID - 用户ID
 * @property {string} userSig - 用户签名
 */

/**
 * 消息参数
 * @typedef {Object} MessageParams
 * @property {string} to - 接收方ID
 * @property {string} conversationType - 会话类型
 * @property {Object} payload - 消息内容
 * @property {string} [cloudCustomData] - 自定义数据
 * @property {string} [priority] - 优先级
 * @property {boolean} [onlineUserOnly] - 是否仅在线用户接收
 * @property {Object} [offlinePushInfo] - 离线推送信息
 */

/**
 * 消息列表参数
 * @typedef {Object} MessageListParams
 * @property {string} conversationID - 会话ID
 * @property {number} [count=15] - 消息数量
 * @property {string} [nextReqMessageID] - 下一条消息ID
 */

/**
 * 文件消息参数
 * @typedef {Object} FileMessageParams
 * @property {File} file - 文件对象
 */

/**
 * 会话对象
 * @typedef {Object} Conversation
 * @property {string} conversationID - 会话ID
 * @property {string} type - 会话类型
 * @property {string} [userID] - 用户ID（单聊）
 * @property {Object} [userProfile] - 用户资料（单聊）
 * @property {string} [groupID] - 群组ID（群聊）
 * @property {Object} [groupProfile] - 群组资料（群聊）
 * @property {number} unreadCount - 未读数
 * @property {Object} [lastMessage] - 最后一条消息
 */

/**
 * 群组对象
 * @typedef {Object} Group
 * @property {string} groupID - 群组ID
 * @property {string} name - 群组名称
 * @property {string} type - 群组类型
 * @property {string} [avatar] - 群组头像
 * @property {Array} [memberList] - 成员列表
 * @property {string} [introduction] - 群组简介
 */

export {}; 