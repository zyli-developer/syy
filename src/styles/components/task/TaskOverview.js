import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    scoreSection: css`
      background: var(--color-primary-bg);
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
    `,
    scoreHeader: css`
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;
    `,
    scoreTitle: css`
      font-size: 14px;
      font-weight: 500;
    `,
    scoreIcon: css`
      margin-left: 4px;
      color: var(--color-text-tertiary);
    `,
    scoreContent: css`
      font-size: 14px;
      color: var(--color-text-tertiary);
    `,
    scoreContentRow: css`
      margin-top: 4px;
    `,
    scoreLink: css`
      color: var(--color-primary);
    `,
    taskInfoSection: css`
      margin-bottom: 24px;
    `,
    infoRow: css`
      display: flex;
      margin-bottom: 16px;
    `,
    infoLabel: css`
      width: 80px;
      color: var(--color-text-tertiary);
    `,
    infoContent: css`
      flex: 1;
    `,
    authorInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    tagContainer: css`
      display: flex;
      flex-wrap: wrap;
    `,
    tag: css`
      border-radius: 12px;
      margin-right: 8px;
    `,
    annotationSection: css`
      margin-bottom: 24px;
    `,
    annotationHeader: css`
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      cursor: pointer;
    `,
    annotationTitle: css`
      font-size: 14px;
      font-weight: 500;
    `,
    annotationIcon: css`
      margin-left: 4px;
      color: var(--color-text-tertiary);
    `,
    annotationTable: css`
      margin-top: 8px;
      width: 676px;
    `,
    avatarContainer: css`
      display: flex;
      justify-content: center;
    `,
    avatarNumber: css`
      background: var(--color-primary);
      font-size: 12px;
    `,
    attachmentContainer: css`
      display: flex;
      gap: 8px;
      overflow: hidden;
    `,
    attachmentTag: css`
      cursor: pointer;
      white-space: nowrap;
    `,
    attachmentLink: css`
      color: var(--color-primary);
    `,
    modifierInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    modifierTime: css`
      color: var(--color-text-tertiary);
      font-size: 12px;
    `,
    warningIcon: css`
      color: var(--color-warning);
    `,
  };
});

export default useStyles; 