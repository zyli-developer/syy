import { useMemo } from 'react';

/**
 * 图表数据处理的自定义Hook
 * @param {Object} card - 卡片数据
 * @param {Array} selectedModels - 选中的模型
 * @returns {Object} 处理后的雷达图和折线图数据
 */
const useChartData = (card, selectedModels) => {
  return useMemo(() => {
    // 如果卡片数据或图表数据不存在，返回空数据
    if (!card || !card.chartData) return { radar: [], line: [] };
    
    /**
     * 雷达图数据处理
     * 为每个维度添加各模型的数据点
     */
    const enhancedRadar = card.chartData.radar.map((item, index) => ({
      name: item.name,
      value: item.value,
      // 使用数学函数生成不同模型的数据，以展示差异
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index) * 0.2)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index) * 0.15)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index + 0.5) * 0.1)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index) * 0.15)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index + 1) * 0.2)),
    }));

    /**
     * 折线图数据处理
     * 为时间序列数据添加各模型的数据点
     */
    const enhancedLine = card.chartData.line.map((item, index) => ({
      month: item.month,
      value: item.value,
      // 使用数学函数生成不同模型的时序数据
      'claude3.5': Math.min(100, item.value * (1 + Math.sin(index * 0.3) * 0.15)),
      'claude3.6': Math.min(100, item.value * (1 + Math.cos(index * 0.3) * 0.1)),
      'claude3.7': Math.min(100, item.value * (1 + Math.sin(index * 0.3 + 0.5) * 0.05)),
      agent2: Math.min(100, item.value * (1 - Math.cos(index * 0.3) * 0.1)),
      deepseek: Math.min(100, item.value * (1 + Math.sin(index * 0.3 + 1) * 0.15)),
    }));

    return {
      radar: enhancedRadar,
      line: enhancedLine
    };
  }, [card, selectedModels]); // 依赖card和selectedModels，当它们变化时重新计算
};

export default useChartData; 