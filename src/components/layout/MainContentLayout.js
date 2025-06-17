import React from 'react';
import { Timeline } from 'antd';
import useStyles from '../../styles/components/layout/MainContentLayout';

const MainContentLayout = ({
  isTaskStarted,
  activeSection,
  setActiveSection,
  TimelineIcon,
  children
}) => {
  const { styles } = useStyles();
  
  return (
    <div className={styles.mainContent}>
      {/* 左侧导航菜单 - 仅在未开始任务时显示 */}
      {!isTaskStarted && (
        <div className={styles.leftMenu}>
          {/* 任务概览标题 */}
          <div className={styles.overviewTitle}>
            任务概览
          </div>

          <Timeline>
            {[
              { key: 'overview', label: '概览' },
              { key: 'qa', label: 'QA' },
              { key: 'scenario', label: '场景' },
              { key: 'flow', label: '模板' }
            ].map((item) => (
              <Timeline.Item
                key={item.key}
                dot={
                  <div 
                    className={`${styles.timelineDot} ${activeSection === item.key ? styles.timelineActiveDot : styles.timelineInactiveDot}`}
                    onClick={() => setActiveSection(item.key)}
                  >
                    <TimelineIcon active={activeSection === item.key} />
                  </div>
                }
                className={styles.timelineItem}
                color={activeSection === item.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
              >
                <div
                  className={`${styles.timelineLabel} ${activeSection === item.key ? styles.timelineLabelActive : styles.timelineLabelInactive}`}
                  onClick={() => setActiveSection(item.key)}
                >
                  {item.label}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      )}

      {/* 右侧内容区域 */}
      <div className={styles.rightContent}>
        {children}
      </div>
    </div>
  );
};

export default MainContentLayout; 