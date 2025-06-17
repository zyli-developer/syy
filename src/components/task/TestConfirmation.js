import React, { useState,  useContext } from 'react';
import { Progress, Card, List, Typography, Space, Alert, Button, Timeline } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useStyles from '../../styles/components/task/TestConfirmation';
import { OptimizationContext } from '../../contexts/OptimizationContext';
import TaskOverview from './TaskOverview';
import QASection from '../qa/QASection';
import SceneSection from '../scene/SceneSection';
import TemplateSection from '../template/TemplateSection';

const { Title, Text } = Typography;

const TestConfirmation = ({ 
  isTesting, 
  testProgress, 
  task, 
  isTaskStarted,
  TimelineIcon,
  onPrevious,
  onStartTest,
  currentStep = 4,
  annotationColumns,
  annotationData,
  isOptimizationMode
}) => {
  const { styles } = useStyles();
  const { comments: optimizationComments } = useContext(OptimizationContext);
  
  // 左侧Timeline使用的状态，与步骤导航不同
  const [activeSection, setActiveSection] = useState('overview');
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [isAnnotationExpanded, setIsAnnotationExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  // 渲染测试进行中的UI
  const renderTestingContent = () => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        width: '100%',
        background: '#f5f5f5',
        padding: 0,
        margin: 0
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Progress 
            type="circle" 
            percent={testProgress}
            strokeColor="var(--color-primary)"
            trailColor="#f3f3f3"
            width={120}
            format={percent => (
              <span style={{ fontSize: '20px', fontWeight: 'normal', color: '#000' }}>
                {percent}%
              </span>
            )}
            strokeWidth={6}
          />
          <div style={{ 
            marginTop: '20px', 
            fontSize: '14px', 
      
          }}>
            测试进行中，请稍候...
          </div>
        </div>
      </div>
    );
  };

 

  // 合并所有注释数据，参考TaskOverview.js
  const mergedAnnotationData = React.useMemo(() => {
    if (!task) return Array.isArray(annotationData) ? annotationData : [];
    if (!task.annotation) return Array.isArray(annotationData) ? annotationData : [];
    const allAnnotations = [];
    Object.keys(task.annotation).forEach(key => {
      const categoryAnnotations = task.annotation[key];
      if (Array.isArray(categoryAnnotations)) {
        allAnnotations.push(...categoryAnnotations);
      }
    });
    return allAnnotations.length > 0 ? allAnnotations : (Array.isArray(annotationData) ? annotationData : []);
  }, [task, annotationData]);

  // 根据activeSection渲染不同的内容
  const renderSectionContent = () => {
    // 从task中获取注释数据
    const getCommentsFromTask = (section) => {
      // 优先用 props 传进来的 annotationData
      if (annotationData && typeof annotationData === 'object') {
        if (annotationData[section]) return annotationData[section];
      }
      // 兼容老逻辑
      if (task && task.annotation && task.annotation[section]) {
        return task.annotation[section];
      }
      return [];
      if (!task || !task.annotations) return [];
      // 根据不同的区域返回对应的注释
      switch(section) {
        case 'qa':
          return task.annotations.qa || [];
        case 'scene':
          return task.annotations.scenario || [];
        case 'flow':
          return task.annotations.flow || [];
        case 'result':
          return task.annotations.result || [];
        default:
          return [];
      }
    };
console.log("getCommentsFromTask",getCommentsFromTask)
    switch (activeSection) {
      case 'overview':
        return (
          <>
            {/* 复用TaskOverview的注释表格区域 */}
            <TaskOverview 
              task={task}
              annotationData={annotationData}
              isOptimizationMode={isOptimizationMode}
            />
          </>
        );
      case 'qa':
        return (
          <div className={styles.section}>
            <QASection 
              isEditable={false} 
              taskId={task?.id}
              prompt={task?.prompt} 
              response={task?.response}
              comments={getCommentsFromTask('qa')} // 从task数据中获取QA注释
            />
          </div>
        ) 
      case 'scene':
        return (
          <div className={styles.section}>
            <SceneSection 
              isEditable={false} 
              taskId={task?.id}
              scenario={task?.scenario}
              comments={getCommentsFromTask('scenario')} // 从task数据中获取场景注释
            />
          </div>
        ) 
      case 'flow':
        return (
          <div className={styles.section}>
            <TemplateSection 
              isEditable={false} 
              taskId={task?.id}
              card={task}
              
              comments={getCommentsFromTask('flow')} // 从task数据中获取模板注释
            />
          </div>
        ) 
   
    }
  };

  return (
    <div className={styles.container} style={{ width: "100%" }}>
      {isTesting ? (
        // 测试进行中时，显示进度条占据整个页面
        renderTestingContent()
      ) : (
        // 非测试状态时，显示常规任务概览布局
        <div className={styles.mainContent} style={{ width: "100%" }}>
          {/* 左侧导航菜单 */}
          <div className={styles.leftMenu}>
            {/* 任务概览标题 */}
            <div className={styles.taskOverviewTitle}>
              任务概览
            </div>

            <Timeline>
              {[
                { key: 'overview', label: '概览' },
                { key: 'qa', label: 'QA' },
                { key: 'scene', label: '场景' },
                { key: 'flow', label: '模板' }
              ].map((item) => (
                <Timeline.Item
                  key={item.key}
                  dot={
                    <div 
                      className={`${styles.timelineDot} ${activeSection === item.key ? styles.timelineDotActive : styles.timelineDotInactive}`}
                      onClick={() => setActiveSection(item.key)}
                    >
                      <TimelineIcon active={activeSection === item.key} />
                    </div>
                  }
                  className={styles.timelineItem}
                  color={activeSection === item.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
                  style={{ marginLeft: 0 }}
                >
                  <div
                    className={`${styles.timelineText} ${activeSection === item.key ? styles.timelineTextActive : styles.timelineTextInactive}`}
                    onClick={() => setActiveSection(item.key)}
                  >
                    {item.label}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>

          {/* 右侧内容区域 */}
          <div className={styles.rightContent} style={{ width: "calc(100% - 110px)" }}>
            <div style={{ flex: 1, width: "100%" }}>
              {renderSectionContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestConfirmation; 