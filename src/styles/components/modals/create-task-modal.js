import { createStyles } from 'antd-style';

// 定义样式
const useStyles = createStyles(({ token, css }) => {
  return {
    modal: css`
      .ant-modal-content {
        border-radius: 8px;
        overflow: hidden;
        height: 95vh;
        display: flex;
        flex-direction: column;
      }
      
      .ant-modal-header {
        display: none;
      }
      
      .ant-modal-title {
        display: none;
      }
      
      .ant-modal-body {
        padding: 16px;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      
      .ant-modal-close {
        top: 12px;
        right: 12px;
      }
    `,
    stepsContainer: css`
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid ${token.colorBorderSecondary};
      
      .ant-steps-item-title {
        font-size: 13px;
        font-weight: 500;
      }
      
      .ant-steps-item-icon {
        width: 28px;
        height: 28px;
        line-height: 28px;
        
        .ant-steps-icon {
          font-size: 14px;
          top: -1px;
        }
      }
    `,
    contentContainer: css`
      flex: 1;
      overflow-y: auto;
      padding:  8px 0;
    `,
    form: css`
      .ant-form-item {
        margin-bottom: 16px;
      }
      
      .ant-form-item-label {
        padding-bottom: 4px;
      }
      
      .ant-form-item-label > label {
        font-weight: 500;
        color: #000000;
        font-size: 13px;
      }
      
      .ant-input, .ant-select-selector, .ant-picker {
        border-radius: 6px;
        border-color: ${token.colorBorderSecondary};
        font-size: 13px;
      }
      
      .ant-input:hover, .ant-select-selector:hover, .ant-picker:hover {
        border-color: ${token.colorPrimary};
      }
      
      .ant-input:focus, .ant-select-selector:focus, .ant-picker-focused {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
      
      .ant-input-affix-wrapper {
        border-radius: 6px;
      }
      
      .ant-select {
        width: 100%;
      }
    `,
    formTitle: css`
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #000000;
    `,
    footerButtons: css`
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      border-top: 1px solid ${token.colorBorderSecondary};
      padding-top: 16px;
      
      .ant-btn {
        border-radius: 6px;
        height: 32px;
        padding: 0 12px;
        font-size: 13px;
      }
      
      .ant-btn:first-child {
        flex: 1;
      }
      
      .ant-btn:nth-child(2) {
        flex: 1;
        margin-left: 12px;
      }
      
      .ant-btn-primary {
        flex: 2;
        margin-left: 12px;
        background-color: ${token.colorPrimary};
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
      }
    `,
    selectFields: css`
      width: 100%;
      
      .ant-select-selection-item {
        font-size: 13px;
      }
    `,
    textArea: css`
      resize: none;
      font-size: 13px;
      
      &:hover {
        border-color: ${token.colorPrimary};
      }
      
      &:focus {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    `,
    infoText: css`
      font-size: 13px;
      color: ${token.colorTextSecondary};
      margin: 8px 0 12px;
    `,
    formGrid: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    `,
    gridItem: css`
      margin-bottom: 0;
    `,
    // 添加表单行布局样式
    formRow: css`
      display: flex;
      flex-direction: row;
      gap: 16px;
      width: 100%;
      margin-bottom: 8px;
    `,
    formRowItem: css`
      flex: 1;
      margin-bottom: 8px;
    `,
    // QA特有样式
    qaContainer: css`
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .ant-form-item-label > label {
        color: #000000;
      }
    `,
    qaTextarea: css`
      resize: none;
      font-size: 13px;
      min-height: 180px;
      
      &:hover {
        border-color: ${token.colorPrimary};
      }
      
      &:focus {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    `,
    // 权限分配页面样式
    permissionText: css`
      font-size: 14px;
      color: ${token.colorText};
      margin-bottom: 16px;
    `,
    permissionCards: css`
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      
      @media (max-width: 1200px) {
        flex-direction: column;
      }
    `,
    permissionCard: css`
      flex: 1;
      min-width: 280px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      padding: 0;
      
      .ant-card-body {
        padding: 16px;
      }
    `,
    permissionCardTitle: css`
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      
      .anticon {
        margin-right: 6px;
        color: ${token.colorPrimary};
      }
    `,
    permissionCardDesc: css`
      font-size: 13px;
      color: ${token.colorTextSecondary};
      margin-bottom: 16px;
    `,
    userSelectForm: css`
      margin-bottom: 0;
    `,
    userSearchContainer: css`
      margin-bottom: 12px;
    `,
    userSearch: css`
      .ant-input-prefix {
        color: ${token.colorTextPlaceholder};
        margin-right: 4px;
      }
      
      input {
        font-size: 13px;
      }
    `,
    userList: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
    userItem: css`
      display: flex;
      align-items: center;
      padding: 4px 0;
    `,
    userAvatar: css`
      background-color: ${token.colorPrimaryBg};
      color: ${token.colorPrimary};
      font-size: 12px;
      margin-right: 8px;
    `,
    userName: css`
      font-size: 13px;
      color: ${token.colorText};
    `,
    
    // 确认发布页面样式
    confirmContainer: css`
      width: 100%;
      height: 100%;
    `,
    confirmLayout: css`
      display: flex;
      gap: 24px;
      height: calc(100% - 40px);
    `,
    confirmSidebar: css`
      flex: 0 0 120px;
      border-right: 1px solid ${token.colorBorderSecondary};
      padding: 16px;
      
      .ant-timeline-item-tail {
        left: 11px;
        border-left: 1px solid #d9d9d9;
      }
      
      .ant-timeline-item {
        padding-bottom: 32px;
      }
      
      .ant-timeline-item-content {
        margin-left: 20px;
      }
    `,
    timelineDot: css`
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9f9f9;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #8c8c8c;
      border: 1px solid #d9d9d9;
      transition: all 0.3s;
      
      &:hover {
        background: #f0f7ff;
      }
    `,
    timelineDotActive: css`
      background: #f0f7ff;
      color: ${token.colorPrimary};
      border-color: ${token.colorPrimary};
    `,
    timelineLabel: css`
      font-size: 14px;
      color: #8c8c8c;
      cursor: pointer;
      margin-left: 8px;
      transition: all 0.3s;
      
      &:hover {
        color: ${token.colorPrimary};
      }
    `,
    timelineLabelActive: css`
      color: ${token.colorPrimary};
      font-weight: 500;
    `,
    confirmContent: css`
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    `,
    confirmSection: css`
      margin-bottom: 24px;
    `,
    confirmSectionTitle: css`
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    confirmInfoRow: css`
      display: flex;
      margin-bottom: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
    `,
    confirmInfoLabel: css`
      width: 80px;
      flex-shrink: 0;
      color: ${token.colorTextSecondary};
      font-size: 13px;
    `,
    confirmInfoValue: css`
      flex: 1;
      font-size: 13px;
      color: ${token.colorText};
      word-break: break-word;
      
      .ant-avatar {
        vertical-align: middle;
        background-color: ${token.colorPrimaryBg};
        color: ${token.colorPrimary};
      }
    `,
    confirmInfoSection: css`
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed ${token.colorBorderSecondary};
    `,
    confirmPermissionCard: css`
      margin-bottom: 24px;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid ${token.colorBorderSecondary};
      background-color: #fafafa;
      
      &:last-child {
        margin-bottom: 0;
      }
    `,
    confirmPermissionTitle: css`
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      
      .anticon {
        margin-right: 6px;
        color: ${token.colorPrimary};
      }
    `,
    confirmPermissionDesc: css`
      font-size: 13px;
      color: ${token.colorTextSecondary};
      margin-bottom: 16px;
    `,
    confirmUserList: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
  };
});

export default useStyles; 