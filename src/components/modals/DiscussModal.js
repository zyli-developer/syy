import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Avatar, Empty, message, Spin, Radio } from 'antd';
import { SearchOutlined, SendOutlined } from '@ant-design/icons';
import { useChatContext } from '../../contexts/ChatContext';
import styles from '../../styles/components/modal/DiscussModal.module.css';

// 引用类型常量
const QUOTE_TYPES = {
  TEXT: 'text',
  VIEWPOINT: 'viewpoint',
};

/**
 * 讨论模态框组件
 * @param {Object} props 组件属性
 * @param {boolean} props.visible 是否可见
 * @param {function} props.onClose 关闭回调
 * @param {string} props.selectedText 选中的文本
 * @param {string} props.selectedType 选中内容的类型，默认为文本
 */
const DiscussModal = ({ visible, onClose, selectedText, selectedType = QUOTE_TYPES.TEXT }) => {
  const { chatUsers, sendMessage, setIsChatOpen, switchActiveUser } = useChatContext();
  const [searchValue, setSearchValue] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [quoteType, setQuoteType] = useState(selectedType);

  // 当聊天用户列表变化时更新过滤后的用户列表
  useEffect(() => {
    if (visible) {
      setFilteredUsers(chatUsers);
      // 重置引用类型
      setQuoteType(selectedType);
    }
  }, [chatUsers, visible, selectedType]);

  // 搜索框变化处理
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // 过滤用户
    if (value.trim() === '') {
      setFilteredUsers(chatUsers);
    } else {
      const filtered = chatUsers.filter(user => 
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // 选择会话
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // 获取会话的头像显示内容
  const getAvatarContent = (user) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} />;
    }
    return user.name.charAt(0).toUpperCase();
  };

  // 处理引用类型变更
  const handleQuoteTypeChange = (e) => {
    setQuoteType(e.target.value);
  };

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!selectedConversation) {
      message.warning('请选择一个会话');
      return;
    }

    if (!selectedText) {
      message.warning('没有可发送的内容');
      return;
    }

    setLoading(true);
    try {
      // 1. 打开聊天区域
      setIsChatOpen(true);
      
      // 2. 切换到所选会话
      switchActiveUser(selectedConversation);
      
      // 成功后关闭对话框
      message.success('已打开聊天区域并添加引用内容');
      onClose();
      
      // 3. 使用自定义事件通知ChatArea组件在输入框中添加引用内容
      // 这里我们利用全局事件总线模式来实现跨组件通信
      const chatInputEvent = new CustomEvent('chat-set-quote-content', {
        detail: {
          quoteContent: selectedText,
          quoteType: quoteType,  // 传递引用类型
          quoteId: `quote-${Date.now()}`,
          timestamp: new Date().getTime()
        }
      });
      document.dispatchEvent(chatInputEvent);
      
    } catch (error) {
      console.error('切换聊天会话失败', error);
      message.error(`操作失败: ${error.message || '请重试'}`);
    } finally {
      setLoading(false);
    }
  };

  // 获取引用类型标签文本
  const getQuoteTypeLabel = (type) => {
    return type === QUOTE_TYPES.VIEWPOINT ? '观点' : '文本';
  };

  return (
    <Modal
      title="讨论"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      {/* 搜索框 */}
      <div className={styles.searchContainer}>
        <Input
          placeholder="搜索联系人或群组..."
          value={searchValue}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </div>

      {/* 选中的文本 */}
      <div className={styles.selectedTextSection}>
        <div className={styles.selectedTextHeader}>
          <div className={styles.selectedTextTitle}>选中内容：</div>
          <div className={styles.selectedTextType}>
            <Radio.Group
              value={quoteType}
              onChange={handleQuoteTypeChange}
              optionType="button"
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value={QUOTE_TYPES.TEXT}>文本</Radio.Button>
              <Radio.Button value={QUOTE_TYPES.VIEWPOINT}>观点</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.selectedText}>
          <div className={styles.quoteTypeIndicator}>{getQuoteTypeLabel(quoteType)}</div>
          {selectedText}
        </div>
      </div>

      {/* 会话列表 */}
      <div className={styles.conversationList}>
        {filteredUsers.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="没有找到会话"
          />
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`${styles.conversationItem} ${selectedConversation?.id === user.id ? styles.selected : ''}`}
              onClick={() => handleSelectConversation(user)}
            >
              <Avatar
                size={36}
                className={styles.conversationAvatar}
                style={{
                  backgroundColor: user.type === 'group' ? '#87d068' : '#1890ff',
                }}
              >
                {getAvatarContent(user)}
              </Avatar>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationName}>{user.name}</div>
                <div className={styles.conversationLastMessage}>
                  {user.lastMessage || (user.type === 'group' ? '群聊' : '私聊')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 操作按钮 */}
      <div className={styles.actionButtons}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button 
          type="primary" 
          onClick={handleSendMessage} 
          disabled={!selectedConversation || loading}
          icon={<SendOutlined />}
        >
          {loading ? <Spin size="small" /> : '讨论'}
        </Button>
      </div>
    </Modal>
  );
};

export default DiscussModal; 