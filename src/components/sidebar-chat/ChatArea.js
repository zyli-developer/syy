"use client"

import { useEffect, useRef, useState, useContext } from "react"
import {
  PlusOutlined,
  CloseOutlined,
  ArrowUpOutlined,
  SmileOutlined,
  PictureOutlined,
  FileOutlined,
  AudioOutlined,
  MoreOutlined,
} from "@ant-design/icons"
import { Sender } from "@ant-design/x"
import { useChatContext } from "../../contexts/ChatContext"
import CreateChatModal from "./CreateChatModal"
import ChatMessage from "./ChatMessage"
import { OptimizationContext } from "../../contexts/OptimizationContext"
import "./sidebar-chat.css"
import { notification } from "antd"
import { getGroupMembers } from "../../services/timService"

// 引用类型定义
const QUOTE_TYPES = {
  TEXT: 'text',
  VIEWPOINT: 'viewpoint',
}

// 引用操作类型
const QUOTE_ACTIONS = {
  WHAT_DOES_IT_MEAN: 'what_does_it_mean',
  HOW_TO_OPTIMIZE: 'how_to_optimize',
}

const ChatArea = () => {
  const { 
    messages, 
    activeUser, 
    sendMessage, 
    closeChat, 
    loading, 
    createNewChat, 
    chatUsers,
    switchActiveUser,
    currentSession,
    endCurrentSession,
    refreshMessages
  } = useChatContext()

  const [inputValue, setInputValue] = useState("")
  const [quotes, setQuotes] = useState([]) // 使用数组保存多个引用
  const [isQuoteEnabled, setIsQuoteEnabled] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [groupMembers, setGroupMembers] = useState([]);
  const [mentionVisible, setMentionVisible] = useState(false);
  const [mentionCandidates, setMentionCandidates] = useState([]);
  const [mentionList, setMentionList] = useState([]); // 已选择@用户列表
  
  // 从全局上下文获取优化模式状态
  const { isOptimizationMode, currentOptimizationStep, setComments } = useContext(OptimizationContext);

  // 监听quotes数组变化，实时更新引用功能状态
  useEffect(() => {
    // 当quotes数组有内容时，表示引用功能已开启
    setIsQuoteEnabled(quotes.length > 0);
    
    // 当当前已经有引用会话时，不重复开启
    if (quotes.length > 0 && !currentSession) {
      console.log('引用功能已开启，随时可以开始新的会话');
    }
  }, [quotes, currentSession]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 消息变更时滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 监听引用内容事件
  useEffect(() => {
    const handleQuoteContent = (event) => {
      const { quoteContent, quoteType, quoteId } = event.detail;
      if (quoteContent) {
        // 添加新的引用到数组
        setQuotes(prevQuotes => [
          ...prevQuotes, 
          { 
            id: quoteId || `quote-${Date.now()}`, 
            content: quoteContent, 
            type: quoteType || QUOTE_TYPES.TEXT
          }
        ]);
      }
    };

    // 注册事件监听
    document.addEventListener('chat-set-quote-content', handleQuoteContent);

    // 清理函数
    return () => {
      document.removeEventListener('chat-set-quote-content', handleQuoteContent);
    };
  }, []);

  // 监听滚动显示回到顶部按钮
  useEffect(() => {
    const container = messagesContainerRef.current

    const handleScroll = () => {
      if (container) {
        const shouldShow = container.scrollTop > 300
        if (shouldShow !== showScrollTop) {
          setShowScrollTop(shouldShow)
        }
      }
    }

    if (container) {
      container.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [showScrollTop])

  // 当活跃用户切换到群聊时加载群成员
  useEffect(() => {
    if (activeUser && activeUser.type === 'group' && activeUser.id) {
      (async () => {
        const members = await getGroupMembers(activeUser.id, 200);
        const formatted = members.map(m => ({ userID: m.userID, nick: m.nick || m.userID }));
        setGroupMembers(formatted);
      })();
    } else {
      setGroupMembers([]);
    }
  }, [activeUser?.id]);

  // 监听输入内容以触发@提示
  const handleInputChange = (value) => {
    setInputValue(value);
    // 检查最后一个@及其后面的文本
    const atMatch = value.match(/@([\u4e00-\u9fa5\w\-]*)$/);
    if (activeUser?.type === 'group' && atMatch) {
      const keyword = atMatch[1] || '';
      const candidates = groupMembers.filter(m => m.nick.includes(keyword));
      setMentionCandidates(candidates);
      setMentionVisible(true);
    } else {
      setMentionVisible(false);
    }
  };

  // 发送消息
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      if (isQuoteEnabled) {
        const quotesFormatted = quotes.map(quote => 
          `【引用:${quote.type}】${quote.content}【/引用】`
        ).join('\n');
        
        const formattedMessage = `${quotesFormatted}\n${inputValue}`;
        sendChatMessage(formattedMessage);
      } else {
        sendChatMessage(inputValue);
      }
      
      setInputValue("");
      setQuotes([]);
    }
  }

  // 选择@成员
  const handleSelectMention = (member) => {
    // 替换输入框中最后的@关键字
    const newValue = inputValue.replace(/@([\u4e00-\u9fa5\w\-]*)$/, `@${member.nick} `);
    setInputValue(newValue);
    setMentionVisible(false);
    // 保存到mentionList，避免重复
    setMentionList(prev => {
      if (prev.find(m => m.userID === member.userID)) return prev;
      return [...prev, member];
    });
  };

  // 处理Sender组件提交事件  (修改mentions)
  const handleSubmit = (value) => {
    if (value.trim()) {
      // 根据是否有引用内容和mentions，使用不同方式
      const options = {};
      if (mentionList.length > 0) {
        options.mentions = mentionList;
      }
      if (isQuoteEnabled) {
        const quotesFormatted = quotes.map(quote => `【引用:${quote.type}】${quote.content}【/引用】`).join('\n');
        const formattedMessage = `${quotesFormatted}\n${value}`;
        sendChatMessage(formattedMessage, options);
      } else {
        sendChatMessage(value, options);
      }

      setInputValue("");
      setQuotes([]);
      setMentionList([]);
    }
  };

  // 清除指定引用内容
  const handleClearQuote = (quoteId) => {
    setQuotes(prevQuotes => {
      const newQuotes = prevQuotes.filter(quote => quote.id !== quoteId);
      // 如果清除后没有引用内容，更新引用状态
      if (newQuotes.length === 0) {
        console.log('所有引用已清除，引用功能已关闭');
      }
      return newQuotes;
    });
  }

  // 清除所有引用
  const clearAllQuotes = () => {
    setQuotes([]);
    console.log('所有引用已清除，引用功能已关闭');
  }

  // 处理创建新会话
  const handleCreateChat = async (type, params) => {
    try {
      const newChat = await createNewChat(type, params);
      setIsCreateModalOpen(false);
      
      // 如果创建/加入成功，自动切换到新的聊天
      if (newChat) {
        console.log('创建/加入聊天成功，自动切换到新的会话:', newChat);
        // 确保群聊类型正确设置
        if (type === 'GROUP') {
          newChat.type = 'group';
        }
        switchActiveUser(newChat);
        
        // 如果是加入群组，立即刷新会话列表
        if (type === 'GROUP' && params.isJoin) {
          // 添加500ms延迟确保服务器响应
          setTimeout(async () => {
            try {
              await refreshMessages();
              // 显示成功提示
              notification.success({
                message: '成功加入群聊',
                description: `已成功加入群聊 ${newChat.name || newChat.id}`
              });
            } catch (error) {
              console.error('刷新消息失败:', error);
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('创建/加入聊天失败:', error);
      notification.error({
        message: '操作失败',
        description: error.message || '创建或加入聊天失败，请重试'
      });
    }
  }

  // 处理切换会话 - 使用新的 switchActiveUser 函数
  const handleUserChange = (user) => {
    if (user) {
      // 复制用户对象，避免修改原始对象
      const userToSwitch = { ...user };
      
      // 如果没有id但有conversationID，从conversationID中提取
      if (!userToSwitch.id && userToSwitch.conversationID) {
        // 检查conversationID是否包含@TGS#格式的群组ID
        if (userToSwitch.conversationID.includes('@TGS#')) {
          // 从conversationID中提取群组ID
          const tgsIndex = userToSwitch.conversationID.indexOf('@TGS#');
          userToSwitch.id = userToSwitch.conversationID.substring(tgsIndex);
          userToSwitch.type = 'group';
          console.log(`检测到TGS格式群组ID: ${userToSwitch.id}，来自conversationID: ${userToSwitch.conversationID}`);
        } else {
          // 常规处理C2C或GROUP前缀
          const prefix = userToSwitch.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
          userToSwitch.id = userToSwitch.conversationID.substring(prefix.length);
          userToSwitch.type = prefix === 'C2C' ? 'user' : 'group';
          console.log(`本地提取用户ID: ${userToSwitch.id}，来自conversationID: ${userToSwitch.conversationID}`);
        }
      }
      
      switchActiveUser(userToSwitch);
    } else {
      console.warn('尝试切换到空的用户对象');
    }
  };

  // 检查消息数组是否有效
  const validMessages = Array.isArray(messages) ? messages : [];

  // 确保每个消息都有唯一的key
  const getMessageKey = (message, index) => {
    if (message.id) return message.id;
    if (message.timestamp) return `msg-${message.timestamp}-${index}`;
    return `msg-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 确保每个用户都有唯一的key
  const getUserKey = (user, index) => {
    // 如果有id直接使用
    if (user.id) return `user-${user.id}`;
    
    // 如果有conversationID，从中提取id
    if (user.conversationID) {
      // 检查conversationID是否包含@TGS#格式的群组ID
      if (user.conversationID.includes('@TGS#')) {
        const tgsIndex = user.conversationID.indexOf('@TGS#');
        const extractedId = user.conversationID.substring(tgsIndex);
        return `user-GROUP-${extractedId}`;
      } else {
        // 常规处理C2C或GROUP前缀
        const prefix = user.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
        const extractedId = user.conversationID.substring(prefix.length);
        return `user-${prefix}-${extractedId}`;
      }
    }
    
    // 最后的备选方案
    return `user-${index}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 打印调试信息
  useEffect(() => {
    console.log('ChatArea渲染，消息数量:', validMessages.length, '活跃用户:', activeUser);
  }, [validMessages.length, activeUser]);

  // 处理引用操作
  const handleQuoteAction = (actionType, quoteContent) => {
    // 根据操作类型生成不同的文本
    let actionText = '';
    
    switch (actionType) {
      case QUOTE_ACTIONS.WHAT_DOES_IT_MEAN:
        actionText = `这是什么意思？`;
        break;
      case QUOTE_ACTIONS.HOW_TO_OPTIMIZE:
        actionText = `如何优化这里？`;
        break;
      default:
        actionText = '';
    }
    
    // 如果有操作文本，填入到输入框而不是直接发送
    if (actionText) {
      // 保留引用内容，不清空quotes
      // 只更新输入框内容
      setInputValue(actionText);
      
      // 聚焦到输入框（可选）
      const inputElement = document.querySelector('.antdx-sender-input');
      if (inputElement) {
        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  // 组件挂载时和活跃用户变化时主动刷新消息
  useEffect(() => {
    if (activeUser && activeUser.id) {
      console.log('ChatArea组件主动刷新消息，activeUser:', activeUser.id);
      refreshMessages().catch(err => {
        console.error('刷新消息失败:', err);
      });
    }
  }, [activeUser?.id]);

  // 页面可见性变化时刷新消息，确保切换回页面时能看到最新消息
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeUser) {
        console.log('页面变为可见，刷新消息');
        refreshMessages().catch(err => {
          console.error('可见性变化刷新消息失败:', err);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeUser?.id]);

  // 直接使用上下文的 sendMessage
  const sendChatMessage = sendMessage;

  return (
    <div className="chat-container">
      {/* 聊天头部 */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-user-avatar">
            {activeUser && activeUser.avatar ? (
              <img src={activeUser.avatar} alt={activeUser?.name || 'User'} />
            ) : (
              <span>{activeUser?.name?.charAt(0) || '?'}</span>
            )}
          </div>
          <div className="chat-user-details">
            <div className="chat-user-name">{activeUser?.name || '未知用户'}</div>
            <div className="chat-user-status">
              <span className="status-dot"></span>
              <span className="status-text">Active</span>
            </div>
          </div>
        </div>
        <button className="chat-close-btn" onClick={closeChat} type="button">
          <CloseOutlined />
        </button>
      </div>
      
      {/* 当前会话引用栏 - 独立显示在消息列表顶部 */}
      {currentSession && (
        <div className="active-session-bar">
          <div className="active-session-content">
            <div className="active-session-quote">
              {currentSession.quoteContent}
            </div>
            <button 
              className="close-session-btn" 
              onClick={endCurrentSession}
            >
              关闭引用
            </button>
          </div>
        </div>
      )}

      {/* 聊天消息区域 */}
      <div className="chat-messages" ref={messagesContainerRef}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>加载消息中...</div>
        ) : validMessages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>暂无消息，开始聊天吧</div>
        ) : (
          <div className="messages-wrapper">
            {validMessages.map((message, index) => (
              <ChatMessage 
                key={getMessageKey(message, index)} 
                message={{
                  ...message,
                  isFirstMessage: index === 0 // 标记第一条消息
                }} 
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 右侧功能区 */}
      <div className="chat-sidebar">
        <button className="sidebar-button" type="button" onClick={() => setIsCreateModalOpen(true)}>
          <PlusOutlined />
        </button>
        <div className="sidebar-divider"></div>
        <div className="sidebar-chat-users">
          {chatUsers.map((user, index) => (
            <div 
              key={getUserKey(user, index)}
              className={`sidebar-chat-user ${activeUser?.id === user.id ? 'active' : ''}`}
              onClick={() => handleUserChange(user)}
            >
              <div className="sidebar-chat-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name?.charAt(0) || '?'}</span>
                )}
                {user.unreadCount > 0 && (
                  <span className="unread-badge">{user.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 聊天输入区域 - 使用Sender组件 */}
      <div className="chat-input-wrapper">
        {isQuoteEnabled && (
          <div className="chat-quotes-wrapper">
            {/* 提示按钮区域 - 移到quotes外部，只显示一次 */}
            <div className="chat-quote-actions">
              <button 
                className="chat-quote-action-btn"
                onClick={() => handleQuoteAction(QUOTE_ACTIONS.WHAT_DOES_IT_MEAN, quotes[0]?.content || '')}
              >
                这是什么意思
              </button>
              <button 
                className="chat-quote-action-btn"
                onClick={() => handleQuoteAction(QUOTE_ACTIONS.HOW_TO_OPTIMIZE, quotes[0]?.content || '')}
              >
                如何优化这里
              </button>
            </div>
            
            {/* 引用内容容器 */}
          <div className="chat-quotes-container">
            {quotes.map((quote) => (
                <div key={quote.id}>
                  <div className="chat-quote-header">
                <div className="chat-quote-icon">
                  <CloseOutlined onClick={() => handleClearQuote(quote.id)} />
                </div>
                <div className="chat-quote-content-text">{quote.content}</div>
                <div className="chat-quote-label">
                  {quote.type === 'viewpoint' ? '观点' : '文本'}
                    </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
        <Sender
          value={inputValue}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          placeholder={isQuoteEnabled ? "请输入对引用内容的回复..." : "请输入文字"}
          autoSize={{ minRows: 1, maxRows: 4 }}
          className={`chat-sender ${isQuoteEnabled ? 'has-quotes' : ''}`}
          submitType="enter"
          disabled={!activeUser}
        />
        {mentionVisible && mentionCandidates.length > 0 && (
          <div className="mention-dropdown">
            {mentionCandidates.map(member => (
              <div key={member.userID} className="mention-item" onClick={() => handleSelectMention(member)}>
                {member.nick}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 创建新会话模态窗口 */}
      {isCreateModalOpen && <CreateChatModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateChat} />}
    </div>
  )
}

export default ChatArea
