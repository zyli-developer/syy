"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { formatDate } from "../utils/dateUtils"
import * as timService from "../services/timService"
import { notification } from "antd"
import { TIM_EVENT } from "../lib/tim/constants"
import { 
  sendSessionStartMessage,
  sendSessionEndMessage,
  extractSessionData
} from "../lib/tim/message"
import { SESSION_STATUS, CUSTOM_MESSAGE_TYPE } from "../lib/tim/constants"
import { getCurrentUser } from "../services/authService"

const ChatContext = createContext()

export const useChatContext = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeUser, setActiveUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatUsers, setChatUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const sendingMessageRef = useRef(false)

  // Session相关状态
  const [currentSession, setCurrentSession] = useState(null)
  const [sessionHistory, setSessionHistory] = useState([])
  const [expandedSessions, setExpandedSessions] = useState({})

  // 新增：暴露初始化和登录IM的方法
  const initChat = async (userID, userSig) => {
      try {
        // 初始化TIM SDK
        const initResult = await timService.initTIM();
        if (!initResult) {
          console.error("TIM SDK初始化失败");
          return;
        }
        // 添加SDK_READY事件监听
        timService.addEventListener(TIM_EVENT.SDK_READY, () => {
          setSdkReady(true);
        // ... existing SDK_READY logic ...
      });
        timService.addEventListener(TIM_EVENT.SDK_NOT_READY, () => {
          setSdkReady(false);
        });
        // 登录TIM
      await timService.loginTIM(userID, userSig);
        setInitialized(true);
        console.log("TIM登录成功，等待SDK Ready");
      } catch (error) {
        console.error("聊天初始化失败:", error);
      }
    };

  // 监听新消息事件
  useEffect(() => {
    if (!initialized) return;
    
    // 添加消息接收监听器
    const handleMessageReceived = event => {
      console.log('收到新消息:', event);
      // 检查消息是否属于当前活跃会话
      if (activeUser && event.data) {
        const newMessages = event.data.filter(msg => {
          // 根据消息的conversationID判断是否属于当前会话
          const isGroupMessage = msg.conversationType === 'GROUP';
          const msgFromId = isGroupMessage ? `GROUP${msg.to}` : `C2C${msg.from}`;
          const msgToId = isGroupMessage ? `GROUP${msg.to}` : `C2C${msg.to}`;
          
          const currentConvID = activeUser.conversationID || 
                               (activeUser.type === 'group' ? `GROUP${activeUser.id}` : `C2C${activeUser.id}`);
          
          return msgFromId === currentConvID || msgToId === currentConvID;
        });
        
        if (newMessages.length > 0) {
          // 转换消息格式并添加到当前消息列表
          const formattedMessages = newMessages.map(msg => ({
            id: msg.ID || `tmp-${Date.now()}-${Math.random()}`,
            sender: msg.flow === 'in' ? 'other' : 'user',
            text: msg.payload?.text || msg.elements?.[0]?.content?.text || '',
            timestamp: formatDate(new Date(msg.time * 1000))
          }));
          
          setMessages(prev => [...prev, ...formattedMessages]);
        }
      }
    };
    
    // 添加会话列表更新监听器
    const handleConversationListUpdated = event => {
      console.log('会话列表更新:', event);
      // 刷新会话列表
      if (sdkReady) {
        timService.getChatUsers().then(users => {
          if (Array.isArray(users) && users.length > 0) {
            setChatUsers(users);
          }
        }).catch(err => {
          console.error("获取会话列表失败:", err);
        });
      }
    };
    
    // 注册事件监听
    timService.addEventListener(TIM_EVENT.MESSAGE_RECEIVED, handleMessageReceived);
    timService.addEventListener(TIM_EVENT.CONVERSATION_LIST_UPDATED, handleConversationListUpdated);
    
    // 清理函数
    return () => {
      timService.removeEventListener(TIM_EVENT.MESSAGE_RECEIVED, handleMessageReceived);
      timService.removeEventListener(TIM_EVENT.CONVERSATION_LIST_UPDATED, handleConversationListUpdated);
    };
  }, [initialized, activeUser, sdkReady]);

  // 获取聊天用户列表 - 仅在SDK就绪后执行
  useEffect(() => {
    if (!initialized || !sdkReady) return;
    
    console.log("SDK已就绪，开始获取会话列表");
    const fetchChatUsers = async () => {
      try {
        // 获取聊天用户
        const users = await timService.getChatUsers();
        
        // 确保用户列表有效
        if (Array.isArray(users) && users.length > 0) {
          setChatUsers(users);
          
          // 从会话列表中查找ID为@RBT#001的用户
          const robotUser = users.find(user => user.id === "@RBT#001");
          
          if (robotUser) {
            // 如果找到机器人用户，设置为活跃用户
            setActiveUser(robotUser);
            setIsChatOpen(true); // 自动打开聊天窗口
          } else if (users.length > 0) {
            // 如果没找到但有其他用户，设置第一个用户为活跃用户
            setActiveUser(users[0]);
          }
        } else {
          console.log("没有聊天用户可用，创建默认用户");
          // 创建一个默认用户
          const defaultUser = {
            id: "@RBT#001",
            name: "智能助手",
            avatar: null,
            status: "active",
            type: "user"
          };
          
          // 尝试创建默认会话
          try {
            await timService.createNewChat('C2C', { userID: defaultUser.id });
            setChatUsers([defaultUser]);
            setActiveUser(defaultUser);
          } catch (err) {
            console.error("创建默认会话失败:", err);
            setChatUsers([]);
          }
        }
      } catch (error) {
        console.error("获取聊天用户失败:", error);
        setChatUsers([]);
      }
    };

    fetchChatUsers();
  }, [initialized, sdkReady]);

  // 获取与当前活跃用户的聊天消息
  useEffect(() => {
    if (!initialized || !sdkReady || !activeUser || !activeUser.id) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      // 先清空消息列表，避免显示上一个会话的消息
      setMessages([]);
      
      try {
        console.log(`开始获取用户(${activeUser.id})的聊天消息`);
        const messages = await timService.getChatMessages(activeUser.id);
        
        if (Array.isArray(messages)) {
          console.log(`获取到${messages.length}条消息`, messages.length > 0 ? messages[0] : '无消息');
          setMessages(messages);
        } else {
          console.warn('获取到的消息不是数组:', messages);
          setMessages([]);
        }
      } catch (error) {
        console.error("获取聊天消息失败:", error);
        setMessages([]); // 出错时设置为空数组
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeUser, initialized, sdkReady]);

  // 监听会话历史变化，保存到本地存储
  useEffect(() => {
    if (sessionHistory.length > 0) {
      try {
        localStorage.setItem('session_history', JSON.stringify(sessionHistory));
        console.log("会话历史已保存到本地存储", sessionHistory);
      } catch(err) {
        console.error("保存会话历史失败", err);
      }
    }
  }, [sessionHistory]);

  // 添加一个新的Effect钩子，用于监听消息中的会话标记
  useEffect(() => {
    if (!messages.length) return;
    
    // 查找会话相关消息
    const sessionMessages = messages.filter(msg => 
      msg.type === 'custom' && 
      msg.sessionData && 
      (msg.sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START || 
       msg.sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END)
    );
    
    if (sessionMessages.length > 0) {
      console.log(`发现${sessionMessages.length}条会话相关消息`);
      
      // 处理会话开始消息
      const startMessages = sessionMessages.filter(msg => 
        msg.sessionData && msg.sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START
      );
      
      // 处理会话结束消息
      const endMessages = sessionMessages.filter(msg => 
        msg.sessionData && msg.sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END
      );
      
      // 更新会话历史
      if (startMessages.length > 0 || endMessages.length > 0) {
        setSessionHistory(prev => {
          const updatedHistory = [...prev];
          
          // 处理开始消息
          for (const msg of startMessages) {
            const sessionId = msg.sessionData.sessionId;
            const existingIndex = updatedHistory.findIndex(s => s.id === sessionId);
            
            if (existingIndex >= 0) {
              // 更新现有会话
              updatedHistory[existingIndex] = {
                ...updatedHistory[existingIndex],
                quoteContent: msg.sessionData.quoteContent,
                startTime: msg.sessionData.timestamp,
                status: SESSION_STATUS.OPENED,
                isPersistent: true
              };
            } else {
              // 添加新会话
              updatedHistory.push({
                id: sessionId,
                quoteContent: msg.sessionData.quoteContent,
                startTime: msg.sessionData.timestamp,
                status: SESSION_STATUS.OPENED,
                isPersistent: true
              });
            }
          }
          
          // 处理结束消息
          for (const msg of endMessages) {
            const sessionId = msg.sessionData.sessionId;
            const existingIndex = updatedHistory.findIndex(s => s.id === sessionId);
            
            if (existingIndex >= 0) {
              // 更新现有会话
              updatedHistory[existingIndex] = {
                ...updatedHistory[existingIndex],
                endTime: msg.sessionData.timestamp,
                status: SESSION_STATUS.CLOSED,
                isPersistent: true
              };
            } else {
              // 添加新会话（异常情况，只有结束消息）
              updatedHistory.push({
                id: sessionId,
                quoteContent: msg.sessionData.quoteContent || '',
                startTime: 0,
                endTime: msg.sessionData.timestamp,
                status: SESSION_STATUS.CLOSED,
                isPersistent: true
              });
            }
          }
          
          console.log('更新会话历史:', updatedHistory);
          return updatedHistory;
        });
        
        // 如果有活跃会话但不在会话历史中，使用找到的第一个开始会话
        if (!currentSession && startMessages.length > 0) {
          const latestStartMsg = startMessages.sort((a, b) => 
            (b.sessionData.timestamp || 0) - (a.sessionData.timestamp || 0)
          )[0];
          
          if (latestStartMsg) {
            const correspondingEndMsg = endMessages.find(msg => 
              msg.sessionData.sessionId === latestStartMsg.sessionData.sessionId
            );
            
            if (!correspondingEndMsg) {
              // 只有当没有对应的结束消息时，才设置为当前会话
              setCurrentSession({
                id: latestStartMsg.sessionData.sessionId,
                quoteContent: latestStartMsg.sessionData.quoteContent,
                startTime: latestStartMsg.sessionData.timestamp,
                status: SESSION_STATUS.OPENED,
                isPersistent: true
              });
              
              console.log('恢复活跃会话:', latestStartMsg.sessionData.sessionId);
            }
          }
        }
      }
    }
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  // 发送消息
  const sendMessage = async (text, options = {}) => {
    if (!text || !activeUser) return;
    
    try {
      // 检查是否包含引用内容
      const quoteMatch = text.match(/【引用:(.*?)】(.*?)【\/引用】/);
      
      // 首先判断消息中是否包含引用，如果包含且当前没有活跃会话，则创建新的会话
      if (quoteMatch && !currentSession) {
        // 如果消息中包含引用内容，且当前没有开启的会话，创建一个新的会话
        const quoteContent = quoteMatch[2];
        const isGroup = activeUser.type === 'group';
        
        // 创建会话ID
        const sessionId = `session_${Date.now()}`;
        const startTime = Date.now();
        
        // 1. 发送会话开始消息
        const startMessage = await sendSessionStartMessage(
          quoteContent, 
          activeUser.id, 
          isGroup,
          sessionId,
          startTime
        );
        
        // 2. 设置当前会话
        const sessionData = extractSessionData(startMessage);
        if (sessionData) {
          const newSession = {
            id: sessionData.sessionId,
            quoteContent: sessionData.quoteContent,
            startTime: sessionData.timestamp,
            status: SESSION_STATUS.OPENED,
            isPersistent: sessionData.isPersistent || true, // 支持跨段历史记录
            creator: sessionData.creator || 'unknown'
          };
          
          setCurrentSession(newSession);
          
          // 也添加到会话历史中
          setSessionHistory(prev => {
            // 检查是否已存在
            if (prev.some(s => s.id === newSession.id)) {
              return prev;
            }
            console.log(`添加会话到历史: ID=${newSession.id}, 开始时间=${new Date(newSession.startTime).toLocaleString()}`);
            return [...prev, newSession];
          });
          
          console.log(`会话已创建: ID=${sessionData.sessionId}`);
          
          // 3. 添加会话开始消息到UI
          const startUIMessage = {
            id: startMessage.ID || `session-start-${Date.now()}`,
            type: 'custom',
            flow: 'out',
            time: startTime / 1000, // 转换为秒
            cloudCustomData: JSON.stringify(sessionData),
            sessionData: sessionData,
            payload: {
              data: JSON.stringify(sessionData),
              description: '引用会话开始'
            },
            sender: 'system',
            timestamp: new Date(startTime).toLocaleString()
          };
          
          // 更新消息列表，添加会话开始消息
          setMessages(prev => [...prev, startUIMessage]);
        }
        
        // 4. 发送普通文本消息
        const textMessage = await timService.sendMessage(activeUser.id, text, options);
        
        // 5. 将发送的文本消息添加到UI
        const newUIMessage = {
          id: textMessage.ID || `msg-${Date.now()}`,
          sender: 'user',
          text: text,
          timestamp: new Date().toLocaleString(),
          time: Date.now() / 1000,
          // 添加会话ID，便于追踪
          sessionId: sessionId
        };
        
        // 更新消息列表
        setMessages(prev => [...prev, newUIMessage]);
      } else {
        // 正常发送文本消息
        const isGroup = activeUser.type === 'group';
        const textMessage = await timService.sendMessage(activeUser.id, text, options);
        
        // 将发送的文本消息添加到UI
        const newUIMessage = {
          id: textMessage.ID || `msg-${Date.now()}`,
          sender: 'user',
          text: text,
          timestamp: new Date().toLocaleString(),
          time: Date.now() / 1000,
          // 如果当前有活跃会话，附加会话ID
          ...(currentSession ? { sessionId: currentSession.id } : {})
        };
        
        // 更新消息列表
        setMessages(prev => [...prev, newUIMessage]);
      }
    } catch (error) {
      console.error("发送消息失败", error);
      // 添加错误消息到界面
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: 'user',
        text: text,
        timestamp: new Date().toLocaleString(),
        error: true,
        errorMessage: error.message || '发送失败'
      }]);
    }
  }
  
  // 结束当前会话
  const endCurrentSession = async () => {
    if (!currentSession || !activeUser) return;
    
    try {
      const isGroup = activeUser.type === 'group';
      
      // 记录会话结束时间
      const endTime = Date.now();
      
      // 发送会话结束消息
      const endMessage = await sendSessionEndMessage(
        currentSession.id,
        currentSession.quoteContent,
        activeUser.id,
        isGroup
      );
      
      // 从返回的消息中提取session数据
      const sessionData = extractSessionData(endMessage);
      
      // 更新会话历史
      const historyEntry = {
        ...currentSession,
        endTime: endTime,
        status: SESSION_STATUS.CLOSED,
        isPersistent: true // 标记为持久化会话，支持跨段历史记录
      };
      
      // 更新会话历史
      setSessionHistory(prev => {
        // 检查是否已存在相同ID的会话，如果有则更新，没有则添加
        const existingIndex = prev.findIndex(s => s.id === currentSession.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = historyEntry;
          console.log(`更新已有会话: ID=${currentSession.id}, 结束时间=${new Date(endTime).toLocaleString()}`);
          return updated;
        } else {
          console.log(`添加会话历史: 会话${currentSession.id}, 开始=${new Date(currentSession.startTime).toLocaleString()}, 结束=${new Date(endTime).toLocaleString()}`);
          return [...prev, historyEntry];
        }
      });
      
      // 添加会话结束消息到UI
      const endUIMessage = {
        id: endMessage.ID || `session-end-${Date.now()}`,
        type: 'custom',
        flow: 'out',
        time: endTime / 1000,
        cloudCustomData: JSON.stringify(sessionData || {
          sessionType: CUSTOM_MESSAGE_TYPE.SESSION_END,
          sessionId: currentSession.id,
          quoteContent: currentSession.quoteContent,
          timestamp: endTime,
          isPersistent: true // 支持跨段历史
        }),
        sessionData: sessionData || {
          sessionType: CUSTOM_MESSAGE_TYPE.SESSION_END,
          sessionId: currentSession.id,
          quoteContent: currentSession.quoteContent,
          timestamp: endTime,
          isPersistent: true
        },
        payload: {
          data: JSON.stringify(sessionData || {
            sessionType: CUSTOM_MESSAGE_TYPE.SESSION_END,
            sessionId: currentSession.id,
            quoteContent: currentSession.quoteContent,
            timestamp: endTime,
            isPersistent: true
          }),
          description: '引用会话结束'
        },
        sender: 'system',
        text: '引用会话结束',
        timestamp: new Date(endTime).toLocaleString()
      };
      
      // 更新消息列表，添加会话结束消息
      setMessages(prev => [...prev, endUIMessage]);
      
      console.log(`会话已结束: ID=${currentSession.id}`);
      
      // 清除当前会话
      setCurrentSession(null);
    } catch (error) {
      console.error("结束会话失败", error);
    }
  }
  
  // 切换会话展开/收起状态
  const toggleSessionExpand = (sessionId) => {
    if (!sessionId) {
      console.warn('toggleSessionExpand: 会话ID不能为空');
      return;
    }
    
    // 查找对应会话
    const session = sessionHistory.find(s => s.id === sessionId);
    if (!session) {
      console.warn(`toggleSessionExpand: 找不到会话 ${sessionId}`);
      return;
    }
    
    // 切换展开状态
    const newExpandedState = !(expandedSessions[sessionId] !== false);
    console.log(`切换会话 ${sessionId} 的展开状态: ${newExpandedState ? '展开' : '折叠'}`);
    
    setExpandedSessions(prev => {
      const newState = {
        ...prev,
        [sessionId]: newExpandedState
      };
      
      // 打印所有会话的展开状态，便于调试
      console.log('会话展开状态更新:', newState);
      
      return newState;
    });
  }
  
  // 当会话ID变更时，自动结束当前会话
  useEffect(() => {
    if (currentSession && activeUser) {
      // 如果切换了会话，自动结束当前session
      return () => {
        endCurrentSession();
      };
    }
  }, [activeUser?.id]);
      
  // 处理接收到的消息
  const handleReceivedMessages = (messages) => {
    if (!Array.isArray(messages)) return;
    
    const processedMessages = messages.map(msg => {
      // 检查是否为Session相关消息
      const sessionData = extractSessionData(msg);
      
      if (sessionData) {
        // 如果是Session开始消息
        if (sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START) {
          // 创建新会话
          const newSession = {
            id: sessionData.sessionId,
            quoteContent: sessionData.quoteContent,
            startTime: sessionData.timestamp,
            status: SESSION_STATUS.OPENED,
            isPersistent: sessionData.isPersistent || true, // 支持跨段历史记录
            creator: sessionData.creator || 'unknown'
          };
          
          // 更新当前会话状态
          if (!currentSession || currentSession.id !== sessionData.sessionId) {
            setCurrentSession(newSession);
      
            // 添加到会话历史
            setSessionHistory(prev => {
              // 检查是否存在同ID会话，避免重复添加
              if (prev.some(s => s.id === newSession.id)) {
                // 如果存在，更新会话状态为打开
                return prev.map(s => s.id === newSession.id 
                  ? {...s, status: SESSION_STATUS.OPENED} 
                  : s);
              }
              console.log(`接收到会话开始消息: ID=${newSession.id}, 时间=${new Date(newSession.startTime).toLocaleString()}`);
              return [...prev, newSession];
            });
          }
          
          // 返回处理后的消息对象，确保UI可以正确显示
          return {
              ...msg, 
            id: msg.ID || `session-start-${Date.now()}`,
            sender: 'system',
            type: 'custom',
            sessionId: sessionData.sessionId,
            sessionData: sessionData,
            text: `引用会话开始: ${sessionData.quoteContent}`,
            timestamp: new Date(sessionData.timestamp || (msg.time * 1000)).toLocaleString()
          };
        } 
        // 如果是Session结束消息
        else if (sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END) {
          // 获取结束时间
          const endTime = sessionData.timestamp || (msg.time * 1000);
          
          // 添加到会话历史
          setSessionHistory(prev => {
            const existingIndex = prev.findIndex(s => s.id === sessionData.sessionId);
            if (existingIndex >= 0) {
              // 更新现有会话
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                endTime: endTime,
                status: SESSION_STATUS.CLOSED,
                isPersistent: sessionData.isPersistent || true, // 支持跨段历史记录
                closedBy: sessionData.closedBy || 'unknown'
              };
              console.log(`更新已有会话: ID=${sessionData.sessionId}, 结束时间=${new Date(endTime).toLocaleString()}`);
              return updated;
            } else {
              // 添加新会话
              console.log(`添加新会话结束记录: ID=${sessionData.sessionId}, 结束时间=${new Date(endTime).toLocaleString()}`);
              return [...prev, {
                id: sessionData.sessionId,
                quoteContent: sessionData.quoteContent,
                startTime: sessionData.timestamp || 0,
                endTime: endTime,
                status: SESSION_STATUS.CLOSED,
                isPersistent: sessionData.isPersistent || true, // 支持跨段历史记录
                closedBy: sessionData.closedBy || 'unknown'
              }];
            }
          });
          
          // 如果是当前会话，则清除当前会话
          if (currentSession && currentSession.id === sessionData.sessionId) {
            setCurrentSession(null);
          }
          
          // 返回处理后的消息对象
          return {
            ...msg,
            id: msg.ID || `session-end-${Date.now()}`,
            sender: 'system',
            type: 'custom',
            sessionId: sessionData.sessionId,
            sessionData: sessionData,
            text: '引用会话结束',
            timestamp: new Date(endTime).toLocaleString()
          };
        }
      }
      
      // 处理普通消息
      let sender = msg.from === "你" ? "user" : "other";
      if (msg.flow === 'in') {
        sender = 'other';
      } else if (msg.flow === 'out') {
        sender = 'user';
      }
      
      // 尝试确定消息所属的会话ID
      let sessionId = null;
      
      // 1. 尝试从message的cloudCustomData中获取
      if (msg.cloudCustomData) {
        try {
          const data = JSON.parse(msg.cloudCustomData);
          if (data.sessionId) {
            sessionId = data.sessionId;
          }
        } catch (e) {}
      }
      
      // 2. 如果当前有活跃会话且消息时间在会话时间范围内，则属于当前会话
      if (currentSession && !sessionId) {
        const msgTime = msg.time * 1000;
        if (msgTime >= currentSession.startTime && (!currentSession.endTime || msgTime <= currentSession.endTime)) {
          sessionId = currentSession.id;
      }
      }
      
      // 3. 如果还没找到sessionId，检查历史会话
      if (!sessionId) {
        const msgTime = msg.time * 1000;
        for (const session of sessionHistory) {
          const sessionStartTime = session.startTime || 0;
          const sessionEndTime = session.endTime || Number.MAX_SAFE_INTEGER;
          
          if (msgTime >= sessionStartTime && msgTime <= sessionEndTime) {
            sessionId = session.id;
            break;
          }
        }
      }
      
      return {
        ...msg,
        id: msg.ID || `msg-${Date.now()}-${Math.random()}`,
        sender: sender,
        text: msg.payload?.text || msg.payload?.description || "",
        timestamp: new Date(msg.time * 1000).toLocaleString(),
        time: msg.time || Date.now() / 1000,
        sessionId: sessionId  // 添加会话ID
      };
    });
    
    // 确保消息按时间排序
    processedMessages.sort((a, b) => (a.time || 0) - (b.time || 0));
    
    // 更新消息列表
    setMessages(processedMessages);
  };

  const createChat = async (type, params) => {
    if (!initialized) return null;
    
    try {
      return await timService.createNewChat(type, params);
    } catch (error) {
      console.error("创建聊天失败:", error);
      return null;
    }
  };
  
  // 为了兼容性保留原函数名
  const createNewChat = async (type, params) => {
    return createChat(type, params);
  };

  /**
   * 切换当前活跃聊天用户
   * @param {Object} user 用户对象
   */
  const switchActiveUser = (user) => {
    if (!user) {
      console.warn('用户对象为空，无法切换聊天');
      return;
    }
    
    // 如果没有id但有conversationID，从conversationID中提取id
    if (!user.id && user.conversationID) {
      // conversationID格式为 "C2C{userId}" 或 "GROUP{groupId}"
      const prefix = user.conversationID.startsWith('C2C') ? 'C2C' : 'GROUP';
      user.id = user.conversationID.substring(prefix.length);
      user.type = prefix === 'C2C' ? 'user' : 'group';
      console.log(`从conversationID(${user.conversationID})中提取ID: ${user.id}`);
    }
    
    if (!user.id) {
      console.warn('用户对象缺少ID，无法切换聊天', user);
      return;
    }
    
    const isChangingUser = activeUser?.id !== user.id;
    console.log(`切换聊天用户: ${user.id}`, { isChangingUser, user });
    
    // 先清空消息，避免旧消息闪现
    if (isChangingUser) {
      setMessages([]);
      setLoading(true);
    }
    
    // 设置活跃用户
    setActiveUser(user);
    
    // 如果是新用户，确保立即获取消息
    if (isChangingUser && sdkReady) {
      // 使用一个小延迟确保activeUser状态已更新
      setTimeout(async () => {
        try {
          const messages = await timService.getChatMessages(user.id);
          if (Array.isArray(messages)) {
            setMessages(messages);
          }
        } catch (error) {
          console.error("获取聊天消息失败:", error);
        } finally {
          setLoading(false);
        }
      }, 100);
    }
    
    // 打开聊天窗口
    setIsChatOpen(true);
  };

  // 刷新消息列表
  const refreshMessages = async () => {
    if (!activeUser || !initialized || !sdkReady) return;
    
    try {
      setLoading(true);
      console.log(`刷新用户(${activeUser.id})的聊天消息`);
      const freshMessages = await timService.getChatMessages(activeUser.id);
      
      if (Array.isArray(freshMessages)) {
        console.log(`刷新获取到${freshMessages.length}条消息`);
        
        // 检查是否有会话相关消息
        const sessionDividers = freshMessages.filter(msg => 
          msg.type === 'custom' && msg.sessionData
        );
        
        if (sessionDividers.length > 0) {
          console.log(`发现${sessionDividers.length}条会话分割线消息:`, 
            sessionDividers.map(msg => ({
              id: msg.id,
              type: msg.sessionData.sessionType,
              sessionId: msg.sessionData.sessionId
            }))
          );
        }
        
        setMessages(freshMessages);
      } else {
        console.warn('刷新获取到的消息不是数组:', freshMessages);
      }
    } catch (error) {
      console.error("刷新聊天消息失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 自动IM登录：页面刷新后自动检测本地用户并登录IM
  useEffect(() => {
    if (!initialized) {
      const user = getCurrentUser();
      if (user && user.id && user.user_signature) {
        initChat(user.id, user.user_signature);
      }
    }
  }, [initialized]);

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        toggleChat,
        closeChat,
        activeUser,
        setActiveUser,
        messages,
        sendMessage,
        chatUsers,
        loading,
        createChat,
        createNewChat, // 为了兼容性添加旧函数名
        setMessages,
        setLoading,
        setIsChatOpen, // 添加这个函数到 context 中
        switchActiveUser, // 添加用户切换函数
        // 暴露Session相关方法和状态
        currentSession,
        sessionHistory,
        expandedSessions,
        endCurrentSession,
        toggleSessionExpand,
        refreshMessages, // 添加刷新消息的函数
        initChat, // 新增暴露
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
