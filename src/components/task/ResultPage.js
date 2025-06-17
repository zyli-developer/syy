import React, { useState, useContext, useMemo } from 'react';
import { 
  Avatar, 
  Select,
  Checkbox,
  Spin,
  message
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import AnnotationModal from '../../components/annotations/AnnotationModal';
import { OptimizationContext } from '../../contexts/OptimizationContext';
import CommentsList from '../common/CommentsList';
import LineChartSection from '../card/LineChartSection';
import RadarChartSection from '../card/RadarChartSection';

const { Option } = Select;

const ResultPage = ({ 
  task, 
  enhancedChartData, 
  evaluationData, 
  selectedModels: propSelectedModels, 
  selectedModel,
  expandedModel,
  radarMaxValue,
  handleModelChange: propHandleModelChange,
  handleSelectAll: propHandleSelectAll,
  toggleModelPanel,
  getModelColor,
  onAddAnnotation,
  isOptimizationMode = false,
  comments = []
}) => {
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [expandedComment, setExpandedComment] = useState(null);
  
  const handleSaveAnnotation = async (data) => {
    try {
      const annotationData = {
        ...data,
        selectedText: data.selectedText || selectedText,
        id: `annotation-${Date.now()}`,
        step: 'result',
        time: new Date().toISOString()
      };
      
      if (onAddAnnotation && typeof onAddAnnotation === 'function') {
        if (!task.annotation) {
          task.annotation = { result: [] };
        } else if (!task.annotation.result) {
          task.annotation.result = [];
        }
        
        onAddAnnotation(annotationData);
      }
      
      if (currentOptimizationStep === 0 || currentOptimizationStep === 'result') {
        addComment(annotationData);
      }
      
      setAnnotationModalVisible(false);
      setSelectedText('');
      
      message.success('添加观点成功');
    } catch (error) {
      console.error('添加观点失败:', error);
      message.error('添加观点失败');
    }
  };
  
  const { 
    currentOptimizationStep, 
    currentStepComments,
    addComment,
    setStepComments
  } = useContext(OptimizationContext);
  
  const handleCommentToggle = (id) => {
    setExpandedComment(expandedComment === id ? null : id);
  };

  const stepsData = useMemo(() => {
    if (!task || !task.step) {
      return [];
    }
    
    const steps = Array.isArray(task.step) ? task.step : [task.step];
    
    return steps.filter(step => step && step.agent);
  }, [task]);

  const modelOptions = useMemo(() => {
    if (stepsData && stepsData.length > 0) {
      return stepsData.map(step => step.agent.toLowerCase().replace(/\s+/g, ''));
      return stepsData.map(step => step.agent.toLowerCase().replace(/\s+/g, ''));
    }
    return Object.keys(evaluationData || {});
  }, [stepsData, evaluationData]);

  const getModelReason = (step) => {
    if (!step || !Array.isArray(step.score) || step.score.length === 0) return '暂无描述';
    const matchedScore = step.score.find(s => s.version === task.version);
    if (matchedScore && matchedScore.reason) return matchedScore.reason;
    if (step.score[0] && step.score[0].reason) return step.score[0].reason;
    return '暂无描述';
  };

  const currentEvaluation = useMemo(() => {
    if (stepsData && stepsData.length > 0 && selectedModel) {
      const selectedStep = stepsData.find(step => 
        step.agent.toLowerCase().replace(/\s+/g, '') === selectedModel
      );
      
      if (selectedStep) {
        let scoreValue = 70;
        if (selectedStep.score) {
          if (Array.isArray(selectedStep.score) && selectedStep.score.length > 0) {
            const scoreObj = selectedStep.score[0];
            if (scoreObj && typeof scoreObj === 'object') {
              if (typeof scoreObj.score === 'string' || typeof scoreObj.score === 'number') {
                scoreValue = scoreObj.score;
              }
            } else if (typeof scoreObj === 'string' || typeof scoreObj === 'number') {
              scoreValue = scoreObj;
            }
          } else if (typeof selectedStep.score === 'string' || typeof selectedStep.score === 'number') {
            scoreValue = selectedStep.score;
          }
        }
        
        let confidenceValue = 75;
        if (selectedStep.score && Array.isArray(selectedStep.score) && selectedStep.score.length > 0) {
          const scoreObj = selectedStep.score[0];
          if (scoreObj && typeof scoreObj === 'object' && 
              (typeof scoreObj.confidence === 'string' || typeof scoreObj.confidence === 'number')) {
            confidenceValue = parseFloat(scoreObj.confidence) * 100;
          }
        }
        
        return {
          name: selectedStep.agent,
          score: scoreValue,
          credibility: confidenceValue,
          scoreChange: '+0.0',
          credibilityChange: '+0.0',
          reason: getModelReason(selectedStep),
          reason: getModelReason(selectedStep),
          tags: selectedStep.tags || []
        };
      }
    }
    
    if (evaluationData && selectedModel && evaluationData[selectedModel]) {
      return evaluationData[selectedModel];
    } else if (evaluationData && Object.values(evaluationData).length > 0) {
      return Object.values(evaluationData)[0];
    }
    
    return {
      name: '未知模型',
      score: 70,
      credibility: 75,
      scoreChange: '+0.0',
      credibilityChange: '+0.0',
      reason: '暂无数据',
      tags: []
    };
  }, [stepsData, selectedModel, evaluationData, task]);

  const lineChartData = useMemo(() => {
    if (!stepsData || stepsData.length === 0) {
      return enhancedChartData?.line || [];
    }
    
    const versionMap = {};
    
    stepsData.forEach(step => {
      if (!step.score || !Array.isArray(step.score)) return;
      
      step.score.forEach(scoreItem => {
        const version = scoreItem.version || '1.0';
        const modelKey = step.agent.toLowerCase().replace(/\s+/g, '');
        
        if (!versionMap[version]) {
          versionMap[version] = { version };
        }
        
        versionMap[version][modelKey] = parseFloat(scoreItem.confidence) * 100;
      });
    });
    
    return Object.values(versionMap);
  }, [stepsData, enhancedChartData]);

  const calculatedRadarMaxValue = useMemo(() => {
    if (!enhancedChartData?.radar || enhancedChartData.radar.length === 0) {
      return 100;
    }
    
    let maxValue = 0;
    
    enhancedChartData.radar.forEach(dataPoint => {
      Object.keys(dataPoint).forEach(key => {
        if (key !== 'name' && typeof dataPoint[key] === 'number') {
          if (dataPoint[key] > maxValue) {
            maxValue = dataPoint[key];
          }
        }
      });
    });
    
    return Math.ceil(maxValue / 10) * 10 + 10;
  }, [enhancedChartData]);

  const enhancedRadar = useMemo(() => {
    if (!Array.isArray(stepsData) || stepsData.length === 0) {
      // 如果没有step数据，回退到使用chartData.radar
      const radarData = task?.chartData?.radar || [];
      return radarData.map(item => ({
        name: item.name || '未知维度',
        value: Math.round(item.value || 0),
      }));
    }

    // 收集所有维度
    const dimensionMap = {};
    
    stepsData.forEach((step) => {
      if (!step || !Array.isArray(step.score)) return;
      
      // 取最新一条score（最后一条）
      const lastScore = step.score[step.score.length - 1];
      if (!lastScore || !Array.isArray(lastScore.dimension)) return;
      
      const modelKey = step.agent.toLowerCase().replace(/\s+/g, '');
      
      lastScore.dimension.forEach(dim => {
        if (!dim.latitude) return;
        
        if (!dimensionMap[dim.latitude]) {
          dimensionMap[dim.latitude] = {
            name: dim.latitude,
            value: 0 // 默认值
          };
        }
        
        // 将score转换为数字并存储到对应模型的key下
        const score = typeof dim.score === 'number' ? dim.score : parseFloat(dim.score) || 0;
        dimensionMap[dim.latitude][modelKey] = Math.round(score);
      });
    });
    
    return Object.values(dimensionMap);
  }, [task, stepsData]);

  if (!task || !enhancedChartData || !currentEvaluation) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>加载评估结果...</div>
      </div>
    );
  }

  const formatScore = (score) => {
    if (score === undefined || score === null) return 70;
    if (typeof score === 'object') return 70;
    
    const numScore = parseFloat(score);
    if (!isNaN(numScore)) {
      return numScore.toFixed(1);
    }
    
    return 70;
  };

  // 计算是否有注释列表
  const hasComments = Array.isArray(comments) && comments.length > 0;

  return (
    <div
      className={`evaluation-charts-wrapper flex gap-2 w-full ${hasComments ? 'justify-between' : ''}`}
    >
      {/* 左侧评估区域 */}
      <div
        className={`evaluation-left-section ${hasComments ? 'w-1/3' : 'w-1/2'} flex-shrink-0`}
      >
        <div className="evaluation-section" style={{ padding: "8px" }}>
          <div className="evaluation-header" style={{ marginBottom: "8px" }}>
            <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ 
                fontSize: "16px", 
                fontWeight: "600", 
                color: "var(--color-text-base)",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
                padding: "4px 12px 4px 0",
                borderRight: "1px solid var(--color-border-secondary)"
              }}>评估结果</span>
              <Select
                mode="multiple"
                value={propSelectedModels || []}
                onChange={propHandleModelChange}
                className="model-selector"
                maxTagCount={2}
                maxTagTextLength={10}
                dropdownRender={(menu) => (
                  <>
                    <div className="select-all-option" onClick={() => propHandleSelectAll(propSelectedModels?.length < modelOptions?.length)} style={{ padding: "4px 8px" }}>
                      <Checkbox checked={propSelectedModels?.length === modelOptions?.length}>
                        全选
                      </Checkbox>
                    </div>
                    {menu}
                  </>
                )}
              >
                {modelOptions.map(modelKey => {
                  const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
                  const displayName = step ? step.agent : (evaluationData[modelKey]?.name || modelKey);
                  
                  return (
                    <Option key={modelKey} value={modelKey}>{displayName}</Option>
                  );
                })}
              </Select>
            </div>
          </div>

          <div className="evaluation-model-info" style={{ gap: "4px" }}>
            {Array.isArray(propSelectedModels) && propSelectedModels.map(modelKey => {
              const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
              
              const modelData = step ? {
                name: step.agent,
                tags: step.tags || [],
                reason: getModelReason(step)
              } : evaluationData[modelKey];
              
              if (!modelData) return null;
              
              return (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                          {modelData.name?.charAt(0) || '?'}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                            {modelData.name || 'Unknown Model'}
                          <span className="model-tags" style={{ gap: "4px", marginLeft: "4px" }}>
                            <span className="model-tag" style={{ padding: "0 4px", fontSize: "11px" }}>
                              {
                                (() => {
                                  const step = stepsData.find(s => s.agent && s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
                                  const consumed = step && Array.isArray(step.score) && step.score[0]
                                    ? step.score[0].consumed_points
                                    : undefined;
                                  return consumed !== undefined ? `${consumed} tokens` : '未知消耗';
                                })()
                              }
                            </span>
                          </span>
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                            {Array.isArray(modelData.tags) && modelData.tags.map((tag, index) => (
                            <span key={index} className="model-tag" style={{ padding: "0 4px", fontSize: "11px" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="model-panel-icon">
                      {expandedModel === modelKey ? <MinusOutlined /> : <PlusOutlined />}
                    </div>
                  </div>

                  {expandedModel === modelKey && (
                    <div className="model-panel-content" style={{ padding: "0 8px 8px" }}>
                      <div className="evaluation-content" style={{ padding: "8px" }}>
                          <p className="evaluation-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.4" }}>
                            {modelData.reason || '暂无描述'}
                          </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右侧图表区域 */}
      <div
        className={`evaluation-right-section flex flex-col gap-1 ${hasComments ? 'w-1/3' : 'w-1/2'} flex-shrink-0`}
      >
        <div className="line-chart-section" style={{ padding: "8px" }}>
          <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
            {Array.isArray(propSelectedModels) && propSelectedModels.map(modelKey => {
              const step = stepsData.find(s => s.agent.toLowerCase().replace(/\s+/g, '') === modelKey);
              const displayName = step ? step.agent : (evaluationData[modelKey]?.name || modelKey);
              
              return (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{displayName}</span>
                </div>
              );
            })}
          </div>

          <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
            <LineChartSection 
              card={{
                ...task,
                step: task.step,
                chartData: { line: lineChartData }
              }} 
              showLinearGradient={true}
              selectedModels={propSelectedModels}
                  />
          </div>
        </div>

        <div className="score-radar-section" style={{ gap: "8px", padding: "8px" }}>
          <div className="metrics-section" style={{ gap: "8px", minWidth: "70px" }}>
            <div className="metric-item" style={{ padding: "8px" }}>
              <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>综合得分</div>
              <div className="metric-value" style={{ fontSize: "20px" }}>
                 { Math.round(task?.score)}
              </div>
              <div className={`metric-change ${typeof currentEvaluation?.credibilityChange === 'string' && currentEvaluation?.credibilityChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                {typeof currentEvaluation?.scoreChange === 'string' ? currentEvaluation?.scoreChange : '0'}
              </div>
            </div>

            <div className="metric-item" style={{ padding: "8px" }}>
              <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>可信度得分</div>
              <div className="metric-value" style={{ fontSize: "20px" }}>{formatScore(task?.credibility)}%</div>
              <div className={`metric-change ${typeof currentEvaluation?.scoreChange === 'string' && currentEvaluation?.scoreChange?.startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                {typeof currentEvaluation?.credibilityChange === 'string' ? currentEvaluation?.credibilityChange : '0'}
              </div>
            </div>
          </div>

          <div className="radar-chart-content" style={{ height: "220px" }}>
            <RadarChartSection 
              radarData={enhancedRadar}
              modelKeys={propSelectedModels}
              maxValue={calculatedRadarMaxValue}
              height={220}
                  />
          </div>
        </div>
      </div>

      {/* 右侧注释列表 - 仅在优化模式下显示且有注释数据时显示 */}
      {isOptimizationMode && hasComments && (
        <div className="comments-section w-1/3 flex-shrink-0 bg-[var(--color-bg-container)] rounded-lg max-h-[calc(100vh-320px)] overflow-hidden">
            <CommentsList 
            comments={comments} 
              title="注释列表"
              expandedId={expandedComment}
              onToggleExpand={handleCommentToggle}
              customStyles={{
                container: { height: '100%' }
              }}
            />
            </div>
          )}

      {/* 非优化模式下显示传递的评论 */}
      {!isOptimizationMode && hasComments && (
        <div className="comments-section w-1/3 flex-shrink-0 bg-[var(--color-bg-container)] rounded-lg max-h-[calc(100vh-320px)] overflow-auto">
          <CommentsList 
            comments={comments} 
            title="注释列表"
            expandedId={expandedComment}
            onToggleExpand={handleCommentToggle}
            customStyles={{
              container: { height: '100%' }
            }}
          />
        </div>
      )}

      <AnnotationModal
        visible={annotationModalVisible}
        onClose={() => setAnnotationModalVisible(false)}
        onSave={handleSaveAnnotation}
        selectedText={selectedText}
        initialContent={selectedText}
        step="result"
      />
    </div>
  );
};

export default ResultPage; 
