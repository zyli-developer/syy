// 评估区域样式定义
import { transparentScrollbarStyle, hideScrollbarStyle } from './scrollbarStyles';

// 评估模型信息区域样式
const evaluationModelInfoStyle = {
  gap: '4px',
  flex: '1',
  height: '300px',
  ...hideScrollbarStyle
};

// 评估左侧区域样式
const evaluationLeftSectionStyle = {
  flex: '0 0 400px',
  gap: '4px',
  // height: 'calc(100% - 16px)'
};

// 评估右侧区域样式
const evaluationRightSectionStyle = {
  gap: '4px',
  flex: 1,
  height: 'calc(100% - 16px)'
};

// 评估区域容器样式
const evaluationSectionStyle = {
  padding: '8px',
  marginBottom: '4px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
};

export {
  evaluationModelInfoStyle,
  evaluationLeftSectionStyle,
  evaluationRightSectionStyle,
  evaluationSectionStyle
};
