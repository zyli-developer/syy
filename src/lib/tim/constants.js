/**
 * 腾讯云即时通讯IM常量定义
 */
import TencentCloudChat from '@tencentcloud/chat';

// 日志级别
export const LOG_LEVEL = {
  NONE: 0, // 关闭日志
  ERROR: 1, // 仅错误
  WARN: 2, // 警告和错误
  INFO: 3, // 信息、警告和错误
  DEBUG: 4, // 调试信息、信息、警告和错误
}

// 会话类型
export const CONVERSATION_TYPE = {
  C2C: 'C2C', // 单聊
  GROUP: 'GROUP', // 群聊
}

// 消息类型
export const MESSAGE_TYPE = {
  TEXT: 'TIMTextElem', // 文本消息
  IMAGE: 'TIMImageElem', // 图片消息
  AUDIO: 'TIMSoundElem', // 语音消息
  VIDEO: 'TIMVideoFileElem', // 视频消息
  FILE: 'TIMFileElem', // 文件消息
  CUSTOM: 'TIMCustomElem', // 自定义消息
  FACE: 'TIMFaceElem', // 表情消息
  LOCATION: 'TIMLocationElem', // 位置消息
}

// 自定义消息业务类型
export const CUSTOM_MESSAGE_TYPE = {
  SESSION_START: 'session_start', // Session开始
  SESSION_END: 'session_end', // Session结束
}

// 消息优先级
export const MESSAGE_PRIORITY = {
  HIGH: 'high', // 高优先级
  NORMAL: 'normal', // 普通优先级
  LOW: 'low', // 低优先级
  LOWEST: 'lowest', // 最低优先级
}

// 腾讯云IM事件 - 使用SDK原生事件常量
export const TIM_EVENT = TencentCloudChat.EVENT; 

// Session状态
export const SESSION_STATUS = {
  OPENED: 'opened',
  CLOSED: 'closed',
} 