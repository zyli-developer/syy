import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Button, Modal, Input, message } from 'antd';
import { EyeOutlined, FolderOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getSavedViews, renameView, deleteView, VIEW_TYPES } from '../../utils/viewManager';
import './saved-views-menu.css';

const { confirm } = Modal;

/**
 * 保存的视图菜单组件
 * @param {Object} props
 * @param {string} props.viewType - 视图类型（探索、任务等）
 * @param {Function} props.onSelectView - 选择视图的回调函数
 */
const SavedViewsMenu = ({ viewType, onSelectView }) => {
  const [savedViews, setSavedViews] = useState([]);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [renameViewId, setRenameViewId] = useState(null);
  const [newViewName, setNewViewName] = useState('');

  // 加载保存的视图
  useEffect(() => {
    const views = getSavedViews(viewType);
    setSavedViews(views);
  }, [viewType]);

  // 处理视图选择
  const handleSelectView = (view) => {
    if (onSelectView) {
      onSelectView(view);
    }
  };

  // 显示重命名模态框
  const showRenameModal = (view, e) => {
    e.stopPropagation();
    setRenameViewId(view.id);
    setNewViewName(view.name);
    setIsRenameModalVisible(true);
  };

  // 处理重命名
  const handleRename = () => {
    if (!newViewName.trim()) {
      message.error('视图名称不能为空');
      return;
    }

    if (renameView(viewType, renameViewId, newViewName)) {
      // 更新本地状态
      const updatedViews = savedViews.map(view => {
        if (view.id === renameViewId) {
          return { ...view, name: newViewName };
        }
        return view;
      });
      setSavedViews(updatedViews);
      message.success('视图已重命名');
    } else {
      message.error('重命名失败，请重试');
    }

    setIsRenameModalVisible(false);
  };

  // 处理删除
  const handleDelete = (view, e) => {
    e.stopPropagation();
    
    confirm({
      title: '确定要删除这个视图吗?',
      icon: <ExclamationCircleOutlined />,
      content: `视图"${view.name}"将被永久删除`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (deleteView(viewType, view.id)) {
          // 更新本地状态
          const updatedViews = savedViews.filter(v => v.id !== view.id);
          setSavedViews(updatedViews);
          message.success('视图已删除');
        } else {
          message.error('删除失败，请重试');
        }
      },
    });
  };

  // 创建菜单项
  const menuItems = savedViews.map(view => ({
    key: view.id,
    label: (
      <div className="saved-view-item" onClick={() => handleSelectView(view)}>
        <span className="saved-view-name">
          <EyeOutlined style={{ marginRight: 8 }} />
          {view.name}
        </span>
        <span className="saved-view-actions">
          <EditOutlined 
            className="edit-icon" 
            onClick={(e) => showRenameModal(view, e)} 
          />
          <DeleteOutlined 
            className="delete-icon" 
            onClick={(e) => handleDelete(view, e)} 
          />
        </span>
      </div>
    ),
  }));

  const menu = (
    <Menu items={menuItems} />
  );

  const dropdownOverlay = savedViews.length > 0 ? menu : (
    <Menu items={[{ key: 'empty', label: '暂无保存的视图' }]} />
  );

  return (
    <>
      <Dropdown overlay={dropdownOverlay} trigger={['click']}>
        <Button icon={<FolderOutlined />} className="saved-views-button">
          已保存视图 <span className="view-count">({savedViews.length})</span>
        </Button>
      </Dropdown>

      <Modal
        title="重命名视图"
        visible={isRenameModalVisible}
        onOk={handleRename}
        onCancel={() => setIsRenameModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Input
          placeholder="请输入新的视图名称"
          value={newViewName}
          onChange={(e) => setNewViewName(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default SavedViewsMenu; 