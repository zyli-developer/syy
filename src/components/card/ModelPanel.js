import React from 'react';
import { Avatar } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import useStyles from '../../styles/components/card/ModelPanel';

/**
 * 模型面板组件
 * @param {Object} props - 组件属性
 * @param {string} props.modelKey - 模型标识
 * @param {Object} props.modelData - 模型数据
 * @param {string|boolean} props.expanded - 是否展开的状态
 * @param {Function} props.onToggle - 切换展开/收起的回调
 * @param {Function} props.getModelColor - 获取模型颜色的函数
 * @returns {ReactElement} 模型面板组件
 */
const ModelPanel = ({ 
  modelKey, 
  modelData, 
  expanded, 
  onToggle, 
  getModelColor 
}) => {
  const styles = useStyles();
  
  if (!modelData) return null;
  
  return (
    <div className={styles.modelPanel}>
      <div 
        className={styles.modelPanelHeader} 
        onClick={() => onToggle(modelKey)}
      >
        <div className={styles.modelPanelLeft}>
          <Avatar 
            size={32} 
            className={styles.modelAvatar} 
            style={{ background: getModelColor(modelKey) }}
          >
            {modelData.name?.charAt(0)}
          </Avatar>
          <div className={styles.modelInfo}>
            <div className={styles.modelName}>
              {modelData.name}
              <span className={styles.modelUsage}>128k</span>
            </div>
            <div className={styles.modelTags}>
              {modelData.tags?.map((tag, index) => (
                <span key={index} className={styles.modelTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.modelPanelIcon}>
          {expanded === modelKey ? <MinusOutlined /> : <PlusOutlined />}
        </div>
      </div>
      
      {expanded === modelKey && (
        <div className={styles.modelPanelContent}>
          <div className={styles.evaluationContent}>
            <p className={styles.evaluationText}>
              {modelData.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPanel;