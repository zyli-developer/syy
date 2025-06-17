import { createStyles } from 'antd-style';

const usePersonalInfoStyles = createStyles(({ token, css }) => ({
  pageWrapper: css`
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 0 120px 0;
    background: #f7f9f8;
    min-height: 100vh;
    position: relative;
  `,
  breadcrumbWrapper: css`
    margin-bottom: 24px;
    font-size: 16px;
    font-weight: 600;
    color: #18371D;
    letter-spacing: 1px;
  `,
  infoCard: css`
    display: flex;
    align-items: flex-start;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 24px 0 rgba(24,55,29,0.06);
    padding: 40px 48px 32px 40px;
    margin-bottom: 32px;
    gap: 40px;
    position: relative;
  `,
  avatarSection: css`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .ant-avatar {
      width: 96px !important;
      height: 96px !important;
      font-size: 40px;
      background: #e6f7ff;
      border: 4px solid #fff;
      box-shadow: 0 2px 8px rgba(24,55,29,0.08);
    }
  `,
  infoSection: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  name: css`
    font-size: 28px;
    font-weight: 700;
    color: #18371D;
    margin-bottom: 2px;
  `,
  stats: css`
    display: flex;
    gap: 32px;
    font-size: 15px;
    color: #8f9098;
    margin-bottom: 2px;
    b { color: #18371D; font-weight: 700; }
  `,
  intro: css`
    font-size: 15px;
    color: #666;
    margin-bottom: 2px;
  `,
  tagsRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  `,
  tags: css`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    .ant-tag {
      border-radius: 16px;
      font-size: 13px;
      background: #f7f9f8;
      color: #18371D;
      border: 1px solid #e5e7eb;
      padding: 2px 14px;
    }
  `,
  shareBtn: css`
    border-radius: 20px;
    font-size: 15px;
    font-weight: 500;
    background: #f7f9f8;
    color: #18371D;
    border: 1px solid #e5e7eb;
    padding: 0 18px;
    height: 36px;
    &:hover {
      background: #e6f7ff;
      color: #1890ff;
      border-color: #1890ff;
    }
  `,
  honorSection: css`
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 24px 0 rgba(24,55,29,0.06);
    padding: 32px 40px;
    margin-bottom: 32px;
    gap: 32px;
  `,
  honorItem: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 90px;
  `,
  honorCount: css`
    font-size: 26px;
    font-weight: 800;
    color: #58BD6D;
    margin-bottom: 2px;
  `,
  honorLabel: css`
    font-size: 15px;
    color: #8f9098;
  `,
  tabSection: css`
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 24px 0 rgba(24,55,29,0.06);
    padding: 32px 40px;
    margin-bottom: 32px;
    .ant-tabs-nav {
      margin-bottom: 20px;
    }
    .ant-tabs-tab {
      font-size: 16px;
      font-weight: 600;
      padding: 8px 32px;
      border-radius: 16px 16px 0 0;
    }
    .ant-tabs-tab-active {
      background: #e6f7ff;
      color: #1890ff !important;
    }
    .ant-tabs-ink-bar {
      display: none;
    }
  `,
  bottomBtnWrapper: css`
    position: fixed;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    justify-content: center;
    width: 100%;
    pointer-events: none;
    .ant-btn {
      pointer-events: auto;
      box-shadow: 0 4px 16px 0 rgba(88,189,109,0.18);
      width: 64px;
      height: 64px;
      font-size: 32px;
      border-radius: 50%;
      background: #58BD6D;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ant-btn:hover {
      background: #7be09a;
    }
  `,
}));

export default usePersonalInfoStyles; 