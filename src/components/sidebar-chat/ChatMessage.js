import React, { useState, useContext, useRef, useEffect } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined, PlusOutlined, MessageOutlined, UnorderedListOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import annotationService from '../../services/annotationService';
import { message as messageApi } from 'antd';
import { OptimizationContext, OPTIMIZATION_STEP_CHANGE_EVENT } from '../../contexts/OptimizationContext';
import { useChatContext } from '../../contexts/ChatContext';
import TextContextMenu from '../context/TextContextMenu';
import { extractSessionData } from '../../lib/tim/message';
import { CUSTOM_MESSAGE_TYPE } from '../../lib/tim/constants';
import '../../styles/components/sidebar-chat/ChatMessage.css'; // 导入样式文件
import useTextHighlight from '../../hooks/useTextHighlight';
import DiscussModal from '../modals/DiscussModal';
import useMultiSelect from '../../hooks/useMultiSelect';

// 引用类型定义
const QUOTE_TYPES = {
  TEXT: 'text',
  VIEWPOINT: 'viewpoint',
};

const ChatMessage = ({ message }) => {
  const { 
    currentSession, 
    sessionHistory, 
    expandedSessions, 
    toggleSessionExpand,
    endCurrentSession
  } = useChatContext();
  
  const isUser = message.sender === "user";
  const [selectedText, setSelectedText] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showDiscussModal, setShowDiscussModal] = useState(false);
  const messageRef = useRef(null);
  
  // 使用全局的OptimizationContext
  const { 
    isOptimizationMode,
    currentOptimizationStep,
    addComment
  } = useContext(OptimizationContext);
  
  // 本地状态跟踪当前优化步骤
  const [localOptimizationStep, setLocalOptimizationStep] = useState(currentOptimizationStep);
  const [localOptimizationMode, setLocalOptimizationMode] = useState(isOptimizationMode);
  
  // 受控高亮 hook，id 用 message.id
  const { highlightMap, addHighlight, clearHighlights, renderHighlightedText, applyHighlightToSelection } = useTextHighlight();
  const textRef = useRef();
  
  // 多选 hook
  const { isMultiSelectActive, endMultiSelectAndGetText, setIsMultiSelectActive, setSelectedTexts, clearAllHighlights } = useMultiSelect(messageRef);
  
  // 在组件顶部 useRef 区域加：
  const lastSelectionRangeRef = useRef(null);
  
  // 监听步骤变更事件
  useEffect(() => {
    console.log('[ChatMessage] useEffect 监听步骤变更事件');
    const handleStepChange = (event) => {
      const { step, isOptimizationMode } = event.detail;
      console.log(`收到步骤变更事件，步骤: ${step}, 优化模式: ${isOptimizationMode}`);
      setLocalOptimizationStep(step);
      setLocalOptimizationMode(isOptimizationMode);
    };
    
    // 监听全局步骤变更事件
    window.addEventListener(OPTIMIZATION_STEP_CHANGE_EVENT, handleStepChange);
    
    // 卸载时移除监听
    return () => {
      window.removeEventListener(OPTIMIZATION_STEP_CHANGE_EVENT, handleStepChange);
    };
  }, []);
  
  // 当全局步骤变更时，同步到本地状态
  useEffect(() => {
    console.log('[ChatMessage] useEffect 同步全局步骤到本地', { currentOptimizationStep, isOptimizationMode });
    setLocalOptimizationStep(currentOptimizationStep);
    setLocalOptimizationMode(isOptimizationMode);
  }, [currentOptimizationStep, isOptimizationMode]);
  
  // 检查当前消息是否是Session分割线
  const isSessionDivider = () => {
    // 检查消息对象中的类型标记
    if (message.type === 'custom' && message.sessionData) {
      return true;
    }
    
    // 检查消息的cloudCustomData
    if (message.cloudCustomData) {
      try {
        const cloudData = JSON.parse(message.cloudCustomData);
        if (cloudData.sessionType && (
          cloudData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START ||
          cloudData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END
        )) {
          return true;
        }
      } catch (e) {
        console.error('解析cloudCustomData失败', e);
      }
    }
    
    // 从消息中提取sessionData
    const sessionData = extractSessionData(message);
    return sessionData && (
      sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_START || 
      sessionData.sessionType === CUSTOM_MESSAGE_TYPE.SESSION_END
    );
  };
  
  // 获取Session信息
  const getSessionInfo = () => {
    if (!isSessionDivider()) return null;
    
    // 如果消息对象中已有sessionData，直接使用
    if (message.sessionData) {
      return {
        id: message.sessionData.sessionId,
        type: message.sessionData.sessionType,
        quoteContent: message.sessionData.quoteContent
      };
    }
    
    // 从cloudCustomData中提取
    if (message.cloudCustomData) {
      try {
        const cloudData = JSON.parse(message.cloudCustomData);
        if (cloudData.sessionType) {
          return {
            id: cloudData.sessionId,
            type: cloudData.sessionType,
            quoteContent: cloudData.quoteContent
          };
        }
      } catch (e) {
        console.error('解析sessionInfo失败', e);
      }
    }
    
    // 使用extractSessionData提取
    const sessionData = extractSessionData(message);
    if (!sessionData) return null;
    
    return {
      id: sessionData.sessionId,
      type: sessionData.sessionType,
      quoteContent: sessionData.quoteContent
    };
  };
  
  // 检查会话是否展开
  const isSessionExpanded = () => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return true;
    
    return expandedSessions[sessionInfo.id] !== false; // 默认展开
  };
  
  // 处理会话展开/折叠
  const handleToggleExpand = () => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return;
    
    const sessionId = sessionInfo.id;
    const currentExpandedState = expandedSessions[sessionId] !== false;
    
    console.log(`切换会话${sessionId}的展开状态: ${currentExpandedState ? '展开→折叠' : '折叠→展开'}`);
    
    // 调用context中的函数切换会话展开状态
    toggleSessionExpand(sessionId);
  };
  
  // 处理会话关闭
  const handleCloseSession = () => {
    if (currentSession) {
      endCurrentSession();
    }
  };

  // 右键菜单弹出，实时获取选中文本
  const handleContextMenu = (e) => {
    if (!isOptimizationMode) return;
    e.preventDefault();
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text) {
      setSelectedText(text);
      setContextMenu({ x: e.clientX, y: e.clientY });
    } else {
      setContextMenu(null);
    }
  };

  // 右键菜单操作
  const handleContextMenuAction = (action) => {
        setContextMenu(null);
    if (action === 'select') {
      if (!isMultiSelectActive) {
        // 开启连续选时，保留当前已选文本高亮
        if (selectedText && lastSelectionRangeRef.current) {
          setSelectedTexts(prev => prev.includes(selectedText) ? prev : [...prev, selectedText]);
          applyHighlightToSelection(lastSelectionRangeRef.current, selectedText);
        }
        setIsMultiSelectActive(true);
      } else {
        setIsMultiSelectActive(false);
        clearAllHighlights();
      }
      return;
    }
    if (action === 'annotate' || action === 'discuss') {
      let textToShow = selectedText;
      if (isMultiSelectActive && endMultiSelectAndGetText) {
        textToShow = endMultiSelectAndGetText();
      }
      setSelectedText(textToShow);
      if (action === 'annotate') setShowAnnotationModal(true);
      if (action === 'discuss') setShowDiscussModal(true);
    }
    // 其它操作可扩展
  };

  // 提取纯文本内容，去除引用部分
  const extractPlainTextContent = (content) => {
    console.log('[ChatMessage] extractPlainTextContent', content);
    if (!content) return '';
    
    // 移除所有引用标记
    let plainText = content.replace(/【引用:(.*?)】(.*?)【\/引用】/gs, '');
    
    // 移除旧格式引用
    plainText = plainText.replace(/【引用】(.*?)【\/引用】\n/s, '');
    
    // 移除前导空格和换行符
    plainText = plainText.trim();
    
    return plainText;
  };

  // 处理添加观点
  const handleAddAnnotation = () => {
    console.log('[ChatMessage] handleAddAnnotation');
    // 每次打开modal前，重新计算提取纯文本内容
    let contentForModal = '';
    
    contentForModal = selectedText || extractPlainTextContent(message.text);
    
    // 确保设置内容后再显示模态框
    setTimeout(() => {
    setShowAnnotationModal(true);
    }, 10);
    
    // 不立即清除高亮，等用户完成添加观点后再清除
  };

  // 保存观点
  const handleSaveAnnotation = async (data) => {
    console.log('[ChatMessage] handleSaveAnnotation', data);
    try {
      // 步骤归一化
      let stepValue = localOptimizationStep || 'result';
      if (stepValue === 'scene') stepValue = 'scenario';
      if (stepValue === 'template') stepValue = 'flow';
      // 创建新的注释对象
      const newAnnotation = {
        ...data,
        step: stepValue, // 使用归一化后的步骤
        messageId: message.id,
        timestamp: new Date().toISOString()
      };
      const savedAnnotation = await annotationService.addAnnotation(newAnnotation);
      
      
      addComment({
        ...savedAnnotation
      });
      messageApi.success('观点已添加');
      setShowAnnotationModal(false);
      clearHighlights();
    } catch (error) {
      console.error('保存观点失败:', error);
      messageApi.error('添加观点失败，请重试');
    }
  };

  // 格式化消息内容，处理引用部分
  const formatMessageContent = (content) => {
    if (!content) return null;
    
    // 使用正则表达式匹配所有引用内容
    const quotes = [];
    let mainText = content;
    
    // 匹配所有引用标记
    const quoteRegex = /【引用:(.*?)】(.*?)【\/引用】/gs;
    let match;
    
    while ((match = quoteRegex.exec(content)) !== null) {
      const [fullMatch, quoteType, quoteText] = match;
      quotes.push({ type: quoteType, content: quoteText });
      mainText = mainText.replace(fullMatch, '');
    }
    
    // 如果没有匹配到新格式的引用，尝试匹配旧格式
    if (quotes.length === 0) {
      const oldQuoteMatch = content.match(/【引用】(.*?)【\/引用】\n(.*)/s);
      if (oldQuoteMatch) {
        const [_, quotedText, textContent] = oldQuoteMatch;
        quotes.push({ type: QUOTE_TYPES.TEXT, content: quotedText });
        mainText = textContent;
      }
    }
    
    // 移除前导换行符
    mainText = mainText.replace(/^\n+/, '');
    
    if (quotes.length > 0) {
      return (
        <>
          {quotes.map((quote, index) => (
            <div className="message-quote" key={`quote-${index}`}>
              <div className="message-quote-bar"></div>
              <div className="message-quote-content">
                <div className="message-quote-text">{quote.content}</div>
                <div className="message-quote-label">{getQuoteLabelText(quote.type)}</div>
              </div>
            </div>
          ))}
          <div>{mainText}</div>
        </>
      );
    }
    
    return content;
  };

  // 根据引用类型获取显示的标签文字
  const getQuoteLabelText = (type) => {
    switch(type) {
      case QUOTE_TYPES.VIEWPOINT:
        return '观点';
      case QUOTE_TYPES.TEXT:
        return '文本';
      default:
        return '引用';
    }
  }

  // 渲染Session分割线
  const renderSessionDivider = () => {
    const sessionInfo = getSessionInfo();
    if (!sessionInfo) return null;
    
    const isStart = sessionInfo.type === CUSTOM_MESSAGE_TYPE.SESSION_START;
    const isExpanded = isSessionExpanded();
    const sessionId = sessionInfo.id;
    
    // 获取当前会话的引用内容和信息
    const quoteContent = sessionInfo.quoteContent || '无引用内容';
    const sessionType = isStart ? '开始' : '结束';
    
    return (
      <div 
        className={`session-divider ${isStart ? 'session-start' : 'session-end'} ${!isExpanded ? 'session-collapsed' : ''}`} 
        data-session-id={sessionId}
        onClick={handleToggleExpand}
      >
        <div className="session-divider-line">
          <span className="divider-text">{isExpanded ? "引用会话收起" : "引用会话展开"}</span>
        </div>
      </div>
    );
  };
  
  // 判断消息是否属于指定的会话
  const belongsToSession = (sessionId) => {
    if (!message || !sessionId) return false;
    
    // 如果消息本身包含sessionId信息，直接比较
    if (message.sessionData && message.sessionData.sessionId === sessionId) {
      return true;
    }
    
    // 如果消息包含cloudCustomData，解析并检查
    if (message.cloudCustomData) {
      try {
        const cloudData = JSON.parse(message.cloudCustomData);
        if (cloudData.sessionId === sessionId) {
          return true;
        }
      } catch (e) {}
    }
    
    // 获取消息时间（优先使用time字段，其次是timestamp的解析值）
    const messageTimeMs = message.time 
      ? message.time * 1000  // 如果有time字段（秒），转换为毫秒
      : message.timestamp
        ? (typeof message.timestamp === 'string' 
            ? new Date(message.timestamp).getTime()
            : message.timestamp)
        : Date.now(); // 兜底使用当前时间
    
    // 通过时间判断消息是否属于会话
    const session = sessionHistory.find(s => s.id === sessionId);
    if (session) {
      return messageTimeMs >= session.startTime && 
             messageTimeMs <= (session.endTime || Date.now());
    }
    
    return false;
  };
  
  // 在处于会话中且消息是普通消息时，检查是否应该显示
  const shouldRenderMessage = () => {
    // 如果是Session分割线则始终显示
    if (isSessionDivider()) {
      return true;
    }
    
    // 查找当前消息所属的会话ID
    let messageSessionId = null;
    
    // 如果消息上没有明确的sessionId，检查消息在DOM中的位置来确定会话
    if (messageRef.current) {
      // 获取所有会话分割线
      const allDividers = document.querySelectorAll('.session-divider');
      if (allDividers.length < 2) {
        return true; // 如果没有找到足够的分割线，默认显示
      }
      
      // 根据DOM位置确定当前消息所处的会话
      const messageElement = messageRef.current;
      
      // 将分割线转为数组，并根据DOM位置排序
      const dividersArray = Array.from(allDividers);
      
      // 查找当前消息的位置
      const messageBoundingRect = messageElement.getBoundingClientRect();
      const messageTop = messageBoundingRect.top;
      
      // 寻找当前消息前后的分割线
      let prevStartDivider = null;
      let nextEndDivider = null;
      
      for (let i = 0; i < dividersArray.length; i++) {
        const divider = dividersArray[i];
        const dividerRect = divider.getBoundingClientRect();
        const isStartDivider = divider.classList.contains('session-start');
        const isEndDivider = divider.classList.contains('session-end');
        const sessionId = divider.getAttribute('data-session-id');
        
        // 检查分割线相对于消息的位置
        if (dividerRect.top < messageTop) {
          // 分割线在消息上方
          if (isStartDivider) {
            prevStartDivider = { divider, sessionId };
          } else if (isEndDivider && prevStartDivider && divider.getAttribute('data-session-id') === prevStartDivider.sessionId) {
            // 如果找到对应会话的结束分割线，说明消息不在该会话内
            prevStartDivider = null;
          }
        } else if (dividerRect.top > messageTop && isEndDivider) {
          // 分割线在消息下方且是结束分割线
          if (prevStartDivider && divider.getAttribute('data-session-id') === prevStartDivider.sessionId) {
            // 找到了对应的结束分割线，说明消息在该会话内
            nextEndDivider = { divider, sessionId };
            break;
          }
        }
      }
      
      // 如果找到了开始分割线和结束分割线，消息在这个会话中
      if (prevStartDivider && nextEndDivider && prevStartDivider.sessionId === nextEndDivider.sessionId) {
        messageSessionId = prevStartDivider.sessionId;
      } else if (prevStartDivider) {
        // 即使没找到结束分割线，也可能在会话中
        // 这种情况在跨段历史记录中可能出现，即开始分割线在当前段，结束分割线在另一段
        messageSessionId = prevStartDivider.sessionId;
      } else {
        // console.log('消息不在任何会话内，或会话状态不完整(缺少开始/结束分割线)');
      }
    }
    
    // 如果找到了消息所属的会话ID，检查该会话是否应该显示
    if (messageSessionId) {
      const shouldShow = expandedSessions[messageSessionId] !== false; // 默认展开
      
      // 为支持跨段历史记录，添加额外的会话判断逻辑
      // 如果在sessionHistory中也找不到这个会话，可能是需要从服务端获取的跨段会话
      if (!shouldShow && !sessionHistory.some(s => s.id === messageSessionId)) {
        // 对于未知会话，默认显示消息，但打印警告
        console.warn(`未在会话历史中找到会话${messageSessionId}，可能是跨段会话，默认显示消息`);
        return true;
      }
      
      return shouldShow;
    }
    
    // 如果无法确定会话，默认显示消息
    return true;
  };
  

  // 检查消息是否在会话中
  const isInActiveSession = () => {
    // 根据消息ID检查是否属于当前会话
    if (currentSession && message.sessionId === currentSession.id) {
      return true;
    }
    
    // 检查消息是否在任何会话中
    const sessionId = message.sessionId || 
                     (message.sessionData && message.sessionData.sessionId) || 
                     (message.cloudCustomData && JSON.parse(message.cloudCustomData)?.sessionId);
    
    return !!sessionId;
  };

  // 如果是分割线消息，渲染分割线
  if (isSessionDivider()) {
    return renderSessionDivider();
  }
  
  // 如果消息应该被折叠，则不渲染
  if (!shouldRenderMessage()) {
    return null;
  }

  return (
    <div className={`message-container ${isUser ? "message-right" : "message-left"}`} ref={messageRef} onContextMenu={handleContextMenu}>
      <div 
        className={`message-bubble ${isUser ? "message-user" : "message-other"}`}
        style={{ position: 'relative' }}
      >
        <div
          ref={textRef}
          style={{ userSelect: 'text', cursor: 'text', fontSize: 16 }}
        >
          {renderHighlightedText(message.text, highlightMap[message.id] || [])}
          </div>
      </div>
      
      {/* 右键菜单 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}
      
      <div className="message-time">{message.timestamp}</div>

      {/* 添加观点弹窗 */}
      <AnnotationModal
        visible={showAnnotationModal}
        onClose={() => setShowAnnotationModal(false)}
        onSave={handleSaveAnnotation}
        selectedText={selectedText}
        initialContent={selectedText}
        step={localOptimizationStep || 'result'}
      />
      
      {/* 讨论弹窗 */}
      {showDiscussModal && (
        <DiscussModal
          visible={showDiscussModal}
          onClose={() => setShowDiscussModal(false)}
          selectedText={selectedText}
        />
      )}
    </div>
  );
};

export default ChatMessage;
