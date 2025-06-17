import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Radio, Space, Divider, Tooltip, Select } from 'antd';
import { CopyOutlined, LinkOutlined, QuestionCircleOutlined, LockOutlined, EyeOutlined, EditOutlined, SettingOutlined, GlobalOutlined, TeamOutlined } from '@ant-design/icons';

const { Option } = Select;

// 权限等级常量
const PERMISSION_LEVELS = {
  VIEW: 'view',
  COMMENT: 'comment',
  FULL: 'full'
};

// 分享区域常量
const SHARE_SCOPES = {
  COMMUNITY: 'community',
  WORKSPACE: 'workspace'
};

const ShareModal = ({ visible, onCancel, taskId, taskTitle }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  // 添加权限设置，默认为"可查看"
  const [permission, setPermission] = useState(PERMISSION_LEVELS.VIEW);
  // 添加分享区域，默认为"工作区"
  const [shareScope, setShareScope] = useState(SHARE_SCOPES.WORKSPACE);
  
  // 当模态框打开时重置状态
  useEffect(() => {
    if (visible) {
      setCopied(false);
      setShareUrl('');
    }
  }, [visible]);
  
  // 生成分享链接
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const sharePath = `/tasks/${taskId}`;
    // 增加权限和分享区域参数
    const shareParams = [];
    
    if (permission) {
      shareParams.push(`perm=${permission}`);
    }
    
    if (shareScope) {
      shareParams.push(`scope=${shareScope}`);
    }
    
    const queryString = shareParams.length > 0 ? `?${shareParams.join('&')}` : '';
    const url = `${baseUrl}${sharePath}${queryString}`;
    setShareUrl(url);
    return url;
  };
  
  // 复制链接到剪贴板
  const copyShareLink = () => {
    // 生成分享链接
    const url = generateShareLink();
    
    // 复制到剪贴板
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        message.success({
          content: '分享链接已复制到剪贴板',
          icon: <CopyOutlined style={{ color: '#52c41a' }} />,
          duration: 3
        });
      })
      .catch(() => {
        message.error('复制失败，请手动复制链接');
      });
  };

  // 权限等级描述
  const permissionDescriptions = {
    [PERMISSION_LEVELS.VIEW]: '接收者只能查看任务详情，不能添加观点或修改任何内容',
    [PERMISSION_LEVELS.COMMENT]: '接收者可以查看任务详情和添加观点，但不能修改或删除其他观点',
    [PERMISSION_LEVELS.FULL]: '接收者拥有与你相同的权限，可以完全编辑任务内容和观点'
  };

  // 权限等级图标
  const permissionIcons = {
    [PERMISSION_LEVELS.VIEW]: <EyeOutlined />,
    [PERMISSION_LEVELS.COMMENT]: <EditOutlined />,
    [PERMISSION_LEVELS.FULL]: <SettingOutlined />
  };

  // 分享区域描述
  const scopeDescriptions = {
    [SHARE_SCOPES.COMMUNITY]: '分享到社区，所有用户都可以访问',
    [SHARE_SCOPES.WORKSPACE]: '仅在当前工作区内分享，只有工作区成员可以访问'
  };

  // 分享区域图标
  const scopeIcons = {
    [SHARE_SCOPES.COMMUNITY]: <GlobalOutlined />,
    [SHARE_SCOPES.WORKSPACE]: <TeamOutlined />
  };

  return (
    <Modal
      title="分享任务"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={copyShareLink}
        >
          {copied ? '已复制' : '生成并复制链接'}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>{taskTitle || '当前任务'}</h3>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          分享区域
        </div>
        <Radio.Group 
          value={shareScope} 
          onChange={(e) => setShareScope(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value={SHARE_SCOPES.WORKSPACE}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{scopeIcons[SHARE_SCOPES.WORKSPACE]} 工作区</span>
                <Tooltip title={scopeDescriptions[SHARE_SCOPES.WORKSPACE]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
            <Radio value={SHARE_SCOPES.COMMUNITY}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{scopeIcons[SHARE_SCOPES.COMMUNITY]} 社区</span>
                <Tooltip title={scopeDescriptions[SHARE_SCOPES.COMMUNITY]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <LockOutlined style={{ marginRight: 8 }} />
          权限设置
        </div>
        <Radio.Group 
          value={permission} 
          onChange={(e) => setPermission(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value={PERMISSION_LEVELS.VIEW}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{permissionIcons[PERMISSION_LEVELS.VIEW]} 可查看</span>
                <Tooltip title={permissionDescriptions[PERMISSION_LEVELS.VIEW]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
            <Radio value={PERMISSION_LEVELS.COMMENT}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{permissionIcons[PERMISSION_LEVELS.COMMENT]} 可添加观点</span>
                <Tooltip title={permissionDescriptions[PERMISSION_LEVELS.COMMENT]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
            <Radio value={PERMISSION_LEVELS.FULL}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{permissionIcons[PERMISSION_LEVELS.FULL]} 所有权限</span>
                <Tooltip title={permissionDescriptions[PERMISSION_LEVELS.FULL]}>
                  <QuestionCircleOutlined style={{ marginLeft: 8, color: '#999' }} />
                </Tooltip>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Input
          prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
          addonAfter={
            <CopyOutlined 
              onClick={copyShareLink} 
              style={{ 
                cursor: 'pointer',
                color: '#1890ff'
              }} 
            />
          }
          value={shareUrl || "链接将在确认后生成并复制"}
          readOnly
        />
        <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          链接有效期为7天，或访问次数超过100次后将失效。接收者需要有网络账号才能查看。
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal; 