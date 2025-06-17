import React, { createContext, useContext } from 'react';
import useMultiSelect from '../../hooks/useMultiSelect';
import TextContextMenu from '../context/TextContextMenu';

// 创建上下文
const MultiSelectContext = createContext(null);

/**
 * 使用MultiSelect上下文
 * @returns 连续选择相关的状态和方法
 */
export const useMultiSelectContext = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error('useMultiSelectContext必须在MultiSelectProvider内使用');
  }
  return context;
};

/**
 * 连续选择功能的Provider组件
 * 用于包装需要使用连续选择功能的组件
 */
export const MultiSelectProvider = ({ children, containerRef, onSelect, onCombinedTextChange }) => {
  const multiSelectProps = useMultiSelect(containerRef);
  
  const {
    contextMenu,
    setContextMenu,
    isMultiSelectActive,
    clearAllHighlights,
    handleGlobalContextMenu,
    handleAutoSelection
  } = multiSelectProps;
  
  // 处理右键菜单项点击
  const handleContextMenuAction = (action) => {
    switch (action) {
      case 'discuss':
      case 'annotate':
        // 调用回调，传递组合后的文本
        if (onSelect) {
          onSelect({
            action,
            text: multiSelectProps.getCombinedText(),
            selectedTexts: multiSelectProps.selectedTexts
          });
        }
        
        // 关闭连续选择模式和临时多选模式
        multiSelectProps.setIsMultiSelectActive(false);
        multiSelectProps.setIsMultiSelectTempMode(false);
        setContextMenu(null);
        break;
      case 'select':
        // 切换连续选择模式
        multiSelectProps.toggleMultiSelect();
        setContextMenu(null);
        break;
      default:
        setContextMenu(null);
        break;
    }
  };
  
  // 当组合文本变化时触发回调
  React.useEffect(() => {
    if (onCombinedTextChange) {
      onCombinedTextChange(multiSelectProps.getCombinedText());
    }
  }, [multiSelectProps.selectedTexts, multiSelectProps.selectedText, multiSelectProps.isMultiSelectActive, multiSelectProps.isMultiSelectTempMode, onCombinedTextChange]);
  
  return (
    <MultiSelectContext.Provider value={multiSelectProps}>
      <div 
        className={isMultiSelectActive ? 'multi-select-mode' : ''}
      >
        {typeof children === 'function' 
          ? children(multiSelectProps) 
          : children}
        
        {/* 右键菜单 */}
        {contextMenu && (
          <TextContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onAction={handleContextMenuAction}
            onClose={() => setContextMenu(null)}
            isMultiSelectActive={isMultiSelectActive}
          />
        )}
      </div>
    </MultiSelectContext.Provider>
  );
};

/**
 * 连续选择功能的触发按钮组件
 */
export const MultiSelectButton = ({ children, className, ...props }) => {
  const { isMultiSelectActive, toggleMultiSelect } = useMultiSelectContext();
  
  return (
    <button
      className={`multi-select-button ${isMultiSelectActive ? 'active' : ''} ${className || ''}`}
      onClick={toggleMultiSelect}
      title={isMultiSelectActive ? "关闭连续选择" : "连续选择"}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * 连续选择高亮组件
 * 用于包装可以高亮的文本内容
 */
export const MultiSelectContent = ({ children, className, ...props }) => {
  const { isMultiSelectActive, handleContextMenu } = useMultiSelectContext();
  
  return (
    <div 
      className={`multi-select-content ${isMultiSelectActive ? 'active' : ''} ${className || ''}`}
      onContextMenu={handleContextMenu}
      {...props}
    >
      {children}
    </div>
  );
};

// 导出合成组件
const MultiSelect = {
  Provider: MultiSelectProvider,
  Button: MultiSelectButton,
  Content: MultiSelectContent
};

export default MultiSelect; 