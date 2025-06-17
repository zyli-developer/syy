"use client"

import { useState, useEffect } from 'react'
import { Avatar, Tag, Card, Typography, Button, Tooltip, Space, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAssetStyles } from '../../styles/components/assets'
import {   StarOutlined,   StarFilled,   SendOutlined,   MessageOutlined,   DeleteOutlined,  UserOutlined,  EyeOutlined } from '@ant-design/icons'
import ResultPage from '../task/ResultPage'
// 引入reportData.js模块
// import { demoReport, generateTaskReports } from '../../mocks/reportData'

const { Text, Title } = Typography

/** * 资产卡片组件 * @param {Object} asset - 资产数据 * @param {Boolean} onClick - 是否可点击 */const AssetCard = ({ asset, onClick }) => {
  const { styles } = useAssetStyles()
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedModels, setSelectedModels] = useState([])
  const [selectedChartModels, setSelectedChartModels] = useState({})
  const [expandedModel, setExpandedModel] = useState(false)
  // 添加状态来存储报告数据
  const [reportData, setReportData] = useState(null)
  const [evaluationData, setEvaluationData] = useState({})
  const [enhancedChartData, setEnhancedChartData] = useState({ radar: [], line: [] })
  
  // 获取报告数据
  useEffect(() => {
    // 只有当资产是报告类型或onClick为true时才加载报告数据
    if (asset?.type !== 'report' && !onClick) return;

    const loadReportData = () => {
      try {
        let report = null;
        
        // 先尝试从localStorage获取报告数据
        const reportsJson = localStorage.getItem('task_reports') || '[]'
        const allReports = JSON.parse(reportsJson)
        
        // 查找与当前asset.id匹配的报告
        const matchedReport = allReports.find(report => 
          report.id === asset?.id || report.taskId === asset?.id
        )
        
        if (matchedReport) {
          console.log('从localStorage找到匹配的报告数据:', matchedReport)
          report = matchedReport;
        } else {
          // 如果localStorage中没有匹配的报告，则使用reportData.js中的数据
          if (asset?.type === 'report') {
            // 如果是演示报告
            if ( asset?.title && asset?.title.includes('演示')) {
              console.log('使用演示报告数据');
             
            } else {
              // 生成一个基于当前资产的报告
              console.log('生成报告数据');
              // const generatedReports = generateTaskReports([asset?.id], [asset]);
              // if (generatedReports && generatedReports.length > 0) {
              //   report = generatedReports[0];
              // }
            }
          }
        }
        
        // 如果找到或生成了报告数据
        if (report) {
          setReportData(report);
          
          // 构建模型评估数据对象
          const modelsData = {};
          
          // 如果报告中有step数据，从中提取模型信息
          if (report.step && Array.isArray(report.step) && report.step.length > 0) {
            report.step.forEach(step => {
              if (step.agent) {
                const modelKey = step.agent.toLowerCase().replace(/\s+/g, '');
                
                // 提取score数据
                let scoreValue = '75';
                let credibilityValue = '85';
                
                if (step.score && Array.isArray(step.score) && step.score.length > 0) {
                  const scoreData = step.score[0];
                  if (scoreData.score) {
                    scoreValue = String(Math.round(parseFloat(scoreData.score) * 100));
                  }
                  if (scoreData.confidence) {
                    credibilityValue = String(Math.round(parseFloat(scoreData.confidence) * 100));
                  }
                }
                
                // 模型评估数据
                modelsData[modelKey] = {
                  name: step.agent,
                  score: scoreValue,
                  scoreChange: '+2.0',
                  credibility: credibilityValue,
                  credibilityChange: '+1.5',
                  tags: ['AI模型'],
                  description: step.reason || `${step.agent}的评估结果`
                };
              }
            });
          }
          
          // 设置评估数据
          if (Object.keys(modelsData).length > 0) {
            setEvaluationData(modelsData);
            
            // 设置默认选择的模型
            const modelKeys = Object.keys(modelsData);
            if (modelKeys.length > 0) {
              // 优先使用报告中指定的models（如果存在）
              if (report.models && Array.isArray(report.models) && report.models.length > 0) {
                // 确保指定的模型存在于评估数据中
                const validModels = report.models.filter(model => modelKeys.includes(model));
                if (validModels.length > 0) {
                  setSelectedModels(validModels);
                  setSelectedModel(validModels[0]);
                  console.log('使用报告中指定的模型:', validModels);
                  return; // 找到并设置了有效的模型，不执行后续代码
                }
              }
              
              // 如果报告中没有指定有效的models，则回退到默认选择前两个模型
              setSelectedModels(modelKeys.slice(0, 2));
              setSelectedModel(modelKeys[0]);
              console.log('使用默认的前两个模型:', modelKeys.slice(0, 2));
            }
          }
          
          // 设置图表数据
          // 处理雷达图数据 - 直接使用report.chartData.radar
          if (report.chartData && report.chartData.radar) {
            // 格式化雷达图数据 - 直接使用原始数据
            const radarData = report.chartData.radar.map(item => {
              // 先保留基本数据结构
              const formattedItem = { name: item.name, value: item.value };
              
              // 为每个模型添加对应的数据点
              Object.keys(modelsData).forEach((modelKey, index) => {
                // 为不同模型添加不同的偏移量，使图表更美观
                const offset = 0.9 + (index * 0.05);
                formattedItem[modelKey] = Math.round(item.value * offset);
              });
              
              return formattedItem;
            });
            
            // 处理折线图数据 - 使用report.step中的agent和score.confidence
            let lineData = [];
            
            // 检查是否有step数据
            if (report.step && Array.isArray(report.step) && report.step.length > 0) {
              // 从step中提取agent和confidence数据
              lineData = report.step.map(step => {
                // 基本数据项
                const item = {
                  month: step.agent || "未知模型", // X轴使用agent名称
                  value: 0 // 默认值
                };
                
                // 提取confidence值
                if (step.score) {
                  if (Array.isArray(step.score) && step.score.length > 0) {
                    // 如果score是数组
                    const scoreData = step.score[0];
                    item.value = scoreData.confidence 
                      ? Math.round(parseFloat(scoreData.confidence) * 100) 
                      : 75; // 默认值
                  } else if (typeof step.score === 'object' && step.score.confidence) {
                    // 如果score是对象
                    item.value = Math.round(parseFloat(step.score.confidence) * 100);
                  } else if (typeof step.score === 'number') {
                    // 如果score直接是数字
                    item.value = Math.round(step.score * 100);
                  }
                }
                
                // 添加该模型自己的数据点
                const modelKey = step.agent?.toLowerCase().replace(/\s+/g, '') || "default";
                item[modelKey] = item.value;
                
                // 为其他模型添加虚拟数据点(略低于主要值)，确保图表显示合理
                Object.keys(modelsData).forEach((otherKey) => {
                  if (otherKey !== modelKey) {
                    item[otherKey] = Math.max(10, Math.round(item.value * 0.85));
                  }
                });
                
                return item;
              });
            } else if (report.chartData.line) {
              // 如果没有step数据，但有原始的line数据，则使用原始数据作为后备
              lineData = report.chartData.line.map(item => {
                const formattedItem = { month: item.month, value: item.value };
                
                // 为每个模型添加对应的数据点
                Object.keys(modelsData).forEach((modelKey, index) => {
                  const offset = 0.9 + (index * 0.05);
                  formattedItem[modelKey] = Math.round(item.value * offset);
                });
                
                return formattedItem;
              });
            }
            
            setEnhancedChartData({
              radar: radarData,
              line: lineData
            });
          }
        } else {
          console.log('未找到匹配的报告数据，使用默认数据');
        }
      } catch (error) {
        console.error('加载报告数据失败:', error);
      }
    };
    
    // 初始加载
    loadReportData();
    
    // 监听报告更新事件
    const handleReportsUpdate = () => {
      console.log('检测到报告更新事件，重新加载报告数据');
      loadReportData();
    };
    
    // 监听localStorage变化
    const handleStorageChange = (e) => {
      if (e.key === 'reports_last_updated' || e.key === 'task_reports') {
        console.log('检测到报告数据更新，重新加载');
        loadReportData();
      }
    };
    
    // 添加事件监听
    window.addEventListener('reportsUpdated', handleReportsUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('reportsUpdated', handleReportsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [asset, onClick]);
  
  // 如果没有资产数据，显示空卡片
  if (!asset) {
    return (
      <Card className={styles.assetCard}>
        <Text>无效资产数据</Text>
      </Card>
    );
  }

  // 确保资产数据包含所需的属性
  const safeAsset = {
    id: asset?.id || 'unknown-id',
    name: asset?.name || asset?.title || '未命名资产',
    summary: asset?.response_summary || asset?.summary || '无概述...',
    creator: asset?.created_by || '未知用户',
    createdFrom: asset?.created_from || '未知来源', 
    keywords: Array.isArray(asset?.keywords) ? asset.keywords : [],
    dimensions: Array.isArray(asset?.dimensions) ? asset.dimensions : [],
    createdAt: asset?.created_at ? new Date(asset.created_at).toLocaleDateString() : '未知日期',
    type: asset?.type || 'template'
  }

  // 处理点击卡片事件
  const handleCardClick = () => {
    // 只有当onClick为true时才响应点击
    if (onClick) {
      setModalVisible(true);
    }
  }

  // 处理收藏按钮点击
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  
  // 处理发送按钮点击
  const handleSendClick = (e) => {
    e.stopPropagation()
    // 处理发送逻辑
    console.log('发送资产:', safeAsset.id)
  }
  
  // 处理消息按钮点击
  const handleMessageClick = (e) => {
    e.stopPropagation()
    // 处理消息逻辑
    console.log('打开消息:', safeAsset.id)
  }
  
  // 处理删除按钮点击
  const handleDeleteClick = (e) => {
    e.stopPropagation()
    // 处理删除逻辑
    console.log('删除资产:', safeAsset.id)
  }

  // 处理关闭模态框
  const handleCloseModal = () => {
    setModalVisible(false)
  }

  // 用于 ResultPage 的处理函数
  const handleModelChange = (value) => {
    if (Array.isArray(value)) {
      setSelectedModels(value)
    } else {
      setSelectedModel(value)
    }
  }

  const handleSelectAll = (checked) => {
    const modelOptions = Object.keys(evaluationData || {})
    setSelectedModels(checked ? modelOptions : [])
  }

  const toggleModelPanel = (modelKey) => {
    setExpandedModel(expandedModel === modelKey ? false : modelKey)
  }

  const getModelColor = (modelKey) => {
    const colorMap = {
      'claude3.5': 'var(--color-primary)',
      'claude3.6': 'var(--color-assist-1)',
      'claude3.7': 'var(--color-assist-2)',
      'default': 'var(--color-heavy)'
    }
    return colorMap[modelKey] || colorMap.default
  }

  // 获取此资产的标签列表
  const getTags = () => {
    if (safeAsset.type === 'scene') {
      return safeAsset.dimensions || []
    } else if (safeAsset.type === 'template') {
      return safeAsset.keywords || []
    } else {
      return [...(safeAsset.keywords || []), ...(safeAsset.dimensions || [])].slice(0, 5)
    }
  }

  const allTags = getTags()
  
  // 最多显示5个标签
  const displayTags = allTags.slice(0, 5)
  const hasMoreTags = allTags.length > 5

  return (
    <>
      <Card 
        className={`${styles.assetCard} ${onClick ? styles.clickableCard : styles.nonClickableCard}`} 
        hoverable={onClick} 
        onClick={handleCardClick}
      >
        <div className={styles.cardContainer}>
          {/* 头部信息 */}
          <div className={styles.cardHeader}>
            <Title level={5} className={`${styles.cardTitle} ${onClick ? styles.clickableTitle : styles.nonClickableTitle}`}>{safeAsset.name}</Title>
            
            {/* 操作按钮 */}
            <div className={styles.cardActions}>
              <Space size={4}>
                <Tooltip title="发送">
                  <Button
                    type="text"
                    size="small"
                    icon={<SendOutlined />}
                    onClick={handleSendClick}
                    className={styles.actionButton}
                  />
                </Tooltip>
                <Tooltip title="消息">
                  <Button
                    type="text"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={handleMessageClick}
                    className={styles.actionButton}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteClick}
                    className={styles.actionButton}
                    danger
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
          
          {/* 创建人信息 */}
          <div className={styles.creatorInfo}>
            <Text type="secondary">创建人：</Text>
            <div className={styles.creatorDetail}>
              <Avatar 
                size="small" 
                className={styles.authorAvatar} 
                icon={<UserOutlined />}
              >
                {safeAsset.creator[0]}
              </Avatar>
              <Text>{safeAsset.creator}</Text>
            </div>
          </div>
          
          {/* 标签区域 */}
          <div className={styles.cardTags}>
            {displayTags.map((tag, index) => (
              <Tag key={index} className={styles.tagStyle}>{tag}</Tag>
            ))}
            {hasMoreTags && (
              <Tooltip title={allTags.slice(5).join(', ')}>
                <Tag className={styles.tagStyle}>+{allTags.length - 5}</Tag>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>

      {/* 结果页面模态框 */}
      <Modal
        title={safeAsset.name}
        open={modalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={null}
      >
        <ResultPage
          task={reportData?.sourceTask || reportData || asset}
          enhancedChartData={enhancedChartData}
          evaluationData={evaluationData}
          selectedModels={selectedModels}
          selectedModel={selectedModel}
          expandedModel={expandedModel}
          radarMaxValue={100}
          handleModelChange={handleModelChange}
          handleSelectAll={handleSelectAll}
          toggleModelPanel={toggleModelPanel}
          getModelColor={getModelColor}
          onAddAnnotation={() => console.log('添加注释')}
        />
      </Modal>
    </>
  )
}

export default AssetCard 