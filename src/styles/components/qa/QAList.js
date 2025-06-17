import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      padding: 24px;
    `,
    title: css`
      margin-bottom: 24px;
    `,
    listItem: css`
      background-color: #fff;
      border-radius: 8px;
      margin-bottom: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s;
    `,
    itemHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    itemTitle: css`
      font-size: 16px;
      font-weight: 500;
    `,
    itemDescription: css`
      display: flex;
      justify-content: space-between;
      color: #666;
      margin-top: 8px;
    `,
    itemContent: css`
      font-size: 14px;
      color: #333;
      margin-top: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `,
    tagContainer: css`
      margin-top: 12px;
      display: flex;
      gap: 8px;
    `,
  };
});

export default useStyles; 