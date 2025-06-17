import React from 'react';
import { Button } from 'antd';
import useStyles from '../../styles/components/common/ActionButton';

/**
 * 通用按钮组件
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 按钮内容
 * @param {ReactNode} props.icon - 按钮图标
 * @param {Function} props.onClick - 点击事件处理函数
 * @param {string} props.type - 按钮类型 (primary, danger, success)
 * @param {number} props.flex - flex布局占比 (1或2)
 * @param {boolean} props.disabled - 是否禁用
 * @param {string} props.className - 额外类名
 * @returns {ReactElement} 按钮组件
 */
const ActionButton = ({
  children,
  icon,
  onClick,
  type,
  flex,
  disabled,
  className,
  ...props
}) => {
  const styles = useStyles();
  
  // 构建类名
  let buttonClassName = styles.actionButton;
  
  if (type === 'primary') buttonClassName += ' ' + styles.primaryButton;
  if (type === 'danger') buttonClassName += ' ' + styles.danger;
  if (type === 'success') buttonClassName += ' ' + styles.success;
  
  if (flex === 1) buttonClassName += ' ' + styles.flex1;
  if (flex === 2) buttonClassName += ' ' + styles.flex2;
  
  if (disabled) buttonClassName += ' ' + styles.disabledButton;
  if (!children && icon) buttonClassName += ' ' + styles.iconOnly;
  if (className) buttonClassName += ' ' + className;
  
  return (
    <Button
      icon={icon}
      onClick={onClick}
      type={type === 'primary' ? 'primary' : 'default'}
      className={buttonClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton; 