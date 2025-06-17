import { createStyles } from 'antd-style';

/**
 * 模型面板样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    modelPanel: css`
      margin-bottom: 4px;
      border: 1px solid ${token.colorBorderSecondary};
      border-radius: ${token.borderRadiusSM}px;
      overflow: hidden;
    `,
    modelPanelHeader: css`
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      background-color: ${token.colorBgContainer};
      transition: background-color 0.3s;

      &:hover {
        background-color: ${token.colorBgTextHover};
      }
    `,
    modelPanelLeft: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    modelAvatar: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    modelInfo: css`
      flex: 1;
    `,
    modelName: css`
      font-size: 14px;
      font-weight: 500;
    `,
    modelUsage: css`
      font-size: 12px;
      margin-left: 4px;
      color: ${token.colorTextSecondary};
    `,
    modelTags: css`
      gap: 4px;
      display: flex;
      flex-wrap: wrap;
    `,
    modelTag: css`
      padding: 0 4px;
      font-size: 11px;
      background: ${token.colorBgTextHover};
      border-radius: ${token.borderRadiusSM}px;
    `,
    modelPanelIcon: css`
      display: flex;
      align-items: center;
      font-size: 12px;
      color: ${token.colorTextSecondary};
    `,
    modelPanelContent: css`
      padding: 0 8px 8px;
    `,
    evaluationContent: css`
      padding: 8px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
    `,
    evaluationText: css`
      font-size: 12px;
      margin: 0;
      line-height: 1.5;
      color: ${token.colorText};
    `,
  };
});

export default useStyles; 