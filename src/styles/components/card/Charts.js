import { createStyles } from 'antd-style';

/**
 * 图表相关样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    lineChartSection: css`
      padding: 8px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      margin-bottom: 8px;
    `,
    chartLegend: css`
      margin-bottom: 8px;
      gap: 8px;
      display: flex;
      flex-wrap: wrap;
    `,
    legendItem: css`
      gap: 4px;
      display: flex;
      align-items: center;
      margin-right: 12px;
    `,
    legendColor: css`
      width: 10px;
      height: 10px;
      border-radius: 50%;
    `,
    legendLabel: css`
      font-size: 12px;
      color: ${token.colorTextSecondary};
    `,
    lineChartContainer: css`
      height: 150px;
      margin-top: 4px;
    `,
    scoreRadarSection: css`
      display: flex;
      gap: 8px;
      padding: 8px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
      margin-bottom: 8px;
      
      @media (max-width: 992px) {
        flex-direction: column;
      }
    `,
    metricsSection: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 150px;
      
      @media (max-width: 992px) {
        flex-direction: row;
        min-width: auto;
      }
    `,
    metricItem: css`
      padding: 8px;
      background: ${token.colorBgTextHover};
      border-radius: ${token.borderRadiusSM}px;
      
      @media (max-width: 992px) {
        flex: 1;
      }
    `,
    metricLabel: css`
      font-size: 12px;
      margin-bottom: 4px;
      color: ${token.colorTextSecondary};
    `,
    metricValue: css`
      font-size: 20px;
      font-weight: 500;
      color: ${token.colorText};
    `,
    metricChange: css`
      font-size: 12px;
    `,
    positive: css`
      color: ${token.colorSuccess};
    `,
    negative: css`
      color: ${token.colorError};
    `,
    radarChartContent: css`
      height: 220px;
      flex: 1;
    `,
    historySection: css`
      padding: 8px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
    `,
    historyTime: css`
      font-size: 12px;
      color: ${token.colorTextSecondary};
    `,
    historyAuthor: css`
      font-size: 12px;
      color: ${token.colorTextSecondary};
      margin-top: 4px;
    `,
    historyContent: css`
      font-size: 12px;
      line-height: 1.5;
      margin-top: 8px;
      color: ${token.colorText};
    `,
  };
});

export default useStyles; 