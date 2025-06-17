import { useCallback } from 'react';

/**
 * 处理模型数据的自定义Hook
 * @returns {Object} 包含模型相关处理方法的对象
 */
const useModelData = () => {
  /**
   * 获取模型颜色
   * 为不同模型分配统一的颜色标识
   * @param {string} modelKey - 模型标识
   * @returns {string} 模型对应的颜色值
   */
  const getModelColor = useCallback((modelKey) => {
    // 不同模型对应不同的颜色
    switch (modelKey) {
      case 'claude3.5':
        return '#3ac0a0'; // 绿色
      case 'claude3.6':
        return '#006ffd'; // 蓝色
      case 'claude3.7':
        return '#722ed1'; // 紫色
      case 'agent2':
        return '#FFB140'; // 辅助色1
      case 'deepseek':
        return '#722ed1'; // 紫色
      default:
        return '#8f9098'; // 默认灰色
    }
  }, []);

  // 返回模型数据处理相关的方法
  return {
    getModelColor
  };
};

export default useModelData; 