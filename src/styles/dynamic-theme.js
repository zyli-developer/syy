import { cssColorVariables } from './utils/colorToken';

// 创建一个函数来动态插入样式
export function injectColorVariables() {
  // 创建style元素
  const styleElement = document.createElement('style');
  styleElement.id = 'syntrust-color-variables';
  
  // 添加CSS变量
  styleElement.textContent = cssColorVariables;
  
  // 将样式添加到head
  document.head.appendChild(styleElement);
  

  // 返回一个用于清理的函数
  return () => {
    const element = document.getElementById('syntrust-color-variables');
    if (element) {
      document.head.removeChild(element);
    }
  };
}

// 在初始化时自动注入变量
export function applyColorTheme() {
  // 检查是否已存在相同ID的style元素
  if (!document.getElementById('syntrust-color-variables')) {
    injectColorVariables();
    console.log('CSS变量主题已应用');
  } else {
    console.log('CSS变量主题已存在，未重新应用');
  }
}

export default applyColorTheme; 