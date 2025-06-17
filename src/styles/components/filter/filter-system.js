import { createStyles } from 'antd-style';

// 定义样式
const useStyles = createStyles(({ token, css }) => {
  return {
    filterSystemContainer: css`
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      padding: 8px 0;
    `,
    toolbarLeft: css`
      display: flex;
      gap: 8px;
    `,
    toolbarRight: css`
      display: flex;
      align-items: center;
      gap: 12px;
    `,
    searchInput: css`
      width: 240px;
      border-radius: 30px;
      padding: 8px 16px;
      border: 1px solid ${token.colorBorderSecondary};
      box-shadow: none;
      font-size: 14px;
      color: ${token.colorTextSecondary};
      transition: all 0.3s;

      &:hover, &:focus {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    `,
    importTaskButton: css`
      display: flex;
      align-items: center;
      background-color: white;
      color: ${token.colorText};
      border: 1px solid ${token.colorBorder};
      border-radius: 30px;
      padding: 0 16px;
      height: 32px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;

      &:hover {
        color: ${token.colorPrimary};
        border-color: ${token.colorPrimary};
        transform: translateY(-1px);
      }

      &:active {
        color: ${token.colorPrimaryActive};
        border-color: ${token.colorPrimaryActive};
        transform: translateY(0);
      }

      .anticon {
        margin-right: 6px;
        font-size: 14px;
      }
    `,
    createTaskButton: css`
      display: flex;
      align-items: center;
      background-color: ${token.colorPrimary};
      color: white;
      border: none;
      border-radius: 30px;
      padding: 0 16px;
      height: 32px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      &:hover {
        background-color: ${token.colorPrimaryHover};
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        background-color: ${token.colorPrimaryActive};
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .anticon {
        margin-right: 6px;
        font-size: 14px;
      }
    `,
    filterButton: css`
      display: flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      border-radius: 20px;
      
      .filter-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        font-size: 12px;
        line-height: 16px;
        border-radius: 10px;
        background-color: ${token.colorPrimary};
        color: white;
      }
    `,
    groupButton: css`
      display: flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      border-radius: 20px;
      
      .group-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        font-size: 12px;
        line-height: 16px;
        border-radius: 10px;
        background-color: ${token.colorPrimary};
        color: white;
      }
    `,
    sortButton: css`
      display: flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      border-radius: 20px;
      
      .filter-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        font-size: 12px;
        line-height: 16px;
        border-radius: 10px;
        background-color: ${token.colorPrimary};
        color: white;
      }
    `,
    circleButtonGroup: css`
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 8px;
    `,
    circleButton: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    `,
  };
});

export default useStyles; 