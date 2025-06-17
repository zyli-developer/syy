import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    cardDetailPage: css`
      padding: 16px;
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
      height: 70vh;
      flex-direction: column;
    `,
    errorMessage: css`
      text-align: center;
      margin: 30px 0;
      font-size: 16px;
      color: #ff4d4f;
    `,
    hideTabsNav: css`
      display: none;
    `,
    taskDetailBreadcrumb: css`
      margin-bottom: 4px;
    `,
    breadcrumbArrow: css`
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    `,
    breadcrumbParent: css`
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    `,
    breadcrumbCurrent: css`
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    `,
    taskDetailTitleSection: css`
      padding: 6px;
      margin-bottom: 4px;
    `,
    taskTitle: css`
      font-size: 18px;
      margin: 0 0 4px 0;
    `,
    taskCreatorSection: css`
      padding: 4px;
      gap: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    taskCreatorInfo: css`
      gap: 8px;
      display: flex;
      align-items: center;
    `,
    creatorAvatar: css`
      background-color: #1890ff;
    `,
    creatorText: css`
      font-size: 12px;
    `,
    creatorName: css`
      font-weight: 500;
    `,
    creatorSource: css`
      color: #1890ff;
    `,
    taskTags: css`
      gap: 4px;
      display: flex;
      flex-wrap: wrap;
    `,
    taskDimensionTag: css`
      font-size: 10px;
      padding: 0 4px;
      margin: 0;
    `,
    taskActionsTop: css`
      display: flex;
      gap: 8px;
    `,
    followButton: css`
      height: 24px;
      padding: 0 8px;
    `,
    shareButton: css`
      height: 24px;
      padding: 0 8px;
    `,
    evaluationChartsWrapper: css`
      display: flex;
      gap: 4px;
      margin-top: 4px;
      flex-wrap: wrap;

      @media (max-width: 992px) {
        flex-direction: column;
      }
    `,
    evaluationLeftSection: css`
      flex: 0 0 400px;
      gap: 4px;
      
      @media (max-width: 992px) {
        flex: auto;
        width: 100%;
      }
    `,
    evaluationSection: css`
      padding: 8px;
      margin-bottom: 4px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    `,
    evaluationHeader: css`
      margin-bottom: 8px;
    `,
    evaluationTitle: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    titleText: css`
      font-size: 14px;
      font-weight: 500;
    `,
    modelSelector: css`
      min-width: 270px;
      flex: 1;
    `,
    selectAllOption: css`
      padding: 4px 8px;
    `,
    evaluationModelInfo: css`
      gap: 4px;
    `,
    modelPanel: css`
      margin-bottom: 4px;
    `,
    modelPanelHeader: css`
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f0f7ff;
      }
    `,
    modelPanelLeft: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    modelAvatar: css`
      /* Colors set dynamically */
    `,
    modelInfo: css`
      flex: 1;
    `,
    modelName: css`
      font-size: 14px;
    `,
    modelUsage: css`
      font-size: 12px;
      margin-left: 4px;
      color: #8c8c8c;
    `,
    modelTags: css`
      gap: 4px;
      display: flex;
      flex-wrap: wrap;
    `,
    modelTag: css`
      padding: 0 4px;
      font-size: 11px;
      background: #f0f0f0;
      border-radius: 10px;
    `,
    modelPanelIcon: css`
      font-size: 12px;
      color: #8c8c8c;
    `,
    modelPanelContent: css`
      padding: 0 8px 8px;
    `,
    evaluationContent: css`
      padding: 8px;
    `,
    evaluationText: css`
      font-size: 12px;
      margin: 0;
      line-height: 1.4;
    `,
    evaluationRightSection: css`
      gap: 4px;
      flex: 1;
      display: flex;
      flex-direction: column;
    `,
    lineChartSection: css`
      padding: 8px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    `,
    chartLegend: css`
      margin-bottom: 8px;
      gap: 8px;
      display: flex;
      flex-wrap: wrap;
    `,
    legendItem: css`
      gap: 4px;
      display: flex;
      align-items: center;
      margin-right: 12px;
    `,
    legendColor: css`
      width: 10px;
      height: 10px;
      border-radius: 50%;
      /* Colors set dynamically */
    `,
    legendLabel: css`
      font-size: 12px;
    `,
    lineChartContainer: css`
      height: 150px;
      margin-top: 4px;
    `,
    scoreRadarSection: css`
      gap: 8px;
      padding: 8px;
      display: flex;
      flex-wrap: wrap;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    `,
    metricsSection: css`
      gap: 8px;
      min-width: 150px;
      display: flex;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
        flex-direction: row;
      }
    `,
    metricItem: css`
      padding: 8px;
      flex: 1;
      min-width: 120px;
      background: #f9f9f9;
      border-radius: 4px;
    `,
    metricLabel: css`
      font-size: 12px;
      margin-bottom: 4px;
      color: #8c8c8c;
    `,
    metricValue: css`
      font-size: 20px;
      font-weight: 500;
    `,
    metricChange: css`
      font-size: 12px;
      
      &.positive {
        color: #52c41a;
      }
      
      &.negative {
        color: #ff4d4f;
      }
    `,
    radarChartContent: css`
      height: 220px;
      flex: 1;
    `,
    historySectionWrapper: css`
      padding: 8px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    `,
    historySection: css`
      gap: 4px;
    `,
    historyTime: css`
      font-size: 12px;
      color: #8c8c8c;
    `,
    historyAuthor: css`
      font-size: 12px;
    `,
    historyContent: css`
      font-size: 12px;
      line-height: 1.4;
      margin-top: 4px;
    `,
    taskFooterActions: css`
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      padding: 8px 0;
    `,
    actionButton: css`
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 12px;
      height: 32px;
      font-size: 12px;
    `,
    likeButton: css``,
    commentButton: css``,
    forkButton: css`
      background-color: #006ffd;
      font-weight: 500;
    `,
    optimizeButton: css``,
  };
});

export default useStyles; 