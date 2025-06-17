import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 连续选择功能的自定义Hook
 * @param {React.RefObject} containerRef - 容器的ref，用于限定选择范围
 * @returns {Object} 连续选择相关的状态和方法
 */
const useMultiSelect = (containerRef) => {
  // 连续选择状态
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [isMultiSelectTempMode, setIsMultiSelectTempMode] = useState(false);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [selectionRanges, setSelectionRanges] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  
  // 使用ref存储所有已选择的高亮元素，确保不会丢失高亮
  const highlightElementsRef = useRef([]);
  
  // 彻底重置所有状态
  const resetAllState = useCallback(() => {
    // 重置所有状态变量
    setSelectedTexts([]);
    setSelectionRanges([]);
    setSelectedText('');
    
    // 清空引用中的所有高亮元素
    highlightElementsRef.current = [];
    
    // 移除DOM中的所有高亮元素
    const container = containerRef?.current;
    if (container) {
      try {
        const highlights = Array.from(container.querySelectorAll('.text-highlight-selection'));
        
        highlights.forEach(el => {
          try {
            const text = el.textContent || '';
            const textNode = document.createTextNode(text);
            
            if (el.parentNode) {
              el.parentNode.replaceChild(textNode, el);
            }
          } catch (err) {
            console.error('重置时清除高亮元素失败:', err);
          }
        });
      } catch (error) {
        console.error('重置状态时发生错误:', error);
      }
    }
    
    // 移除body上的样式类
    document.body.classList.remove('multi-select-mode');
    document.body.classList.remove('multi-select-temp');
    
    console.log('已重置所有选择状态');
  }, [containerRef]);
  
  // 注册高亮元素到ref中
  const registerHighlightElement = useCallback((element, text, range) => {
    if (!element) return;
    
    // 检查是否已存在
    const exists = highlightElementsRef.current.some(item => 
      item.element === element || 
      (item.text === text && item.range && range && 
       item.range.startContainer === range.startContainer && 
       item.range.endContainer === range.endContainer)
    );
    
    if (!exists) {
      highlightElementsRef.current.push({
        element,
        text,
        range: range ? range.cloneRange() : null,
        timestamp: Date.now()
      });
    }
  }, []);
  
  // 移除高亮元素
  const unregisterHighlightElement = useCallback((element) => {
    if (!element) return;
    
    highlightElementsRef.current = highlightElementsRef.current.filter(
      item => item.element !== element
    );
  }, []);
  
  // 获取当前选择的文本和范围
  const getCurrentSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return null;
    }
    
    // 获取选择的范围
    const range = selection.getRangeAt(0);
    
    // 检查选择是否在指定容器内
    if (containerRef && containerRef.current) {
      if (!containerRef.current.contains(range.commonAncestorContainer)) {
        return null;
      }
    }
    
    // 获取选中的文本
    const text = range.toString().trim();
    if (!text) return null;
    
    return { range, text };
  }, [containerRef]);
  
  // 应用高亮样式到选中文本
  const applyHighlightToSelection = useCallback((range, text) => {
    console.log('applyHighlightToSelection', range, text);
    if (!range) return;
    
    try {
      // 检查是否在已高亮区域内选择
      let isInsideExistingHighlight = false;
      let closestHighlight = null;
      
      // 检查开始点是否已在高亮区域内
      if (range.startContainer.nodeType === Node.TEXT_NODE && 
          range.startContainer.parentNode.classList && 
          range.startContainer.parentNode.classList.contains('text-highlight-selection')) {
        isInsideExistingHighlight = true;
        closestHighlight = range.startContainer.parentNode;
      }
      
      // 如果是高亮区域内的选择，使用其他方式处理
      if (isInsideExistingHighlight && closestHighlight) {
        // 获取当前高亮的文本
        const existingText = closestHighlight.getAttribute('data-text') || '';
        
        // 创建新的高亮元素
        const newHighlightEl = document.createElement('span');
        newHighlightEl.className = 'text-highlight-selection';
        newHighlightEl.textContent = text;
        newHighlightEl.setAttribute('data-text', `${existingText} ${text}`.trim());
        
        // 注册新的高亮元素
        registerHighlightElement(newHighlightEl, text, range);
        
        // 记录范围的信息用于后续可能的恢复
        const highlightInfo = {
          element: newHighlightEl,
          range: range.cloneRange(),
          text,
          parentHighlight: closestHighlight
        };
        
        return highlightInfo;
      }
      
      // 克隆范围以避免修改原始选择
      const clonedRange = range.cloneRange();
      
      // 方法1：对于简单的文本节点内的选择，使用surroundContents
      if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
        // 创建高亮元素
        const highlightEl = document.createElement('span');
        highlightEl.className = 'text-highlight-selection';
        highlightEl.setAttribute('data-text', text);
        
        // 直接包装内容
        clonedRange.surroundContents(highlightEl);
        
        // 添加一个唯一标识
        const uniqueId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        highlightEl.setAttribute('data-highlight-id', uniqueId);
        
        // 注册新的高亮元素
        registerHighlightElement(highlightEl, text, clonedRange);
        
        // 返回需要记录的数据
        return {
          element: highlightEl,
          range: clonedRange,
          text,
          highlightId: uniqueId
        };
      } 
      // 方法2：对于复杂的跨节点选择，使用提取和插入的方式
      else {
        // 提取选中内容的HTML
        const fragment = clonedRange.extractContents();
        
        // 创建高亮容器元素
        const highlightEl = document.createElement('span');
        highlightEl.className = 'text-highlight-selection';
        highlightEl.setAttribute('data-text', text);
        
        // 添加一个唯一标识
        const uniqueId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        highlightEl.setAttribute('data-highlight-id', uniqueId);
        
        // 将提取的内容添加到高亮元素中
        highlightEl.appendChild(fragment);
        
        // 将高亮元素插入到原来的位置
        clonedRange.insertNode(highlightEl);
        
        // 注册新的高亮元素
        registerHighlightElement(highlightEl, text, clonedRange);
        
        // 返回需要记录的数据
        return {
          element: highlightEl,
          range: clonedRange,
          text,
          highlightId: uniqueId
        };
      }
    } catch (e) {
      console.error('高亮应用失败:', e);
      
      // 失败回退方案：尝试使用替换方式
      try {
        // 创建新的范围
        const backupRange = range.cloneRange();
        
        // 创建高亮元素
        const highlightEl = document.createElement('span');
        highlightEl.className = 'text-highlight-selection';
        highlightEl.textContent = text;
        highlightEl.setAttribute('data-text', text);
        
        // 添加一个唯一标识
        const uniqueId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        highlightEl.setAttribute('data-highlight-id', uniqueId);
        
        // 先保存选区内容再删除
        const content = backupRange.toString();
        backupRange.deleteContents();
        
        // 如果内容丢失，使用保存的内容
        if (highlightEl.textContent === '') {
          highlightEl.textContent = content || text;
        }
        
        // 插入高亮元素
        backupRange.insertNode(highlightEl);
        
        // 注册新的高亮元素
        registerHighlightElement(highlightEl, content || text, backupRange);
        
        return {
          element: highlightEl,
          range: backupRange,
          text: content || text,
          highlightId: uniqueId
        };
      } catch (fallbackError) {
        console.error('高亮应用回退方案也失败:', fallbackError);
        return null;
      }
    }
  }, [registerHighlightElement]);
  
  // 同步高亮状态到DOM
  const syncHighlightsToDOM = useCallback(() => {
    const container = containerRef?.current;
    if (!container) return;
    
    try {
      // 获取当前DOM中的所有高亮元素
      const domHighlights = Array.from(container.querySelectorAll('.text-highlight-selection'));
      
      // 确保每个已注册的高亮元素都有正确的样式
      highlightElementsRef.current.forEach(item => {
        const { element } = item;
        if (element && element.isConnected) {
          // 确保样式正确
          element.classList.add('text-highlight-selection');
          if (!element.style.backgroundColor) {
            element.style.backgroundColor = 'rgba(24, 144, 255, 0.25)';
          }
          if (!element.style.borderBottom) {
            element.style.borderBottom = '1px dashed #1890ff';
          }
        }
      });
      
      // 验证DOM中的高亮元素是否都已注册
      domHighlights.forEach(element => {
        const isRegistered = highlightElementsRef.current.some(item => item.element === element);
        if (!isRegistered && element.parentNode) {
          // 自动注册未注册的高亮元素
          registerHighlightElement(element, element.textContent, null);
        }
      });
      
      // 更新状态以反映当前的高亮文本
      if (isMultiSelectActive && domHighlights.length > 0) {
        // 收集所有高亮文本
        const highlightedTexts = domHighlights.map(el => el.textContent || '');
        const uniqueTexts = [...new Set(highlightedTexts)];
        
        // 只有当文本集合发生变化时才更新状态
        if (JSON.stringify(uniqueTexts) !== JSON.stringify(selectedTexts)) {
          setSelectedTexts(uniqueTexts);
        }
      }
    } catch (err) {
      console.error('同步高亮状态失败:', err);
    }
  }, [containerRef, registerHighlightElement, isMultiSelectActive, selectedTexts]);
  
  // 清除所有高亮
  const clearAllHighlights = useCallback(() => {
    // 移除所有已存在的高亮元素
    const container = containerRef?.current;
    if (container) {
      try {
        // 在处理前先获取所有高亮元素的引用
        const highlights = Array.from(container.querySelectorAll('.text-highlight-selection'));
        
        // 确保有序地处理高亮元素，避免DOM结构变化导致的问题
        highlights.forEach(el => {
          try {
            // 获取高亮元素的文本内容
            const text = el.textContent || '';
            
            // 创建一个文本节点来替换高亮元素
            const textNode = document.createTextNode(text);
            
            // 确保父元素存在
            if (el.parentNode) {
              // 用文本节点替换高亮元素
              el.parentNode.replaceChild(textNode, el);
              
              // 从注册表中移除
              unregisterHighlightElement(el);
            }
          } catch (err) {
            console.error('清除单个高亮元素失败:', err);
          }
        });
        
        // 确保没有遗漏的高亮元素
        const remainingHighlights = container.querySelectorAll('.text-highlight-selection');
        if (remainingHighlights.length > 0) {
          console.warn(`还有 ${remainingHighlights.length} 个高亮元素未被清除`);
          
          // 再次尝试清除残余元素
          remainingHighlights.forEach(el => {
            try {
              if (el.parentNode) {
                const text = el.textContent || '';
                const textNode = document.createTextNode(text);
                el.parentNode.replaceChild(textNode, el);
              }
            } catch (err) {
              console.error('清除残余高亮元素失败:', err);
            }
          });
        }
      } catch (error) {
        console.error('清除高亮时发生错误:', error);
      }
    }
    
    // 彻底重置所有状态
    resetAllState();
  }, [containerRef, unregisterHighlightElement, resetAllState]);
  
  // 重新应用所有已保存的高亮
  const reapplyAllHighlights = useCallback(() => {
    if (!containerRef?.current || !isMultiSelectActive) return;
    
    // 先移除现有高亮但保留文本
    const container = containerRef.current;
    const existingHighlights = container.querySelectorAll('.text-highlight-selection');
    
    // 收集高亮文本
    const textsToHighlight = [];
    existingHighlights.forEach(el => {
      textsToHighlight.push(el.textContent || '');
    });
    
    // 如果有之前选中的文本也加入
    if (selectedTexts.length > 0) {
      textsToHighlight.push(...selectedTexts);
    }
    
    // 添加从highlightElementsRef中记录的文本
    highlightElementsRef.current.forEach(item => {
      if (item.text && !textsToHighlight.includes(item.text)) {
        textsToHighlight.push(item.text);
      }
    });
    
    // 移除重复项
    const uniqueTexts = [...new Set(textsToHighlight)];
    
    if (uniqueTexts.length > 0) {
      // 更新状态
      setSelectedTexts(uniqueTexts);
      
      // 确保DOM元素正确高亮
      uniqueTexts.forEach(text => {
        if (!text) return;
        
        // 尝试在文档中查找该文本并高亮
        // 这是一个简化的实现，在复杂场景可能需要更复杂的匹配逻辑
        const textNodes = [];
        const findTextNodes = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.includes(text)) {
              textNodes.push(node);
            }
          } else {
            for (let i = 0; i < node.childNodes.length; i++) {
              findTextNodes(node.childNodes[i]);
            }
          }
        };
        
        findTextNodes(container);
        
        if (textNodes.length > 0) {
          // 找到了文本节点，应用高亮
          textNodes.forEach(textNode => {
            try {
              const range = document.createRange();
              const startIndex = textNode.textContent.indexOf(text);
              
              if (startIndex >= 0) {
                range.setStart(textNode, startIndex);
                range.setEnd(textNode, startIndex + text.length);
                
                // 应用高亮
                applyHighlightToSelection(range, text);
              }
            } catch (err) {
              console.error('重新应用高亮失败:', err);
            }
          });
        }
      });
    }
    
    // 确保所有高亮元素都有正确的样式
    setTimeout(() => {
      syncHighlightsToDOM();
    }, 50);
  }, [
    containerRef, 
    isMultiSelectActive, 
    selectedTexts, 
    applyHighlightToSelection, 
    syncHighlightsToDOM
  ]);
  
  // 自动选择：将用户的选择添加到集合中
  const handleAutoSelection = useCallback(() => {
    const current = getCurrentSelection();
    if (!current) return;
    
    if (isMultiSelectActive || isMultiSelectTempMode) {
      if (!selectedTexts.includes(current.text)) {
        setSelectedTexts(prev => [...prev, current.text]);
        setSelectionRanges(prev => [...prev, current.range]);
        applyHighlightToSelection(current.range, current.text);
      }
      // 不清除高亮
    } else {
      clearAllHighlights();
      setSelectedTexts([current.text]);
      setSelectionRanges([current.range]);
      applyHighlightToSelection(current.range, current.text);
    }
  }, [isMultiSelectActive, isMultiSelectTempMode, selectedTexts, setSelectedTexts, setSelectionRanges, applyHighlightToSelection, clearAllHighlights]);
  
  // 处理Ctrl键切换临时多选模式
  useEffect(() => {
    // 保留Ctrl键临时多选模式，但这只是一个额外功能
    // 即使不按Ctrl键，如果是连续选择模式，也应该可以多选
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        setIsMultiSelectTempMode(true);
        document.body.classList.add('multi-select-temp');
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setIsMultiSelectTempMode(false);
        document.body.classList.remove('multi-select-temp');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.classList.remove('multi-select-temp');
    };
  }, []);
  
  // 监听鼠标抬起事件以处理选择
  useEffect(() => {
    // 处理mouseup事件，当用户释放鼠标时检查是否有文本被选中
    const handleMouseUp = (e) => {
      // 确保不是右键点击（右键点击会由handleContextMenu处理）
      if (e.button !== 2) {
        // 在连续选择模式下处理选择
        if (isMultiSelectActive || isMultiSelectTempMode) {
          // 稍微延迟以确保选择已完成
          setTimeout(() => {
            handleAutoSelection();
          }, 10);
        }
      }
    };
    
    // 处理鼠标点击，避免误选
    const handleMouseDown = (e) => {
      // 只在连续选择模式下阻止默认行为
      if (isMultiSelectActive || isMultiSelectTempMode) {
        if (e.target.closest('.text-highlight-selection')) {
          // 如果点击已高亮的文本，阻止默认选择行为，避免取消高亮
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    
    // 添加事件监听
    const container = containerRef?.current;
    if (container) {
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mousedown', handleMouseDown);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [containerRef, isMultiSelectActive, isMultiSelectTempMode, handleAutoSelection]);
  
  // 切换连续选择模式
  const toggleMultiSelect = useCallback(() => {
    const newState = !isMultiSelectActive;
    
    // 如果开启了连续选择，应该显示视觉提示
    if (newState) {
      // 先彻底重置状态，确保没有残留数据
      resetAllState();
      
      // 然后设置新状态
      setIsMultiSelectActive(true);
      document.body.classList.add('multi-select-mode');
      
      // 确保同步已有高亮
      setTimeout(() => {
        syncHighlightsToDOM();
      }, 50);
    } else {
      // 如果关闭了连续选择，清除所有高亮和样式
      document.body.classList.remove('multi-select-mode');
      
      // 清除所有高亮元素和状态
      clearAllHighlights();
      
      // 最后设置状态
      setIsMultiSelectActive(false);
    }
  }, [isMultiSelectActive, clearAllHighlights, syncHighlightsToDOM, resetAllState]);
  
  // 处理右键菜单
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    
    // 在设置新菜单前，确保先关闭任何已存在的菜单
    setContextMenu(null);
    
    // 移除已存在的菜单DOM元素（防止浏览器渲染层菜单累积）
    const oldMenus = document.querySelectorAll('.text-context-menu');
    oldMenus.forEach(menu => {
      if (menu.parentNode) {
        menu.parentNode.removeChild(menu);
      }
    });
    
    // 获取当前选择
    const current = getCurrentSelection();
    
    // 如果右键点击时没有激活的多选模式，则先清除所有之前的选择
    if (!isMultiSelectActive && !isMultiSelectTempMode && selectedTexts.length > 0) {
      resetAllState();
    }
    
    // 如果当前有选择，应用高亮
    if (current) {
      const highlighted = applyHighlightToSelection(current.range, current.text);
      if (highlighted) {
        // 确保不重复添加已高亮的文本
        const isDuplicate = selectedTexts.includes(current.text);
        if (!isDuplicate) {
          setSelectedTexts(prev => [...prev, current.text]);
          setSelectionRanges(prev => [...prev, highlighted]);
        }
        
        // 清除选择
        window.getSelection().removeAllRanges();
      }
    }
    
    // 如果没有选择也没有已选中的文本，则不显示菜单
    if (!current && selectedTexts.length === 0) {
      return;
    }
    
    // 添加一个短暂延迟，确保DOM中的旧菜单已被移除
    setTimeout(() => {
      // 设置右键菜单位置
      setContextMenu({
        x: e.clientX,
        y: e.clientY
      });
    }, 10);
    
    // 确保所有高亮都正确显示
    setTimeout(() => {
      syncHighlightsToDOM();
    }, 50);
  }, [
    getCurrentSelection, 
    selectedTexts, 
    applyHighlightToSelection, 
    syncHighlightsToDOM, 
    isMultiSelectActive, 
    isMultiSelectTempMode, 
    resetAllState
  ]);
  
  // 组合所有选择的文本
  const getCombinedText = useCallback(() => {
    return selectedTexts.join(' ');
  }, [selectedTexts]);
  
  // 在组件卸载时移除所有菜单
  useEffect(() => {
    return () => {
      const menus = document.querySelectorAll('.text-context-menu');
      menus.forEach(menu => {
        if (menu.parentNode) {
          menu.parentNode.removeChild(menu);
        }
      });
    };
  }, []);
  
  // 在初始化和连续选择模式改变时，同步高亮状态
  useEffect(() => {
    if (isMultiSelectActive) {
      syncHighlightsToDOM();
      // 尝试重新应用丢失的高亮
      reapplyAllHighlights();
    }
  }, [isMultiSelectActive, syncHighlightsToDOM, reapplyAllHighlights]);
  
  // 定期检查和同步高亮状态，确保不丢失
  useEffect(() => {
    if (!isMultiSelectActive) return;
    
    const intervalId = setInterval(() => {
      syncHighlightsToDOM();
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isMultiSelectActive, syncHighlightsToDOM]);
  
  const endMultiSelectAndGetText = useCallback(() => {
    setIsMultiSelectActive(false);
    document.body.classList.remove('multi-select-mode');
    document.body.classList.remove('multi-select-temp');
    const text = selectedTexts.join('\n\n');
    clearAllHighlights();
    return text;
  }, [selectedTexts, clearAllHighlights]);
  
  return {
    isMultiSelectActive,
    setIsMultiSelectActive,
    isMultiSelectTempMode,
    setIsMultiSelectTempMode,
    selectedTexts,
    selectedText,
    selectionRanges,
    contextMenu,
    setContextMenu,
    toggleMultiSelect,
    handleAutoSelection,
    handleContextMenu,
    clearAllHighlights,
    getCombinedText,
    syncHighlightsToDOM,
    resetAllState,
    endMultiSelectAndGetText
  };
};

export default useMultiSelect; 