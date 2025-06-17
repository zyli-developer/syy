import { createStyles } from 'antd-style';

export const cardColors = [
  '#F7D6F7', // 粉
  '#D6E6FF', // 蓝
  '#FFD6B3', // 橙
  '#E6F7D6', // 绿
  '#E6E6FF', // 紫
  '#FFF7D6', // 黄
  '#D6FFF7', // 青
  '#FFD6E6', // 桃
];

const useProposalSquareStyles = createStyles(({ token, css }) => ({
  pageWrapper: css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0 120px 0;
    background: #f7f9f8;
    min-height: 100vh;
    position: relative;
  `,
  cardGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  `,
  proposalCard: css`
    border-radius: 32px;
    box-shadow: 0 4px 24px 0 rgba(24,55,29,0.06);
    padding: 32px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.18s, box-shadow 0.18s;
    cursor: pointer;
    background: #fff;
    &:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 8px 32px 0 rgba(88,189,109,0.12);
    }
  `,
  cardImage: css`
    width: 120px;
    height: 120px;
    border-radius: 32px;
    margin-bottom: 18px;
    object-fit: cover;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(24,55,29,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
  `,
  cardTitle: css`
    font-size: 22px;
    font-weight: 700;
    color: #18371D;
    margin-bottom: 12px;
    text-align: center;
  `,
  cardDesc: css`
    font-size: 15px;
    color: #666;
    margin-bottom: 24px;
    text-align: center;
    min-height: 48px;
  `,
  cardBtn: css`
    border-radius: 20px;
    font-size: 15px;
    font-weight: 500;
    border: 1.5px solid #18371D;
    color: #18371D;
    background: #fff;
    padding: 0 24px;
    height: 40px;
    margin-top: auto;
    transition: all 0.18s;
    &:hover {
      background: #e6f7ff;
      color: #1890ff;
      border-color: #1890ff;
    }
  `,
}));

export default useProposalSquareStyles; 