import React from 'react';
import { Button, Switch, Spin } from 'antd';
import {
  ArrowLeftOutlined,
  LikeOutlined,
  CommentOutlined,
  ForkOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import ActionButton from '../common/ActionButton';

/**
 * 底部按钮样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    taskFooterActions: css`
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      padding: 8px 0;
      max-width: 100%;
      width: 100%;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadiusSM}px;
    `,
    optimizeMode: css`
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 12px;
      height: 32px;
      font-size: 12px;
      border: 1px solid ${token.colorBorder};
      flex: 1;
    `,
    active: css`
      background: ${token.colorPrimaryBg};
    `,
    settingIcon: css`
      font-size: 14px;
    `,
  };
});

/**
 * 底部按钮组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOptimizationMode - 是否为优化模式
 * @param {number} props.currentStep - 当前步骤
 * @param {Function} props.onBack - 返回按钮回调
 * @param {Function} props.onPrev - 上一步按钮回调
 * @param {Function} props.onSave - 保存按钮回调
 * @param {Function} props.onNext - 下一步按钮回调
 * @param {Function} props.onToggle - 切换模式按钮回调
 * @param {Function} props.onFork - 分支为新任务按钮回调
 * @param {Function} props.onStartTest - 开始测试按钮回调
 * @param {Function} props.onSubmit - 提交结果按钮回调
 * @param {boolean} props.isTesting - 是否正在测试
 * @param {number} props.testProgress - 测试进度
 * @returns {ReactElement} 底部按钮组件
 */
const FooterActions = ({
  isOptimizationMode,
  currentStep,
  onBack,
  onPrev,
  onSave,
  onNext,
  onToggle,
  onFork,
  onStartTest,
  onSubmit,
  isTesting,
  testProgress,
}) => {
  const styles = useStyles();

  // 渲染优化模式下的按钮
  const renderOptimizationButtons = () => {
    // 提交结果阶段的按钮布局
    if (currentStep === 5) {
      return (
        <>
          <ActionButton
            icon={<FileTextOutlined />}
            onClick={() => message.info('生成报告功能开发中')}
            flex={2}
          >
            生成报告
          </ActionButton>
          <ActionButton
            icon={<CloseCircleOutlined />}
            onClick={() => onToggle(false)}
            flex={2}
          >
            放弃此次优化
          </ActionButton>
          <ActionButton
            type="primary"
            icon={<SendOutlined />}
            onClick={onSubmit}
            flex={1}
          >
            保存并新建任务
          </ActionButton>
          <div
            className={`${styles.optimizeMode} ${isOptimizationMode ? styles.active : ''}`}
          >
            <SettingOutlined className={styles.settingIcon} />
            <span>优化模式</span>
            <Switch
              size="small"
              checked={isOptimizationMode}
              onChange={onToggle}
              style={{ marginLeft: '4px' }}
            />
          </div>
        </>
      );
    }

    // 再次测试步骤的按钮
    if (currentStep === 4) {
      return (
        <>
          <ActionButton
            icon={<ArrowLeftOutlined />}
            onClick={currentStep === 0 ? onBack : onPrev}
            flex={1}
          >
            {currentStep === 0 ? '返回' : '上一步'}
          </ActionButton>
          <ActionButton
            onClick={onSave}
            flex={1}
          >
            保存
          </ActionButton>
          <ActionButton
            type="primary"
            onClick={onStartTest}
            flex={2}
            disabled={isTesting}
          >
            {isTesting ? (
              <>
                <Spin size="small" style={{ marginRight: '8px' }} />
                测试中...({testProgress}%)
              </>
            ) : '确认无误，开始测试'}
          </ActionButton>
          <div
            className={`${styles.optimizeMode} ${isOptimizationMode ? styles.active : ''}`}
          >
            <SettingOutlined className={styles.settingIcon} />
            <span>优化模式</span>
            <Switch
              size="small"
              checked={isOptimizationMode}
              onChange={onToggle}
              style={{ marginLeft: '4px' }}
            />
          </div>
        </>
      );
    }

    // 其他步骤的常规按钮
    return (
      <>
        <ActionButton
          icon={<ArrowLeftOutlined />}
          onClick={currentStep === 0 ? onBack : onPrev}
          flex={1}
        >
          {currentStep === 0 ? '返回' : '上一步'}
        </ActionButton>
        <ActionButton
          onClick={onSave}
          flex={1}
        >
          保存
        </ActionButton>
        <ActionButton
          type="primary"
          onClick={onNext}
          flex={2}
        >
          {currentStep < 5 ? '保存并进入下一步' : '保存并完成'}
        </ActionButton>
        <div
          className={`${styles.optimizeMode} ${isOptimizationMode ? styles.active : ''}`}
        >
          <SettingOutlined className={styles.settingIcon} />
          <span>优化模式</span>
          <Switch
            size="small"
            checked={isOptimizationMode}
            onChange={onToggle}
            style={{ marginLeft: '4px' }}
          />
        </div>
      </>
    );
  };

  // 渲染普通模式下的按钮
  const renderStandardButtons = () => {
    return (
      <>
        <ActionButton
          icon={<LikeOutlined />}
        >
          点赞
        </ActionButton>
        <ActionButton
          icon={<CommentOutlined />}
        >
          评论
        </ActionButton>
        <ActionButton
          icon={<ForkOutlined />}
          type="primary"
          onClick={onFork}
        >
          分支为新任务
        </ActionButton>
        <div
          className={`${styles.optimizeMode} ${isOptimizationMode ? styles.active : ''}`}
        >
          <SettingOutlined className={styles.settingIcon} />
          <span>优化模式</span>
          <Switch
            size="small"
            checked={isOptimizationMode}
            onChange={onToggle}
            style={{ marginLeft: '4px' }}
          />
        </div>
      </>
    );
  };

  return (
    <div className={styles.taskFooterActions}>
      {isOptimizationMode ? renderOptimizationButtons() : renderStandardButtons()}
    </div>
  );
};

export default FooterActions; 