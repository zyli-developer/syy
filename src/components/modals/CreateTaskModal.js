"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, message, Steps, DatePicker, Divider, Card, Avatar, Timeline } from "antd"
import { UserOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import taskService from "../../services/taskService"
import useStyles from "../../styles/components/modals/create-task-modal"
import dayjs from 'dayjs'
import ConfirmPage from "./CreateTaskModal/ConfirmPage"

const { Option } = Select
const { Step } = Steps
const { TextArea } = Input
const { Search } = Input

const CreateTaskModal = ({ visible, onCancel, cardData }) => {
  const { styles } = useStyles()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [confirmSection, setConfirmSection] = useState('basicInfo')
  const [showTargetDescription, setShowTargetDescription] = useState(false)
  
  // 判断是否是从卡片详情页或探索页打开
  const isFromCardDetail = cardData && !!cardData.id
  
  // 模拟用户数据
  const mockUsers = [
    { id: '1', name: 'Jackson', avatar: 'J' },
    { id: '2', name: 'Jackson', avatar: 'J' },
  ];
  
  const steps = [
    {
      title: '基本信息',
      content: 'first',
    },
    {
      title: 'QA',
      content: 'second',
    },
    {
      title: '权限分配',
      content: 'third',
    },
    {
      title: '确认创建',
      content: 'fourth',
    },
  ]

  // 初始化表单数据
  useEffect(() => {
    if (visible && cardData) {
      // 如果有cardData，则预填充表单
      form.setFieldsValue({
        title: cardData.title || "",
        description: `基于卡片"${cardData.title?.substring(0, 30)}${cardData.title?.length > 30 ? "..." : ""}"创建的任务`,
        priority: cardData.priority || "medium",
        testTarget: cardData.testTarget || "web_app_llm",
        brand: cardData.brand || "",
        model: cardData.model || "",
        version: cardData.version || "",
        paramCount: cardData.paramCount || "",
        recommendPrecision: cardData.recommendPrecision || "",
        // 设置问题描述和答案描述 - 正确映射字段
        questionDescription: cardData.questionDescription || cardData.prompt || cardData.qa?.question || "",
        answerDescription: cardData.answerDescription || cardData.response_summary || cardData.summary || cardData.qa?.answer || "",
      });
      
      // 如果测评对象是"other"，显示补充描述输入框
      if (cardData.testTarget === "other") {
        setShowTargetDescription(true);
      }
    }
  }, [visible, cardData, form]);
  
  // 禁用当前日期之前的所有日期
  const disabledDate = (current) => {
    // 禁用今天之前的日期
    return current && current < dayjs().startOf('day')
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      // 1. 从data.js文件中获取explorationCardsData数据
      let originalCardData = null;
      
      try {
        // 导入explorationCardsData数据
        const { explorationCardsData } = require("../../mocks/data");
        console.log("加载explorationCardsData成功，共有", explorationCardsData.length, "条数据");
        
        // 根据当前cardData.id从explorationCardsData查找对应的完整数据
        if (cardData && cardData.id) {
          originalCardData = explorationCardsData.find(item => item.id === cardData.id);
          if (originalCardData) {
            console.log("成功从explorationCardsData找到ID为", cardData.id, "的原始数据");
          } else {
            console.log("未在explorationCardsData中找到ID为", cardData.id, "的数据");
          }
        }
      } catch (error) {
        console.error("加载或查找explorationCardsData数据出错:", error);
      }
      
      // 2. 验证表单字段并获取表单数据
      const values = await form.validateFields()
      console.log("表单提交的所有值:", values)
      
      // 3. 使用找到的原始数据或现有cardData作为基础数据
      const baseCardData = originalCardData || cardData || {};
      // 构建任务数据，确保完全匹配explorationCardsData的数据结构
      const taskData = {
        // 基本表单字段
        ...values,
        
        // 基本标识信息
        id: `task_${Date.now()}`,
        createdAt: new Date().toISOString(),
        created_at: { seconds: Math.floor(Date.now() / 1000) },
        status: "pending",
        sourceCardId: baseCardData.id || null,
        
        // 基本任务内容
        title: values.title || (baseCardData.title || "新建任务"),
        prompt: values.questionDescription || baseCardData.prompt || "",
        response_summary: values.answerDescription || baseCardData.response_summary || "",
        summary: values.description || baseCardData.summary || "",
        description: values.description || baseCardData.description || "",
        
        // 创建者和标签信息
        author: baseCardData.author ? JSON.parse(JSON.stringify(baseCardData.author)) : null,
        created_by: baseCardData.author?.name || baseCardData.created_by || "当前用户",
        created_from: baseCardData.source || baseCardData.created_from || "用户创建",
        source: baseCardData.source || baseCardData.created_from || "用户创建",
        tags: baseCardData.tags ? [...baseCardData.tags] : [],
        
        // 任务信息字段
        priority: values.priority || baseCardData.priority || "中",
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : (baseCardData.deadline || ""),
        testTarget: values.testTarget || baseCardData.testTarget || "",
        brand: values.brand || baseCardData.brand || "",
        model: values.model || baseCardData.model || "",
        version: values.version || baseCardData.version || "",
        paramCount: values.paramCount || baseCardData.paramCount || "",
        recommendPrecision: values.recommendPrecision || baseCardData.recommendPrecision || "",
        
        // 评分信息
        credibility: baseCardData.credibility || 85.0,
        credibilityChange: baseCardData.credibilityChange || "+0.0%",
        score: baseCardData.score || 8.5,
        scoreChange: baseCardData.scoreChange || "+0.0%",
        
        // QA数据
        qa: {
          question: values.questionDescription || baseCardData.prompt,
          answer: values.answerDescription || baseCardData.response_summary
        },
        
        // 权限分配数据
        permissions: {
          sceneEditors: values.sceneEditors || [],
          templateEditors: values.templateEditors || [],
          viewpointEditors: values.viewpointEditors || []
        },
        
        // 完整复制来自baseCardData的所有关键对象
        // 步骤数据 - 强制确保深拷贝完整数组
        step: (() => {
          // 如果baseCardData存在且有step数据
          if (baseCardData && baseCardData.step) {
            const stepData = Array.isArray(baseCardData.step) ? 
              baseCardData.step : [baseCardData.step]; // 确保是数组格式
            
            // 深拷贝所有step数据
            return JSON.parse(JSON.stringify(stepData));
          }
          // 如果没有数据，返回一个默认结构的空数组
          return [];
        })(),
        
        // 注释数据 - 强制确保四个分类的数据完整复制
        annotation: (() => {
          if (baseCardData && baseCardData.annotation) {
            return {
              result: Array.isArray(baseCardData.annotation.result) ? JSON.parse(JSON.stringify(baseCardData.annotation.result)) : [],
              qa: Array.isArray(baseCardData.annotation.qa) ? JSON.parse(JSON.stringify(baseCardData.annotation.qa)) : [],
              scenario: Array.isArray(baseCardData.annotation.scenario) ? JSON.parse(JSON.stringify(baseCardData.annotation.scenario)) : [],
              flow: Array.isArray(baseCardData.annotation.flow) ? JSON.parse(JSON.stringify(baseCardData.annotation.flow)) : []
            };
          }
          return { result: [], qa: [], scenario: [], flow: [] };
        })(),
        
        // 场景数据 - 强制确保node和edge数组完整复制
        scenario: (() => {
          // 如果baseCardData存在且有scenario数据
          if (baseCardData && baseCardData.scenario) {
            // 确保node和edge数组都存在，即使为空也要有数组
            const scenarioData = {
              node: Array.isArray(baseCardData.scenario.node) ? 
                JSON.parse(JSON.stringify(baseCardData.scenario.node)) : [],
              edge: Array.isArray(baseCardData.scenario.edge) ? 
                JSON.parse(JSON.stringify(baseCardData.scenario.edge)) : []
            };
            return scenarioData;
          }
          // 如果没有数据，返回一个默认结构的空对象
          return {
            node: [],
            edge: []
          };
        })(),
        
        // 模板数据 - 强制确保nodes和edges数组完整复制
        templateData: (() => {
          // 如果baseCardData存在且有templateData数据
          if (baseCardData && baseCardData.templateData) {
            // 确保nodes和edges数组都存在，即使为空也要有数组
            const templateDataCopy = {
              nodes: Array.isArray(baseCardData.templateData.nodes) ? 
                JSON.parse(JSON.stringify(baseCardData.templateData.nodes)) : [],
              edges: Array.isArray(baseCardData.templateData.edges) ? 
                JSON.parse(JSON.stringify(baseCardData.templateData.edges)) : []
            };
            return templateDataCopy;
          }
          // 如果没有数据，返回一个默认结构的空对象
          return {
            nodes: [],
            edges: []
          };
        })(),
        
        // 图表数据
        chartData: baseCardData.chartData ? JSON.parse(JSON.stringify(baseCardData.chartData)) : {
          radar: [
            { name: "维度1", weight: 0.80, value: 80 },
            { name: "维度2", weight: 0.85, value: 85 },
            { name: "维度3", weight: 0.75, value: 75 }
          ],
          line: [
            { month: "11", value: 85 }
          ]
        },
        
        // agents配置
        agents: baseCardData.agents ? JSON.parse(JSON.stringify(baseCardData.agents)) : {
          overall: true,
          agent1: true,
          agent2: false
        },
        
        // 其他特殊字段
        // 处理优化数据
        optimizationData: baseCardData.optimizationData ? JSON.parse(JSON.stringify(baseCardData.optimizationData)) : null,
        
        // 记录修改信息
        lastModifiedBy: {
          name: "当前用户",
          avatar: "U"
        },
        modifiedTime: {
          hour: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString()
        }
      }
      
      // 用于调试 - 打印完整结构
      console.log("提交的完整任务数据:", {
        source: baseCardData ? "explorationCardsData" : "cardData参数",
        sourceId: baseCardData.id,
        taskData: taskData
      });

      // 调用保存任务接口
      const result = await taskService.createTask(taskData)

      // 为mock数据生成一个新的纯数字ID
      const generateNumericId = () => {
        // 生成一个大于当前最大ID的数字
        const { taskCardsData } = require("../../mocks/data")
        const maxId = Math.max(...taskCardsData.map(task => parseInt(task.id) || 0))
        return String(maxId + 1)
      }
      
      // 将新任务添加到mock数据中并返回新ID
      const addTaskToMockData = (sourceData) => {
        try {
          const { taskCardsData } = require("../../mocks/data")
          const newId = generateNumericId()
          
          // 创建新任务对象，完全复制explorationCardsData的数据结构
          const newTask = {
            // 基本标识信息
            id: newId,
            
            // 基本任务内容 (表单数据优先，sourceData其次)
            prompt: values.questionDescription || sourceData.prompt || "",
            response_summary: values.answerDescription || sourceData.response_summary || "",
            created_by: sourceData.author?.name || sourceData.created_by || "当前用户",
            created_from: sourceData.source || sourceData.created_from || "用户创建",
            created_at: { seconds: Math.floor(Date.now() / 1000) },
            
            // 基本任务信息
            status: "running",
            title: values.title || sourceData.title || "新建任务",
            summary: values.description || sourceData.summary || "",
            
            // 作者和来源信息
            author: sourceData.author ? JSON.parse(JSON.stringify(sourceData.author)) : {
              id: "1",
              name: "当前用户",
              avatar: null
            },
            source: sourceData.source || sourceData.created_from || "用户创建",
            
            // 标签信息
            tags: sourceData.tags ? [...sourceData.tags] : [],
            
            // 详细设置信息
            priority: values.priority || sourceData.priority || "中",
            deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : (sourceData.deadline || ""),
            testTarget: values.testTarget || sourceData.testTarget || "",
            brand: values.brand || sourceData.brand || "",
            model: values.model || sourceData.model || "",
            version: values.version || sourceData.version || "",
            paramCount: values.paramCount || sourceData.paramCount || "",
            recommendPrecision: values.recommendPrecision || sourceData.recommendPrecision || "",
            
            // 评分信息
            credibility: sourceData.credibility || 85.0,
            credibilityChange: sourceData.credibilityChange || "+0.0%",
            score: sourceData.score || 8.5,
            scoreChange: sourceData.scoreChange || "+0.0%",
            
            // 步骤数据 - 强制确保深拷贝完整数组
            step: (() => {
              // 如果sourceData存在且有step数据
              if (sourceData && sourceData.step) {
                const stepData = Array.isArray(sourceData.step) ? 
                  sourceData.step : [sourceData.step]; // 确保是数组格式
                
                // 深拷贝所有step数据
                return JSON.parse(JSON.stringify(stepData));
              }
              // 如果没有数据，返回一个默认结构的样例step数据
              return [
              {
                agent: "GPT-4",
                score: [
                  {
                    version: "1.0",
                    confidence: "0.85",
                    score: "0.85",
                    consumed_points: 90,
                    description: "新创建的任务，等待评估",
                    dimension: [
                      { latitude: "维度1", weight: 0.80 },
                      { latitude: "维度2", weight: 0.85 }
                    ],
                    updated_at: { seconds: Math.floor(Date.now() / 1000) }
                  }
                ],
                reason: "初始创建的任务"
              }
              ];
            })(),
            
            // 注释数据 - 强制确保四个分类的数据完整复制
            annotation: (() => {
              // 如果sourceData存在且有annotation数据
              if (sourceData && sourceData.annotation) {
                // 确保所有分类都存在，即使为空也要有数组
                const annotationData = {
                  result: Array.isArray(sourceData.annotation.result) ? 
                    JSON.parse(JSON.stringify(sourceData.annotation.result)) : [],
                  qa: Array.isArray(sourceData.annotation.qa) ? 
                    JSON.parse(JSON.stringify(sourceData.annotation.qa)) : [],
                  scenario: Array.isArray(sourceData.annotation.scenario) ? 
                    JSON.parse(JSON.stringify(sourceData.annotation.scenario)) : [],
                  flow: Array.isArray(sourceData.annotation.flow) ? 
                    JSON.parse(JSON.stringify(sourceData.annotation.flow)) : []
                };
                return annotationData;
              }
              // 如果没有数据，返回一个默认结构的空对象
              return {
                result: [],
                qa: [],
                scenario: [],
                flow: []
              };
            })(),
            
            // 场景数据 - 强制确保node和edge数组完整复制
            scenario: (() => {
              // 如果sourceData存在且有scenario数据
              if (sourceData && sourceData.scenario) {
                // 确保node和edge数组都存在，即使为空也要有数组
                const scenarioData = {
                  node: Array.isArray(sourceData.scenario.node) ? 
                    JSON.parse(JSON.stringify(sourceData.scenario.node)) : [],
                  edge: Array.isArray(sourceData.scenario.edge) ? 
                    JSON.parse(JSON.stringify(sourceData.scenario.edge)) : []
                };
                return scenarioData;
              }
              // 如果没有数据，返回一个默认结构的空对象
              return {
                node: [],
                edge: []
              };
            })(),
            
            // 模板数据 - 强制确保nodes和edges数组完整复制
            templateData: (() => {
              // 如果sourceData存在且有templateData数据
              if (sourceData && sourceData.templateData) {
                // 确保nodes和edges数组都存在，即使为空也要有数组
                const templateDataCopy = {
                  nodes: Array.isArray(sourceData.templateData.nodes) ? 
                    JSON.parse(JSON.stringify(sourceData.templateData.nodes)) : [],
                  edges: Array.isArray(sourceData.templateData.edges) ? 
                    JSON.parse(JSON.stringify(sourceData.templateData.edges)) : []
                };
                return templateDataCopy;
              }
              // 如果没有数据，返回一个默认结构的空对象
              return {
                nodes: [],
                edges: []
              };
            })(),
            
            // 图表数据 - 确保radar和line数组完整
            chartData: sourceData.chartData ? JSON.parse(JSON.stringify(sourceData.chartData)) : {
              radar: [
                { name: "维度1", weight: 0.80, value: 80 },
                { name: "维度2", weight: 0.85, value: 85 },
                { name: "维度3", weight: 0.75, value: 75 }
              ],
              line: [
                { month: "11", value: 85 }
              ]
            },
            
            // agents配置
            agents: sourceData.agents ? JSON.parse(JSON.stringify(sourceData.agents)) : {
              overall: true,
              agent1: true,
              agent2: false
            },
            
            // 附加属性 - 记录修改相关信息
            lastModifiedBy: {
              name: "当前用户",
              avatar: "U"
            },
            modifiedTime: {
              hour: new Date().toLocaleTimeString(),
              date: new Date().toLocaleDateString()
            },
            
            // 记录原卡片ID
            sourceCardId: cardData?.id || null
          }
          
          // 将新任务添加到taskCardsData
          taskCardsData.unshift(newTask)
          
          // 将完整的新任务对象保存到localStorage，确保页面刷新后数据不丢失
          localStorage.setItem(`task_${newId}`, JSON.stringify(newTask))
          
          // 设置标记，通知AppSidebar激活任务菜单
          localStorage.setItem('activate_tasks_menu', 'true')
          
          console.log("新任务已添加到mock数据", newTask)
          return newId
        } catch (error) {
          console.error("添加任务到mock数据失败", error)
          return null
        }
      }
      
      // 修改完整数据源引用，确保addTaskToMockData也使用完整的原始数据
      const newId = addTaskToMockData(baseCardData)

      message.success("任务创建成功")
      form.resetFields()
      onCancel()
      
      // 使用navigate跳转到任务列表页面，并传递需要刷新列表的信息
      // 设置refreshList和newTaskId状态，使TaskPage能够加载新创建的任务
      navigate('/tasks', {
        state: {
          refreshList: true,
          newTaskId: newId,
          activateTasksMenu: true
        }
      });
    } catch (error) {
      console.error("创建任务失败:", error)
      message.error("创建任务失败，请重试")
    } finally {
      setLoading(false)
    }
  }
  
  const handleNext = async () => {
    try {
      // 验证当前步骤的表单字段
      // 不限制验证字段，获取所有表单值
      await form.validateFields();
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error("表单验证失败:", error)
    }
  }
  
  const handleBack = () => {
    if (currentStep === 0) {
      onCancel()
    } else {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSaveAndNext = async () => {
    try {
      // 验证当前步骤的表单字段
      // 不限制验证字段，获取所有表单值
      await form.validateFields();
      
      // 获取完整表单数据
      const formData = form.getFieldsValue();
      console.log("当前表单数据:", formData);
      
      // 这里可以添加保存逻辑
      message.success("保存成功");
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };
  
  // 根据当前步骤获取需要验证的字段
  const getStepFieldNames = (step) => {
    switch (step) {
      case 0:
        // 基本信息步骤 - 包含所有可能的基本字段
        return [
          'title', 'description', 'priority', 'testTarget', 'targetDescription',
          'deadline', 'brand', 'model', 'version', 'paramCount', 'recommendPrecision'
        ];
      case 1:
        // QA步骤 - 问题和答案描述
        return ['questionDescription', 'answerDescription'];
      case 2:
        // 权限分配步骤 - 编辑权限设置
        return ['sceneEditors', 'templateEditors', 'viewpointEditors'];
      case 3:
        // 确认步骤 - 可能需要的额外字段
        return ['confirmNotes', 'tags'];
      default:
        return [];
    }
  };
  
  // 用户搜索处理
  const handleUserSearch = (value, type) => {
    // 这里可以实现搜索逻辑
    console.log(`搜索${type}用户:`, value);
  };
  
  // 渲染确认发布页面的基本信息内容
  const renderConfirmBasicInfo = () => {
    const formValues = form.getFieldsValue();
    
    return (
      <div className={styles.confirmSection}>
    
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>任务名称</div>
          <div className={styles.confirmInfoValue}>{formValues.title}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>创建人</div>
          <div className={styles.confirmInfoValue}>
            <Avatar size={24} style={{ marginRight: '8px' }}>M</Avatar>
            Mike
          </div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>描述</div>
          <div className={styles.confirmInfoValue}>{formValues.description}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>优先级</div>
          <div className={styles.confirmInfoValue}>
            {formValues.priority === 'high' ? '高' : 
             formValues.priority === 'medium' ? '中' : 
             formValues.priority === 'low' ? '低' : ''}
          </div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>完成期限</div>
          <div className={styles.confirmInfoValue}>
            {formValues.deadline ? dayjs(formValues.deadline).format('YYYY-MM-DD') : '未设置'}
          </div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>测评对象</div>
          <div className={styles.confirmInfoValue}>{formValues.testTarget}</div>
        </div>
        
        {formValues.testTarget === 'other' && (
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>补充描述</div>
            <div className={styles.confirmInfoValue}>{formValues.targetDescription || '无'}</div>
          </div>
        )}
        
        <div className={styles.confirmInfoSection}>
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>品牌</div>
            <div className={styles.confirmInfoValue}>{formValues.brand || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>型号</div>
            <div className={styles.confirmInfoValue}>{formValues.model || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>版本</div>
            <div className={styles.confirmInfoValue}>{formValues.version || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>参数量</div>
            <div className={styles.confirmInfoValue}>{formValues.paramCount || '无'}</div>
          </div>
          
          <div className={styles.confirmInfoRow}>
            <div className={styles.confirmInfoLabel}>推理精度</div>
            <div className={styles.confirmInfoValue}>{formValues.recommendPrecision || '无'}</div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染确认发布页面的QA内容
  const renderConfirmQA = () => {
    const formValues = form.getFieldsValue();
    
    return (
      <div className={styles.confirmSection}>
        <div className={styles.confirmSectionTitle}>编辑QA</div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>问题描述</div>
          <div className={styles.confirmInfoValue}>{formValues.questionDescription}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>答案描述</div>
          <div className={styles.confirmInfoValue}>{formValues.answerDescription}</div>
        </div>
      </div>
    );
  };
  
  // 渲染确认发布页面的权限分配内容
  const renderConfirmPermissions = () => {
    const formValues = form.getFieldsValue();
    
    return (
      <div className={styles.confirmSection}>
        <div className={styles.confirmSectionTitle}>权限分配</div>
        
        <div className={styles.confirmPermissionCard}>
          <div className={styles.confirmPermissionTitle}>
            <EditOutlined /> 编辑场景
          </div>
          <div className={styles.confirmPermissionDesc}>
            以下用户可以：编辑场景和针对场景的观点
          </div>
          <div className={styles.confirmUserList}>
            {mockUsers.map(user => (
              <div key={`confirm-scene-${user.id}`} className={styles.userItem}>
                <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.confirmPermissionCard}>
          <div className={styles.confirmPermissionTitle}>
            <EditOutlined /> 编辑模板
          </div>
          <div className={styles.confirmPermissionDesc}>
            以下用户可以：编辑模板和针对模板的观点
          </div>
          <div className={styles.confirmUserList}>
            {mockUsers.map(user => (
              <div key={`confirm-template-${user.id}`} className={styles.userItem}>
                <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.confirmPermissionCard}>
          <div className={styles.confirmPermissionTitle}>
            <EditOutlined /> 编辑观点
          </div>
          <div className={styles.confirmPermissionDesc}>
            以下用户可以：编辑针对该任务的全部观点
          </div>
          <div className={styles.confirmUserList}>
            {mockUsers.map(user => (
              <div key={`confirm-viewpoint-${user.id}`} className={styles.userItem}>
                <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // 根据选择的确认部分渲染对应的内容
  const renderConfirmContent = () => {
    switch (confirmSection) {
      case 'basicInfo':
        return renderConfirmBasicInfo();
      case 'qa':
        return renderConfirmQA();
      case 'permissions':
        return renderConfirmPermissions();
      default:
        return renderConfirmBasicInfo();
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
 
            
            <Form.Item 
              name="title" 
              label="名称" 
              rules={[
                { required: true, message: "请输入任务名称" },
              ]}
            >
              <Input 
                placeholder="请输入任务名称" 
                disabled={isFromCardDetail} 
              />
            </Form.Item>

            <Form.Item 
              name="description" 
              label="描述" 
              rules={[{ required: true, message: "请输入任务描述" }]}
            >
              <TextArea 
                rows={6} 
                placeholder="请输入任务描述" 
                className={styles.textArea} 
                disabled={isFromCardDetail} 
              />
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item 
                name="priority" 
                label="优先级" 
                rules={[{ required: true, message: "请选择优先级" }]}
                className={styles.formRowItem}
              >
                <Select 
                  placeholder="Please select" 
                  disabled={isFromCardDetail}
                >
                <Option value="high">高</Option>
                <Option value="medium">中</Option>
                <Option value="low">低</Option>
              </Select>
            </Form.Item>

              <Form.Item 
                name="deadline" 
                label="完成期限" 
                className={styles.formRowItem}
              >
              <DatePicker 
                placeholder="Select date" 
                style={{ width: '100%' }} 
                disabledDate={disabledDate}
          
              />
            </Form.Item>
            
              <Form.Item 
                name="testTarget" 
                label="测评对象" 
                rules={[{ required: true, message: "请选择测评对象" }]}
                className={styles.formRowItem}
              >
                <Select 
                  placeholder="Please select" 
                  onChange={(value) => {
                setShowTargetDescription(value === 'other');
                  }}
                  disabled={isFromCardDetail}
                >
                <Option value="web_app_llm">大语言模型（网页、app端）</Option>
                <Option value="local_llm">大语言模型（本地部署）</Option>
                <Option value="smart_cockpit">智能座舱</Option>
                <Option value="smart_watch">智能手表</Option>
                <Option value="smart_toy">智能玩具</Option>
                <Option value="smart_furniture">智能家具</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
            </div>
            
            {showTargetDescription && (
              <Form.Item
                name="targetDescription"
                label="补充描述"
                rules={[{ required: true, message: "请输入补充描述" }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="请补充描述" 
                  className={styles.textArea} 
                  disabled={isFromCardDetail}
                />
              </Form.Item>
            )}
            
            <div className={styles.infoText}>选填但很重要：填写越详细，测试可信度越高。</div>
            
            <div className={styles.formRow}>
              <Form.Item 
                name="brand" 
                label="品牌" 
                className={styles.formRowItem}
              >
                <Input 
                  placeholder="请输入品牌" 
            
                />
              </Form.Item>
              
              <Form.Item 
                name="model" 
                label="型号" 
                className={styles.formRowItem}
              >
                <Input 
                  placeholder="请输入型号" 
               
                />
              </Form.Item>
              
              <Form.Item 
                name="version" 
                label="版本" 
                className={styles.formRowItem}
              >
                <Input 
                  placeholder="请输入版本" 
              
                />
              </Form.Item>
            </div>
            
            <div className={styles.formRow}>
              <Form.Item 
                name="paramCount" 
                label="参数量" 
                className={styles.formRowItem}
              >
                <Input 
                  placeholder="请输入参数量" 
             
                />
              </Form.Item>
              
              <Form.Item 
                name="recommendPrecision" 
                label="推理精度" 
                className={styles.formRowItem}
              >
                <Input 
                  placeholder="请输入推理精度" 
            
                />
              </Form.Item>
            </div>
          </>
        )
      case 1:
        return (
          <>            
            <div className={styles.qaContainer}>
              <Form.Item 
                name="questionDescription" 
                label="问题描述" 
                rules={[{ required: true, message: "请输入问题描述" }]}
              >
                <TextArea 
                  rows={10} 
                  placeholder="请输入问题描述" 
                  className={styles.qaTextarea} 
                  disabled={isFromCardDetail}
                />
              </Form.Item>
              
              <Form.Item 
                name="answerDescription" 
                label="答案描述" 
                rules={[{ required: true, message: "请输入答案描述" }]}
              >
                <TextArea 
                  rows={10} 
                  placeholder="请输入答案描述" 
                  className={styles.qaTextarea} 
                  disabled={isFromCardDetail}
                />
              </Form.Item>
            </div>
          </>
        )
      case 2:
        return (
          <>

            
            <div className={styles.permissionText}>
              针对以下三项工作，分别选择有操作权限的用户：
            </div>
            
            <div className={styles.permissionCards}>
              <Card className={styles.permissionCard}>
                <div className={styles.permissionCardTitle}>
                  <EditOutlined /> 编辑场景
                </div>
                <div className={styles.permissionCardDesc}>
                  以下 2 位用户可以：编辑场景和针对场景的观点
                </div>
                
                <Form.Item name="sceneEditors" className={styles.userSelectForm}>
                  <div className={styles.userSearchContainer}>
                    <Search 
                      placeholder="搜索" 
                      onSearch={(value) => handleUserSearch(value, 'scene')}
                      className={styles.userSearch}
                      prefix={<UserOutlined />}
                      disabled={isFromCardDetail}
                    />
                  </div>
                  
                  <div className={styles.userList}>
                    {mockUsers.map(user => (
                      <div key={`scene-${user.id}`} className={styles.userItem}>
                        <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Card>
              
              <Card className={styles.permissionCard}>
                <div className={styles.permissionCardTitle}>
                  <EditOutlined /> 编辑模板
                </div>
                <div className={styles.permissionCardDesc}>
                  以下 2 位用户可以：编辑模板和针对模板的观点
                </div>
                
                <Form.Item name="templateEditors" className={styles.userSelectForm}>
                  <div className={styles.userSearchContainer}>
                    <Search 
                      placeholder="搜索" 
                      onSearch={(value) => handleUserSearch(value, 'template')}
                      className={styles.userSearch}
                      prefix={<UserOutlined />}
                      disabled={isFromCardDetail}
                    />
                  </div>
                  
                  <div className={styles.userList}>
                    {mockUsers.map(user => (
                      <div key={`template-${user.id}`} className={styles.userItem}>
                        <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Card>
              
              <Card className={styles.permissionCard}>
                <div className={styles.permissionCardTitle}>
                  <EditOutlined /> 编辑观点
                </div>
                <div className={styles.permissionCardDesc}>
                  以下 2 位用户可以：编辑针对该任务的全部观点
                </div>
                
                <Form.Item name="viewpointEditors" className={styles.userSelectForm}>
                  <div className={styles.userSearchContainer}>
                    <Search 
                      placeholder="搜索" 
                      onSearch={(value) => handleUserSearch(value, 'viewpoint')}
                      className={styles.userSearch}
                      prefix={<UserOutlined />}
                      disabled={isFromCardDetail}
                    />
                  </div>
                  
                  <div className={styles.userList}>
                    {mockUsers.map(user => (
                      <div key={`viewpoint-${user.id}`} className={styles.userItem}>
                        <Avatar className={styles.userAvatar}>{user.avatar}</Avatar>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Card>
            </div>
          </>
        );
      case 3:
        return (
          <ConfirmPage formData={form.getFieldsValue(true)} />
        )
      default:
        return null
    }
  }

  return (
    <Modal 
      title={null}
      open={visible} 
      onCancel={onCancel} 
      footer={null} 
      width="80vw"
      height="95vh"
      style={{ top: 20 }}
      bodyStyle={{ height: 'calc(95vh - 56px)', display: 'flex', flexDirection: 'column' }}
      destroyOnClose
      className={styles.modal}
    >
      <div className={styles.stepsContainer}>
        <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} />
      </div>
      
      <div className={styles.contentContainer}>
      <Form
        form={form}
        layout="vertical"
          className={styles.form}
        initialValues={{
          permission: "workspace",
            title: cardData?.title || "",
            description: cardData ? `基于卡片"${cardData?.title?.substring(0, 30)}${cardData?.title?.length > 30 ? "..." : ""}"创建的任务` : "",
            questionDescription: "",
            answerDescription: "",
            sceneEditors: [],
            templateEditors: [],
            viewpointEditors: [],
            targetDescriptionVisible: false,
            priority: "medium"
          }}
        >
          {renderContent()}
        </Form>
      </div>

      <div className={styles.footerButtons}>
        <Button onClick={handleBack}>
          {currentStep === 0 ? '返回' : '上一步'}
        </Button>
        <Button onClick={handleSubmit}>
              保存
            </Button>
        {currentStep === 3 ? (
          <Button type="primary" onClick={handleSubmit}>
            确认创建
          </Button>
        ) : (
          <Button type="primary" onClick={handleSaveAndNext}>
            保存并进入下一步
          </Button>
        )}
          </div>
    </Modal>
  )
}

export default CreateTaskModal
