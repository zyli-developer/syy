"use client"

import { useState, useEffect, useRef, useContext, useMemo } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {  Button, Avatar, Tag, Spin, Select,  Breadcrumb, Switch, Steps, message, Tooltip, Card } from "antd"
import {
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  ForkOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  SendOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons"
import taskService from "../services/taskService"
import cardService from "../services/cardService"
import { useChatContext } from "../contexts/ChatContext"
import CreateTaskModal from "../components/modals/CreateTaskModal"
import TimelineIcon from "../components/icons/TimelineIcon"
import AnnotationModal from "../components/annotations/AnnotationModal"

// 导入QA组件
import QASection from "../components/qa/QASection"
// 导入场景优化和模板优化组件
import SceneSection from "../components/scene/SceneSection"
import TemplateSection from "../components/template/TemplateSection"
// 导入再次测试组件
import TestConfirmation from "../components/task/TestConfirmation"
// 导入提交结果组件
import SubmitResultSection from "../components/task/SubmitResultSection"
import ResultPage from "../components/task/ResultPage" // 添加ResultPage组件导入

// 导入样式覆盖
import "../styles/overrides/qa.css"
import "../styles/overrides/scene.css"
import "../styles/overrides/template.css"
import "../styles/overrides/retest.css"


// 导入右键菜单和讨论模态框组件
import TextContextMenu from "../components/context/TextContextMenu"
import DiscussModal from "../components/modals/DiscussModal"
import ShareModal from "../components/modals/ShareModal"
import { OptimizationContext } from "../contexts/OptimizationContext"

// 导入通用评论列表组件
import CommentsList from "../components/common/CommentsList";
import useTextHighlight from '../hooks/useTextHighlight';

const { Option } = Select


// 优化模式步骤组件
const STEP_TITLES = [
  '结果质询',
  'QA优化',
  '场景优化',
  '模版优化',
  '再次测试',
  '提交结果',
];

// 步骤字符串到数字的映射
const STEP_TYPE_TO_INDEX = {
  'result': 0,
  'qa': 1,
  'scenario': 2,
  'flow': 3,
  'retest': 4,
  'submit': 5
};

const OptimizationSteps = ({ currentStep, onStepChange }) => {
  const stepItems = STEP_TITLES.map(title => ({ title }));
  
  // 将字符串步骤转换为数字索引
  const currentIndex = typeof currentStep === 'string' ? 
    STEP_TYPE_TO_INDEX[currentStep] || 0 : currentStep;

  return (
    <div className="optimization-steps" style={{ 
      padding: "12px", 
      marginBottom: "12px", 
      backgroundColor: "var(--color-bg-layout)", 
      border: "1px solid var(--color-border-secondary)", 
      borderRadius: "8px" 
    }}>
      <Steps 
        current={currentIndex} 
        onChange={onStepChange}
        items={stepItems} 
        size="small"
        labelPlacement="vertical"
      />
    </div>
  );
};

// QA优化界面组件
// const QAOptimizationSection = ({ card, comments }) => {
//   return (
//     <div className="qa-optimization-content" style={{ width: "100%" }}>
//       <QASection 
//         isEditable={true} 
//         taskId={card?.id}
//         card={card}
//         prompt={card?.prompt} 
//         response={card?.response } 
//         comments={comments} // 传递 currentStepComments
//       />
//     </div>
//   );
// };

// 场景优化界面组件
// const SceneOptimizationSection = ({ card }) => {
//   console.log('SceneOptimizationSection', card);
//   return (
//     <div className="scene-optimization-content" style={{ width: "100%" }}>
//       <SceneSection 
//         isEditable={true} 
//         taskId={card?.id}
//         scenario={card?.scenario} 
//         comments={card?.annotation?.scenario || []} // 统一用 annotation
//         card={card}
//         onAddAnnotation={addAnnotationToTask} // 修复：传递注释添加方法
//       />
//     </div>
//   );
// };

// 模板优化界面组件
// const TemplateOptimizationSection = ({ card }) => {
//   console.log('TemplateOptimizationSection', card);
//   return (
//     <div className="template-optimization-content" style={{ width: "100%" }}>
//       <TemplateSection 
//         isEditable={true} 
//         taskId={card?.id}
//         steps={card?.flow_config ? { flow: card.flow_config, ...card?.step } : card?.step} 
//         comments={card?.annotation?.flow || []} // 统一用 annotation
//         card={card}
//       />
//     </div>
//   );
// };



const CardDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedModels, setSelectedModels] = useState([])
  const [selectedChartModels, setSelectedChartModels] = useState({

  })
  const { isChatOpen } = useChatContext()
  const [expandedModel, setExpandedModel] = useState(false)
  const [selectedModel, setSelectedModel] = useState("claude")
  const [evaluationData, setEvaluationData] = useState({})
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  
  // 添加关注和分享相关状态
  const [isFollowing, setIsFollowing] = useState(false)
  const [isShareModalVisible, setIsShareModalVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false);

  // 添加用于保存完整卡片数据的状态
  const [completeCardData, setCompleteCardData] = useState(null)
  
  // 使用全局优化模式上下文
  const { 
    isOptimizationMode, setIsOptimizationMode,
    currentOptimizationStep, setCurrentOptimizationStep,
    currentStepComments, setComments, addComment
  } = useContext(OptimizationContext);
  
  // 保留本地状态存储
  const [savedData, setSavedData] = useState({})
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [isTaskStarted, setIsTaskStarted] = useState(false);
  
  // 添加右键菜单和讨论模态框相关状态
  const [selectedText, setSelectedText] = useState('');
  const [contextMenu, setContextMenu] = useState(null); // {x, y}
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showDiscussModal, setShowDiscussModal] = useState(false);

  // 添加注释展开状态
  const [expandedComment, setExpandedComment] = useState(null);
  
  // 添加连续选择相关状态
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [selectionRanges, setSelectionRanges] = useState([]);
  
  // 临时多选模式（按Ctrl/Command键触发）
  const [isMultiSelectTempMode, setIsMultiSelectTempMode] = useState(false);
  
  // 添加用于模态框显示的文本状态
  const [selectedModalText, setSelectedModalText] = useState('');
  
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  
  // 处理注释展开切换
  const handleCommentToggle = (id) => {
    setExpandedComment(expandedComment === id ? null : id);
  };

  // Determine if we came from explore or tasks
  const isFromExplore = location.pathname.includes("/explore") || location.state?.from === "explore"
  const parentPath = isFromExplore ? "/explore" : "/tasks"
  const parentLabel = isFromExplore ? "探索" : "任务"

  // 切换优化模式
  const toggleOptimizationMode = (checked) => {
    setIsOptimizationMode(checked);
    // 重置到第一步
    setCurrentOptimizationStep('result');
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    // 设置body的类，以便全局样式生效
    if (checked) {
      document.body.classList.add('optimization-mode');
    } else {
      document.body.classList.remove('optimization-mode');
    }
  };

  // 保存当前修改的数据
  const saveCurrentData = () => {
    // 收集当前数据
    const currentData = {
      step: currentOptimizationStep,
      models: selectedModels,
      comments: currentStepComments,
      // 其他需要保存的数据
    };
    
    // 更新savedData状态
    setSavedData(prev => ({
      ...prev,
      [currentOptimizationStep]: currentData
    }));
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    console.log("数据已保存", currentData);
  };

  // 保存并进入下一步
  const saveAndNext = () => {
    // 先保存当前数据
    saveCurrentData();
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    // 根据当前步骤确定下一步
    let nextStep;
    switch(currentOptimizationStep) {
      case 'result':
        nextStep = 'qa';
        break;
      case 'qa':
        nextStep = 'scenario';
        break;
      case 'scenario':
        nextStep = 'flow';
        break;
      case 'flow':
        nextStep = 'retest';
        break;
      case 'retest':
        nextStep = 'submit';
        break;
      default:
        nextStep = 'result';
    }
    
    // 进入下一步
    setCurrentOptimizationStep(nextStep);
  };

  // 步骤变更处理
  const handleStepChange = (current) => {
    // 将数字步骤转换为字符串表示
    let stepType;
    switch(current) {
      case 0:
        stepType = 'result';
        break;
      case 1:
        stepType = 'qa';
        break;
      case 2:
        stepType = 'scenario';
        break;
      case 3:
        stepType = 'flow';
        break;
      case 4:
        stepType = 'retest';
        break;
      case 5:
        stepType = 'submit';
        break;
      default:
        stepType = 'result';
    }
    
    // 更新全局优化上下文中的当前步骤
    setCurrentOptimizationStep(stepType);
    
    // 记录当前步骤数据，用于返回时恢复
    if (stepType !== currentOptimizationStep) {
      // 如果是切换到不同步骤，保存当前步骤的数据
      saveCurrentData();
      
      // 关闭连续选择模式并清除高亮
      if (isMultiSelectActive) {
        setIsMultiSelectActive(false);
        clearAllHighlights();
      }
    }
  };

  // 返回按钮处理函数
  const handleBack = () => {
    // 关闭优化模式
    if (isOptimizationMode) {
      setIsOptimizationMode(false);
      setCurrentOptimizationStep('result');
    }
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    navigate(-1)
  }

  // 上一步按钮处理函数
  const handlePrevStep = () => {
    // 根据当前步骤确定上一步
    let prevStep;
    switch(currentOptimizationStep) {
      case 'qa':
        prevStep = 'result';
        break;
      case 'scenario':
        prevStep = 'qa';
        break;
      case 'flow':
        prevStep = 'scenario';
        break;
      case 'retest':
        prevStep = 'flow';
        break;
      case 'submit':
        prevStep = 'retest';
        break;
      default:
        // 如果已经是第一步，则关闭优化模式
        setIsOptimizationMode(false);
        return;
    }
    
      saveCurrentData(); // 先保存当前步骤数据
      
      // 关闭连续选择模式并清除高亮
      if (isMultiSelectActive) {
        setIsMultiSelectActive(false);
        clearAllHighlights();
      }
      
    setCurrentOptimizationStep(prevStep);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        let cardData;
        let evaluationData = {};
        
        // 检查ID格式，确定使用哪个API获取数据
        // 如果ID是数字格式（如"1001"），则使用getExplorationDetail
        
          // 获取探索详情
          console.log(`正在获取ID为 ${id} 的探索详情...`);
          const response = await cardService.getExplorationDetail(id);
          
          // 确保我们使用正确的数据结构 - 从response.exploration中获取数据
          cardData = response.exploration || response;
          
          // 从response中获取模型评估数据
          evaluationData = response.evaluationData || {};
          
          console.log(`获取到的探索详情数据:`, cardData);
          console.log(`获取到的模型评估数据:`, evaluationData);
        
        // 确保templateData正确设置
        if (!cardData.templateData && cardData.step) {
          if (typeof cardData.step === 'object' && !Array.isArray(cardData.step) && cardData.step.templateData) {
            cardData.templateData = cardData.step.templateData;
          }
        }
        
        // 确保 chartData 存在且包含必要的属性
        if (!cardData.chartData) {
          cardData.chartData = { radar: [], line: [] };
        } else {
          if (!cardData.chartData.radar || !Array.isArray(cardData.chartData.radar)) {
            cardData.chartData.radar = [];
          }
          if (!cardData.chartData.line || !Array.isArray(cardData.chartData.line)) {
            cardData.chartData.line = [];
          }
        }
        // 自动从 step[].score[].dimension 生成 chartData.radar
        if (cardData.chartData && (!cardData.chartData.radar || cardData.chartData.radar.length === 0)) {
          let dimensionArr = null;
          if (Array.isArray(cardData.step)) {
            for (const step of cardData.step) {
              if (Array.isArray(step.score) && step.score.length > 0 && step.score[0].dimension && step.score[0].dimension.length > 0) {
                dimensionArr = step.score[0].dimension;
                break;
              }
            }
          }
          if (dimensionArr) {
            cardData.chartData.radar = dimensionArr.map((dim, idx) => ({
              name: dim.latitude || `维度${idx+1}`,
              value: typeof dim.weight === 'number' ? dim.weight * 100 : 0
            }));
          }
        }
        
        console.log("获取到的卡片数据:", cardData);
        setCard(cardData)
        setEvaluationData(evaluationData)
        
        // 确保每次加载卡片详情时，优化模式默认是关闭的
        setIsOptimizationMode(false);
        setCurrentOptimizationStep('result'); // 使用字符串'result'，而非数字0
        
        // 更新模型选择下拉菜单的可选项为从数据中获取的模型键
        const availableModels = Object.keys(evaluationData);
        if (availableModels.length > 0) {
          // 根据可用模型更新默认选中的模型
          setSelectedModels(availableModels.slice(0, 3)); // 默认选择前三个模型
          setSelectedModel(availableModels[0]); // 设置第一个模型为当前选中的模型
        }
        
        // 设置注释数据，确保正确使用task.annotations中的对应字段
        if (isFromExplore || id) {
          // 确保 annotation 对象存在，如果不存在则创建一个空的
          if (!cardData.annotation) {
            cardData.annotation = {
              result: [],
              qa: [],
              scenario: [],
              flow: []
            };
          }
          
          // 使用步骤字符串确保直接映射到 annotation 对应字段
          if (currentOptimizationStep === 'result' || currentOptimizationStep === 0) {
            setComments(Array.isArray(cardData.annotation.result) ? cardData.annotation.result : []);
          // QA优化 - 对应 qa 注释  
          } else if (currentOptimizationStep === 'qa' || currentOptimizationStep === 1) {
            setComments(Array.isArray(cardData.annotation.qa) ? cardData.annotation.qa : []);
          // 场景优化 - 对应 scenario 注释
          } else if (currentOptimizationStep === 'scenario' || currentOptimizationStep === 2) {
            setComments(Array.isArray(cardData.annotation.scenario) ? cardData.annotation.scenario : []);
          // 模板优化 - 对应 flow 注释
          } else if (currentOptimizationStep === 'flow' || currentOptimizationStep === 3) {
            setComments(Array.isArray(cardData.annotation.flow) ? cardData.annotation.flow : []);
          }
        }
        
        setError(null)
      } catch (err) {
        console.error(`获取数据失败 (ID: ${id}):`, err)
        setError("获取数据失败，请重试")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, isFromExplore])

  const handleGoBack = () => {
    // 关闭优化模式
    if (isOptimizationMode) {
      setIsOptimizationMode(false);
      setCurrentOptimizationStep(0);
    }
    
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    
    navigate(-1)
  }

  const currentEvaluation = evaluationData[selectedModel] || evaluationData.claude

  // 获取所有可用的模型选项
  const modelOptions = Object.keys(evaluationData);

  // 处理全选/取消全选
  const handleSelectAll = (checked) => {
    setSelectedModels(checked ? modelOptions : []);
    setSelectedChartModels(
      Object.fromEntries(
        modelOptions.map(model => [model, checked])
      )
    );
  };

  // 修改模型选择处理函数
  const handleModelChange = (values) => {
    setSelectedModels(values);
    setSelectedChartModels(
      Object.fromEntries(
        modelOptions.map(model => [model, values.includes(model)])
      )
    );
  };

  const handleChartModelChange = (modelKey) => {
    setSelectedChartModels((prev) => ({
      ...prev,
      [modelKey]: !prev[modelKey],
    }))
  }

  const toggleModelPanel = (modelKey) => {
    // 如果当前点击的模型已经展开，则收起它，否则展开它
    setExpandedModel(expandedModel === modelKey ? null : modelKey);
  }

  // 使用useRef和useMemo缓存图表数据，防止重新渲染导致数据变化
  const chartDataRef = useRef({
    radar: [],
    line: []
  });

  // Prepare enhanced chart data with multiple model series
  const getEnhancedChartData = () => {
    // 如果已经有缓存的数据，直接返回
    if (chartDataRef.current.radar.length > 0 || chartDataRef.current.line.length > 0) {
      return chartDataRef.current;
    }
    
    if (!card || !card.chartData) return { radar: [], line: [] }

    // 获取可用的模型键
    const modelKeys = Object.keys(evaluationData);

    // Enhanced radar data with multiple model values
    const enhancedRadar = card.chartData.radar && Array.isArray(card.chartData.radar) 
      ? card.chartData.radar.map((item, index) => {
          // 创建包含基本数据的对象
          const radarPoint = {
        name: item.name,
            value: Math.round(item.value), // 确保值为整数，去掉小数点
          };
          
          // 为每个模型添加对应的数据点
          modelKeys.forEach((modelKey, modelIndex) => {
            // 使用固定的偏移量，不再使用随机数
            // 每个模型的数据会有轻微差异，但不会随重新渲染而变化
            const offset = 0.8 + (modelIndex * 0.05);
            radarPoint[modelKey] = Math.round(Math.min(100, item.value * offset));
          });
          
          return radarPoint;
        })
      : [];

    // Enhanced line data with multiple model values
    const enhancedLine = card.chartData.line && Array.isArray(card.chartData.line)
      ? card.chartData.line.map((item, index) => {
          // 创建包含基本数据的对象
          const linePoint = {
        month: item.month,
            value: Math.round(item.value), // 确保值为整数，去掉小数点
          };
          
          // 为每个模型添加对应的数据点
          modelKeys.forEach((modelKey, modelIndex) => {
            // 使用固定的偏移量，不再使用随机数
            const offset = 0.8 + (modelIndex * 0.05);
            linePoint[modelKey] = Math.round(Math.min(100, item.value * offset));
          });
          
          return linePoint;
        })
      : [];

    // 缓存计算结果
    chartDataRef.current = { radar: enhancedRadar, line: enhancedLine };
    return chartDataRef.current;
  }

  // 当card或evaluationData变化时重置缓存
  useEffect(() => {
    chartDataRef.current = { radar: [], line: [] };
  }, [card, evaluationData]);

  const enhancedChartData = useMemo(() => getEnhancedChartData(), [card, evaluationData]);
  
  // 计算雷达图中的最大值
  const calculateRadarMaxValue = () => {
    if (!enhancedChartData.radar || enhancedChartData.radar.length === 0) {
      return 100; // 默认值为100
    }
    
    // 找出所有数据点中的最大值
    let maxValue = 0;
    enhancedChartData.radar.forEach(item => {
      // 检查基本的value值
      if (item.value > maxValue) {
        maxValue = item.value;
      }
      
      // 检查每个模型的值
      Object.keys(item).forEach(key => {
        if (key !== 'name' && key !== 'value' && typeof item[key] === 'number' && item[key] > maxValue) {
          maxValue = item[key];
        }
      });
    });
    
    // 向上取整到最接近的10的倍数，并确保至少为100
    return Math.max(100, Math.ceil(maxValue / 10) * 10);
  }

  const radarMaxValue = calculateRadarMaxValue();

  const getModelColor = (modelKey) => {
    switch (modelKey) {
      case 'claude3.5':
        return 'var(--color-primary)';
      case 'claude3.6':
        return 'var(--color-assist-1)';
      case 'claude3.7':
        return 'var(--color-assist-2)';
      case 'agent2':
        return 'var(--color-assist-1)';
      case 'deepseek':
        return 'var(--color-heavy)';
      default:
        return 'var(--color-primary)';
    }
  };

  // 处理分支为新任务按钮点击
  const handleForkTask = () => {
    // 确保传递完整的卡片数据，包含问题描述和答案描述
    // 正确映射字段名：问题描述(questionDescription)对应prompt，回答描述(answerDescription)对应response
    const newCompleteCardData = {
      ...card,
      // 正确映射字段：使用prompt作为问题描述，response作为答案描述
      questionDescription: card.prompt || card.qa?.question || "基于卡片创建的问题描述。\n\n请在此处描述您想要测试或评估的内容。",
      answerDescription: card.response || card.summary || card.qa?.answer || "基于卡片创建的答案描述。\n\n请在此处描述预期的测试结果或评估标准。"
    }
    // 保存到状态中
    setCompleteCardData(newCompleteCardData)
    setIsCreateTaskModalVisible(true)
  }

  // 处理取消创建任务
  const handleCancelCreateTask = () => {
    setIsCreateTaskModalVisible(false)
  }

  // 移除默认注释数据

  // 注释表格列定义
  const annotationColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 50,
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar size={24} style={{ background: 'var(--color-primary)', fontSize: '12px' }}>
            {text || (index + 1)}
          </Avatar>
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100,
      ellipsis: true,
      render: (text, record) => text || record.summary || '未命名注释',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        const content = text || record.text || record.selectedText || '';
        return (
          <Tooltip title={content}>
            <a href="#" style={{ color: 'var(--color-primary)' }}>{content || '无内容'}</a>
        </Tooltip>
        );
      },
    },
    {
      title: '附件',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 140,
      ellipsis: true,
      render: (attachments) => (
        <div style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}>
          {Array.isArray(attachments) && attachments.length > 0 ? 
            attachments.map((file, index) => (
            <Tag key={index} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <a href={file.url} style={{ color: 'var(--color-primary)' }}>{file.name}</a>
            </Tag>
            )) :
            <span style={{ color: 'var(--color-text-tertiary)' }}>无附件</span>
          }
        </div>
      ),
    },
    {
      title: '最近修改',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 100,
      render: (modifier, record) => {
        // 首先尝试使用lastModifiedBy字段(如果存在)
        if (modifier && typeof modifier === 'object') {
          const avatar = modifier.avatar || modifier.name?.charAt(0) || '?';
          return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar size={24}>{avatar}</Avatar>
              <span>{modifier.name || '未知'}</span>
        </div>
          );
        }
        
        // 否则尝试使用author字段
        const author = record.author;
        if (author) {
          if (typeof author === 'string') {
            // 如果author是字符串
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar size={24}>{author.charAt(0)}</Avatar>
                <span>{author}</span>
              </div>
            );
          } else if (typeof author === 'object') {
            // 如果author是对象
            const authorName = author.name || '未知';
            const authorAvatar = author.avatar || authorName.charAt(0);
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar size={24}>{authorAvatar}</Avatar>
                <span>{authorName}</span>
              </div>
            );
          }
        }
        
        // 默认返回
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar size={24}>?</Avatar>
            <span>未知</span>
          </div>
        );
      },
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      width: 86,
      align: 'right',
      render: (time, record) => {
        // 如果有modifiedTime对象并且格式正确
        if (time && typeof time === 'object' && time.hour && time.date) {
          return (
        <div style={{ color: '#8f9098', fontSize: '12px' }}>
          <div>{time.hour}</div>
          <div>{time.date}</div>
        </div>
          );
        }
        
        // 尝试使用time或updatedAt字段
        const timeString = record.time || record.updatedAt || time;
        if (!timeString) {
          return (
            <div style={{ color: '#8f9098', fontSize: '12px' }}>
              <div>未知时间</div>
            </div>
          );
        }
        
        // 尝试解析时间字符串
        try {
          const date = new Date(timeString);
          if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            
            return (
              <div style={{ color: '#8f9098', fontSize: '12px' }}>
                <div>{`${hours}:${minutes}`}</div>
                <div>{`${month}/${day}`}</div>
              </div>
            );
          }
        } catch (e) {
          // 解析失败，直接显示原始字符串
        }
        
        // 无法解析，直接显示时间字符串
        return (
          <div style={{ color: '#8f9098', fontSize: '12px' }}>
            <div>{typeof timeString === 'string' ? timeString : '未知时间'}</div>
          </div>
        );
      },
    },
  ];

  // 使用card中的annotation数据构建任务注释数据对象
  const getAllAnnotations = (card) => {
    if (!card?.annotation) return [];
    const allAnnotations = [];
    ['result', 'qa', 'scenario', 'flow'].forEach(key => {
      const categoryAnnotations = card.annotation[key];
      if (Array.isArray(categoryAnnotations)) {
        allAnnotations.push(...categoryAnnotations);
      }
    });
    return allAnnotations;
  };
  
  // 获取原始annotation对象（只用 result、qa、scenario、flow 四类）
  const getAnnotationObject = (card) => {
    if (!card?.annotation || typeof card.annotation !== 'object') {
      return {
        result: [],
        qa: [],
        scenario: [],
        flow: []
      };
    }
    // 只保留四个字段
    const { result = [], qa = [], scenario = [], flow = [] } = card.annotation;
    return { result, qa, scenario, flow };
  };
  
  const taskAnnotationData = {
    columns: annotationColumns,
    data: getAllAnnotations(card)
  };

  // 添加测试进度的定时器
  useEffect(() => {
    let timer;
    if (isTesting && testProgress < 100) {
      timer = setInterval(() => {
        setTestProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(timer);
            // 测试完成后自动进入结果页面
            setCurrentOptimizationStep('submit');
            setIsTesting(false);
          }
          return next;
        });
      }, 50); // 将间隔从100毫秒改为50毫秒，使总测试时间为5秒
    }
    return () => timer && clearInterval(timer);
  }, [isTesting, testProgress]);

  // 开始测试方法
  const handleStartTest = async () => {
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false);
      clearAllHighlights();
    }
    setIsTesting(true);
    setTestProgress(0);
    
    // 1. 发起API调用，模拟生成新version
    try {
      let newStepArr = Array.isArray(card?.step) ? [...card.step] : [];
      // 针对每个agent都新增一个version
      newStepArr = newStepArr.map(stepItem => {

        const isTrafficLLM =  stepItem.agent  === 'TrafficLLM'
        
        const lastScore = Array.isArray(stepItem.score) && stepItem.score.length > 0 ? stepItem.score[stepItem.score.length - 1] : null;
        const lastScoreValue = lastScore ? parseFloat(lastScore.score) : 0.7;
        // 新score为上升趋势
        const newScoreValue = Math.min(1, (lastScoreValue * (1.05 + Math.random() * 0.05)).toFixed(2));
        // 版本号规则：最新version+1，保留一位小数
        let newVersion = '1.0';
        if (lastScore && lastScore.version) {
          const lastVer = parseFloat(lastScore.version);
          newVersion = (lastVer + 1).toFixed(1);
        }
        const newScoreObj = {
          version: newVersion,
          score: newScoreValue,
          description: "优化后得分上升",
          confidence: "0.95",
          consumed_points: 60,
          dimension: lastScore?.dimension || []
        };
        if(isTrafficLLM){
          newScoreObj.reason = "根据专家提示，回答不需要特定的法律条款引用，只做出技术性判断，不存在合规风险。"
        }
          
        return {
          ...stepItem,
          score: [...(stepItem.score || []), newScoreObj]
        };
      });
      // 3. 发起API调用（模拟）
      await taskService.submitOptimizationResult({
        cardId: card.id,
        step: newStepArr,
        comments: currentStepComments,
        models: selectedModels,
        optimization: true
      });
      // 4. 更新本地card数据
      setCard(prev => ({ ...prev, step: newStepArr }));
    } catch (e) {
      message.error("测试API调用失败");
    }
    // 5. 模拟测试进度，完成后自动跳转到下一步
    const timer = setInterval(() => {
      setTestProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          setCurrentOptimizationStep('submit');
          setIsTesting(false);
        }
        return next;
      });
    }, 50);
  };
  
  // 处理提交测试结果
  const handleSubmitResults = () => {
    // 关闭连续选择模式并清除高亮
    if (isMultiSelectActive) {
      setIsMultiSelectActive(false)
      clearAllHighlights()
    }
    
    // 收集所有优化步骤的数据
    const optimizationData = {
      sourceCardId: card?.id,
      title: `优化: ${card?.title || "未命名任务"}`,
      originalTitle: card?.title,
      source: card?.source || "优化测试",
      tags: [...(Array.isArray(card?.tags) ? card.tags : []), "已优化"],
      author: card?.author ? JSON.parse(JSON.stringify(card.author)) : null,
      comments: currentStepComments ? JSON.parse(JSON.stringify(currentStepComments)) : [], // 深拷贝所有注释
      steps: savedData ? JSON.parse(JSON.stringify(savedData)) : {}, // 深拷贝各步骤保存的数据
      selectedModels: selectedModels ? [...selectedModels] : [], // 深拷贝选中的模型
      // 添加卡片的原始数据
      description: card?.description || card?.summary || "",
      response: card?.response || "",
      prompt: card?.prompt || "",
      scenario: card?.scenario ? JSON.parse(JSON.stringify(card.scenario)) : {},
      templateData: card?.templateData ? JSON.parse(JSON.stringify(card.templateData)) : {},
      paramCount: card?.paramCount || "",
      chartData: card?.chartData ? JSON.parse(JSON.stringify(card.chartData)) : {},
      // 确保annotation对象被完整深拷贝
      annotation: card?.annotation ? JSON.parse(JSON.stringify(card.annotation)) : {
        result: [],
        qa: [],
        scenario: [],
        flow: []
      },
      // 保留原始卡片的所有step信息并深拷贝
      step: Array.isArray(card?.step) ? JSON.parse(JSON.stringify(card.step)) : (card?.step ? JSON.parse(JSON.stringify(card.step)) : {}),
      updatedAt: new Date().toLocaleString(),
      updatedBy: { name: "当前用户", avatar: null },
      optimizationResults: {
        beforeScore: card?.score || 0,
        afterScore: Math.min(100, ((card?.score || 70) * 1.15).toFixed(1)), // 模拟优化后的得分提高15%
        improvementRate: "15%",
      }
    }
    
    // 准备完整的卡片数据传递给CreateTaskModal
    const completeCardData = {
      ...card,
      // 添加optimizationData中的额外数据
      optimizationData: optimizationData,
      // 确保所有必要的字段都被正确映射
      questionDescription: card.prompt || "",
      answerDescription: card.response || card.summary || "",
      // 确保所有字段都被深拷贝
      scenario: card?.scenario ? JSON.parse(JSON.stringify(card.scenario)) : {},
      templateData: card?.templateData ? JSON.parse(JSON.stringify(card.templateData)) : {},
      annotation: card?.annotation ? JSON.parse(JSON.stringify(card.annotation)) : {
        result: [],
        qa: [],
        scenario: [],
        flow: []
      },
      step: Array.isArray(card?.step) ? JSON.parse(JSON.stringify(card.step)) : 
            (card?.step ? JSON.parse(JSON.stringify(card.step)) : {})
      }
      
    // 保存到状态中
    setCompleteCardData(completeCardData)
      
    // 显示创建任务的模态框
    setIsCreateTaskModalVisible(true)
      
    // 关闭加载状态
      setLoading(false)
  }

  // 处理文本选择事件
  const handleTextSelection = (event) => {
    // 仅在优化模式下启用右键菜单
    if (!isOptimizationMode) return;
    
    // 获取选中的文本
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    const isModifierKeyPressed = event.ctrlKey || event.metaKey; // 检测Ctrl/Command键
    
    // 如果有选中文本，显示右键菜单或进行连续选择
    if (selectedText) {
      // 创建选择的范围信息
      const range = selection.getRangeAt(0);
      const newSelectionRange = {
        range: range.cloneRange(),
        text: selectedText
      };
      
      // 检查此文本是否已被高亮，避免重复选择
      const hasHighlight = range.commonAncestorContainer.closest?.('.text-highlight-selection');
      if (hasHighlight) {
        // 如果已经是高亮元素，仅显示右键菜单，不进行其他处理
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY
        });
        return;
      }
      
      // 连续选择模式处理
      if (isMultiSelectActive || isMultiSelectTempMode || isModifierKeyPressed) {
        event.preventDefault();
        
        // 检查文本是否已存在于选择列表中
        if (!selectedTexts.includes(selectedText)) {
          // 添加到已选择的文本列表
          setSelectedTexts(prev => [...prev, selectedText]);
          setSelectionRanges(prev => [...prev, newSelectionRange]);
          
          // 应用高亮样式，保持选中状态
          applyHighlightToSelection(range, selectedText);
        }
      } else {
        // 普通选择，清除之前的选择
        clearAllHighlights();
        setSelectedTexts([selectedText]);
        setSelectionRanges([newSelectionRange]);
        
        // 对第一次选中的文本也应用高亮
        applyHighlightToSelection(range, selectedText);
      }
      
      // 显示右键菜单
      event.preventDefault();
      setSelectedText(selectedText);
      setContextMenu({
        x: event.clientX,
        y: event.clientY
      });
    }
  };
  
  // 应用高亮样式到选中文本
  const applyHighlightToSelection = (range, text) => {
    if (!range) return;
    
    // 创建高亮元素
    const highlightEl = document.createElement('span');
    highlightEl.className = 'text-highlight-selection';
    highlightEl.textContent = text;
    
    // 清除原有内容，插入高亮元素
    range.deleteContents();
    range.insertNode(highlightEl);
  };
  
  // 清除所有高亮
  const clearAllHighlights = () => {
    // 清除所有高亮元素
    const highlights = document.querySelectorAll('.text-highlight-selection');
    highlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        // 将高亮元素替换为其文本内容
        const textNode = document.createTextNode(el.textContent);
        parent.replaceChild(textNode, el);
        parent.normalize(); // 合并相邻的文本节点
      }
    });
    
    // 重置选择状态
    setSelectedTexts([]);
    setSelectionRanges([]);
  };

  // 打开添加观点模态框前的处理
  const handleOpenAnnotationModal = () => {
    // 如果是连续选择模式，合并所有选中的文本
    // 确保不会重复添加最后选中的文本
    const textToShow = (isMultiSelectActive || isMultiSelectTempMode) && selectedTexts.length > 0
      ? Array.from(new Set(selectedTexts)).join('\n\n') // 使用Set去重
      : selectedText;
    
    // 设置要在模态框中显示的文本
    console.log('textToShow', textToShow);
    setSelectedModalText(textToShow);
    
    // 显示模态框
    setShowAnnotationModal(true);
  };

  // 处理右键菜单项点击
  const handleContextMenuAction = (action) => {
    switch (action) {
      case 'discuss':
        // 如果处于连续选择模式，合并所有选中的文本
        if ((isMultiSelectActive || isMultiSelectTempMode) && selectedTexts.length > 0) {
          // 使用Set去重，确保不会重复添加最后选中的文本
          const combinedText = Array.from(new Set(selectedTexts)).join('\n\n');
          setSelectedText(combinedText);
        }
        setShowDiscussModal(true);
        
        // 讨论后关闭连续选择模式
        setIsMultiSelectActive(false);
        break;
      case 'annotate':
        // 打开添加观点模态框
        handleOpenAnnotationModal();
        
        // 添加观点后关闭连续选择模式
        setIsMultiSelectActive(false);
        break;
      case 'select':
        // 切换连续选择模式
        setIsMultiSelectActive(!isMultiSelectActive);
        
        // 如果当前有选中的文本，且正在开启连续选择模式，保留当前选中的文本
        // 只有在关闭连续选择模式时才清除高亮
        if (isMultiSelectActive) {
          // 关闭连续选择模式时清除所有高亮
          clearAllHighlights();
        }
        // 如果是开启连续选择模式，且右键菜单是因为选中文本出现的，保留该文本高亮
        else if (selectedText) {
          // 当前选中文本已经加入了selectedTexts中，不需要额外操作
          // 关闭右键菜单后文本会保持高亮状态
        }
        break;
      default:
        break;
    }
  };

  // 全局点击事件，用于关闭右键菜单
  useEffect(() => {
    // 全局右键点击事件处理
    const handleGlobalContextMenu = (event) => {
      // 先检查是否在已高亮元素上右键
      const isHighlightedText = event.target.closest('.text-highlight-selection');
      
      if (isHighlightedText) {
        // 在已高亮文本上右键，显示右键菜单，但不再添加到已选择列表
        event.preventDefault();
        setContextMenu({
          x: event.clientX,
          y: event.clientY
        });
        return;
      }
      
      // 检查是否在可选择文本的元素上
      const isSelectableText = 
        event.target.closest('.evaluation-text') || 
        event.target.closest('.message-bubble') ||
        event.target.closest('.qa-section') ||
        event.target.closest('.scene-section') ||
        event.target.closest('.template-section');
      
      if (isSelectableText && isOptimizationMode) {
        handleTextSelection(event);
      } else {
        // 不是在已高亮的文本上右键，也不是在可选择的文本上右键，则关闭菜单
        setContextMenu(null);
      }
    };
    
    // 全局点击处理
    const handleGlobalClick = (e) => {
      // 点击其他区域关闭右键菜单，但不清除选择
      if (contextMenu) {
        setContextMenu(null);
      }
      
      // 检查是否点击了高亮元素
      const isClickOnHighlight = e.target.closest('.text-highlight-selection');
      if (isClickOnHighlight) {
        return; // 点击高亮文本时不清除高亮
      }
      
      // 如果不是连续选择模式，且不是临时多选模式，且不是按着Ctrl/Command键，点击其他区域时清除高亮
      if (!isMultiSelectActive && !isMultiSelectTempMode && !(e.ctrlKey || e.metaKey)) {
        clearAllHighlights();
      }
    };
    
    // 监听键盘事件，处理Ctrl/Command键
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !isMultiSelectActive) {
        // Ctrl/Command键按下，临时进入多选模式
        document.body.classList.add('multi-select-temp');
        
        // 如果用户按下了Ctrl/Command，启用临时多选模式功能
        setIsMultiSelectTempMode(true);
      }
    };
    
    const handleKeyUp = (e) => {
      if (!e.ctrlKey && !e.metaKey) {
        // Ctrl/Command键释放，如果不是永久多选模式，清除临时标记
        if (!isMultiSelectActive) {
          document.body.classList.remove('multi-select-temp');
          
          // 释放键时，关闭临时多选模式
          setIsMultiSelectTempMode(false);
        }
      }
    };
    
    // 添加事件监听
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // 组件卸载时移除监听
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [contextMenu, isOptimizationMode, isMultiSelectActive, isMultiSelectTempMode, selectedTexts, clearAllHighlights]);

  // 组件卸载时清理body上的类
  useEffect(() => {
    return () => {
      document.body.classList.remove('optimization-mode');
      document.body.classList.remove('multi-select-temp');
    };
  }, []);

  // 处理添加注释的逻辑
  const handleSaveAnnotation = (data) => {
    console.log('handleSaveAnnotation', data);
    // 只允许新四类，直接用 currentOptimizationStep
    let step = currentOptimizationStep;
    if (step === 'scene') step = 'scenario'; // 兼容旧值，强制为新值
      const annotationData = {
        ...data,
      id: data.id || `comment-${Date.now()}`,
      text: data.text || data.content || '',
      summary: data.summary || (data.text ? (data.text.length > 20 ? data.text.substring(0, 20) + '...' : data.text) : ''),
      selectedText: data.selectedText || selectedModalText || '',
      step,
      author: {
        name: '当前用户',
        avatar: 'U'
      },
      time: data.time || new Date().toLocaleString(),
      attachments: data.attachments || [],
    };
      addComment(annotationData);
    addAnnotationToTask(annotationData, step); // 这里 step 只会是 result/qa/scenario/flow
    // 立即同步当前分类注释到 currentStepComments
    if (card && card.annotation && card.annotation[step]) {
      setComments([...card.annotation[step], annotationData]);
    } else {
      setComments([annotationData]);
    }
    setShowAnnotationModal(false);
    setSelectedModalText('');
      message.success('添加成功');
  };

  // 添加一个mouseup事件处理函数，用于处理在连续选择状态下无需右键也能自动高亮
  useEffect(() => {
    const handleAutoSelection = (event) => {
      // 只在连续选择模式下启用自动选择高亮
      if (!isMultiSelectActive) return;
      
      // 从window获取当前选区
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      // 如果有选中文本
      if (selectedText) {
        // 创建选择的范围信息
        const range = selection.getRangeAt(0);
        
        // 检查此文本是否已被高亮，避免重复选择
        const hasHighlight = range.commonAncestorContainer.closest?.('.text-highlight-selection');
        if (hasHighlight) return; // 如果已经是高亮元素，不再处理
        
        // 检查该文本是否已经在选中列表中，避免重复添加
        if (selectedTexts.includes(selectedText)) return;
        
        // 添加到已选择的文本列表，使用Set避免重复
        setSelectedTexts(prev => [...new Set([...prev, selectedText])]);
        
        // 应用高亮样式，保持选中状态
        applyHighlightToSelection(range, selectedText);
      }
    };
    
    // 仅在连续选择模式下添加监听
    if (isMultiSelectActive) {
      document.addEventListener('mouseup', handleAutoSelection);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleAutoSelection);
    };
  }, [isMultiSelectActive, selectedTexts]);

  // 处理关注切换
  const handleToggleFollow = () => {
    setIsFollowing(prev => !prev);
    message.success(isFollowing ? '已取消关注' : '已关注');
  };
      // 新增点赞处理函数
      const handleToggleLike = () => { // <--- 添加这个函数
        setIsLiked(prev => {
          const newLikedState = !prev;
          message.success(newLikedState ? '已点赞' : '已取消点赞');
          return newLikedState;
        });
      };
  
  // 处理分享按钮点击
  const handleShare = () => {
    setIsShareModalVisible(true);
  };
  
  // 关闭分享模态框
  const handleCloseShareModal = () => {
    setIsShareModalVisible(false);
  };
  
  // 为ShareModal组件格式化当前选中的模型
  const getFormattedModels = () => {
    if (!evaluationData) return [];
    
    return selectedModels.map(modelKey => ({
      label: evaluationData[modelKey]?.name || modelKey,
      value: modelKey
    }));
  };

  // 切换任务详情展开/收起
  const toggleDetailsExpanded = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  // 处理生成报告
  const handleGenerateReport = () => {
    try {
      // 生成唯一的报告ID
      const reportId = `report-${card.id}-${Date.now()}`;
      
      // 创建报告数据
      const reportData = {
        id: reportId,
        title: `${card.title} 报告`,
        prompt: card.prompt,
        response: card.response || card.summary,
        type: 'report',
        source: card.source,
        author: card.author,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: [...(card.tags || []), '报告'],
        status: 'completed',
        score: enhancedChartData.radar?.[0]?.value || 85,
        credibility: enhancedChartData.radar?.[1]?.value || 80,
        models: selectedModels,
        chartData: card.chartData || enhancedChartData,
        evaluationData: evaluationData
      };
      
      // 获取现有报告数据
      let existingReports = [];
      try {
        const existingReportsJson = localStorage.getItem('task_reports');
        if (existingReportsJson) {
          existingReports = JSON.parse(existingReportsJson);
          if (!Array.isArray(existingReports)) {
            existingReports = [];
          }
        }
      } catch (e) {
        console.error('解析已有报告数据失败:', e);
      }
      
      // 添加新报告
      const updatedReports = [...existingReports, reportData];
      
      // 保存到localStorage
      localStorage.setItem('task_reports', JSON.stringify(updatedReports));
      localStorage.setItem('reports_last_updated', new Date().toISOString());
      
      // 触发报告生成事件
      const reportGeneratedEvent = new CustomEvent('reportGenerated', {
        detail: {
          reportId: reportId,
          report: reportData
        }
      });
      window.dispatchEvent(reportGeneratedEvent);
      
      // 获取已生成的报告ID列表
      let generatedReportIds = [];
      try {
        const generatedReportsJson = localStorage.getItem('generated_reports');
        if (generatedReportsJson) {
          generatedReportIds = JSON.parse(generatedReportsJson);
          if (!Array.isArray(generatedReportIds)) {
            generatedReportIds = [];
          }
        }
      } catch (e) {
        console.error('解析已生成报告ID列表失败:', e);
      }
      
      // 添加新报告ID到已生成列表
      if (!generatedReportIds.includes(reportId)) {
        generatedReportIds.push(reportId);
        localStorage.setItem('generated_reports', JSON.stringify(generatedReportIds));
      }
      
      message.success("报告已生成，可在资产页面查看");
    } catch (error) {
      console.error("生成报告失败:", error);
      message.error("生成报告失败，请重试");
    }
  };

  // 假设 messages 是 [{id, text}] 或类似结构
  const messages = Array.isArray(card?.step)
    ? card.step.map((s, i) => ({
        id: s.id || i,
        text: s.text || s.prompt || s.description || ''
      }))
    : [];

  // 受控高亮 hook
  const { highlightMap, addHighlight, clearHighlights, renderHighlightedText } = useTextHighlight();

  // 鼠标松开时添加高亮
  const handleMouseUp = (msgId, text) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const anchorNode = selection.anchorNode;
    if (!anchorNode || anchorNode.nodeType !== Node.TEXT_NODE) return;
    const start = selection.anchorOffset;
    const end = selection.focusOffset;
    if (start === end) return;
    const s = Math.min(start, end);
    const e = Math.max(start, end);
    const msgHighlights = highlightMap[msgId] || [];
    if (msgHighlights.some(hl => s >= hl.start && e <= hl.end)) return;
    addHighlight(msgId, s, e);
    selection.removeAllRanges();
  };

  // 添加注释到卡片中的方法
  const addAnnotationToTask = (newAnnotation, stepType) => {
    console.log('addAnnotationToTask', newAnnotation, stepType);
    if (!card || !newAnnotation) return;
    // 只允许四个分类
    let category = stepType || newAnnotation.step || 'result';
    if (![ 'result', 'qa', 'scenario', 'flow' ].includes(category)) category = 'result';
    const updatedAnnotation = card.annotation ? { ...card.annotation } : {
      result: [], qa: [], scenario: [], flow: []
    };
    if (!updatedAnnotation[category]) updatedAnnotation[category] = [];
    updatedAnnotation[category].push({ ...newAnnotation, step: category });
    const updatedCard = { ...card, annotation: updatedAnnotation };
    setCard(updatedCard);
    // 立即同步当前分类注释到 currentStepComments
    setComments(updatedAnnotation[category]);
  };

  if (loading) {
    return (
      <div className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="error-message">{error || "卡片不存在"}</div>
        <Button type="primary" onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
          返回
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`card-detail-page ${isChatOpen ? "chat-open" : "chat-closed"} ${isMultiSelectActive ? 'multi-select-mode' : ''}`}
      onContextMenu={e => {
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
      }}
    >
      {/* 隐藏头部的community/workspace/peison的tab */}
      <div className="hide-tabs-nav" style={{ display: 'none' }}>
        {/* 这里本应显示tab，但现在设置为不显示 */}
      </div>
      
      {/* 面包屑导航 */}
      <div className="task-detail-breadcrumb" style={{ marginBottom: "4px" }}>
        <Breadcrumb
          items={[
            {
              title: <ArrowLeftOutlined onClick={handleGoBack} className="breadcrumb-arrow" style={{ fontSize: "12px" }} />,
            },
            {
              title: (
                <span onClick={() => navigate(parentPath)} className="breadcrumb-parent" style={{ fontSize: "12px" }}>
                  {parentLabel}
          </span>
              ),
            }
          ]}
        />
      </div>

      {/* 卡片标题和信息 */}
      <div className="task-detail-title-section" style={{ padding: "6px", marginBottom: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="task-title">  {card.prompt}</h1>
          <Button 
            type="text"
            icon={isDetailsExpanded ? <UpOutlined /> : <DownOutlined />}
            onClick={toggleDetailsExpanded}
            style={{ fontSize: "12px" }}
          >
            {isDetailsExpanded ? '收起' : '展开'}
          </Button>
        </div>
        <div className="task-creator-section" style={{ padding: "4px", gap: "8px" }}>
          <div className="task-creator-info" style={{ gap: "8px" }}>
            <Avatar size={24} className="creator-avatar">
              {card.created_by?.charAt ? card.created_by.charAt(0) : ''}
            </Avatar>
            <span className="creator-text" style={{ fontSize: "12px" }}>
              by <span className="creator-name">{card.created_by}</span> from{" "}
              <span className="creator-source">{card.created_from}</span>
            </span>
          </div>
          <div className="task-tags" style={{ gap: "4px" }}>
            <div>
              {(card.keyword || []).map((tag, idx) => (
                <Tag className="task-dimension-tag" key={idx}>{tag}</Tag>
            ))}
            </div>
          </div>
          <div className="task-actions-top">
            <Button 
              icon={isFollowing ? <StarFilled /> : <StarOutlined />} 
              className={`follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleToggleFollow}
              size="small" 
              style={{ 
                height: "24px", 
                padding: "0 8px",
                transition: "all 0.3s",
                backgroundColor: isFollowing ? "var(--color-primary-bg)" : "transparent",
                borderColor: isFollowing ? "var(--color-primary-border)" : "var(--color-border-secondary)",
                color: isFollowing ? "var(--color-primary-text)" : "inherit"
              }}
            >
              {isFollowing ? '已关注' : '关注'}
            </Button>
            <Button 
              icon={<ShareAltOutlined />} 
              className="share-button" 
              onClick={handleShare}
              size="small" 
              style={{ height: "24px", padding: "0 8px" }}
            >
              分享
            </Button>
          </div>
        </div>
      </div>

      {/* 任务基本信息卡片 - 可展开/收起 */}
      {isDetailsExpanded && (
        <Card 
          className="task-basic-info-card"
          style={{ 
            marginBottom: "12px", 
            borderRadius: "12px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div style={{ padding: "8px 16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "16px", color: "var(--color-text-base)" }}>任务基本信息</h3>

            {/* 描述单独一行显示 */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex" }}>
                <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>描述</div>
                <div style={{ flex: 1, fontSize: "13px", lineHeight: "1.6" }}>{card.description }</div>
              </div>
            </div>

            {/* 三列布局的字段 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: "1 1 30%", minWidth: "250px" }}>
                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>优先级</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>
                    {card.priority === 'high' ? '高' : 
                    card.priority === 'medium' ? '中' : 
                    card.priority === 'low' ? '低' : '未设置'}
                  </div>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>创建时间</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>
                    {card.created_at?.seconds ? new Date(card.created_at.seconds * 1000).toLocaleString() : "未知"}
                  </div>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>完成期限</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.due_date || "未设置"}</div>
                </div>
              </div>

              <div style={{ flex: "1 1 30%", minWidth: "250px" }}>
                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>测评对象</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.testTarget || "未设置"}</div>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>品牌</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.brand || "未设置"}</div>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>型号</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.model || "未设置"}</div>
                </div>
              </div>

              <div style={{ flex: "1 1 30%", minWidth: "250px" }}>
                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>版本</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.version || "未设置"}</div>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>参数量</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.paramCount || "未设置"}</div>
                </div>

                <div style={{ display: "flex", marginBottom: "12px" }}>
                  <div style={{ width: "80px", color: "var(--color-text-tertiary)", fontSize: "13px" }}>推理精度</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>{card.recommendPrecision || "未设置"}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 评估结果和图表区域 - 左右结构或优化模式结构 */}
      <div className="evaluation-charts-wrapper" style={{ gap: "4px", marginTop: "4px", flexDirection: isOptimizationMode ? "column" : "row" }}>
        {isOptimizationMode ? (
          // 优化模式界面
          <>
            {/* 优化模式步骤条 */}
            <OptimizationSteps 
              currentStep={currentOptimizationStep} 
              onStepChange={handleStepChange} 
            />
            
            {/* 优化模式内容区域 */}
            <div className="optimization-content" style={{ display: "flex", gap: "4px"  }}>
              {currentOptimizationStep === 'result' ? (
                // 结果质询界面
                <>
                  {/* 左侧评估结果区域 - 使用ResultPage组件 */}
                  <div style={{ flex: currentStepComments.length > 0 ? 2 : 3, display: "flex", flexDirection: "column", gap: "4px",width: "100%" }}>
                    <ResultPage 
                      task={card}
                      enhancedChartData={enhancedChartData}
                      evaluationData={evaluationData}
                      selectedModels={selectedModels}
                      selectedModel={selectedModel}
                      expandedModel={expandedModel}
                      radarMaxValue={radarMaxValue}
                      handleModelChange={handleModelChange}
                      handleSelectAll={handleSelectAll}
                      toggleModelPanel={toggleModelPanel}
                      getModelColor={getModelColor}
                      onAddAnnotation={addComment}
                      comments={currentStepComments}
                    />
                  </div>
                  
                </>
              ) : currentOptimizationStep === 'qa' ? (
                // QA优化界面
                // <QAOptimizationSection card={card} comments={currentStepComments} />
                <div className="qa-optimization-content" style={{ width: "100%" }}>
                <QASection 
                  isEditable={true} 
                  taskId={card?.id}
                  card={card}
                  prompt={card?.prompt} 
                  response={card?.response } 
                  comments={currentStepComments} // 传递 currentStepComments
                />
              </div>
              ) : currentOptimizationStep === 'scenario' ? (
                // 场景优化界面
                <div className="scene-optimization-content" style={{ width: "100%" }}>
                  <SceneSection 
                    isEditable={true} 
                    taskId={card?.id}
                    scenario={card?.scenario} 
                    comments={currentStepComments} // 统一用 context
                    card={card}
                    onAddAnnotation={addAnnotationToTask} // 修复：传递注释添加方法
                  />
                </div>
              ) : currentOptimizationStep === 'flow' ? (
                // 模板优化界面
                <div className="template-optimization-content" style={{ width: "100%" }}>
                  <TemplateSection 
                    isEditable={true} 
                    taskId={card?.id}
                    steps={card?.flow_config ? { flow: card.flow_config, ...card?.step } : card?.step} 
                    comments={currentStepComments} // 统一用 context
                    card={card}
                    onAddAnnotation={addAnnotationToTask} // 修复：传递注释添加方法
                  />
                </div>
              ) : currentOptimizationStep === 'retest' ? (
                // 再次测试界面
                <div style={{ width: "100%", display: "flex", flex: 1 }}>
                  <TestConfirmation
                    isTesting={isTesting}
                    testProgress={testProgress}
                    task={card}
                    isTaskStarted={isTaskStarted}
                    TimelineIcon={TimelineIcon}
                    currentStep={4}
                    onPrevious={handleBack}
                    onStartTest={handleStartTest}
                    QASection={QASection}
                    SceneSection={SceneSection}
                    TemplateSection={TemplateSection}
                    annotationColumns={taskAnnotationData.columns}
                    annotationData={getAnnotationObject(card)}
                  />
                </div>
              ) : currentOptimizationStep === 'submit' ? (
                // 提交结果界面
                <div style={{ width: "100%", display: "flex", flex: 1 }}>
                  <SubmitResultSection
                    task={card}
                  />
                </div>
              ) : (
                // 其他步骤(未实现)的通用界面
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                      {STEP_TITLES[currentOptimizationStep]}界面
                    </h3>
                    <p style={{ color: "#666" }}>该功能正在开发中，敬请期待...</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // 原始布局
          <>
            {/* 使用SubmitResultSection组件替代原始评估内容 */}
            <SubmitResultSection 
              task={card}
                    />
          </>
        )}
      </div>

      {/* 底部按钮区域 */}
      <div className="task-footer-actions" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px', padding: '8px 0', maxWidth: '100%', width: '100%' }}>
        {isOptimizationMode ? (
          // 优化模式下的按钮
          <>
            {currentOptimizationStep === 'submit' ? (
              // 提交结果阶段的按钮布局
              <>
                <Button 
                  className="action-button generate-report-button"
                  onClick={handleGenerateReport}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 2
                  }}
                >
                  <FileTextOutlined />
                  生成报告
                </Button>
                <Button 
                  className="action-button cancel-optimization-button"
                  onClick={() => {
                    setIsOptimizationMode(false);
                  }}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 2
                  }}
                >
                  <CloseCircleOutlined />
                  放弃此次优化
                </Button>
                <Button 
                  type="primary"
                  className="action-button submit-result-button"
                  onClick={handleSubmitResults}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    backgroundColor: 'var(--color-primary)',
                    fontWeight: 500,
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  <SendOutlined />
                  保存并新建任务
                </Button>
                <div 
                  className="action-button optimize-mode"
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    border: '1px solid var(--color-border-secondary)',
                    background: isOptimizationMode ? 'var(--color-primary-bg)' : 'var(--color-bg-container)',
                    flex: 1
                  }}
                >
                  <SettingOutlined style={{ fontSize: '14px' }} />
                  <span>优化模式</span>
                  <Switch 
                    size="small" 
                    checked={isOptimizationMode}
                    onChange={toggleOptimizationMode}
                    style={{ marginLeft: '4px' }}
                  />
                </div>
              </>
            ) : (
              // 其他步骤的常规按钮
              <>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  className="action-button back-button"
                  onClick={currentOptimizationStep === 'result' ? handleBack : handlePrevStep}
                  style={{ 
                    borderRadius: '20px', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  {currentOptimizationStep === 'result' ? '返回' : '上一步'}
                </Button>
                <Button 
                  className="action-button save-button"
                  onClick={saveCurrentData}
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    flex: 1
                  }}
                >
                  保存
                </Button>
                {currentOptimizationStep === 'retest' ? (
                  // 再次测试步骤特有的按钮
                  <Button 
                    type="primary"
                    className="action-button start-test-button"
                    onClick={handleStartTest}
                    style={{ 
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '0 12px',
                      height: '32px',
                      backgroundColor: 'var(--color-primary)',
                      fontWeight: 500,
                      fontSize: '12px',
                      flex: 2
                    }}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <>
                        <Spin size="small" style={{ marginRight: '8px' }} />
                        测试中...({testProgress}%)
                      </>
                    ) : '确认无误，开始测试'}
                  </Button>
                ) : (
                  // 其他步骤的常规按钮
                  <Button 
                    type="primary"
                    className="action-button save-next-button"
                    onClick={saveAndNext}
                    style={{ 
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '0 12px',
                      height: '32px',
                      backgroundColor: 'var(--color-primary)',
                      fontWeight: 500,
                      fontSize: '12px',
                      flex: 2
                    }}
                  >
                    {currentOptimizationStep !== 'submit' ? '保存并进入下一步' : '保存并完成'}
                  </Button>
                )}
                <div 
                  className="action-button optimize-mode"
                  style={{ 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0 12px',
                    height: '32px',
                    fontSize: '12px',
                    border: '1px solid var(--color-border-secondary)',
                    background: isOptimizationMode ? 'var(--color-primary-bg)' : 'var(--color-bg-container)'
                  }}
                >
                  <SettingOutlined style={{ fontSize: '14px' }} />
                  <span>优化模式</span>
                  <Switch 
                    size="small" 
                    checked={isOptimizationMode}
                    onChange={toggleOptimizationMode}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          // 非优化模式下的原始按钮
          <>
        <Button
          icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
          className={`action-button like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleToggleLike} // 添加点击事件
          style={{
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            fontSize: '12px',
            color: isLiked ? 'var(--color-primary)' : 'inherit', // 点赞后文字颜色变化
            borderColor: isLiked ? 'var(--color-primary)' : 'var(--color-border-secondary)', // 点赞后边框颜色变化
            backgroundColor: isLiked ? 'var(--color-primary-bg)' : 'transparent', // 点赞后背景颜色变化
            transition: 'all 0.3s ease' // 添加平滑过渡动画
          }}
        >
          {isLiked ? '已点赞' : '点赞'}
        </Button>
        <Button 
          icon={<CommentOutlined />} 
          className="action-button comment-button"
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            fontSize: '12px'
          }}
        >
          评论
        </Button>
        <Button 
          icon={<ForkOutlined />} 
          className="action-button fork-button" 
          type="primary"
          onClick={handleForkTask}
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
            backgroundColor: 'var(--color-primary)',
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          分支为新任务
        </Button>
            <div 
              className="action-button optimize-mode"
          style={{ 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 12px',
            height: '32px',
                fontSize: '12px',
                border: '1px solid var(--color-border-secondary)',
                background: isOptimizationMode ? 'var(--color-primary-bg)' : 'var(--color-bg-container)'
              }}
            >
              <SettingOutlined style={{ fontSize: '14px' }} />
              <span>优化模式</span>
              <Switch 
                size="small" 
                checked={isOptimizationMode}
                onChange={toggleOptimizationMode}
              />
            </div>
          </>
        )}
      </div>

      {/* 创建任务模态框 */}
      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onCancel={handleCancelCreateTask}
        cardData={completeCardData}
      />
      
      {/* 右键菜单 */}
      {contextMenu && (
        <TextContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* 添加观点弹窗 */}
      <AnnotationModal
        visible={showAnnotationModal}
        onClose={() => setShowAnnotationModal(false)}
        onSave={handleSaveAnnotation}
        selectedText={selectedText}
        initialContent={selectedText}
        step={currentOptimizationStep || 'result'}
      />
      {/* 讨论弹窗 */}
      <DiscussModal
        visible={showDiscussModal}
        onClose={() => setShowDiscussModal(false)}
        selectedText={selectedText}
      />
      
      {/* 分享模态框 */}
      <ShareModal
        visible={isShareModalVisible}
        onCancel={handleCloseShareModal}
        taskId={id}
        taskTitle={card?.title}
        availableModels={getFormattedModels()}
      />
    </div>
  )
}

export default CardDetailPage
