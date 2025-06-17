import React, { useEffect } from 'react';
import { Avatar, Button, Tag, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined, PaperClipOutlined } from '@ant-design/icons';
import './CommentsList.css';

/**
 * 通用注释列表组件
 * @param {Object} props 组件属性
 * @param {Array} props.comments 注释数组
 * @param {boolean} props.isEditable 是否可编辑
 * @param {function} props.onDelete 删除注释的回调
 * @param {function} props.onMouseEnter 鼠标进入注释的回调
 * @param {string} props.expandedId 当前展开的注释ID
 * @param {function} props.onToggleExpand 切换展开/收起的回调
 * @param {string} props.contextType 注释上下文类型（'text', 'node', 'template'）
 * @param {string} props.title 列表标题（可选）
 * @param {Object} props.customStyles 自定义样式（可选）
 * @param {Array} props.nodes 节点数据（当contextType为'node'或'template'时需要提供）
 */
const CommentsList = ({ 
  comments = [], 
  isEditable = false, 
  onDelete, 
  onMouseEnter,
  expandedId,
  onToggleExpand,
  contextType = 'text',
  title,
  customStyles = {},
  nodes = []
}) => {
  // 确保comments是数组
  const commentsArray = Array.isArray(comments) ? comments : [];
  
  // 处理没有onToggleExpand的情况（为了更好的兼容性）
  const handleToggleExpand = (id) => {
    if (onToggleExpand) {
      onToggleExpand(expandedId === id ? null : id);
    }
  };

  // 调试日志 - 帮助开发者查看传入的数据
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!Array.isArray(comments)) {
        console.warn('CommentsList: expected comments to be an array, got', typeof comments);
      }
      if (commentsArray.length > 0 && contextType === 'node' && nodes.length === 0) {
        console.warn('CommentsList: contextType is "node" but no nodes were provided');
      }
    }
  }, [comments, nodes, contextType]);

  // 获取注释显示的文本内容
  const getDisplayText = (item) => {
    if (!item) return '';
    
    // 如果是节点相关的注释，尝试从节点中获取标签
    if ((contextType === 'node' || contextType === 'template') && item.nodeId && nodes.length > 0) {
      const node = nodes.find(node => node.id === item.nodeId);
      if (node?.data?.label) {
        return node.data.label;
      }
    }
    
    // 常规文本处理
    return item.text || item.content || item.selectedText || '';
  };

  // 生成唯一ID，如果项目没有ID则使用索引
  const getItemId = (item, index) => {
    if (!item) return `comment-${index}`;
    return item.id || `comment-${index}`;
  };

  // 格式化时间显示
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // 判断是否已经是格式化后的时间
    if (timeString.includes(':') && !timeString.includes('-')) {
      return timeString;
    }
    
    try {
      // 尝试解析时间格式
      const date = new Date(timeString);
      return isNaN(date.getTime()) 
        ? timeString 
        : `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}, ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}`;
    } catch (e) {
      return '';
    }
  };

  // 获取作者首字母
  const getAuthorInitial = (author) => {
    if (!author) return '';
    
    if (typeof author === 'string') {
      return author.charAt(0) || '';
    } else if (author.name) {
      return author.name.charAt(0) || '';
    } else {
      return '';
    }
  };
  
  // 获取作者名称
  const getAuthorName = (author) => {
    if (!author) return '';
    
    if (typeof author === 'string') {
      return author;
    } else if (author.name) {
      return author.name;
    } else {
      return '';
    }
  };
  
  // 如果没有评论数据，不渲染任何内容
  if (commentsArray.length === 0) {
    return (
      <div className="comments-list" style={{...customStyles.container}}>
        {title && (
          <div className="comments-list-title" style={customStyles.title}>
            {title}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="comments-list" style={customStyles.container}>
      {title && (
        <div className="comments-list-title" style={customStyles.title}>
          {title}
        </div>
      )}
      
        <div className="comments-content">
        {commentsArray.filter(item => item && (item.text || item.content || item.selectedText || item.summary)).map((item, index) => (
            <div 
              className="comment-item" 
              key={getItemId(item, index)} 
              style={customStyles.item}
            >
              {/* 观点卡片头部 */}
              <div className="comment-card-header">
                {/* 左侧观点图标和指示器 */}
                <div className="comment-indicator">
                  <div className="comment-number">{index + 1}</div>
                </div>
                
                {/* 右侧观点摘要 */}
                <div className="comment-summary" onClick={() => handleToggleExpand(getItemId(item, index))}>
                  <div className="comment-summary-text">
                    {item.summary || getDisplayText(item).substring(0, 20) + (getDisplayText(item).length > 20 ? '...' : '')}
                  </div>
                </div>
                
                {/* 展开/收起图标 */}
                {onToggleExpand && (
                  <div 
                    className="comment-expand-icon"
                    onClick={() => handleToggleExpand(getItemId(item, index))}
                  >
                    {expandedId === getItemId(item, index) ? <MinusOutlined /> : <PlusOutlined />}
      </div>
                )}
              </div>
              
              {/* 观点详情（展开时显示） */}
              {expandedId === getItemId(item, index) && (
                <div className="comment-detail">
                  {/* 观点内容 */}
                  <div className="comment-content-wrapper">
                    <p className="comment-text">
                      {getDisplayText(item)}
              </p>
            </div>
                  
                  {/* 附件区域 */}
                  {Array.isArray(item.attachments) && item.attachments.length > 0 && (
                    <div className="comment-attachments">
                      <div className="attachments-header">
                        <PaperClipOutlined /> 附件 ({item.attachments.length})
                      </div>
                      <div className="attachments-list">
                        {item.attachments.filter(file => file && file.name).map((file, idx) => (
                          <Tag key={idx} className="attachment-tag">
                            <a href={file.url || '#'} target="_blank" rel="noopener noreferrer">
                              {file.name}
                            </a>
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 作者信息和操作按钮 */}
                  <div className="comment-footer">
                    <div className="comment-author-info">
                      <Avatar 
                        size={24} 
                        className="commenter-avatar"
                      >
                        {getAuthorInitial(item.author)}
                      </Avatar>
                      <span className="commenter-name">
                        {getAuthorName(item.author)}
                      </span>
                      <span className="comment-time">
                        {formatTime(item.time)}
                      </span>
                    </div>
                    
                    {/* 编辑模式下的操作按钮 */}
                    {isEditable && (
                      <div className="comment-actions">
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined />} 
                          danger
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(getItemId(item, index));
                          }}
                        >
                          删除
                        </Button>
          </div>
        )}
      </div>
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
};

export default CommentsList; 