import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    mainContent: css`
      display: flex;
      min-height: calc(100vh - 300px);
      background: #FAFAFA;
      border-radius: 0 0 12px 12px;
    `,
    leftMenu: css`
      width: 110px;
      border-right: 1px solid #f0f0f0;
      padding: 16px 0;
    `,
    overviewTitle: css`
      padding: 0 0 40px;
      font-size: 14px;
      font-weight: 600;
      color: #000;
    `,
    timelineDot: css`
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `,
    timelineActiveDot: css`
      background: var(--color-primary-bg);
    `,
    timelineInactiveDot: css`
      background: #f9f9f9;
    `,
    timelineItem: css`
      padding: 0 0 32px;
    `,
    timelineLabel: css`
      font-size: 14px;
      cursor: pointer;
      margin-left: 8px;
    `,
    timelineLabelActive: css`
      color: var(--color-primary);
    `,
    timelineLabelInactive: css`
      color: var(--color-text-tertiary);
    `,
    rightContent: css`
      flex: 1;
      padding: 24px;
    `,
  };
});

export default useStyles; 