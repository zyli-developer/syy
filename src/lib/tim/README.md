# 腾讯云即时通讯IM集成方案

本方案实现了基于腾讯云即时通讯SDK的聊天功能，并与现有UI组件进行了无缝集成。

## 目录结构

```
src/
  ├── lib/
  │   └── tim/             # 腾讯IM核心库
  │       ├── constants.js # 常量定义
  │       ├── types.js     # 类型定义
  │       ├── core.js      # 核心功能
  │       ├── auth.js      # 认证相关
  │       ├── message.js   # 消息相关
  │       ├── conversation.js # 会话相关
  │       └── index.js     # 导出入口
  ├── services/
  │   └── timService.js    # IM服务封装
  ├── contexts/
  │   └── ChatContext.js   # 聊天上下文
  └── components/
      └── chat/            # 聊天UI组件
          ├── ChatArea.js  # 聊天区域
          ├── ChatHeader.js # 聊天头部
          ├── ChatInput.js # 聊天输入
          ├── ChatMessage.js # 聊天消息
          ├── QuickSendPanel.js # 快速发送面板
          └── chat-area.css # 样式文件
```

## 主要功能

1. **初始化与认证**
   - 初始化腾讯IM SDK
   - 实现用户登录/登出
   - 会话状态管理

2. **消息功能**
   - 发送文本消息
   - 接收消息
   - 获取历史消息
   - 标记已读

3. **会话管理**
   - 获取会话列表
   - 创建新会话
   - 删除会话

## 使用方法

1. **初始化**

在应用入口处初始化IM:

```jsx
import { useEffect } from 'react';
import * as timService from './services/timService';

function App() {
  useEffect(() => {
    // 初始化IM
    timService.initTIM();
    
    // 应用卸载时清理
    return () => {
      timService.logoutTIM();
    };
  }, []);
  
  return (
    // ...应用内容
  );
}
```

2. **使用ChatContext**

在组件中使用聊天功能:

```jsx
import { useChatContext } from '../contexts/ChatContext';

function MyChatComponent() {
  const { 
    isChatOpen, 
    toggleChat, 
    messages, 
    sendMessage,
    activeUser,
    setActiveUser,
    chatUsers
  } = useChatContext();
  
  return (
    <div>
      <button onClick={toggleChat}>打开聊天</button>
      
      {isChatOpen && (
        <div>
          {/* 聊天界面 */}
        </div>
      )}
    </div>
  );
}
```

## Mock数据与生产环境

当前实现使用的是Mock数据，实际使用时需要替换为真实的腾讯云IM配置：

1. 在`timService.js`中，将`TIM_CONFIG`修改为真实配置:

```js
const TIM_CONFIG = {
  SDKAppID: 你的应用ID, // 替换为实际的SDKAppID
  logLevel: TIM.LOG_LEVEL.INFO
};
```

2. 在生产环境中，需要后端生成userSig:

```js
// 登录示例
export async function loginTIM(userID, userSig) {
  // userSig需要由后端生成
  // ...
}
```

## 注意事项

1. 此实现是基于Mock数据的，生产环境需要配置实际的腾讯云IM应用ID和userSig。
2. 实际应用中可能需要根据业务需求扩展更多功能，如图片消息、文件消息等。
3. 当前版本已适配现有UI组件，并保持了原有的交互体验。 