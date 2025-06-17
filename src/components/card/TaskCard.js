"use client"

import { useState, useMemo } from "react"
import { Avatar, Tag,  Button, message, Modal } from "antd"
import { useNavigate } from "react-router-dom"
import { FileTextOutlined, PlusOutlined, CheckCircleOutlined } from "@ant-design/icons"
import CreateTaskModal from "../modals/CreateTaskModal"
import taskService from "../../services/taskService"
import SceneSection from "../scene/SceneSection" 
import QASection from "../qa/QASection"
import TemplateSection from "../template/TemplateSection"
import LineChartSection from "./LineChartSection"
import RadarChartSection from "./RadarChartSection"

const TaskCard = ({ task, onTaskUpdate }) => {
  const navigate = useNavigate()
  const [showRadarChart, setShowRadarChart] = useState(false)

  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [taskStatus, setTaskStatus] = useState(task.status || "pending")
  
  // 添加控制三个模态框显示的状态
  const [isSceneModalVisible, setIsSceneModalVisible] = useState(false)
  const [isQAModalVisible, setIsQAModalVisible] = useState(false)
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false)

  // 组装作者
  const authorName = task.created_by || (task.author && task.author.name) || '';
  const authorAvatar = task.avatar || (task.author && task.author.avatar) || null;
  // 组装标签
  const tags = task.keywords || task.tags || [];
  // 组装来源
  const source = task.created_from || task.source || '';
  // 组装描述
  const description = task.response || task.description || '';
  // 组装标题
  const title = task.prompt || task.name || task.title || '';

  // 解析 step 得到 line/radar 数据
  // 折线图数据
  const line = useMemo(() => {
    if (!Array.isArray(task.step)) return [];
    const versionSet = new Set();
    task.step.forEach(step => {
      if (Array.isArray(step.score)) {
        step.score.forEach(score => {
          if (score.version && score.confidence !== undefined) {
            versionSet.add(score.version);
          }
        });
      }
    });
    const versions = Array.from(versionSet).sort();
    return versions.map(version => {
      const row = { version };
      task.step.forEach(step => {
        const agent = step.agent || step.name || 'Agent';
        const found = (step.score || []).find(s => s.version === version);
        row[agent] = found ? parseFloat(found.confidence) * 100 : null;
      });
      return row;
    });
  }, [task.step]);

  // 雷达图数据
  const radar = useMemo(() => {
    if (!Array.isArray(task.step) || task.step.length === 0) return [];
    const firstStep = task.step.find(s => Array.isArray(s.score) && s.score.length > 0 && s.score[0].dimension && s.score[0].dimension.length > 0);
    if (firstStep) {
      return firstStep.score[0].dimension.map((dim, idx) => ({
        name: dim.latitude || `维度${idx+1}`,
        value: Math.max(0.1, dim.weight)
      }));
    }
    return [];
  }, [task.step]);

  // 计算雷达图的最大值
  const radarMaxValue = useMemo(() => {
    if (!radar || radar.length === 0) return 100;
    let max = 0;
    radar.forEach(item => {
      Object.values(item).forEach(val => {
        if (typeof val === 'number' && val > max) max = val;
      });
    });
    return Math.ceil(max * 1.1) || 100;
  }, [radar]);

  const toggleRadarChart = () => {
    setShowRadarChart(!showRadarChart)
  }

 

  // 处理标题点击
  const handleTitleClick = () => {
    // 直接使用任务ID导航到详情页
    navigate(`/tasks/detail/${task.id}`, { state: { from: "tasks" } })
  }
  
  // 添加模态框控制函数
  const showSceneModal = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsSceneModalVisible(true);
  }
  
  const showQAModal = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsQAModalVisible(true);
  }
  
  const showTemplateModal = (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setIsTemplateModalVisible(true);
  }
  
  const handleModalClose = () => {
    setIsSceneModalVisible(false);
    setIsQAModalVisible(false);
    setIsTemplateModalVisible(false);
  }
  
  // 处理提交结果按钮点击
  const handleSubmitResult = async (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    try {
      setSubmitting(true);
      
      // 创建更新后的任务对象
      const updatedTask = {
        ...task,
        status: "completed"
      };
      
      // 调用API更新任务状态为completed
      await taskService.updateTask(task.id, updatedTask);
      
      // 更新本地状态
      setTaskStatus("completed");
      
      // 显示成功消息
      message.success("任务已成功完成！");
      
      // 如果父组件提供了onTaskUpdate回调，则调用它
      if (typeof onTaskUpdate === 'function') {
        onTaskUpdate(task.id, updatedTask);
      } else {
        // 否则，尝试通过CustomEvent触发列表刷新
        const refreshEvent = new CustomEvent('taskStatusUpdated', { 
          detail: { taskId: task.id, status: "completed" }
        });
        window.dispatchEvent(refreshEvent);
      }
    } catch (error) {
      console.error("提交结果失败:", error);
      message.error("提交结果失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsCreateTaskModalVisible(false)
  }

  return (
    <div className={`task-card`}>
      {/* Card title */}
      <div className="task-card-header">
        <h2 className="task-card-title" onClick={handleTitleClick}>
          {title}
        </h2>
        
        {/* 提交结果按钮 - 仅在任务状态为running时显示 */}
        { task.status === "running" && 
          (
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={handleSubmitResult}
            loading={submitting}
            style={{ marginLeft: 'auto', borderRadius: '10px' }}
          >
            提交结果
          </Button>
        )}
      </div>

      {/* Author info and tags */}
      <div className="task-card-meta">
        <div className="task-author-info">
          <Avatar size={32} src={authorAvatar} className="task-author-avatar">
            {authorName?.charAt(0)}
          </Avatar>
          <span className="task-assigned-text">
            Assigned by
          </span>
          <span className="task-author-name">{authorName}</span>
          <span className="task-from-text">from</span>
          <span className="task-source-name">{source}</span>
        </div>
        <div className="task-card-tags">
          {tags.map((tag, index) => (
            <Tag 
              key={index} 
              className="task-tag"
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <div className="task-card-divider"></div>

      {/* Card content - horizontal layout */}
      <div className="task-card-content">
        {/* Left section - task details */}
        <div className="task-card-left">
          <div className="task-details">
            <div className="task-detail-item">
              <span className="task-detail-label">状态：</span>
              <span className="task-detail-value">
                {(() => {
                  // 使用本地状态变量显示状态
                  const currentStatus = taskStatus || task.status || "pending";
                  
                  // 格式化状态显示
                  switch (currentStatus) {
                    case "pending":
                      return "待启动";
                    case "running":
                      return "进行中";
                    case "completed":
                      return "已完成";
                    case "pending_approval":
                      return "待审批";
                    default:
                      return currentStatus;
                  }
                })()}
              </span>
            </div>

            <div className="task-detail-item">
              <span className="task-detail-label">描述：</span>
              <span className="task-detail-value">
                {description || "暂无描述"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="task-actions">
            <div className="task-action-buttons">
              <div 
                className={`task-action-item ${task.scenario ? 'active' : 'add-item'}`}
                onClick={showSceneModal}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-action-icon">
                  {task.scenario ? <FileTextOutlined /> : <PlusOutlined />}
                </div>
                <div className="task-action-text">场景</div>
                {task.scenario && <button className="task-action-close" onClick={(e) => { e.stopPropagation(); }}>×</button>}
              </div>

              <div 
                className={`task-action-item ${(task.prompt && task.response_summary) ? 'active' : 'add-item'}`}
                onClick={showQAModal}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-action-icon">
                  {(task.prompt && task.response_summary) ? <FileTextOutlined /> : <PlusOutlined />}
                </div>
                <div className="task-action-text">添加QA</div>
                {(task.prompt && task.response_summary) && <button className="task-action-close" onClick={(e) => { e.stopPropagation(); }}>×</button>}
              </div>

              <div 
                className={`task-action-item ${task.step && task.step.length > 0 ? 'active' : 'add-item'}`}
                onClick={showTemplateModal}
                style={{ cursor: 'pointer' }}
              >
                <div className="task-action-icon">
                  {task.step && task.step.length > 0 ? <FileTextOutlined /> : <PlusOutlined />}
                </div>
                <div className="task-action-text">添模板</div>
                {task.step && task.step.length > 0 && <button className="task-action-close" onClick={(e) => { e.stopPropagation(); }}>×</button>}
              </div>
            </div>
            
            <div className="task-dimension-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  toggleRadarChart()
                }}
              >
                {showRadarChart ? "收起" : "查看维度"} {showRadarChart ? "←" : "→"}
              </a>
            </div>
          </div>
        </div>


        {showRadarChart && (
          <div className="task-radar-chart-container bg-white">
            <div className="task-chart-title">可信度得分</div>
            <div className="task-radar-chart">
              <RadarChartSection radarData={radar} maxValue={radarMaxValue}  />
            </div>
          </div>
        )}

        <div className="task-chart-container bg-white">
          <div className="task-chart-title">置信度爬升曲线</div>
          <div className="task-chart">
            <LineChartSection card={task}  />
          </div>  
          
        </div>

      </div>

      {/* 场景 Modal */}
      <Modal
        open={isSceneModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <SceneSection taskId={task.id} scenario={task.scenario} />
      </Modal>

      {/* QA Modal */}
      <Modal
        open={isQAModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <QASection taskId={task.id} prompt={task.prompt} response={task.response} />
      </Modal>

      {/* 模板 Modal */}
      <Modal
        open={isTemplateModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <TemplateSection taskId={task.id} steps={task.flow ? { flow: task.flow_config, ...task.step } : task.step} />
      </Modal>

      {/* Create Task Modal */}
      <CreateTaskModal visible={isCreateTaskModalVisible} onCancel={handleModalCancel} cardData={task} />
    </div>
  )
}

export default TaskCard
