const colorToken = {
  // 主题色
  colorPrimary: '#58BD6D',
  colorPrimaryHover: '#4CA75E',
  colorPrimaryActive: '#3E8C4C',
  colorPrimaryRgb: '88, 189, 109', // RGB值，用于rgba函数
  colorChatBg: '#E7F0EC',
  // 重色
  colorHeavy: '#00474A',
  // 辅助色
  colorAssist1: '#FFB140',
  colorAssist1Alpha20: '#FFB14033', // 添加20%透明度的辅助色1
  colorAssist2: '#E76F51',
  colorAssist3: '#CACFD6',
  // 背景色
  colorBgBase: '#F5F5F5',
  colorBgContainer: '#F7F9F8',
  colorBgLayout: '#F8F9FA',
  colorBgChat: '#F7F9F8',
  // 文字色
  colorTextBase: '#1f2024',
  colorTextSecondary: '#71727a',
  colorTextTertiary: '#8f9098',
  colorTextDisabled: '#CACFD6',
  // 边框色
  colorBorder: '#CACFD6',
  colorBorderSecondary: '#E8E9F1',
  // 其他
  colorError: '#E76F51',
  colorSuccess: '#58BD6D',
  // 按钮相关
  colorPrimaryBg: 'rgba(88, 189, 109, 0.1)',
  colorPrimaryBgHover: 'rgba(88, 189, 109, 0.2)',
  colorPrimaryBorder: '#58BD6D',
  colorPrimaryText: '#58BD6D',
  colorPrimaryTextHover: '#4CA75E',
  colorPrimaryTextActive: '#3E8C4C',
};

// 导出CSS变量版本，用于生成CSS样式表
export const cssColorVariables = `:root {
  --color-primary: ${colorToken.colorPrimary};
  --color-chat-bg: ${colorToken.colorChatBg};
  --color-primary-hover: ${colorToken.colorPrimaryHover};
  --color-primary-active: ${colorToken.colorPrimaryActive};
  --color-primary-rgb: ${colorToken.colorPrimaryRgb};
  --color-heavy: ${colorToken.colorHeavy};
  --color-assist-1: ${colorToken.colorAssist1};
  --color-assist-1-alpha-20: ${colorToken.colorAssist1Alpha20};
  --color-assist-2: ${colorToken.colorAssist2};
  --color-assist-3: ${colorToken.colorAssist3};
  --color-bg-base: ${colorToken.colorBgBase};
  --color-bg-container: ${colorToken.colorBgContainer};
  --color-bg-layout: ${colorToken.colorBgLayout};
  --color-bg-chat: ${colorToken.colorBgChat};
  --color-text-base: ${colorToken.colorTextBase};
  --color-text-secondary: ${colorToken.colorTextSecondary};
  --color-text-tertiary: ${colorToken.colorTextTertiary};
  --color-text-disabled: ${colorToken.colorTextDisabled};
  --color-border: ${colorToken.colorBorder};
  --color-border-secondary: ${colorToken.colorBorderSecondary};
  --color-error: ${colorToken.colorError};
  --color-success: ${colorToken.colorSuccess};
  --color-primary-bg: ${colorToken.colorPrimaryBg};
  --color-primary-bg-hover: ${colorToken.colorPrimaryBgHover};
  --color-primary-border: ${colorToken.colorPrimaryBorder};
  --color-primary-text: ${colorToken.colorPrimaryText};
  --color-primary-text-hover: ${colorToken.colorPrimaryTextHover};
  --color-primary-text-active: ${colorToken.colorPrimaryTextActive};
}`;

export default colorToken; 