import React, { useState } from 'react';
import { Timeline, Typography, Avatar, Space } from 'antd';
import { FileTextOutlined, QuestionCircleOutlined, UsergroupAddOutlined, ClockCircleOutlined, TeamOutlined, RocketOutlined } from '@ant-design/icons';
import useStyles from '../../../styles/components/modals/create-task-modal';

const { Text } = Typography;

const ConfirmPage = ({ formData }) => {
  const { styles } = useStyles();
  const [activeTab, setActiveTab] = useState('basicInfo');

  // 调试用 - 查看传入的表单数据
  console.log('ConfirmPage收到的表单数据:', formData);

  // 自定义Timeline点
  const TimelineDot = ({ number, isActive }) => (
    <div className={isActive ? `${styles.timelineDot} ${styles.timelineDotActive}` : styles.timelineDot}>
      {number}
    </div>
  );

  // 渲染Timeline标签
  const renderTimelineLabel = (label, tab) => (
    <span
      className={activeTab === tab ? `${styles.timelineLabel} ${styles.timelineLabelActive}` : styles.timelineLabel}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </span>
  );

  // 渲染基本信息内容
  const renderBasicInfo = () => (
    <div className={styles.confirmSection}>
  
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>任务名称：</div>
        <div className={styles.confirmInfoValue}>{formData.title || '未设置'}</div>
      </div>
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>描述：</div>
        <div className={styles.confirmInfoValue}>{formData.description || '未设置'}</div>
      </div>
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>优先级：</div>
        <div className={styles.confirmInfoValue}>
          {formData.priority === 'high' && '高'}
          {formData.priority === 'medium' && '中'}
          {formData.priority === 'low' && '低'}
          {!formData.priority && '未设置'}
        </div>
      </div>
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>截止日期：</div>
        <div className={styles.confirmInfoValue}>{formData.deadline ? formData.deadline.format('YYYY-MM-DD') : '未设置'}</div>
      </div>
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>测评对象：</div>
        <div className={styles.confirmInfoValue}>{formData.testTarget || '未设置'}</div>
      </div>
      
      <div className={styles.confirmInfoSection}>
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>补充描述：</div>
          <div className={styles.confirmInfoValue}>{formData.targetDescription || '无'}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>品牌：</div>
          <div className={styles.confirmInfoValue}>{formData.brand || '无'}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>型号：</div>
          <div className={styles.confirmInfoValue}>{formData.model || '无'}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>版本：</div>
          <div className={styles.confirmInfoValue}>{formData.version || '无'}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>参数量：</div>
          <div className={styles.confirmInfoValue}>{formData.paramCount || '无'}</div>
        </div>
        
        <div className={styles.confirmInfoRow}>
          <div className={styles.confirmInfoLabel}>推理精度：</div>
          <div className={styles.confirmInfoValue}>{formData.recommendPrecision || '无'}</div>
        </div>
      </div>
    </div>
  );

  // 渲染QA内容
  const renderQA = () => (
    <div className={styles.confirmSection}>
      <div className={styles.confirmSectionTitle}>QA</div>
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>问题描述：</div>
        <div className={styles.confirmInfoValue}>{formData.questionDescription || '未设置'}</div>
      </div>
      
      <div className={styles.confirmInfoRow}>
        <div className={styles.confirmInfoLabel}>答案描述：</div>
        <div className={styles.confirmInfoValue}>{formData.answerDescription || '未设置'}</div>
      </div>
    </div>
  );

  // 渲染任务分配内容
  const renderTaskAssignment = () => (
    <div className={styles.confirmSection}>
      <div className={styles.confirmSectionTitle}>权限分配</div>
      
      {/* 场景编辑人员 */}
      <div className={styles.confirmPermissionCard}>
        <div className={styles.confirmPermissionTitle}>
          <FileTextOutlined /> 编辑场景
        </div>
        <div className={styles.confirmPermissionDesc}>
          以下用户可以：编辑场景和针对场景的观点
        </div>
        <div className={styles.confirmUserList}>
          {formData.sceneEditors && formData.sceneEditors.length > 0 ? (
            formData.sceneEditors.map((user, index) => (
              <div key={index} className={styles.userItem}>
                <Avatar size={24} className={styles.userAvatar}>
                  {user.name ? user.name.substring(0, 1) : 'U'}
                </Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))
          ) : (
            <Text type="secondary">未分配场景编辑人员</Text>
          )}
        </div>
      </div>
      
      {/* 模板编辑人员 */}
      <div className={styles.confirmPermissionCard}>
        <div className={styles.confirmPermissionTitle}>
          <TeamOutlined /> 编辑模板
        </div>
        <div className={styles.confirmPermissionDesc}>
          以下用户可以：编辑模板和针对模板的观点
        </div>
        <div className={styles.confirmUserList}>
          {formData.templateEditors && formData.templateEditors.length > 0 ? (
            formData.templateEditors.map((user, index) => (
              <div key={index} className={styles.userItem}>
                <Avatar size={24} className={styles.userAvatar}>
                  {user.name ? user.name.substring(0, 1) : 'U'}
                </Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))
          ) : (
            <Text type="secondary">未分配模板编辑人员</Text>
          )}
        </div>
      </div>
      
      {/* 观点编辑人员 */}
      <div className={styles.confirmPermissionCard}>
        <div className={styles.confirmPermissionTitle}>
          <UsergroupAddOutlined /> 编辑观点
        </div>
        <div className={styles.confirmPermissionDesc}>
          以下用户可以：编辑针对该任务的全部观点
        </div>
        <div className={styles.confirmUserList}>
          {formData.viewpointEditors && formData.viewpointEditors.length > 0 ? (
            formData.viewpointEditors.map((user, index) => (
              <div key={index} className={styles.userItem}>
                <Avatar size={24} className={styles.userAvatar}>
                  {user.name ? user.name.substring(0, 1) : 'U'}
                </Avatar>
                <span className={styles.userName}>{user.name}</span>
              </div>
            ))
          ) : (
            <Text type="secondary">未分配观点编辑人员</Text>
          )}
        </div>
      </div>
    </div>
  );

  // 根据激活的标签渲染对应内容
  const renderContent = () => {
    switch (activeTab) {
      case 'basicInfo':
        return renderBasicInfo();
      case 'qa':
        return renderQA();
      case 'taskAssignment':
        return renderTaskAssignment();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className={styles.confirmContainer}>
 
      <div className={styles.confirmLayout}>
        {/* 左侧Timeline导航 */}
        <div className={styles.confirmSidebar}>
          <Timeline>
            <Timeline.Item dot={<TimelineDot number="1" isActive={activeTab === 'basicInfo'} />}>
              {renderTimelineLabel('基本信息', 'basicInfo')}
            </Timeline.Item>
            <Timeline.Item dot={<TimelineDot number="2" isActive={activeTab === 'qa'} />}>
              {renderTimelineLabel('QA', 'qa')}
            </Timeline.Item>
            <Timeline.Item dot={<TimelineDot number="3" isActive={activeTab === 'taskAssignment'} />}>
              {renderTimelineLabel('权限分配', 'taskAssignment')}
            </Timeline.Item>
          </Timeline>
        </div>
        
        {/* 右侧内容区域 */}
        <div className={styles.confirmContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage; 