# Protocol Buffers 支持

本文档描述了对API规范中Protocol Buffers格式的支持实现。

## 实现概览

我们添加了对Protocol Buffers格式API的支持，主要包括以下几个方面：

1. **认证支持**：实现了JWT Token认证机制
2. **Protocol Buffers处理**：添加了序列化和反序列化支持
3. **API端点更新**：更新了所有API端点以符合规范
4. **数据转换**：实现了数据格式转换，处理雷达图和折线图数据

## 文件结构

```
src/
├── services/
│   ├── api.js             # 基础API请求工具，支持Protocol Buffers
│   ├── authService.js     # 认证服务，处理JWT Token
│   ├── cardService.js     # 卡片服务，支持探索API
│   ├── taskService.js     # 任务服务，支持任务API
│   └── endpoints.js       # API端点定义
├── utils/
│   ├── protobufHelper.js  # Protocol Buffers辅助工具
│   └── dataTransformer.js # 数据转换工具
└── pages/
    ├── ExplorePage.js     # 探索页面，使用探索API
    └── TaskPage.js        # 任务页面，使用任务API
```

## 主要功能

### 1. Protocol Buffers 支持

`protobufHelper.js` 提供了Protocol Buffers的基本支持：

- 消息类型定义
- 编码和解码功能
- 时间戳转换

### 2. 认证机制

`authService.js` 实现了JWT Token认证：

- Token存储和获取
- 用户信息管理
- 登录和登出功能

### 3. API请求工具

`api.js` 更新为支持Protocol Buffers格式：

- 支持Content-Type: application/x-protobuf
- 添加JWT Token认证头
- 处理Protocol Buffers响应

### 4. 数据转换

`dataTransformer.js` 实现了数据格式转换：

- 处理雷达图数据（从dimension字段）
- 处理折线图数据（从step字段）
- 处理时间戳格式

## 使用方法

### 1. 发送API请求

```javascript
// 获取探索列表
const response = await api.get(
  endpoints.explorations.list, 
  { params: requestParams },
  'GetExplorationsPageResponse'  // 响应消息类型
);

// 搜索探索
const response = await api.post(
  endpoints.explorations.search, 
  searchParams,
  'ExplorationSearchRequest',    // 请求消息类型
  'ExplorationSearchResponse'    // 响应消息类型
);
```

### 2. 处理响应数据

```javascript
// 处理探索列表响应
const processedResponse = processExplorationsResponse(response);

// 处理单个探索卡片
const processedCard = processExplorationCard(card);
```

## 配置选项

在 `api.js` 中，可以通过 `USE_PROTOBUF` 开关控制是否使用Protocol Buffers格式：

```javascript
// 是否使用Protocol Buffers格式
const USE_PROTOBUF = false;  // 设置为true启用Protocol Buffers
```

## 注意事项

1. 实际生产环境中应使用真实的protobufjs库，而不是当前的模拟实现
2. JWT Token应由服务端生成，当前实现仅作为示例
3. 错误处理需要进一步完善
4. 应添加单元测试确保功能正常 