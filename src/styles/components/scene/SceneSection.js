import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: flex; 
      gap: 4px;
      padding: 16px;
      height: calc(100vh - 300px);
      overflow: hidden;
      position: relative;
    `,
    flowChartContainer: css`
      flex: 1;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
    `,
    flowChartHeader: css`
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    headerTitle: css`
      margin: 0;
    `,
    flowChartContent: css`
      height: calc(100% - 57px);
    `,
    annotationSidebar: css`
      width: 320px;
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;
      overflow: auto;
    `,
    annotationTitle: css`
      margin-bottom: 16px;
    `,
    annotationList: css`
      gap: 4px;
    `,
    annotationPanel: css`
      margin-bottom: 4px;
    `,
    annotationPanelHeader: css`
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    expandedHeader: css`
      background-color: #E6F7FF;
    `,
    collapsedHeader: css`
      background-color: #f8f9fa;
    `,
    annotationPanelLeft: css`
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    `,
    annotationInfo: css`
      flex: 1;
    `,
    annotationText: css`
      font-size: 14px;
      color: #333;
      word-break: break-all;
    `,
    annotationMeta: css`
      font-size: 12px;
      color: #8f9098;
      margin-top: 4px;
    `,
    annotationPanelContent: css`
      padding: 0 8px 8px;
    `,
    annotationContent: css`
      padding: 8px;
    `,
    annotationTextContent: css`
      font-size: 12px;
      margin: 0;
      line-height: 1.4;
      color: #333;
    `,
    attachmentContainer: css`
      margin-top: 8px;
    `,
    actionContainer: css`
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    `,
    loadingContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    `,
    addNodeButton: css`
      position: absolute;
      right: 360px;
      bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `,
    customNode: css`
      padding: 10px;
      border-radius: 5px;
      background: white;
      border: 1px solid #d9d9d9;
      min-width: 150px;
    `,
    nodeContent: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    expandButton: css`
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    childrenContainer: css`
      margin-top: 8px;
      margin-left: 24px;
      border-left: 1px dashed #d9d9d9;
      padding-left: 8px;
    `,
  };
});

export default useStyles; 