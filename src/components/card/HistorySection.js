import React from 'react';
import useStyles from '../../styles/components/card/Charts';

/**
 * 历史记录区域组件
 * @param {Object} props - 组件属性
 * @param {Object} props.evaluation - 评估数据
 * @returns {ReactElement} 历史记录组件
 */
const HistorySection = ({ evaluation }) => {
  const styles = useStyles();
  
  if (!evaluation) {
    return (
      <div className={styles.historySection}>
        <div style={{ textAlign: 'center', padding: '10px' }}>
          暂无历史记录
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.historySection}>
      <div className={styles.historyTime}>{evaluation.updatedAt}</div>
      <div className={styles.historyAuthor}>
        by <span>{evaluation.updatedBy}</span>
      </div>
      <div className={styles.historyContent}>{evaluation.history}</div>
    </div>
  );
};

export default HistorySection; 