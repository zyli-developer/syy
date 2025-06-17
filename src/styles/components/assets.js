/**
 * 资产页面样式定义
 * 使用antd样式系统
 */

import { createStyles } from 'antd-style';

// 创建资产页面样式
export const useAssetStyles = createStyles(({ token, css }) => {
  return {
    // 资产页面容器
    pageContainer: css`
      width: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
    `,
    
    // 内容区域
    contentArea: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      transition: all 0.3s;
    `,
    
    // 聊天区域展开时的内容样式
    contentWithChat: css`
      padding: 24px;
      max-width: 100%;
    `,
    
    // 聊天区域收起时的内容样式
    contentWithoutChat: css`
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      width: calc(100% - 360px);
    `,
    
    // 资产页面整体背景
    assetPageBackground: css`
      background-color: var(--color-chat-bg);
      border-radius: 28px;
      padding: 24px;
      min-height: 500px;
    `,
    
    // 资产分组区域容器
    assetSections: css`
      display: flex;
      flex-direction: column;
      gap: 32px;
    `,
    
    // 单个资产分组区域
    assetSection: css`
      display: flex;
      flex-direction: column;
      gap: 12px;
    `,
    
    // 分组标题行
    sectionHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
    `,
    
    // 分组标题
    sectionTitle: css`
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      color: #18371D;
    `,
    
    // 分组标题按钮容器
    sectionHeaderButtons: css`
      display: flex;
      align-items: center;
      gap: 12px;
    `,
    
    // 下载按钮
    downloadButton: css`
      font-size: 14px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--color-success);
      
      &:hover {
        color: ${token.colorSuccess};
        opacity: 0.85;
      }
    `,
    
    // 展开/收起按钮
    expandButton: css`
      font-size: 14px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      color: #18371D;
      
      &:hover {
        color: ${token.colorPrimary};
      }
    `,
    
    // 分组背景
    sectionBackground: css`
      border-radius: 16px;
      padding: 0 24px;
 
    
    `,
    
    // 资产卡片容器
    cardGrid: css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    `,
    
    // 收起时的提示
    collapsedHint: css`
      width: 100%;
      text-align: center;
    `,
    
    // 搜索筛选区域
    filterArea: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    `,
    
    // 左侧筛选条件
    filterLeft: css`
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    `,
    
    // 搜索框容器
    searchBox: css`
      width: 300px;
      border-radius: 22px;
      overflow: hidden;
      
      .ant-input {
        border-radius: 22px;
      }
      
      .ant-input-search-button {
        border-radius: 0 22px 22px 0 !important;
      }
    `,
    
    // 标签选择器
    filterTag: css`
      border-radius: 200px;
      padding: 8px 12px;
      
      &.ant-tag-checkable-checked {
        background-color: ${token.colorPrimary};
      }
    `,
    
    // 筛选按钮
    filterButton: css`
      border-radius: 200px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      
      &.active {
        background-color: ${token.colorPrimary};
        color: #fff;
      }
    `,
    
    // 资产卡片
    assetCard: css`
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      border: none;
      background-color: #FFFFFF;
      transition: all 0.3s ease;
      
      .ant-card-body {
        padding: 10px;
      }
    `,
    
    // 可点击卡片样式
    clickableCard: css`
      cursor: pointer;
      
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
    `,
    
    // 不可点击卡片样式
    nonClickableCard: css`
      cursor: default;
      background-color: #FAFAFA;
      
      &:hover {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        transform: none;
      }
      
      .ant-card-body {
        opacity: 0.9;
      }
    `,
    
    // 卡片内容容器
    cardContainer: css`
      display: flex;
      flex-direction: column;
      gap: 12px;
    `,
    
    // 卡片头部
    cardHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    `,
    
    // 资产卡片标题
    cardTitle: css`
      font-size: 16px;
      font-weight: 500;
      color: #18371D;
      margin: 0;
      padding: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      max-width: 70%;
    `,
    
    // 可点击标题样式
    clickableTitle: css`
      cursor: pointer;
      
      &:hover {
        color: #58BD6D;
      }
    `,
    
    // 不可点击标题样式
    nonClickableTitle: css`
      cursor: default;
      color: rgba(24, 55, 29, 0.85);
      
      &:hover {
        color: rgba(24, 55, 29, 0.85);
      }
    `,
    
    // 操作按钮
    actionButton: css`
      padding: 0;
      font-size: 16px;
      
      &:hover {
        color: #58BD6D;
      }
    `,
    
    // 创建人信息
    creatorInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    `,
    
    // 创建人详情
    creatorDetail: css`
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    
    // 资产卡片创建者头像
    authorAvatar: css`
      background-color: var(--color-chat-bg);
      border: 1px solid #fff;
      color: #446F48;
    `,
    
    // 资产卡片标签区域
    cardTags: css`
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `,
    
    // 标签样式
    tagStyle: css`
      background-color: var(--color-chat-bg);
      border-radius: 16px;
      padding: 0px 8px;
      font-size: 12px;
      border: none;
      color: #446F48;
      height: 22px;
      line-height: 22px;
      margin: 0;
    `,
    
    // 卡片底部操作区
    cardActions: css`
      display: flex;
      gap: 4px;
      align-items: center;
    `,
    
    // 分页组件
    pagination: css`
      margin-top: 24px;
      display: flex;
      justify-content: center;
    `,
    
    // 空状态
    emptyState: css`
      padding: 48px 0;
      text-align: center;
    `,
    
    // 标签栏样式
    tabsStyle: css`
      .ant-tabs-nav {
        margin-bottom: 20px;
      }
      
      .ant-tabs-tab {
        padding: 8px 12px;
      }
      
      .ant-tabs-tab-active {
        background-color: #122415;
        border-radius: 12px;
        
        .ant-tabs-tab-btn {
          color: #fff !important;
        }
      }
      
      .ant-tabs-ink-bar {
        display: none;
      }
    `
  };
}); 