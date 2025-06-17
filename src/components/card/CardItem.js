"use client"

import { useState, useMemo } from "react"
import { Avatar, Tag, Checkbox } from "antd"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart
} from "recharts"
import CreateTaskModal from "../modals/CreateTaskModal"
import { useNavigate } from "react-router-dom"
import "./card.css"
import LineChartSection from "./LineChartSection"
import RadarChartSection from "./RadarChartSection"

const CardItem = ({ card }) => {
  // 获取所有包含score的step
  const stepsWithScore = useMemo(() => {
    if (!card || !card.step) return [];
    return card.step.filter(step => 
      step.score && step.score.length > 0 && step.score[0]?.dimension?.length > 0
    );
  }, [card]);

  // 确保 card 对象存在且包含必要的属性
  const safeCard = useMemo(() => {

    
    // 从step数组中找到第一个包含score的步骤
    const stepWithScore = card.step?.find(step => 
      step.score && step.score.length > 0 && step.score[0]?.dimension?.length > 0
    );
    
    // 提取该步骤的评分和维度数据
    const scoreData = stepWithScore?.score?.[0];
    const dimensionData = scoreData?.dimension || [];
    
    console.log("找到的步骤数量:", stepsWithScore.length);
    console.log("评分数据:", scoreData);
    console.log("维度数据:", dimensionData);
    
    // 提供默认值以防属性不存在
    return {
      id: card.id || '',
      title: card.prompt || '',
      summary: card.summary || card.response || '',
      author: {
        name: card.author?.name || card.created_by || '',
        avatar: card.author?.avatar || null,
      },
      source: card.source || card.created_from || '',
      tags: card.tags || [],
      credibility: parseFloat(card.credibility || scoreData?.confidence || 0) * 100 || 0,
      credibilityChange: card.credibilityChange || '+0%',
      score: parseFloat(card.score || scoreData?.score || 0) || 0,
      scoreChange: card.scoreChange || '+0%',
      chartData: {
        radar: (() => {
          // 查找与card.version一致的step
          if (!card || !card.step || !card.version) return [];
          const matchedStep = card.step.find(
            step => step.score && step.score.length > 0 && step.score[0].version === card.version
          );
          if (matchedStep && matchedStep.score[0]?.dimension?.length > 0) {
            return matchedStep.score[0].dimension;
          }
          // 兜底逻辑：如果没有匹配的step，返回空数组
          return [];
        })(),
        line: card.chartData?.line || [
          { month: "版本1", value: parseFloat(scoreData?.confidence || 0) * 100 || 0 }
        ]
      },
      agents: card.agents || { overall: true, agent1: false, agent2: false },
      qa: card.qa || { 
        question: card.question || card.questionDescription || "",
        answer: card.answer || card.answerDescription || ""
      },
      questionDescription: card.questionDescription || card.qa?.question || card.question || "",
      answerDescription: card.answerDescription || card.qa?.answer || card.answer || ""
    };
  }, [card]);
  
  const navigate = useNavigate()
  const [showRadarChart, setShowRadarChart] = useState(false)

  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  const [completeCardData, setCompleteCardData] = useState({
    ...safeCard,
    questionDescription: safeCard.prompt || "基于卡片创建的问题描述。\n\n请在此处描述您想要测试或评估的内容。",
    answerDescription: safeCard.response || safeCard.summary || "基于卡片创建的答案描述。\n\n请在此处描述预期的测试结果或评估标准。"
  })

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

  const handleAgentChange = (agentKey) => {
  }

  const handleBranchClimbClick = () => {
    // 在点击"分支为新任务"按钮时，构建一个包含完整数据的对象
    // 正确映射字段名：问题描述(questionDescription)对应prompt，回答描述(answerDescription)对应response
    const newCompleteCardData = {
      ...safeCard,
      questionDescription: safeCard.prompt || "基于卡片创建的问题描述。\n\n请在此处描述您想要测试或评估的内容。",
      answerDescription: safeCard.response || safeCard.summary || "基于卡片创建的答案描述。\n\n请在此处描述预期的测试结果或评估标准。"
    };
    // 更新状态
    setCompleteCardData(newCompleteCardData)
    setIsCreateTaskModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  // Update the handleTitleClick function in CardItem.js
  const handleTitleClick = () => {
    // Navigate to the card detail page with state to track where we came from
    navigate(`/explore/detail/${safeCard.id}`, { state: { from: "explore" } })
  }

  // Generate unique radar data for each card
  const generateUniqueRadarData = useMemo(() => {
    
    if (!safeCard.chartData?.radar || safeCard.chartData.radar.length === 0) {
      // 不返回默认数据，如果真的没有维度，返回空数组
      return [];
    }

    // 确保所有维度都有值，避免SVG路径错误
    const processedData = safeCard.chartData.radar.map((item, index) => {
      // 使用一个合理的固定值（如整体评分）作为每个维度的基准值
      // 计算每个维度的具体值
      const value = Math.max(0.1, item.weight);
      // 统一使用API返回的latitude作为维度名称
      return {
        name: item.latitude || `维度${index+1}`,
        value: Math.max(0.1, value), // 确保至少有0.1的值以避免SVG错误
        // 为不同step创建不同的数据字段
        // ...stepsWithScore.reduce((acc, step, stepIndex) => {
        //   const stepScore = step.score?.[0]?.score || 0;
        //   const weight = item.weight || 0.25;
        //   // 使用step名称作为字段名，但去掉空格和特殊字符
        //   const fieldName = `step${stepIndex+1}`;
        //   acc[fieldName] = Math.max(0.1, stepScore * weight * 4);
        //   return acc;
        // }, {})
      };
    });
    return processedData;
  }, [safeCard.chartData?.radar, safeCard.score, stepsWithScore])

  // 计算雷达图的最大值
  const radarMaxValue = useMemo(() => {
    if (!generateUniqueRadarData || generateUniqueRadarData.length === 0) return 100;
    // 取所有维度的value和stepX的最大值
    let max = 0;
    generateUniqueRadarData.forEach(item => {
      Object.values(item).forEach(val => {
        if (typeof val === 'number' && val > max) max = val;
      });
    });
    return Math.ceil(max * 1.1); // 留10%余量
  }, [generateUniqueRadarData]);

  return (
    <div className="card-item">
      {/* Card title and button */}
      <div className="card-header">
        <h2 className="card-title-text" onClick={handleTitleClick}>
          {safeCard.title}
        </h2>
        <button className="branch-climb-button" onClick={handleBranchClimbClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="share-icon"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          分支为新任务
        </button>
      </div>

      {/* Author info and tags */}
      <div className="card-meta">
        <div className="author-info">
          <Avatar size={20} src={safeCard.author.avatar} className="author-avatar">
            {safeCard.author.name ? safeCard.author.name.charAt(0) : 'U'}
          </Avatar>
          <span className="by-text">by</span>
          <span className="author-name">{safeCard.author.name || '未知用户'}</span>
          <span className="from-text">from</span>
          <span className="source-name">{safeCard.source || '未知来源'}</span>
        </div>
        <div className="card-tags">
          {(safeCard.tags || []).map((tag, index) => (
            <Tag key={index} className="card-tag">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="card-divider"></div>

      {/* Card content - horizontal layout */}
      <div className="card-content-horizontal">
        {/* Left section - problem summary and metrics */}
        <div className={`card-left-section ${showRadarChart ? "with-radar" : ""}`}>
          <div className="card-summary">
            <p className="summary-text">{safeCard.summary}</p>
          </div>

          {/* Metrics section */}
          <div className="card-metrics">
            <div className="metrics-container">
              <div className="metric-item">
                <div className="metric-value" style={{ fontSize: '20px' }}>{safeCard.credibility.toFixed(1)}%</div>
                <div className="metric-info">
                  <div className="metric-label">可信度</div>
                  <div className={`metric-change ${(safeCard.credibilityChange || '').startsWith("+") ? "positive" : "negative"}`}>
                    {safeCard.credibilityChange || '+0%'}
                  </div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-value" style={{ fontSize: '20px' }}>{safeCard.score.toFixed(1)}</div>
                <div className="metric-info">
                  <div className="metric-label">评分</div>
                  <div className={`metric-change ${(safeCard.scoreChange || '').startsWith("+") ? "positive" : "negative"}`}>
                    {safeCard.scoreChange || '+0%'}
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension score link */}
            <div className="dimension-link" onClick={toggleRadarChart}>
              <span>{showRadarChart ? "收起" : "可信度得分"}</span>
              <span className="dimension-arrow">{showRadarChart ? "←" : "→"}</span>
            </div>
          </div>
        </div>

        {showRadarChart && ( <div className="card-right-section">
         
            <div className="radar-chart-container">
              <div className="radar-chart-title">可信度得分</div>
              <div className="radar-chart">
                <RadarChartSection radarData={generateUniqueRadarData} maxValue={radarMaxValue} />
              </div>
       
            </div>
        </div>
          )}
        {/* Right section - charts */}
        <div className="card-right-section">


          {/* Line chart */}
          <div className={`line-chart-container ${showRadarChart ? "with-radar" : ""}`}>
            <div className="line-chart-title">置信度爬升曲线</div>
            <LineChartSection card={card} />
          </div>
        </div>
      </div>

      {/* Create task modal */}
      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onCancel={handleModalCancel}
        cardData={completeCardData}
      />
    </div>
  )
}

export default CardItem
