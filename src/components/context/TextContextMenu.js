import React, { useEffect } from 'react';
import { MessageOutlined, PlusCircleOutlined, UnorderedListOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from '../../styles/components/context/TextContextMenu.module.css';

/**
 * 文本上下文菜单组件
 * @param {Object} props 组件属性
 * @param {number} props.x 菜单显示X坐标
 * @param {number} props.y 菜单显示Y坐标
 * @param {function} props.onAction 菜单动作回调，接收action参数
 * @param {function} props.onClose 关闭菜单回调
 * @param {boolean} props.isMultiSelectActive 是否处于连续选择模式
 * @param {string} props.contextType 当前上下文类型，可能的值有：text, scenario, flow
 */
const TextContextMenu = ({ 
  x, 
  y, 
  onAction, 
  onClose, 
  isMultiSelectActive = false,
  contextType = 'text'
}) => {
  // 点击文档其他地方关闭菜单
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(`.${styles.contextMenuContainer}`)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  // 点击菜单项事件处理
  const handleMenuItemClick = (action) => {
    // 清除任何选择
    window.getSelection().removeAllRanges();
    
    // 调用回调
    onAction(action);
    onClose();
  };

  // 检查是否为场景或模板上下文
  const isSceneOrTemplate = contextType === 'scenario' || contextType === 'flow';

  return (
    <div 
      className={`${styles.contextMenuContainer} text-context-menu`}
      style={{ left: x, top: y }}
    >
      <div 
        className={styles.menuItem}
        onClick={() => handleMenuItemClick('discuss')}
      >
        <MessageOutlined className={styles.menuItemIcon} />
        <span className={styles.menuItemText}>讨论</span>
      </div>
      
      <div 
        className={`${styles.menuItem} ${isMultiSelectActive ? styles.active : ''}`}
        onClick={() => handleMenuItemClick('select')}
      >
        <UnorderedListOutlined className={styles.menuItemIcon} />
        <span className={styles.menuItemText}>连续选</span>
        {isMultiSelectActive && <CheckOutlined className={styles.menuItemStatus} />}
        {isMultiSelectActive && <span className={styles.menuItemActiveIndicator}>已启用</span>}
      </div>
      
      <div 
        className={styles.menuItem}
        onClick={() => handleMenuItemClick('annotate')}
      >
        <PlusCircleOutlined className={styles.menuItemIcon} />
        <span className={styles.menuItemText}>添加观点</span>
      </div>

      {/* 只在场景或模板上下文中显示编辑选项 */}
      {isSceneOrTemplate && (
        <div 
          className={styles.menuItem}
          onClick={() => handleMenuItemClick('edit')}
        >
          <EditOutlined className={styles.menuItemIcon} />
          <span className={styles.menuItemText}>编辑</span>
        </div>
      )}
      
      {/* 只在场景或模板上下文中显示删除选项 */}
      {isSceneOrTemplate && (
        <div 
          className={styles.menuItem}
          onClick={() => handleMenuItemClick('delete')}
        >
          <DeleteOutlined className={styles.menuItemIcon} />
          <span className={styles.menuItemText}>删除</span>
        </div>
      )}
    </div>
  );
};

export default TextContextMenu; 