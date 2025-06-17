import { createStyles } from 'antd-style';

/**
 * 通用按钮样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    actionButton: css`
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 12px;
      height: 32px;
      font-size: 12px;
    `,
    primaryButton: css`
      background-color: ${token.colorPrimary};
      color: white;
      font-weight: 500;
      border-color: ${token.colorPrimary};
      
      &:hover, &:focus {
        background-color: ${token.colorPrimaryHover} !important;
        border-color: ${token.colorPrimaryHover} !important;
      }
      
      &:active {
        background-color: ${token.colorPrimaryActive} !important;
        border-color: ${token.colorPrimaryActive} !important;
      }
    `,
    flex1: css`
      flex: 1;
    `,
    flex2: css`
      flex: 2;
    `,
    disabledButton: css`
      &[disabled] {
        background-color: ${token.colorBgContainerDisabled};
        color: ${token.colorTextDisabled};
        cursor: not-allowed;
        
        &:hover, &:focus {
          background-color: ${token.colorBgContainerDisabled} !important;
          color: ${token.colorTextDisabled} !important;
        }
      }
    `,
    iconOnly: css`
      padding: 0 8px;
    `,
    danger: css`
      background-color: ${token.colorError};
      color: white;
      font-weight: 500;
      border-color: ${token.colorError};
      
      &:hover, &:focus {
        background-color: ${token.colorErrorHover || token.colorError} !important;
        border-color: ${token.colorErrorHover || token.colorError} !important;
        opacity: 0.85;
      }
      
      &:active {
        opacity: 0.7;
      }
    `,
    success: css`
      background-color: ${token.colorSuccess};
      color: white;
      font-weight: 500;
      border-color: ${token.colorSuccess};
      
      &:hover, &:focus {
        background-color: ${token.colorSuccessHover || token.colorSuccess} !important;
        border-color: ${token.colorSuccessHover || token.colorSuccess} !important;
        opacity: 0.85;
      }
      
      &:active {
        opacity: 0.7;
      }
    `,
  };
});

export default useStyles; 