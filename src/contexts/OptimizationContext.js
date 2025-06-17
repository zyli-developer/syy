import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 创建优化模式上下文
export const OptimizationContext = createContext({
  isOptimizationMode: false,
  currentOptimizationStep: 'result', // 直接使用字符串标识步骤: result=结果质询, qa=QA优化, scenario=场景优化, flow=模板优化
  comments: {
    'result': [], // 结果质询对应CardDetailPage步骤0
    'qa': [],     // QA优化对应CardDetailPage步骤1
    'scenario': [],  // 场景优化对应CardDetailPage步骤2
    'flow': [] // 模板优化对应CardDetailPage步骤3
  },  // 对象类型，完全与task.annotation结构一致
  currentStepComments: [], // 当前步骤的注释列表
  setIsOptimizationMode: () => {},
  setCurrentOptimizationStep: () => {},
  addComment: () => {}, // 新增添加单条注释的方法
  setStepComments: () => {}, // 设置特定步骤的注释列表
  syncStepToIM: () => {}, // 新增同步当前步骤到IM组件的方法
});

// 定义一个全局事件名称用于跨组件通信
export const OPTIMIZATION_STEP_CHANGE_EVENT = 'optimization_step_change';

// 优化模式提供者组件
export const OptimizationProvider = ({ children }) => {
  const [isOptimizationMode, setIsOptimizationMode] = useState(false);
  // 直接使用字符串标识步骤，与task.annotation字段完全对应
  const [currentOptimizationStep, setInternalCurrentOptimizationStep] = useState('result');
  // 使用对象存储各步骤的注释，完全与task.annotation结构一致
  const [commentsMap, setCommentsMap] = useState({
    result: [], // 结果质询对应CardDetailPage步骤0
    qa: [],     // QA优化对应CardDetailPage步骤1
    scenario: [],  // 场景优化对应CardDetailPage步骤2
    flow: [] // 模板优化对应CardDetailPage步骤3
  });
  const location = useLocation();
  
  // 当前步骤的注释列表 - 直接使用步骤名称作为键
  // 不再需要getStepType函数，因为我们已经使用字符串标识步骤
  const currentStepComments = commentsMap[currentOptimizationStep] || [];

  // 同步步骤到IM组件的方法
  const syncStepToIM = () => {
    // 创建并触发自定义事件
    const event = new CustomEvent(OPTIMIZATION_STEP_CHANGE_EVENT, {
      detail: {
        step: currentOptimizationStep,
        isOptimizationMode
      }
    });
    
    // 在window对象上发布事件
    window.dispatchEvent(event);
    
    console.log(`已同步优化步骤到IM，当前步骤：${currentOptimizationStep}，优化模式：${isOptimizationMode}`);
  };
  
  // 设置当前步骤并同步到IM
  const setCurrentOptimizationStep = (step) => {
    setInternalCurrentOptimizationStep(step);
    // 立即同步去掉，交由useEffect统一处理
    // setTimeout(() => syncStepToIM(), 0);
  };

  // 为特定步骤添加新的注释
  const addComment = (comment) => {
    // 确保comment具有step字段，该字段指示注释类型(qa/scenario/flow)
    // 如果没有step字段，使用当前步骤
    console.log('addComment----------comment', comment);
    const commentType = comment.step || currentOptimizationStep;
    setCommentsMap(prevMap => {
      const stepComments = prevMap[commentType] || [];
      // 防止重复添加（根据id去重）
      if (stepComments.some(c => c.id === comment.id)) return prevMap;
      return {
        ...prevMap,
        [commentType]: [...stepComments, comment]
      };
    });
  };

  // 设置特定步骤的注释列表
  const setStepComments = (stepType, comments) => {
    // 直接使用步骤类型字符串(qa/scenario/flow)
    console.log('setStepComments----------stepType', stepType);
    setCommentsMap(prevMap => ({
      ...prevMap,
      [stepType]: comments
    }));
  };

  // 简化方法，直接设置当前步骤的注释列表
  const setCurrentStepComments = (comments) => {
    // 直接使用当前步骤类型
    setCommentsMap(prevMap => ({
      ...prevMap,
      [currentOptimizationStep]: comments
    }));
  };

  // 当步骤变化时，初始化该步骤的注释列表（如果不存在）
  useEffect(() => {
    if (!commentsMap[currentOptimizationStep]) {
      setCommentsMap(prevMap => ({
        ...prevMap,
        [currentOptimizationStep]: []
      }));
    }
    // 步骤变化或优化模式变化时同步到IM
    syncStepToIM();
  }, [currentOptimizationStep, isOptimizationMode]);
  
  useEffect(() => {
    syncStepToIM();
  }, [isOptimizationMode]);
  // 监听路由变化，当离开详情页时自动关闭优化模式
  useEffect(() => {
    const path = location.pathname;
    // 检查是否在探索详情页或任务详情页
    const isExplorationDetail = path.includes('/explore/detail/');
    const isTaskDetail = path.includes('/tasks/detail/') || (/^\/tasks\/(\w+)/.test(path));
    // 允许在探索详情页和任务详情页都能开启优化模式
    if (!isExplorationDetail && !isTaskDetail && isOptimizationMode) {
      console.log('已离开详情页，重置优化模式');
      setIsOptimizationMode(false);
      setInternalCurrentOptimizationStep('result'); // 重置为result(结果质询)步骤
    }
  }, [location.pathname, isOptimizationMode]);

  // 优化模式上下文值
  const optimizationContextValue = {
    isOptimizationMode,
    currentOptimizationStep,
    comments: commentsMap, // 所有步骤的注释映射
    currentStepComments, // 当前步骤的注释列表
    setIsOptimizationMode,
    setCurrentOptimizationStep,
    addComment, // 添加单条注释
    setStepComments, // 设置特定步骤的注释列表
    setComments: setCurrentStepComments, // 兼容原来的API
    syncStepToIM, // 导出同步方法
  };

  return (
    <OptimizationContext.Provider value={optimizationContextValue}>
      {children}
    </OptimizationContext.Provider>
  );
};

// 自定义钩子，用于访问优化模式上下文
export const useOptimization = () => useContext(OptimizationContext); 