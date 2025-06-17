import React, { useState, useEffect, useRef, useContext } from 'react';
import { Typography, Avatar, Tag, Button, message, Spin } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import DiscussModal from '../modals/DiscussModal';
import CommentsList from '../common/CommentsList';
import * as annotationService from '../../services/annotationService';
import * as qaService from '../../services/qaService';
import useStyles from '../../styles/components/qa/QASection';
import { OptimizationContext } from '../../contexts/OptimizationContext';
import useMultiSelect from '../../hooks/useMultiSelect';
import TextContextMenu from '../context/TextContextMenu';
import '../../styles/components/MultiSelect.css';

const { Title } = Typography;

/**
 * QA优化界面组件
 */
const QASection = ({ isEditable = false, taskId, prompt, response, comments = [], onAddAnnotation, card }) => {
  const { styles } = useStyles();
  
  const [annotations, setAnnotations] = useState([]);
  const [expandedAnnotation, setExpandedAnnotation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qaContent, setQAContent] = useState({
    title: "问答详情",
    content: response ? 
      `${response}` :
      "暂无问答内容"
  });
  const contentRef = useRef(null);
  
  // 添加讨论模态框状态
  const [discussModalVisible, setDiscussModalVisible] = useState(false);
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [selectedModalText, setSelectedModalText] = useState('');

  // 引入全局优化上下文
  const { 
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);

  // 使用连续选择hook
  const multiSelect = useMultiSelect(contentRef);
  const {
    isMultiSelectActive,
    setIsMultiSelectActive,
    selectedTexts,
    selectedText,
    contextMenu,
    setContextMenu,
    handleContextMenu,
    toggleMultiSelect,
    clearAllHighlights,
    getCombinedText,
    syncHighlightsToDOM,
    resetAllState
  } = multiSelect;

  // 处理全局点击事件关闭右键菜单
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // 如果点击的不是右键菜单内部元素，且右键菜单显示中，则关闭菜单
      if (contextMenu && !e.target.closest('.text-context-menu')) {
        setContextMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleGlobalClick);
    
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [contextMenu, setContextMenu]);

  // 防止默认的浏览器右键菜单
  useEffect(() => {
    const preventDefaultContextMenu = (e) => {
      // 只在容器内阻止默认右键菜单
      if (contentRef.current && contentRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', preventDefaultContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', preventDefaultContextMenu);
    };
  }, []);

  useEffect(() => {
    if (comments && comments.length > 0) {
      // 如果提供了comments属性，直接使用它
      setAnnotations(comments);
      setLoading(false);
    } else {
      // 否则从服务获取注释
    fetchAnnotations().finally(() => {
      setLoading(false);
    });
    }
  }, [comments]);

  // 当从优化上下文获取到注释数据时，更新本地状态
  useEffect(() => {
    // 同时支持字符串'qa'和数字1两种形式的步骤标识符
    if ((currentOptimizationStep === 'qa' || currentOptimizationStep === 1) && currentStepComments && currentStepComments.length > 0) {
      setAnnotations(currentStepComments);
    }
  }, [currentOptimizationStep, currentStepComments]);

  // 添加effect监听props变化，更新qaContent
  useEffect(() => {
    if (response) {
      setQAContent({
        title: "问答详情",
        content: `${response}`
      });
    }
  }, [prompt, response]);

  const fetchAnnotations = async () => {
    try {
      const data = await annotationService.getAnnotations();
      
      // 过滤注释数据，只保留step为'qa'的注释
      const qaAnnotations = data.filter(annotation => annotation.step === 'qa');
      setAnnotations(qaAnnotations);
      
      // 将获取到的注释也同步到全局状态
      // 支持字符串'qa'和数字1两种形式的步骤标识符
      if (currentOptimizationStep === 'qa' || currentOptimizationStep === 1) {
        setStepComments('qa', qaAnnotations);
      }
    } catch (error) {
      message.error('获取注释失败');
    }
  };

  // 处理右键菜单项点击
  const handleContextMenuAction = (action) => {
    switch (action) {
      case 'discuss':
        // 打开讨论模态框
        setSelectedModalText(getCombinedText());
        setDiscussModalVisible(true);
        setContextMenu(null);
        // 关闭连续选择模式并彻底清除状态
        if (isMultiSelectActive) {
          resetAllState();
          setIsMultiSelectActive(false);
        }
        break;
      case 'annotate':
        // 打开添加观点模态框
        setSelectedModalText(getCombinedText());
        setAnnotationModalVisible(true);
        setContextMenu(null);
        // 关闭连续选择模式并彻底清除状态
        if (isMultiSelectActive) {
          resetAllState();
          setIsMultiSelectActive(false);
        }
        break;
      case 'select':
        // 切换连续选择模式
        if (isMultiSelectActive) {
          resetAllState();
          setIsMultiSelectActive(false);
        } else {
          resetAllState(); // 防止有残留状态
          setIsMultiSelectActive(true);
        }
        setContextMenu(null);
        break;
      default:
        setContextMenu(null);
        break;
    }
  };

  const handleSaveAnnotation = async (data) => {
    try {
      // 创建注释数据对象
      const annotationData = {
        ...data,
        selectedText: data.selectedText,
        id: data.id || `annotation-${Date.now()}`, // 如果有id则保留，否则创建新id
        step: 'qa' // 明确标记为QA节的注释，与task.annotation.qa对应
      };

      // 首先调用服务保存
      await annotationService.addAnnotation(annotationData);

      // 更新本地状态
      setAnnotations(prev => [...prev, annotationData]);
      
      // 同时更新全局状态，支持字符串'qa'和数字1两种形式的步骤标识符
      if (currentOptimizationStep === 'qa' || currentOptimizationStep === 1) {
        addComment(annotationData);
      }
      
      // 如果父组件提供了onAddAnnotation函数，调用它将注释添加到task中
      if (onAddAnnotation && typeof onAddAnnotation === 'function') {
        onAddAnnotation(annotationData);
      }
      
      // 关闭模态框
      setAnnotationModalVisible(false);
      setModalVisible(false);
      
      // 确保连续选择状态关闭并彻底清除状态
      if (isMultiSelectActive) {
        resetAllState();
        setIsMultiSelectActive(false);
      }
      
      message.success('添加注释成功');
    } catch (error) {
      console.error('添加注释失败:', error);
      message.error('添加注释失败');
    }
  };

  const handleDeleteAnnotation = async (id) => {
    try {
      await annotationService.deleteAnnotation(id);
      
      // 更新本地状态
      const updatedAnnotations = annotations.filter(item => item.id !== id);
      setAnnotations(updatedAnnotations);
      
      // 同时更新全局状态，支持字符串'qa'和数字1两种形式的步骤标识符
      if (currentOptimizationStep === 'qa' || currentOptimizationStep === 1) {
        setStepComments('qa', updatedAnnotations);
      }
      
      message.success('删除注释成功');
    } catch (error) {
      message.error('删除注释失败');
    }
  };

  const handleMouseEnter = (id) => {
    setExpandedAnnotation(id);
  };

  // 处理自定义右键菜单，只在用户点击右键时显示
  const handleContentContextMenu = (e) => {
    // 阻止默认右键菜单
    e.preventDefault();
    e.stopPropagation();
    
    // 显示自定义右键菜单
    handleContextMenu(e);
  };

  // 合并props.comments和card.annotation.qa，去重
  const taskAnnotations = Array.isArray(card?.annotation?.qa) ? card.annotation.qa : [];
  const mergedComments = [
    ...taskAnnotations,
    ...comments.filter(c => !taskAnnotations.some(t => t.id === c.id))
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isEditable ? 'edit-mode' : ''} ${isMultiSelectActive ? 'multi-select-mode' : ''}`}>
      {/* 左侧文本区域 */}
      <div className={styles.leftSection}>
        <div className={styles.headerSection}>
          <Title level={5} className={styles.headerTitle}>{qaContent.title}</Title>
          {isEditable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* <Button 
                type="text" 
                icon={<UnorderedListOutlined />} 
                className={`${styles.actionButton} ${isMultiSelectActive ? 'active' : ''}`}
                onClick={() => {
                  // 如果已激活，则先清除状态，再关闭
                  if (isMultiSelectActive) {
                    resetAllState();
                    setIsMultiSelectActive(false);
                  } else {
                    // 如果未激活，则先开启状态
                    resetAllState(); // 防止有残留状态
                    setIsMultiSelectActive(true);
                  }
                }}
                title={isMultiSelectActive ? "关闭连续选择" : "连续选择"}
              /> */}
              <Button 
                type="text" 
                icon={<PlusOutlined />} 
                className={styles.actionButton}
                onClick={() => setAnnotationModalVisible(true)}
              >
                添加观点
              </Button>
              {/* <Button 
                type="text" 
                icon={<EyeOutlined />} 
                className={styles.actionButton}
              >
                预览
              </Button> */}
            </div>
          )}
        </div>
        
        <div 
          ref={contentRef}
          className={`${styles.contentText} qa-content-text`}
          onContextMenu={handleContentContextMenu}
        >
          {qaContent.content.split('').map((char, index) => {
            const annotation = annotations.find(a => index >= a.start && index < a.end);
            if (annotation) {
              return (
                <span
                  key={index}
                  className={styles.annotatedText}
                  onMouseEnter={() => handleMouseEnter(annotation.id)}
                >
                  {char}
                  {index === annotation.start && (
                    <span className={styles.annotationMarker}>
                      {annotation.id}
                    </span>
                  )}
                </span>
              );
            }
            return <span key={index}>{char}</span>;
          })}
      </div>

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

      {/* 右侧注释列表 - 只有当有注释数据时才显示 */}
      {mergedComments && mergedComments.length > 0 && (
      <div className="qa-sidebar-container" style={{ 
        width: '320px', 
        flexShrink: 0,
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px'
      }}>   
        <CommentsList 
          comments={mergedComments}
          isEditable={isEditable}
          expandedId={expandedAnnotation}
          onToggleExpand={setExpandedAnnotation}
          onMouseEnter={handleMouseEnter}
          onDelete={handleDeleteAnnotation}
          contextType="text"
          title="观点列表"
        />
      </div>
      )}

      {/* 添加注释的 Modal */}
      <AnnotationModal
        visible={annotationModalVisible}
        onClose={() => {
          setAnnotationModalVisible(false);
          // 确保连续选择状态关闭并彻底清除状态
          if (isMultiSelectActive) {
            resetAllState();
            setIsMultiSelectActive(false);
          }
          // 清空选中的文本
          setSelectedModalText('');
        }}
        onSave={handleSaveAnnotation}
        selectedText={selectedModalText}
        initialContent={selectedModalText}
        step="qa"
      />
      
      {/* 讨论对话框 */}
      <DiscussModal
        visible={discussModalVisible}
        onClose={() => {
          setDiscussModalVisible(false);
          // 确保连续选择状态关闭并彻底清除状态
          if (isMultiSelectActive) {
            resetAllState();
            setIsMultiSelectActive(false);
          }
          // 清空选中的文本
          setSelectedModalText('');
        }}
        selectedText={selectedModalText}
      />
    </div>
  );
};

export default QASection; 