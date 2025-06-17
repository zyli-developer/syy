/**
 * Protocol Buffers 支持工具
 * 处理protobuf格式的序列化和反序列化
 */

// 注意：实际项目中需要使用protobufjs库
// 这里提供一个模拟实现，用于演示API调用流程

// 模拟protobuf消息类型
const messageTypes = {
  // 基础消息类型
  "Error": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  
  // 探索相关消息类型
  "ExplorationsPageRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "GetExplorationsPageResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "ExplorationSearchRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "ExplorationSearchResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  
  // 任务相关消息类型
  "TasksPageRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "GetTasksPageResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "TaskSearchRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "TaskSearchResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  
  // 任务详情相关消息类型
  "TaskRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "GetTaskResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "TaskQnaRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "GetTaskQnaResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "TaskScenarioRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "GetTaskScenarioResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "TaskFlowRequest": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  },
  "GetTaskFlowResponse": {
    encode: (data) => JSON.stringify(data),
    decode: (buffer) => JSON.parse(buffer),
    create: (data) => data
  }
};

/**
 * 获取消息类型
 * @param {string} typeName - 消息类型名称
 * @returns {Object} - 消息类型对象
 */
export const getMessageType = (typeName) => {
  const messageType = messageTypes[typeName];
  if (!messageType) {
    throw new Error(`未找到消息类型: ${typeName}`);
  }
  return messageType;
};

/**
 * 编码消息
 * @param {string} typeName - 消息类型名称
 * @param {Object} data - 要编码的数据
 * @returns {string} - 编码后的数据
 */
export const encodeMessage = (typeName, data) => {
  const messageType = getMessageType(typeName);
  const message = messageType.create(data);
  return messageType.encode(message);
};

/**
 * 解码消息
 * @param {string} typeName - 消息类型名称
 * @param {string} buffer - 要解码的数据
 * @returns {Object} - 解码后的对象
 */
export const decodeMessage = (typeName, buffer) => {
  const messageType = getMessageType(typeName);
  return messageType.decode(buffer);
};

/**
 * 转换时间戳
 * @param {Object} timestamp - Protocol Buffers时间戳对象 {seconds, nanos}
 * @returns {Date} - JavaScript Date对象
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return new Date();
  }
  const milliseconds = Number(timestamp.seconds) * 1000;
  return new Date(milliseconds);
};

/**
 * 转换为时间戳
 * @param {Date} date - JavaScript Date对象
 * @returns {Object} - Protocol Buffers时间戳对象 {seconds, nanos}
 */
export const dateToTimestamp = (date) => {
  const seconds = Math.floor(date.getTime() / 1000);
  const nanos = (date.getTime() % 1000) * 1000000;
  return { seconds: String(seconds), nanos };
}; 