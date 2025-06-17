"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Typography,
  Button,
  Progress,
  Card,
  Input,
  Spin,
  message,
  Avatar,
  Row,
  Col,
  Badge,
  Divider,
  Collapse,
} from "antd"
import {
  ArrowLeftOutlined,
  SyncOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  RocketOutlined,
  DownloadOutlined,
} from "@ant-design/icons"
import { useChatContext } from "../contexts/ChatContext"
import taskService from "../services/taskService"
import evaluationService from "../services/evaluationService"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Panel } = Collapse

const EvaluationPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reevaluating, setReevaluating] = useState(false)
  const [error, setError] = useState(null)
  const { isChatOpen } = useChatContext()
  const [optimizationInputs, setOptimizationInputs] = useState({})
  const [expandedModelIds, setExpandedModelIds] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Fetching data for task ID:", id)

        // 获取任务详情
        const taskData = await taskService.getTaskDetail(id)
        console.log("Task data:", taskData)
        setTask(taskData)

        // 获取评估数据
        const evaluationData = await evaluationService.getTaskEvaluation(id)
        console.log("Evaluation data:", evaluationData)
        setEvaluation(evaluationData)

        // 初始化每个模型的优化输入
        const inputs = {}
        evaluationData.models.forEach((model, index) => {
          inputs[index] =
            `针对${model.name}的优化建议：\n1. ${model.weaknesses[0]}\n2. ${model.weaknesses.length > 1 ? model.weaknesses[1] : ""}`
        })
        setOptimizationInputs(inputs)

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
  }, [id])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleReEvaluate = async (modelIndex) => {
    if (!optimizationInputs[modelIndex]?.trim()) {
      message.warning("请输入优化提示信息")
      return
    }

    try {
      setReevaluating(true)
      const updatedEvaluation = await evaluationService.reevaluate(evaluation.id, optimizationInputs[modelIndex])
      setEvaluation(updatedEvaluation)
      message.success("重新评估完成")

      // 评估完成后折叠优化区域
      setExpandedModelIds(expandedModelIds.filter((id) => id !== modelIndex))
    } catch (err) {
      console.error("重新评估失败:", err)
      message.error("重新评估失败，请重试")
    } finally {
      setReevaluating(false)
    }
  }

  const handleGenerateReport = () => {
    // 模拟生成报告
    message.success("报告生成中，请稍候...")
  }

  const handleShare = () => {
    // 模拟分享功能
    message.success("分享链接已复制到剪贴板")
  }

  const toggleOptimizationArea = (modelIndex) => {
    if (expandedModelIds.includes(modelIndex)) {
      setExpandedModelIds(expandedModelIds.filter((id) => id !== modelIndex))
    } else {
      setExpandedModelIds([...expandedModelIds, modelIndex])
    }
  }

  const handleOptimizationInputChange = (modelIndex, value) => {
    setOptimizationInputs({
      ...optimizationInputs,
      [modelIndex]: value,
    })
  }

  if (loading) {
    return (
      <div className={`evaluation-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="loading-container">
          <Spin size="large" />
          <div className="loading-text">正在进行AI安全性测评，请稍候...</div>
        </div>
      </div>
    )
  }

  if (error || !evaluation) {
    return (
      <div className={`evaluation-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
        <div className="error-message">{error || "评估数据不存在"}</div>
        <Button type="primary" onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
          返回
        </Button>
      </div>
    )
  }

  // 获取置信度对应的状态颜色
  const getTrustworthinessColor = (value) => {
    if (value >= 90) return "#3ac0a0"
    if (value >= 80) return "#006ffd"
    return "#ff7a45"
  }

  return (
    <div className={`evaluation-page ${isChatOpen ? "chat-open" : "chat-closed"}`}>
      {/* 页面头部 - 修改为space-between布局 */}
      <div className="evaluation-header">
        <div className="header-left">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="back-button"
            size="large"
          />
          <div className="evaluation-title-section">
            <Title level={3} className="evaluation-title">
              AI玩具安全性测评
            </Title>
            <div className="evaluation-meta">
              <Text className="evaluation-id">测评ID: {evaluation.id}</Text>
              <Text className="evaluation-time">创建时间: {evaluation.createdAt}</Text>
            </div>
          </div>
        </div>
        <div className="header-right">
          <Button icon={<DownloadOutlined />} onClick={handleGenerateReport} type="primary" ghost>
            生成报告
          </Button>
          <Button icon={<ShareAltOutlined />} onClick={handleShare}>
            分享
          </Button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="evaluation-progress-section">
        <div className="progress-label">测评进度</div>
        <Progress
          percent={evaluation.progress}
          status="active"
          strokeColor={{
            "0%": "#006ffd",
            "100%": "#3ac0a0",
          }}
          trailColor="#e8e9f1"
          className="evaluation-progress"
        />
        <div className="progress-value">{evaluation.progress}%</div>
      </div>

      {/* 测评结果 */}
      <div className="evaluation-content">
        <div className="section-header">
          <ThunderboltOutlined className="section-icon" />
          <span className="section-title">测评结果</span>
        </div>

        <div className="model-results">
          {evaluation.models.map((model, index) => (
            <div key={index} className="model-result-wrapper">
              {/* 模型评估结果卡片 */}
              <Card className="model-result-card" bordered={false}>
                <div className="model-result-header">
                  <div className="model-name-section">
                    <Avatar
                      size={48}
                      style={{
                        backgroundColor: getTrustworthinessColor(model.trustworthiness),
                        boxShadow: `0 2px 8px ${getTrustworthinessColor(model.trustworthiness)}40`,
                      }}
                    >
                      {model.name.charAt(0)}
                    </Avatar>
                    <div className="model-info">
                      <div className="model-name">{model.name}</div>
                      <div className="model-score">总体评分: {model.trustworthiness / 10}/10</div>
                    </div>
                  </div>
                  <div className="model-trustworthiness">
                    <Badge.Ribbon
                      text={`置信度: ${model.trustworthiness}%`}
                      color={getTrustworthinessColor(model.trustworthiness)}
                    >
                      <div className="trustworthiness-placeholder"></div>
                    </Badge.Ribbon>
                  </div>
                </div>

                <Paragraph className="model-description">{model.description}</Paragraph>

                <Row gutter={24} className="model-evaluation-details">
                  <Col xs={24} md={12}>
                    <div className="model-strengths">
                      <div className="strengths-header">
                        <CheckCircleOutlined className="strengths-icon" /> 优势
                      </div>
                      <ul className="strengths-list">
                        {model.strengths.map((strength, i) => (
                          <li key={i} className="strength-item">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="model-weaknesses">
                      <div className="weaknesses-header">
                        <CloseCircleOutlined className="weaknesses-icon" /> 不足
                      </div>
                      <ul className="weaknesses-list">
                        {model.weaknesses.map((weakness, i) => (
                          <li key={i} className="weakness-item">
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>

                <div className="model-actions">
                  <div className="action-buttons">
                    <Button className="detail-button">详细分析</Button>
                    <Button type="primary" className="optimize-button" onClick={() => toggleOptimizationArea(index)}>
                      {expandedModelIds.includes(index) ? "收起优化" : "优化此结果"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* 优化区域 - 作为子树展开 */}
              {expandedModelIds.includes(index) && (
                <div className="optimization-area">
                  {/* 优化输入区域 */}
                  <Card className="optimization-section" bordered={false}>
                    <div className="section-title">
                      <RocketOutlined className="section-icon" />
                      <span>添加优化提示</span>
                    </div>
                    <Divider className="section-divider" />
                    <div className="optimization-description">
                      提供更多信息以优化测评结果。您可以添加产品的详细信息、安全认证文档、用户测试反馈等内容。
                    </div>

                    <TextArea
                      className="optimization-input"
                      rows={6}
                      value={optimizationInputs[index]}
                      onChange={(e) => handleOptimizationInputChange(index, e.target.value)}
                      placeholder="请输入更多关于产品的信息，或者指定需要重点关注的测评方向..."
                    />

                    <div className="optimization-actions">
                      <Button
                        type="primary"
                        icon={<SyncOutlined />}
                        className="re-evaluate-button"
                        onClick={() => handleReEvaluate(index)}
                        loading={reevaluating}
                        size="large"
                      >
                        重新测评
                      </Button>
                    </div>
                  </Card>

                  {/* 优化历史 */}
                  <Card className="optimization-history-section" bordered={false}>
                    <div className="section-title">
                      <HistoryOutlined className="section-icon" />
                      <span>优化历史</span>
                    </div>
                    <Divider className="section-divider" />
                    <div className="history-description">查看之前的优化记录</div>

                    <div className="history-items">
                      {evaluation.optimizationHistory.map((item) => (
                        <Card key={item.id} className="history-item" bordered={false}>
                          <div className="history-item-title">优化 #{item.id}</div>
                          <div className="history-item-description">{item.description}</div>
                          <div className="history-item-result">{item.result}</div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EvaluationPage
