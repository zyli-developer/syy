import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      display: flex;
      gap: 24px;
 
      height: calc(100vh - 300px);
      overflow: hidden;
      
      /* 确保QA界面中高亮效果显示正常 */
      &.multi-select-mode {
        position: relative;
      }
      
      &.multi-select-mode .contentText::before,
      &.multi-select-mode .qa-content-text::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
      
        border-radius: 4px;
        pointer-events: none;
        animation: pulse 2s infinite;
      }
      
      .text-highlight-selection {
        background-color: rgba(24, 144, 255, 0.15);
        border-radius: 2px;
        padding: 1px 0;
        border-bottom: 1px dashed #1890ff;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .text-highlight-selection:hover {
        background-color: rgba(24, 144, 255, 0.25);
      }
    `,
    loadingContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    `,
    leftSection: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;
      background-color: white;
      border-radius: 8px;
    `,
    headerSection: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    headerTitle: css`
      margin: 0;
    `,
    contentText: css`
      padding: 16px;
      background-color: ${token.colorBgContainer};
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 15px;
      line-height: 1.6;
      max-height: calc(100% - 80px);
      overflow-y: auto;
      white-space: pre-wrap;
      position: relative;
      user-select: text;
      transition: background-color 0.3s;
    `,
    annotatedText: css`
      background-color: rgba(255, 211, 41, 0.15);
      border-radius: 2px;
      padding: 1px 0;
      border-bottom: 1px dashed rgba(255, 211, 41, 0.8);
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(255, 211, 41, 0.25);
      }
    `,
    annotationMarker: css`
      display: none;
    `,
    actionButton: css`
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.active {
        color: ${token.colorPrimary};
        background-color: ${token.colorPrimaryBg};
      }
    `,
    rightSection: css`
      width: 320px;
      background-color: #fff;
      border-radius: 8px;
      overflow: auto;
      padding: 16px;
    `,
    annotationTitle: css`
      margin-bottom: 16px;
    `,
    annotationList: css`
      gap: 4px;
    `,
    annotationPanel: css`
      margin-bottom: 8px;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      overflow: hidden;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    `,
    annotationPanelHeader: css`
      padding: 8px;
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.3s;
    `,
    annotationPanelExpanded: css`
      background-color: #E6F7FF;
    `,
    annotationPanelCollapsed: css`
      background-color: #f8f9fa;
      
      &:hover {
        background-color: #f0f7ff;
      }
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
      line-height: 1.6;
    `,
    annotationMeta: css`
      font-size: 12px;
      color: #8f9098;
      margin-top: 4px;
    `,
    annotationPanelContent: css`
      padding: 12px;
      background-color: #fff;
      border-top: 1px solid #f0f0f0;
    `,
    annotationContent: css`
      margin-bottom: 8px;
    `,
    annotationMetaInfo: css`
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #8c8c8c;
      font-size: 12px;
    `,
    annotationAttachments: css`
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `,
    attachmentTag: css`
      margin-right: 4px;
    `,
    annotationActions: css`
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    `,
    annotationPanelIcon: css`
      display: flex;
      align-items: center;
    `,
    // 讨论相关样式
    selectedTextHighlight: css`
      background-color: rgba(24, 144, 255, 0.1);
      border-bottom: 1px dashed ${token.colorPrimary};
    `,
    // 连续选择相关样式
    highlightText: css`
      background-color: rgba(24, 144, 255, 0.15);
      border-radius: 2px;
      padding: 1px 0;
      border-bottom: 1px dashed #1890ff;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s;
    `,
  };
});

export default useStyles; 