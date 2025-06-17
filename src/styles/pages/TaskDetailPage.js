import { createStyles } from 'antd-style';

const useTaskDetailStyles = createStyles(({ css }) => {
  return {
    taskDetailPage: css`
      padding: 12px;
      transition: all 0.3s;
    `,
    chatOpen: css`
      margin-right: 320px;
    `,
    chatClosed: css`
      margin-right: 0;
    `,
    loadingContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60vh;
      flex-direction: column;
    `,
    errorMessage: css`
      text-align: center;
      margin: 20px 0;
      font-size: 16px;
      color: var(--color-error);
    `,
    hideTabsNav: css`
      display: none;
    `,
    taskDetailBreadcrumb: css`
      margin-bottom: 6px;
    `,
    breadcrumbArrow: css`
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    `,
    breadcrumbParent: css`
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    `,
    taskDetailTitleSection: css`
      margin-bottom: 12px;
    `,
    taskTitle: css`
      font-size: 18px;
      margin: 0 0 6px 0;
    `,
    taskCreatorSection: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    `,
    taskCreatorInfo: css`
      display: flex;
      align-items: center;
      gap: 6px;
    `,
    creatorText: css`
      font-size: 13px;
    `,
    creatorName: css`
      font-weight: 500;
    `,
    creatorSource: css`
      color: var(--color-primary);
    `,
    taskTags: css`
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    `,
    taskDimensionTag: css`
      margin: 0;
    `,
    taskActionsTop: css`
      display: flex;
      gap: 6px;
    `,
    // Task Bottom Section
    taskDetailBottomSection: css`
      margin-top: 12px;
      background: var(--color-bg-container);
      border-radius: 16px;
      max-height: calc(892px - 120px); // 减去上方区域的高度
      // overflow-y: auto;
    `,
    // Steps Navigation
    stepsNavigation: css`
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      height: 50px;
      align-items: center;
      border-radius: 16px 16px 0 0;
      position: sticky;
      top: 0;
      background: var(--color-bg-container);
      z-index: 10;
    `,
    step: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    `,
    currentStep: css`
      cursor: pointer;
    `,
    stepIcon: css`
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
    `,
    stepIconCurrent: css`
      border: 1px solid var(--color-primary);
      background: var(--color-primary);
      color: #fff;
    `,
    stepIconCompleted: css`
      border: 1px solid var(--color-primary);
      background: var(--color-primary-bg);
      color: var(--color-primary);
    `,
    stepIconIncomplete: css`
      border: 1px solid var(--color-text-tertiary);
      background: #fff;
      color: var(--color-text-tertiary);
    `,
    stepLabel: css`
      font-size: 11px;
      font-weight: 700;
    `,
    stepLabelCurrent: css`
      color: var(--color-primary);
    `,
    stepLabelCompleted: css`
      color: var(--color-primary);
    `,
    stepLabelIncomplete: css`
      color: var(--color-text-tertiary);
    `,
    // Score Section
    scoreSection: css`
      background: var(--color-primary-bg);
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 16px;
    `,
    scoreHeader: css`
      display: flex;
      align-items: center;
      cursor: pointer;
    `,
    scoreTitle: css`
      font-size: 13px;
      font-weight: 500;
    `,
    scoreIcon: css`
      margin-left: 4px;
      color: var(--color-text-tertiary);
    `,
    scoreContent: css`
      font-size: 13px;
      color: var(--color-text-tertiary);
      margin-top: 6px;
    `,
    scoreLink: css`
      color: var(--color-primary);
    `,
    // Task Info Section
    taskInfoSection: css`
      margin-bottom: 16px;
    `,
    infoRow: css`
      display: flex;
      margin-bottom: 10px;
    `,
    infoLabel: css`
      width: 70px;
      color: var(--color-text-tertiary);
      font-size: 13px;
    `,
    infoContent: css`
      flex: 1;
      font-size: 13px;
    `,
    // Annotation Section
    annotationSection: css`
      margin-bottom: 16px;
    `,
    annotationHeader: css`
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
    `,
    annotationTitle: css`
      font-size: 13px;
      font-weight: 500;
    `,
    annotationIcon: css`
      margin-left: 4px;
      color: var(--color-text-tertiary);
    `,
    annotationLoading: css`
      padding: 16px 0;
      text-align: center;
    `,
    annotationLoadingText: css`
      margin-top: 6px;
      color: var(--color-text-tertiary);
      font-size: 12px;
    `,
    // Button Bar at bottom
    buttonBar: css`
      margin: 12px auto;
      display: flex;
      gap: 10px;
      justify-content: center;
      position: sticky;
      bottom: 0;
      background: var(--color-bg-container);
      padding: 8px 0;
      z-index: 10;
    `,
    // 添加开始任务按钮样式
    startTaskButton: css`
      background-color: var(--color-primary) !important;
      border: none !important;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
      justify-content: center !important;
    `,
    // 添加测试按钮样式
    primaryButton: css`
      background-color: var(--color-primary) !important;
      border-color: var(--color-primary) !important;
      color: #fff !important;
      height: 32px !important;
    `,
    // 添加弹性布局按钮样式
    flexButton: css`
      flex: 1;
      height: 32px !important;
    `,
    flexButton2: css`
      flex: 2;
      height: 32px !important;
    `,
    // 优化模式容器
    optimizeModeContainer: css`
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    `,
    // Progress container for test
    progressContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
    `,
    progressText: css`
      margin-top: 16px;
    `,
    // Timeline and Animation
    timelineAnimation: css`
      position: relative;
    `,
    
    // Pulse animation (used in CSS)
    pulseAnimation: css`
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.4);
        }
        70% {
          box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0);
        }
      }
    `,
    // Evaluation Results
    evaluationChartsWrapper: css`
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    evaluationLeftSection: css`
      padding: 6px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      flex: 0 0 350px;
      
      @media (max-width: 768px) {
        flex: 0 0 auto;
        width: 100%;
      }
    `,
    evaluationRightSection: css`
      padding: 6px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      flex: 1;
      min-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    `,
    modelPanelHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: var(--color-primary-bg);
      }
    `,
    modelPanelLeft: css`
      display: flex;
      align-items: center;
      gap: 6px;
    `,
    modelInfo: css`
      flex: 1;
    `,
    modelTags: css`
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    `,
    modelTag: css`
      background: var(--color-bg-base);
      border-radius: 8px;
      padding: 0 4px;
      font-size: 10px;
    `,
    chartLegend: css`
      display: flex;
      flex-wrap: wrap;
    `,
    legendItem: css`
      display: flex;
      align-items: center;
      margin-right: 10px;
      font-size: 11px;
    `,
    legendColor: css`
      border-radius: 50%;
      margin-right: 3px;
    `,
    metricsSection: css`
      display: flex;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    metricItem: css`
      background: #f9f9f9;
      border-radius: 4px;
      flex: 1;
      min-width: 110px;
      padding: 8px;
    `,
    positive: css`
      color: var(--color-success);
    `,
    negative: css`
      color: var(--color-error);
    `,
    scoreRadarSection: css`
      display: flex;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    // Customizing Ant Design components
    // (these can be used with className or passed to components)
    customTimelineItem: css`
      .ant-timeline-item-head.ant-timeline-item-head-custom {
        background: var(--color-bg-container) !important;
        padding: 0;
        border: none;
      }
      
      .ant-timeline-item-content {
        color: var(--color-text-tertiary);
      }
      
      .ant-timeline-item-head-blue {
        color: var(--color-primary) !important;
        border-color: var(--color-primary) !important;
      }
    `,
    // 添加主内容区域样式
    mainContent: css`
      display: flex;
      max-height: calc(892px - 200px);
      border-radius: 0 0 16px 16px;
      overflow-y: auto;
    `,
    // 结果部分样式
    resultSection: css`
      padding: 16px;
      margin-top: 8px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    `,
    sectionTitle: css`
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 14px;
    `,
    scorePanel: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 16px;
    `,
    totalScore: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `,
    scoreValue: css`
      font-size: 28px;
      font-weight: bold;
      color: var(--color-primary);
    `,
    scoreLabel: css`
      font-size: 13px;
      color: #666;
    `,
    dimensionScores: css`
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
      margin-left: 16px;
    `,
    dimensionItem: css`
      padding: 8px 12px;
      background: #fff;
      border-radius: 6px;
      width: calc(50% - 4px);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    `,
    dimensionName: css`
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    `,
    dimensionValue: css`
      font-size: 14px;
      font-weight: 600;
    `,
    agentEvaluation: css`
      margin-top: 16px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    `,
    agentsList: css`
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `,
    agentItem: css`
      padding: 12px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    `,
    agentName: css`
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
    `,
    agentScore: css`
      font-size: 13px;
      line-height: 1.5;
      color: #444;
    `,
    scoreDescription: css`
      margin-top: 4px;
      padding: 6px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
      color: #555;
    `,
    optimizationResults: css`
      margin-top: 16px;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
      border: 1px solid #e1f0ff;
    `,
    beforeAfterScore: css`
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      padding: 8px;
      background: #fff;
      border-radius: 6px;
      margin-top: 8px;
    `,
    arrow: css`
      color: #999;
      font-size: 16px;
      margin: 0 4px;
    `,
    improvedScore: css`
      color: var(--color-success);
      font-weight: bold;
    `,
    improvementRate: css`
      margin-left: auto;
      background: var(--color-success-bg);
      color: var(--color-success);
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    `,
  };
});

export default useTaskDetailStyles; 