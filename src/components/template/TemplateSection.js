import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Panel, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Typography, Avatar, Tag, Button, message, Spin, Modal, Input } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AnnotationModal from '../annotations/AnnotationModal';
import ContextMenu from '../annotations/ContextMenu';
import TextContextMenu from '../context/TextContextMenu';
import DiscussModal from '../modals/DiscussModal';
import CommentsList from '../common/CommentsList';
import * as annotationService from '../../services/annotationService';
import * as templateService from '../../services/templateService';
import useStyles from '../../styles/components/template/TemplateSection';
import { OptimizationContext } from '../../contexts/OptimizationContext';

const { Title } = Typography;
const { TextArea } = Input;

const TemplateSection = ({ isEditable = false, taskId, steps, comments = [], onAddAnnotation, card }) => {
  const { styles } = useStyles();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedAnnotation, setExpandedAnnotation] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [addNodeModalVisible, setAddNodeModalVisible] = useState(false);
  const [newNodeContent, setNewNodeContent] = useState('');
  const [discussModalVisible, setDiscussModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // 引入全局优化上下文
  const { 
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);
  console.log('TemplateSection', card);
  // 优先使用 card?.templateData 作为数据源
  const templateData = card?.templateData;

  useEffect(() => {
    // 优先使用 flow_config 或 props.steps 里的新结构
    const flowConfig = card?.flow_config || steps;
    if (flowConfig && Array.isArray(flowConfig.steps) && Array.isArray(flowConfig.connections)) {
      // 1. 处理节点
      const flowNodes = flowConfig.steps.map((step) => {
        let nodeStyle = {
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '14px'
        };
        // 入口节点高亮
        if (Array.isArray(flowConfig.entry_points) && flowConfig.entry_points.includes(step.id)) {
          nodeStyle = {
            ...nodeStyle,
            background: '#f0f7ff',
            border: '1px solid #006ffd',
            fontWeight: 'bold'
          };
        }
        // 出口节点特殊样式
        if (Array.isArray(flowConfig.exit_points) && flowConfig.exit_points.includes(step.id)) {
          nodeStyle = {
            ...nodeStyle,
            background: '#fffbe6',
            border: '1px solid #faad14',
            fontWeight: 'bold'
          };
        }
        return {
          id: step.id,
          data: { label: step.name },
          position: { x: step.position?.x || 0, y: step.position?.y || 0 },
          type: 'default',
          style: nodeStyle
        };
      });
      // 2. 处理边（from/to结构）
      const flowEdges = flowConfig.connections.map(conn => ({
        id: `${conn.from}-${conn.to}`,
        source: conn.from,
        target: conn.to,
        animated: true,
        style: { stroke: '#006ffd' }
      }));
      setNodes(flowNodes);
      setEdges(flowEdges);
      if (comments && comments.length > 0) {
        setLoading(false);
      } else {
        fetchAnnotations().finally(() => {
          setLoading(false);
        });
      }
      return;
    }
    // 优先使用 templateData
    if (taskId && templateData) {
      setNodes(templateData.nodes || []);
      setEdges(templateData.edges || []);
      if (comments && comments.length > 0) {
        setLoading(false);
      } else {
        fetchAnnotations().finally(() => {
          setLoading(false);
        });
      }
    } else if (taskId && steps) {
      // 兼容旧逻辑
      if (steps.templateData) {
        setNodes(steps.templateData.nodes);
        setEdges(steps.templateData.edges);
        if (comments && comments.length > 0) {
          setLoading(false);
        } else {
        fetchAnnotations().finally(() => {
          setLoading(false);
        });
          // 否则从服务获取注释
          fetchAnnotations().finally(() => {
            setLoading(false);
          });
        }
      } else if (Array.isArray(steps) && steps.length > 0) {
        // 将steps数组数据转换为React Flow所需的格式
        // 创建一个简单的流程图，每个step作为一个节点
        const flowNodes = steps.map((step, index) => {
          // 根据节点类型设置不同的样式
          let nodeStyle = {
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          };
          
          // 第一个节点样式
          if (index === 0) {
            nodeStyle = {
              ...nodeStyle,
              background: '#f0f7ff',
              border: '1px solid #006ffd',
              fontWeight: 'bold'
            };
          }
          
          return {
            id: `${index}`,
            data: { label: step.agent || `步骤 ${index + 1}` },
            position: { x: 250, y: index * 100 },
            type: 'default',
            style: nodeStyle
          };
        });

        // 创建节点之间的连接边
        const flowEdges = steps.slice(0, -1).map((_, index) => ({
          id: `e${index}-${index + 1}`,
          source: `${index}`,
          target: `${index + 1}`,
          animated: true,
          style: { stroke: '#006ffd' }
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
        
        if (comments && comments.length > 0) {
          // 如果提供了comments属性，直接使用它
          setLoading(false);
        } else {
          // 否则从服务获取注释
          fetchAnnotations().finally(() => {
            setLoading(false);
          });
        }
      } else {
        // 如果steps为空或无效格式，则从服务获取数据
        Promise.all([
          fetchTemplateContent(),
          fetchAnnotations()
        ]).finally(() => {
          setLoading(false);
        });
      }
    } else {
      // 如果没有提供steps参数，则从服务获取数据
      Promise.all([
        fetchTemplateContent(),
        fetchAnnotations()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [taskId]);

  // 当从props获取到comments或从优化上下文获取到注释数据时，更新本地状态
  useEffect(() => {
    // 优先使用从props传入的comments
    if (comments && comments.length > 0) {
      setLoading(false);
    } 
    // 如果没有props传入comments但有来自上下文的数据，且当前为模板优化步骤，则使用上下文数据
    else if (currentOptimizationStep === 'flow' && currentStepComments && currentStepComments.length > 0) {
      setLoading(false);
    }
  }, [comments, currentOptimizationStep, currentStepComments]);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      // 检查点击的元素是否为右键菜单本身或其子元素
      const isClickInsideMenu = e.target.closest('.contextMenuContainer');
      
      if (contextMenu && !isClickInsideMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [contextMenu]);

  const fetchTemplateContent = async () => {
    try {
      const data = await templateService.getTemplateContent();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      message.error('获取模板内容失败');
    }
  };

  const fetchAnnotations = async () => {
    try {
      const data = await annotationService.getAnnotations();
      
      // 将获取到的注释也同步到全局状态
      if (currentOptimizationStep === 'flow') {
        setStepComments('flow', data);
      }
    } catch (error) {
      message.error('获取注释失败');
    }
  };

  const onConnect = useCallback((params) => {
    if (isEditable) {
      setEdges((eds) => addEdge(params, eds));
    }
  }, [isEditable]);

  const onNodeContextMenu = useCallback((event, node) => {
    if (!isEditable) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    setSelectedNode(node);
    setSelectedText(node.data.label || '');
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id
    });
  }, [isEditable]);

  const handleContextMenuAction = (action) => {
    setContextMenu(null);
    switch (action) {
      case 'discuss':
        setDiscussModalVisible(true);
        break;
      case 'addAnnotation':
      case 'annotate':
        setModalVisible(true);
        break;
      case 'edit':
        setEditContent(selectedNode.data.label);
        setEditModalVisible(true);
        break;
      case 'select':
        console.log('连续选择功能', selectedNode.data.label);
        break;
      case 'delete':
        handleDeleteNode();
        break;
      default:
        break;
    }
  };

  const handleSaveAnnotation = async (data) => {
    try {
      let annotationData = {
        ...data,
        nodeId: selectedNode?.id,
        step: 'flow',
        id: `flow-annotation-${Date.now()}`
      };
      if (onAddAnnotation) {
        onAddAnnotation(annotationData);
      } else {
        addComment(annotationData);
        message.success('注释已添加');
      }
      setModalVisible(false);
      setContextMenu(null);
    } catch (error) {
      console.error('保存注释失败:', error);
      message.error('添加注释失败，请重试');
    }
  };

  const handleDeleteAnnotation = async (id) => {
    try {
      await annotationService.deleteAnnotation(id);
      // 只操作全局
      if (currentOptimizationStep === 'flow') {
        setStepComments('flow', comments.filter(item => item.id !== id));
      }
      message.success('删除观点成功');
    } catch (error) {
      message.error('删除观点失败');
    }
  };

  const handleMouseEnter = (id) => {
    setExpandedAnnotation(id);
  };

  const handleEditNode = () => {
    if (!selectedNode || !editContent.trim()) {
      message.error('请输入节点内容');
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: editContent.trim()
            }
          };
        }
        return node;
      })
    );

    setEditModalVisible(false);
    setEditContent('');
    setSelectedNode(null);
    message.success('修改成功');
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    setSelectedNode(null);
    message.success('删除成功');
  };

  const handleAddNode = () => {
    if (!newNodeContent.trim()) {
      message.error('请输入节点内容');
      return;
    }

    const newNode = {
      id: `${Date.now()}`,
      data: { label: newNodeContent.trim() },
      position: { x: 250, y: nodes.length * 100 },
      style: {
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px'
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setAddNodeModalVisible(false);
    setNewNodeContent('');
    message.success('添加成功');
  };

  // 合并props.comments和card.annotation.flow，去重
  const taskAnnotations = Array.isArray(card?.annotation?.flow) ? card.annotation.flow : [];
  const filteredComments = Array.isArray(comments)
    ? comments.filter(item => item.step === 'flow')
    : [];
  const mergedComments = [
    ...taskAnnotations,
    ...filteredComments.filter(c => !taskAnnotations.some(t => t.id === c.id))
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 左侧流程图区域 */}
      <div className={styles.flowChartContainer}>
        <div className={styles.flowChartHeader}>
          <Title level={5} className={styles.headerTitle}>模板详情</Title>
          {isEditable ? (
            <Button 
              type="text" 
              icon={<PlusOutlined />} 
              className={styles.actionButton}
              onClick={() => {
                // 点击添加观点按钮时，清空已选节点，直接打开模态框
                setSelectedNode(null);
                setSelectedText('');
                setModalVisible(true);
              }}
            >
              添加观点
            </Button>
          ) : null}
        </div>
        
        <div className={styles.flowChartContent}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={isEditable ? onNodesChange : undefined}
              onEdgesChange={isEditable ? onEdgesChange : undefined}
              onConnect={onConnect}
              onNodeContextMenu={onNodeContextMenu}
              nodeTypes={{ custom: undefined }}
              fitView
              proOptions={{ hideAttribution: true }}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.1}
              maxZoom={4}
              zoomOnScroll={false}
              panOnScroll={false}
              panOnDrag={true}
              preventScrolling={false}
              onWheelCapture={(e) => e.stopPropagation()}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* 右侧注释列表 - 只有当有注释数据时才显示 */}
      {mergedComments && mergedComments.length > 0 && (
        <div className="template-sidebar-container" style={{ 
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
            contextType="flow"
            title="模板观点"
          />
        </div>
      )}

      {/* 右键菜单 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
          contextType="flow"
        />
      )}

      {/* 添加观点的 Modal */}
      <AnnotationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedNode(null);
        }}
        onSave={handleSaveAnnotation}
        selectedText={selectedNode?.data.label || selectedText || ''}
        initialContent={selectedNode?.data.label || selectedText || ''}
        step="flow"
        nodeId={selectedNode?.id} // 传递选中节点的ID
      />

      {/* 编辑节点的 Modal */}
      <Modal
        title="编辑节点"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditContent('');
          setSelectedNode(null);
        }}
        onOk={handleEditNode}
        okText="保存"
        cancelText="取消"
      >
        <TextArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="请输入节点内容..."
          rows={4}
        />
      </Modal>

      {/* 添加节点的 Modal */}
      <Modal
        title="添加节点"
        open={addNodeModalVisible}
        onCancel={() => {
          setAddNodeModalVisible(false);
          setNewNodeContent('');
        }}
        onOk={handleAddNode}
        okText="添加"
        cancelText="取消"
      >
        <TextArea
          value={newNodeContent}
          onChange={(e) => setNewNodeContent(e.target.value)}
          placeholder="请输入节点内容..."
          rows={4}
        />
      </Modal>

      {/* 添加节点按钮 */}
      {isEditable && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusCircleOutlined />}
          size="large"
          className={styles.addNodeButton}
          onClick={() => setAddNodeModalVisible(true)}
        />
      )}

      {/* 讨论对话框 */}
      <DiscussModal
        visible={discussModalVisible}
        onClose={() => setDiscussModalVisible(false)}
        selectedText={selectedText}
      />
    </div>
  );
};

export default TemplateSection; 