import React, { useState, useEffect } from 'react';
import { 


  Avatar, 


  Select,
  Checkbox,
  Spin
} from 'antd';
import colorToken from '../../styles/utils/colorToken';
import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import LineChartSection from '../card/LineChartSection';
import RadarChartSection from '../card/RadarChartSection';

const { Option } = Select;

const SubmitResultSection = ({ task }) => {
  // 状态管理
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedChartModels, setSelectedChartModels] = useState({});
  const [expandedModel, setExpandedModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [evaluationData, setEvaluationData] = useState({});
  const [enhancedChartData, setEnhancedChartData] = useState({ radar: [], line: [] });
  
  // 在组件加载时处理数据
  useEffect(() => {
    if (!task) return;
    
    // 从task.step中提取模型数据
    const modelData = {};
    const modelKeys = [];
    
    if (Array.isArray(task.step)) {
      task.step.forEach((step, index) => {
        if (step && step.agent) {
          const modelKey = step.agent.toLowerCase().replace(/\s+/g, '');
          modelKeys.push(modelKey);
          
          // 获取评分数据（默认使用第一个评分记录）
          let scoreData = {};
          let matchedReason = '暂无评估原因';
          if (Array.isArray(step.score) && step.score.length > 0) {
            // 优先查找与task.version匹配的score
            scoreData = step.score.find(s => s.version === task.version) || step.score[0];
            if (scoreData && scoreData.version === task.version && scoreData.reason) {
              matchedReason = scoreData.reason;
            } else if (scoreData && scoreData.reason) {
              matchedReason = scoreData.reason;
            }
          }
          
          modelData[modelKey] = {
            name: step.agent,
            score: scoreData.score || "0.0",
            scoreChange: scoreData.scoreChange || "+0.0%",
            credibility: scoreData.confidence || "0.0",
            credibilityChange: scoreData.credibilityChange || "+0.0%",
            tags: scoreData.dimension ? scoreData.dimension.map(d => d.latitude) : ['未知维度'],
            description: matchedReason,
            description: matchedReason,
            updatedAt: scoreData.updated_at ? new Date(scoreData.updated_at.seconds * 1000).toLocaleDateString() : '未知时间',
            updatedBy: '系统',
            history: '',
            reason: matchedReason
          };
        }
      });
    }
    
    console.log("modelData",modelData)
    
    console.log("modelData",modelData)
    
    // 设置评估数据
    setEvaluationData(modelData);
    
    // 默认选中所有模型
    setSelectedModels(modelKeys);
    
    // 设置图表模型数据
    const chartModels = {};
    modelKeys.forEach(key => {
      chartModels[key] = true;
    });
    setSelectedChartModels(chartModels);
    
    // 如果有模型，默认选择第一个
    if (modelKeys.length > 0) {
      setSelectedModel(modelKeys[0]);
    }
    
    // 处理图表数据
    prepareChartData();
  }, [task]);

  // 准备图表数据
  const prepareChartData = () => {
    if (!task || !task.step) return;

    // 1. 收集所有维度
    const steps = Array.isArray(task.step) ? task.step : [];
    const modelKeys = steps.map(step => step.agent?.toLowerCase().replace(/\s+/g, '')).filter(Boolean);
    const dimensionMap = {};

    steps.forEach((step) => {
      const modelKey = step.agent?.toLowerCase().replace(/\s+/g, '');
      if (!modelKey || !Array.isArray(step.score)) return;
      // 只取最新一条score
      const lastScore = step.score[step.score.length - 1];
      if (!lastScore || !Array.isArray(lastScore.dimension)) return;
      lastScore.dimension.forEach(dim => {
        if (!dim.latitude) return;
        if (!dimensionMap[dim.latitude]) {
          dimensionMap[dim.latitude] = { name: dim.latitude };
        }
        // 百分比显示 - 确保使用dimension中的score值
        const scoreValue = dim.score;
        dimensionMap[dim.latitude][modelKey] =
          typeof scoreValue === 'number'
            ? Math.round(scoreValue )
            : Math.round((parseFloat(scoreValue) || 0));
      });
    });

    const enhancedRadar = Object.values(dimensionMap);

    // 计算雷达图的动态最大值
    let maxRadarValue = 0;
    enhancedRadar.forEach(dimension => {
      Object.keys(dimension).forEach(key => {
        if (key !== 'name' && typeof dimension[key] === 'number') {
          maxRadarValue = Math.max(maxRadarValue, dimension[key]);
        }
      });
    });
    // 设置一个合理的最大值，向上取整到最近的10的倍数
    const dynamicMaxValue = maxRadarValue > 0 ? Math.ceil(maxRadarValue / 10) * 10 : 100;

    // 折线图数据保持原逻辑
    let lineData = [];
    if (Array.isArray(task.step) && task.step.length > 0) {
      task.step.forEach(step => {
        if (step && Array.isArray(step.score) && step.score.length > 0) {
          step.score.forEach(scoreData => {
            if (!scoreData.version) return;
            const existingPoint = lineData.find(point => point.month === scoreData.version);
            const modelKey = step.agent?.toLowerCase().replace(/\s+/g, '');
            const scoreValue = parseFloat(scoreData.score || 0) * 100;
            if (existingPoint) {
              if (modelKey) existingPoint[modelKey] = Math.round(scoreValue);
            } else {
              const newPoint = { month: scoreData.version, value: Math.round(scoreValue) };
              if (modelKey) newPoint[modelKey] = Math.round(scoreValue);
              lineData.push(newPoint);
            }
          });
        }
      });
    }
    lineData.sort((a, b) => {
      const versionA = parseFloat(a.month.replace(/[^0-9.]/g, '')) || 0;
      const versionB = parseFloat(b.month.replace(/[^0-9.]/g, '')) || 0;
      return versionA - versionB;
    });

    setEnhancedChartData({ radar: enhancedRadar, line: lineData, maxValue: dynamicMaxValue });
  };

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

  const toggleModelPanel = (modelKey) => {
    setExpandedModel(modelKey === expandedModel ? null : modelKey);
  };

  const getModelColor = (modelKey) => {
    // 根据模型确定颜色，使用主题色
    const colorMap = {
      0: colorToken.colorSuccess,
      1: colorToken.colorPrimary,
      2: colorToken.colorHeavy,
      3: colorToken.colorAssist1,
      4: colorToken.colorAssist2,
      5: colorToken.colorWarning,
      6: colorToken.colorInfo
    };
    
    // 从已有的selectedModels中获取索引
    const index = selectedModels.indexOf(modelKey);
    if (index >= 0) {
      return colorMap[index % Object.keys(colorMap).length];
    }
    
    // 如果不在selectedModels中，使用哈希值取模
    const hashCode = modelKey.split('').reduce((acc, char) => 
      (acc * 31 + char.charCodeAt(0)) & 0xffffffff, 0);
    return colorMap[Math.abs(hashCode) % Object.keys(colorMap).length] || colorToken.colorTextTertiary;
  };

  // 获取当前选中的评估数据
  const currentEvaluation = evaluationData[selectedModel] || (modelOptions.length > 0 ? evaluationData[modelOptions[0]] : {});

  if (!task) {
    return <Spin tip="加载中..." />;
  }

  return (
    <div className="evaluation-charts-wrapper" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '16px', margin: 0 }}>提交结果</h2>
      </div> */}
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* 左侧评估区域 */}
        <div className="evaluation-left-section" style={{ flex: "0 0 400px", gap: "4px" }}>
          <div className="evaluation-section" style={{ padding: "8px", marginBottom: "4px" }}>
            <div className="evaluation-header" style={{ marginBottom: "8px" }}>
              <div className="evaluation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>评估结果</span>
                <Select
                  mode="multiple"
                  value={selectedModels}
                  onChange={handleModelChange}
                  className="model-selector"
                  maxTagCount={2}
                  maxTagTextLength={10}
                  style={{ minWidth: "270px", flex: 1 }}
                  dropdownRender={(menu) => (
                    <>
                      <div className="select-all-option" onClick={() => handleSelectAll(selectedModels.length < modelOptions.length)} style={{ padding: "4px 8px" }}>
                        <Checkbox checked={selectedModels.length === modelOptions.length}>
                          全选
                        </Checkbox>
                      </div>
                      {menu}
                    </>
                  )}
                >
                  {modelOptions.map(modelKey => (
                    <Option key={modelKey} value={modelKey}>
                      {evaluationData[modelKey]?.name || modelKey}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="evaluation-model-info" style={{ gap: "4px" }}>
              {selectedModels.map(modelKey => (
                <div className="model-panel" key={modelKey} style={{ marginBottom: "4px" }}>
                  <div className="model-panel-header" onClick={() => toggleModelPanel(modelKey)} style={{ padding: "8px" }}>
                    <div className="model-panel-left">
                      <Avatar size={32} className="model-avatar" style={{ background: getModelColor(modelKey) }}>
                        {evaluationData[modelKey]?.name?.charAt(0) || 'M'}
                      </Avatar>
                      <div className="model-info">
                        <div className="model-name" style={{ fontSize: "14px" }}>
                          {evaluationData[modelKey]?.name || modelKey}
                        </div>
                        <div className="model-tags" style={{ gap: "4px" }}>
                          <span className="model-tag" style={{ padding: "0 4px", fontSize: "11px" }}>
                            {
                              (() => {
                                const step = Array.isArray(task.step)
                                  ? task.step.find(s => s.agent && s.agent.toLowerCase().replace(/\s+/g, '') === modelKey)
                                  : null;
                                const consumed = step && Array.isArray(step.score) && step.score[0]
                                  ? step.score[0].consumed_points
                                  : undefined;
                                return consumed !== undefined ? `${consumed} tokens` : '未知消耗';
                              })()
                            }
                            </span>
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
                          {
                            evaluationData[modelKey]?.reason ||
                            (() => {
                              const step = Array.isArray(task.step)
                                ? task.step.find(s => s.agent && s.agent.toLowerCase().replace(/\s+/g, '') === modelKey)
                                : null;
                              return step?.reason || '暂无描述';
                            })()
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧图表区域 */}
        <div className="evaluation-right-section" style={{ gap: "4px", flex: 1 }}>
          {/* 折线图区域 */}
          <div className="line-chart-section" style={{ padding: "8px" }}>
            <div className="chart-legend" style={{ marginBottom: "8px", gap: "8px" }}>
              {selectedModels.map(modelKey => (
                <div className="legend-item" key={modelKey} style={{ gap: "4px" }}>
                  <span className="legend-color" style={{ backgroundColor: getModelColor(modelKey), width: "10px", height: "10px" }}></span>
                  <span className="legend-label" style={{ fontSize: "12px" }}>{evaluationData[modelKey]?.name || modelKey}</span>
                </div>
              ))}
            </div>

            <div className="line-chart-container" style={{ height: "150px", marginTop: "4px" }}>
              <LineChartSection 
                card={{
                  ...task,
                  step: task.step,
                  chartData: { line: enhancedChartData.line }
                }}
                showLinearGradient={true}
                height={150}
                selectedModels={selectedModels}
              />

            </div>
          </div>

          {/* 评分和雷达图区域 */}
          <div className="score-radar-section" style={{ gap: "8px", padding: "8px" }}>
            <div className="metrics-section" style={{ gap: "8px", minWidth: "70px" }}>
              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>综合得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation.score || "0.0"}</div>
                <div className={`metric-change ${String(task.scoreChange || "").startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {task.scoreChange || "+0.0%"}
                </div>
              </div>

              <div className="metric-item" style={{ padding: "8px" }}>
                <div className="metric-label" style={{ fontSize: "12px", marginBottom: "4px" }}>置信度得分</div>
                <div className="metric-value" style={{ fontSize: "20px" }}>{currentEvaluation.credibility || "0.0"}</div>
                <div className={`metric-change ${String(task.credibilityChange || "").startsWith("+") ? "positive" : "negative"}`} style={{ fontSize: "12px" }}>
                  {task.credibilityChange || "+0.0%"}
                </div>
              </div>
            </div>

            {/* 雷达图 */}
            <div className="radar-chart-content" style={{ height: "220px" }}>
              <RadarChartSection 
                radarData={enhancedChartData.radar}
                modelKeys={selectedModels}
                maxValue={enhancedChartData.maxValue || 100}
                height={220}
                    />
      
            </div>
          </div>

          {/* 历史记录区域已删除 */}
        </div>
      </div>
    </div>
  );
};

export default SubmitResultSection;