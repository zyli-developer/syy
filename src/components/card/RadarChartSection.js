import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import useStyles from '../../styles/components/card/Charts';
import colorToken from '../../styles/utils/colorToken';

// 修复：定义默认颜色数组
const defaultColors = [
  colorToken.colorPrimary,
  colorToken.colorAssist1,
  colorToken.colorAssist2,
  colorToken.colorAssist3,
  colorToken.colorError,
  colorToken.colorSuccess,
];

/**
 * 通用雷达图组件
 * @param {Object[]} radarData - 维度数据数组，每项至少有name和value，可有多模型字段
 * @param {string[]} [modelKeys] - 多模型字段名数组，自动遍历所有数值字段（除name）
 * @param {number} [maxValue] - 最大值，默认自动计算
 * @param {number} [height] - 图表高度，默认150
 * @param {string[]} [colors] - 线条颜色数组
 * @returns {ReactElement}
 */
const RadarChartSection = ({
  radarData = [],
  modelKeys,
  maxValue,
  height = 150,
  colors = defaultColors,
}) => {
  const styles = useStyles();

  // 自动推断所有可用的模型字段（除name）
  const keys = useMemo(() => {
    if (modelKeys && modelKeys.length > 0) return modelKeys;
    if (!radarData || radarData.length === 0) return ['value'];
    // 取第一个数据项，找出所有数值字段
    const first = radarData[0];
    return Object.keys(first).filter(k => k !== 'name' && typeof first[k] === 'number');
  }, [radarData, modelKeys]);

  // 自动计算最大值
  const computedMax = useMemo(() => {
    if (typeof maxValue === 'number') return maxValue;
    let max = 0;
    radarData.forEach(item => {
      keys.forEach(k => {
        if (typeof item[k] === 'number' && item[k] > max) max = item[k];
      });
    });
    return Math.max(100, Math.ceil(max * 1.1));
  }, [radarData, keys, maxValue]);

  if (!radarData || radarData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>暂无雷达图数据</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius={height / 3.2}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#8f9098' }} />
          <PolarRadiusAxis domain={[0, computedMax]} tick={{ fontSize: 10, fill: '#8f9098' }} axisLine={false} />
          <RechartsTooltip />
          {keys.map((key, idx) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              fillOpacity={0.18}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartSection;